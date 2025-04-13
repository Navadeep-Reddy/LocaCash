from flask import Blueprint, request, jsonify
from app.utils import factors
from app.utils.bptree import bptree
from app.utils.score import calculate_scores
from app.services.supabase_service import supabase
import time
import logging

atm_bp = Blueprint("atm", __name__, url_prefix='/atm/v1')

# Initialize logger
logger = logging.getLogger(__name__)

def init_cache_from_database():
    """Load all previously analyzed ATM locations from Supabase into the B+ Tree cache"""
    start_time = time.time()
    loaded_count = 0
    
    try:
        # Fetch all ATM analysis records from the database
        response = supabase.table('atm_analysis').select('*').execute()
        
        logger.info(f"Starting cache initialization from database...")
        
        if not hasattr(response, 'data') or not response.data:
            logger.warning("No data found in database for cache initialization")
            return 0
            
        for record in response.data:
            # Extract location coordinates
            lat = record.get('location_lat')
            lng = record.get('location_lng')
            
            if lat is not None and lng is not None:
                try:
                    # Create a key for the B+ tree (rounded coordinates tuple)
                    coords = (float(lat), float(lng))
                    
                    # Create a data structure similar to what calculate_location_data returns
                    location_data = {
                        "coords": [float(f"{round(lat, 3):.3f}"), float(f"{round(lng, 3):.3f}")],
                        "population_density": record.get('population_density'),
                        "competing_atms": record.get('competing_atms'),
                        "commercial_activity": record.get('commercial_activity'),
                        "traffic_flow": record.get('traffic_flow'),
                        "public_transport": record.get('public_transport'),
                        "land_rate": record.get('land_rate'),
                        "cached": True,
                        "cache_source": "database",
                        "timestamp": record.get('created_at')
                    }
                    
                    # Insert into B+ Tree
                    bptree.insert(coords, location_data)
                    loaded_count += 1
                except Exception as e:
                    logger.error(f"Error adding record to cache: {str(e)}")
                    continue
        
        duration = time.time() - start_time
        logger.info(f"Cache initialized with {loaded_count} locations in {duration:.2f} seconds")
        
        # Print cache statistics
        logger.info(f"B+ Tree Stats:")
        logger.info(f"Total entries: {bptree.size()}")
        
        return loaded_count
    except Exception as e:
        logger.error(f"Failed to initialize cache from database: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return 0

# Initialize the cache when this module is imported
cache_size = init_cache_from_database()

@atm_bp.route('/fetch_details', methods=['POST'])
def get_data():
    data = request.get_json()
    location = data.get('Location')

    if not location or len(location) != 2:
        return jsonify({"error": "Invalid location input"}), 400

    # Round coordinates to 3 decimals and remove trailing zeros
    coords = tuple(round(float(x), 3) for x in location)

    # Check if already in B+ Tree
    result = bptree.search(coords)
    if result is not None:
        # Enhanced detailed cache hit logging
        hit_source = result.get('cache_source', 'unknown')
        hit_time = result.get('timestamp', 'N/A')
        logger.info(f"🚀 CACHE HIT: Coordinates {coords} found in B+ tree cache")
        logger.info(f"  └─ Source: {hit_source}")
        logger.info(f"  └─ Original timestamp: {hit_time}")
        logger.info(f"  └─ Data: Population Density={result.get('population_density')}, " +
                   f"Competing ATMs={result.get('competing_atms')}, " +
                   f"Commercial Activity={result.get('commercial_activity')}")
        
        # Update hit counter for statistics
        bptree._hit_count += 1
        
        # Add hit metadata
        result["cache_hit"] = True
        result["cache_accessed_at"] = time.time()
        return jsonify(result)

    try:
        # Log cache miss
        logger.info(f"❌ CACHE MISS: Coordinates {coords} not in cache, fetching from API")
        bptree._miss_count += 1
        
        # Fetch from Overpass API
        result = factors.calculate_location_data(coords[0], coords[1])
        # Add miss metadata
        result["cache_hit"] = False
        result["cache_source"] = "api"
        result["timestamp"] = time.time()
        
        # Insert into cache
        bptree.insert(coords, result)
        logger.info(f"➕ Added new location to cache: {coords}")
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Failed to analyze location {coords}: {str(e)}")
        return jsonify({"error": f"Failed to analyze location: {str(e)}"}), 500

@atm_bp.route('/get_score', methods=['POST'])
def get_score():
    data = request.get_json()
    location_data = data.get('location_data')
    weights = data.get('weights')

    if not location_data:
        return jsonify({"error": "Missing location data"}), 400

    scores = calculate_scores(location_data, weights)
    return jsonify(scores)

@atm_bp.route('/cache-status', methods=['GET'])
def cache_status():
    """Return statistics about the B+ tree cache"""
    try:
        # Get cache statistics
        stats = {
            "total_cached_locations": bptree.size(),
            "database_loaded_locations": cache_size,
            "memory_usage_estimate": bptree.size() * 1024,  # Rough estimate in bytes
            "hit_ratio": bptree.get_hit_ratio() if hasattr(bptree, 'get_hit_ratio') else None,
            "cache_initialized_at": bptree.created_at if hasattr(bptree, 'created_at') else None
        }
        return jsonify({"success": True, "stats": stats})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@atm_bp.route('/cache-contents', methods=['GET'])
def cache_contents():
    """Return the contents of the B+ tree cache"""
    try:
        # Check if we have a method to get all keys
        if hasattr(bptree, 'get_all'):
            all_data = bptree.get_all()
            
            # Just return count and summary instead of full data
            return jsonify({
                "success": True, 
                "count": len(all_data),
                "summary": f"B+ tree contains {len(all_data)} cached locations",
                "sample": list(all_data.keys())[:5] if all_data else []
            })
        else:
            # If get_all method doesn't exist
            return jsonify({
                "success": False, 
                "error": "B+ tree implementation doesn't support retrieving all values",
                "stats": cache_status().get_json()
            })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500