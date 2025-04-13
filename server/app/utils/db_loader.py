import logging
import time
from app.services.supabase_service import supabase
from app.utils.bptree import bptree

logger = logging.getLogger(__name__)

def print_database_records():
    """Fetch and print all ATM analysis records from Supabase"""
    try:
        # Fetch all records from the atm_analysis table
        response = supabase.table('atm_analysis').select('*').execute()
        
        if hasattr(response, 'data') and response.data:
            record_count = len(response.data)
            logger.info(f"===== DATABASE RECORDS ({record_count} total) =====")
            
            # Print a header for the table format
            logger.info(f"{'ID':<8} | {'Latitude':<10} | {'Longitude':<10} | {'Score':<5} | {'Land Rate':<10} | {'Pop Density':<10} | {'ATMs':<4}")
            logger.info("-" * 80)
            
            # Print each record in a tabular format
            for record in response.data:
                logger.info(
                    f"{str(record.get('id', ''))[:7]:<8} | "
                    f"{record.get('location_lat', ''):<10.6f} | "
                    f"{record.get('location_lng', ''):<10.6f} | "
                    f"{record.get('overall_score', ''):<5.1f} | "
                    f"{record.get('land_rate', ''):<10} | "
                    f"{record.get('population_density', ''):<10.2f} | "
                    f"{record.get('competing_atms', ''):<4}"
                )
            
            logger.info("=" * 80)
            logger.info(f"Total records: {record_count}")
            
            # Return the data for potential further processing
            return response.data
        else:
            logger.warning("No records found in the database.")
            return []
    except Exception as e:
        logger.error(f"Error fetching database records: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return []

def load_records_into_bptree(records=None):
    """
    Load records into the B+ tree cache
    If records is None, fetch them from the database first
    """
    start_time = time.time()
    loaded_count = 0
    
    try:
        # If records not provided, fetch them from the database
        if records is None:
            response = supabase.table('atm_analysis').select('*').execute()
            if hasattr(response, 'data'):
                records = response.data
            else:
                logger.warning("No data returned from database")
                return 0
        
        logger.info(f"Loading {len(records)} records into B+ tree cache...")
        
        for record in records:
            # Extract location coordinates
            lat = record.get('location_lat')
            lng = record.get('location_lng')
            
            if lat is not None and lng is not None:
                # Create a key for the B+ tree
                coords = (float(lat), float(lng))
                
                # Create a data structure for B+ tree storage
                location_data = {
                    "coords": [float(lat), float(lng)],
                    "population_density": record.get('population_density'),
                    "competing_atms": record.get('competing_atms'),
                    "commercial_activity": record.get('commercial_activity'),
                    "traffic_flow": record.get('traffic_flow'),
                    "public_transport": record.get('public_transport'),
                    "land_rate": record.get('land_rate'),
                    "overall_score": record.get('overall_score'),
                    "cached": True,
                    "cache_source": "database_startup",
                    "timestamp": record.get('created_at')
                }
                
                # Insert into B+ Tree
                bptree.insert(coords, location_data)
                loaded_count += 1
        
        duration = time.time() - start_time
        logger.info(f"✅ B+ tree cache initialized with {loaded_count} locations in {duration:.2f} seconds")
        
        # Print cache statistics
        if hasattr(bptree, 'size'):
            logger.info(f"B+ tree size: {bptree.size()} entries")
        
        # Print sample keys
        if hasattr(bptree, 'root') and bptree.root and bptree.root.keys:
            sample_keys = bptree.root.keys[:3]
            logger.info(f"Sample keys in B+ tree: {sample_keys}")
        
        return loaded_count
    except Exception as e:
        logger.error(f"Error loading records into B+ tree: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return 0

def verify_cache_operation():
    """Test the B+ tree cache with a sample key"""
    if not hasattr(bptree, 'root') or not bptree.root or not bptree.root.keys:
        logger.warning("B+ tree is empty, skipping verification")
        return False
    
    try:
        # Get a sample key from the cache
        sample_key = bptree.root.keys[0]
        logger.info(f"Testing cache with sample key: {sample_key}")
        
        # Try to search for this exact key
        result = bptree.search(sample_key)
        
        if result:
            logger.info(f"✅ Cache verification SUCCESSFUL! Found data for key {sample_key}")
            return True
        else:
            logger.error(f"❌ Cache verification FAILED! Could not find data for key {sample_key}")
            return False
    except Exception as e:
        logger.error(f"Error verifying cache operation: {str(e)}")
        return False

def initialize_cache():
    """Complete initialization of the cache system"""
    logger.info("Initializing ATM location cache...")
    records = print_database_records()
    
    if records:
        cache_size = load_records_into_bptree(records)
        logger.info(f"Cache now contains {cache_size} records")
        verify_cache_operation()
    else:
        logger.warning("No records available for cache initialization")
    
    return len(records) if records else 0