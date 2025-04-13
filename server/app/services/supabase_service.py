import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY", os.environ.get("SUPABASE_KEY"))
supabase: Client = create_client(supabase_url, supabase_key)

def save_atm_analysis(user_id, analysis_data):
    """
    Store ATM analysis data in Supabase
    
    Args:
        user_id (str): The authenticated user ID
        analysis_data (dict): Analysis data with location, factors, scores and weights
    
    Returns:
        dict: The saved record or error message
    """
    try:
        print(f"Attempting to save analysis for user: {user_id}")
        
        # Convert recommendations if it's a string to parse it as JSON
        recommendations = analysis_data.get("recommendations", [])
        if isinstance(recommendations, str):
            try:
                recommendations = json.loads(recommendations)
            except:
                # If parsing fails, keep as is
                pass
        
        # Create a record in the atm_analysis table
        result = supabase.table('atm_analysis').insert({
            "user_id": user_id,
            "location_lat": analysis_data.get("location_lat"),
            "location_lng": analysis_data.get("location_lng"),
            
            # Raw factors from analysis
            "population_density": analysis_data.get("population_density"),
            "competing_atms": analysis_data.get("competing_atms"),
            "commercial_activity": analysis_data.get("commercial_activity"),
            "traffic_flow": analysis_data.get("traffic_flow"),
            "public_transport": analysis_data.get("public_transport"),
            "land_rate": analysis_data.get("land_rate"),
            
            # Score data
            "overall_score": analysis_data.get("overall_score"),
            "population_density_score": analysis_data.get("population_density_score"),
            "competing_atms_score": analysis_data.get("competing_atms_score"),
            "commercial_activity_score": analysis_data.get("commercial_activity_score"),
            "traffic_flow_score": analysis_data.get("traffic_flow_score"),
            "public_transport_score": analysis_data.get("public_transport_score"),
            "land_rate_score": analysis_data.get("land_rate_score"),
            
            # Weights used for calculation
            "population_density_weight": analysis_data.get("population_density_weight"),
            "competing_atms_weight": analysis_data.get("competing_atms_weight"),
            "commercial_activity_weight": analysis_data.get("commercial_activity_weight"),
            "traffic_flow_weight": analysis_data.get("traffic_flow_weight"),
            "public_transport_weight": analysis_data.get("public_transport_weight"),
            "land_rate_weight": analysis_data.get("land_rate_weight"),
            
            # Recommendations as JSON
            "recommendations": recommendations
        }).execute()
        
        print("Success! Saved analysis with result:", result.data)
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"Error saving analysis: {str(e)}")
        # Print more debugging info
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

def get_user_analyses(user_id):
    """
    Get all ATM analyses for a specific user
    
    Args:
        user_id (str): The authenticated user ID
    
    Returns:
        list: List of ATM analyses
    """
    try:
        result = supabase.table('atm_analysis') \
            .select('*') \
            .eq('user_id', user_id) \
            .order('created_at', desc=True) \
            .execute()
        
        return result.data
    except Exception as e:
        print(f"Error fetching analyses: {str(e)}")
        return {"error": str(e)}

def get_analysis_by_id(analysis_id, user_id):
    """
    Get a specific analysis by ID
    
    Args:
        analysis_id (str): The analysis ID
        user_id (str): The authenticated user ID
    
    Returns:
        dict: The analysis record or error message
    """
    try:
        result = supabase.table('atm_analysis') \
            .select('*') \
            .eq('id', analysis_id) \
            .eq('user_id', user_id) \
            .limit(1) \
            .execute()
        
        if not result.data:
            return {"error": "Analysis not found"}
            
        return result.data[0]
    except Exception as e:
        print(f"Error fetching analysis: {str(e)}")
        return {"error": str(e)}

def toggle_favorite(analysis_id, user_id, is_favorite):
    """
    Toggle favorite status for an analysis
    
    Args:
        analysis_id (str): The analysis ID
        user_id (str): The authenticated user ID
        is_favorite (bool): The new favorite status
    
    Returns:
        dict: The updated record or error message
    """
    try:
        result = supabase.table('atm_analysis') \
            .update({"is_favorite": is_favorite}) \
            .eq('id', analysis_id) \
            .eq('user_id', user_id) \
            .execute()
        
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"Error updating favorite status: {str(e)}")
        return {"error": str(e)}