from flask import Blueprint, request, jsonify
from app.utils import factors
from app.utils.bptree import bptree, BPlusTree
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

def normalize_coordinates(coords):
    """Normalize coordinates to ensure consistent formatting across operations"""
    # Always use the same rounding precision as in BPlusTree insert/search
    return tuple(round(float(x), 4) for x in coords)

@atm_bp.route('/fetch_details', methods=['POST'])
def get_data():
    data = request.get_json()
    location = data.get('Location')

    if not location or len(location) != 2:
        return jsonify({"error": "Invalid location input"}), 400

    # Normalize coordinates using the helper function
    coords = normalize_coordinates(location)
    
    # Log the original and normalized coordinates
    logger.info(f"Original coordinates: {location}")
    logger.info(f"Normalized coordinates: {coords}")
    
    # Check if already in B+ Tree
    result = bptree.search(coords)
    if result is not None:
        # Enhanced detailed cache hit logging with B+ Tree usage indicator
        hit_source = result.get('cache_source', 'unknown')
        hit_time = result.get('timestamp', 'N/A')
        
        # Print B+ Tree cache hit message
        logger.info("=" * 60)
        logger.info(f"🔍 B+ TREE CACHE HIT 🔍")
        logger.info(f"🚀 Coordinates {coords} found in B+ tree cache")
        logger.info(f"  └─ Source: {hit_source}")
        logger.info(f"  └─ Original timestamp: {hit_time}")
        logger.info(f"  └─ Data: Population Density={result.get('population_density')}, " +
                   f"Competing ATMs={result.get('competing_atms')}, " +
                   f"Commercial Activity={result.get('commercial_activity')}")
        logger.info("=" * 60)
        
        # Update hit counter for statistics
        bptree._hit_count += 1
        
        # Add hit metadata
        result["cache_hit"] = True
        result["cache_accessed_at"] = time.time()
        result["cache_mechanism"] = "B+ Tree"
        return jsonify(result)

    # If we get here, we need to check for similar coordinates
    # Find closest matches within a small radius
    close_matches = []
    closest_match = None
    min_distance = float('inf')
    
    if bptree.root and bptree.root.keys:
        for k in bptree.root.keys:
            # Calculate distance between points
            dist = ((k[0] - coords[0])**2 + (k[1] - coords[1])**2)**0.5
            
            # If within 10 meters (approximately 0.0001 degrees)
            if dist < 0.0001:
                close_matches.append((k, dist))
                
                # Track the closest match
                if dist < min_distance:
                    min_distance = dist
                    closest_match = k
        
        # Use the closest match if found
        if closest_match:
            result = bptree.search(closest_match)
            if result:
                logger.info("=" * 60)
                logger.info(f"📍 B+ TREE PROXIMITY MATCH 📍")
                logger.info(f"📡 Found nearby location in cache: {closest_match}")
                logger.info(f"  └─ Distance: {min_distance * 111000:.2f} meters (approx)")
                logger.info(f"  └─ Original request: {coords}")
                logger.info(f"  └─ Source: {result.get('cache_source', 'unknown')}")
                logger.info("=" * 60)
                
                # Update hit counter for statistics
                bptree._hit_count += 1
                
                # Add hit metadata
                result["cache_hit"] = True
                result["original_request"] = coords
                result["matched_coords"] = closest_match
                result["distance_meters"] = min_distance * 111000  # Rough conversion to meters
                result["cache_accessed_at"] = time.time()
                result["cache_mechanism"] = "B+ Tree Proximity Match"
                return jsonify(result)

    try:
        # Log cache miss with B+ Tree indicator
        logger.info("=" * 60)
        logger.info(f"❌ B+ TREE CACHE MISS ❌")
        logger.info(f"⚡ Coordinates {coords} not in cache, fetching from API")
        logger.info("=" * 60)
        
        bptree._miss_count += 1
        
        # Fetch from Overpass API
        result = factors.calculate_location_data(coords[0], coords[1])
        
        # Add miss metadata
        result["cache_hit"] = False
        result["cache_source"] = "api"
        result["timestamp"] = time.time()
        result["cache_mechanism"] = "API Direct"
        
        # Insert into cache
        bptree.insert(coords, result)
        logger.info(f"➕ Added new location to B+ Tree cache: {coords}")
        
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

@atm_bp.route('/debug-key', methods=['POST'])
def debug_key():
    """Debug a specific key to see if it exists in the cache"""
    data = request.get_json()
    location = data.get('Location')

    if not location or len(location) != 2:
        return jsonify({"error": "Invalid location input"}), 400

    # Format the key in different ways to check
    raw_coords = tuple(location)
    rounded_3 = tuple(round(float(x), 3) for x in location)
    rounded_4 = tuple(round(float(x), 4) for x in location)
    rounded_6 = tuple(round(float(x), 6) for x in location)
    
    # Check if any key format exists in tree
    results = {
        "raw": str(raw_coords) in str(bptree.root.keys),
        "rounded_3": str(rounded_3) in str(bptree.root.keys),
        "rounded_4": str(rounded_4) in str(bptree.root.keys),
        "rounded_6": str(rounded_6) in str(bptree.root.keys),
        "exact_match": False,
        "closest_keys": [],
    }
    
    # Check for direct equality with each key
    for k in bptree.root.keys:
        if k == rounded_4:
            results["exact_match"] = True
        
        # Find closest keys
        if abs(k[0] - rounded_4[0]) < 0.01 and abs(k[1] - rounded_4[1]) < 0.01:
            results["closest_keys"].append(str(k))
    
    return jsonify({
        "search_key": {
            "raw": raw_coords,
            "rounded_3": rounded_3,
            "rounded_4": rounded_4,
            "rounded_6": rounded_6
        },
        "results": results,
        "cache_keys_sample": [str(k) for k in bptree.root.keys[:10]],
        "total_keys": len(bptree.root.keys)
    })

@atm_bp.route('/reinitialize-cache', methods=['POST'])
def reinitialize_cache():
    """Force reinitialization of the cache"""
    try:
        # Clear existing cache
        global bptree
        bptree = BPlusTree()  # Create a new instance
        
        # Reinitialize
        global cache_size
        cache_size = init_cache_from_database()
        
        return jsonify({
            "success": True,
            "message": f"Cache reinitialized with {cache_size} entries",
            "stats": {
                "total_cached_locations": bptree.size(),
                "hit_ratio": bptree.get_hit_ratio()
            }
        })
    except Exception as e:
        logger.error(f"Failed to reinitialize cache: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500