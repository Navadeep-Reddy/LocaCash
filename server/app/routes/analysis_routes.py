from flask import Blueprint, request, jsonify
from app.services.supabase_service import (
    save_atm_analysis, 
    get_user_analyses, 
    get_analysis_by_id,
    toggle_favorite,
    supabase
)

analysis_bp = Blueprint("analysis", __name__, url_prefix='/analysis/v1')

@analysis_bp.route('/save', methods=['POST'])
def save_analysis():
    """Save ATM analysis data to Supabase"""
    data = request.get_json()
    
    # Extract user_id from the request
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    # Remove user_id from the data before saving
    analysis_data = {k: v for k, v in data.items() if k != 'user_id'}
    
    result = save_atm_analysis(user_id, analysis_data)
    
    if isinstance(result, dict) and "error" in result:
        return jsonify({"error": result["error"]}), 500
    
    return jsonify({"success": True, "data": result}), 201

@analysis_bp.route('/history/<user_id>', methods=['GET'])
def get_history(user_id):
    """Get analysis history for a specific user"""
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    result = get_user_analyses(user_id)
    
    if isinstance(result, dict) and "error" in result:
        return jsonify({"error": result["error"]}), 500
    
    return jsonify({"success": True, "data": result}), 200

@analysis_bp.route('/detail/<analysis_id>/<user_id>', methods=['GET'])
def get_analysis_detail(analysis_id, user_id):
    """Get a specific analysis by ID"""
    if not analysis_id or not user_id:
        return jsonify({"error": "Analysis ID and User ID are required"}), 400
    
    result = get_analysis_by_id(analysis_id, user_id)
    
    if isinstance(result, dict) and "error" in result:
        return jsonify({"error": result["error"]}), 404 if result["error"] == "Analysis not found" else 500
    
    return jsonify({"success": True, "data": result}), 200

@analysis_bp.route('/favorite', methods=['POST'])
def update_favorite():
    """Toggle favorite status for an analysis"""
    data = request.get_json()
    analysis_id = data.get('analysis_id')
    user_id = data.get('user_id')
    is_favorite = data.get('is_favorite', False)
    
    if not analysis_id or not user_id:
        return jsonify({"error": "Analysis ID and User ID are required"}), 400
    
    result = toggle_favorite(analysis_id, user_id, is_favorite)
    
    if isinstance(result, dict) and "error" in result:
        return jsonify({"error": result["error"]}), 500
    
    return jsonify({"success": True, "data": result}), 200

@analysis_bp.route('/supabase-test', methods=['GET'])
def test_supabase():
    """Test Supabase connection"""
    try:
        # Try a simple query to test the connection
        result = supabase.table('profiles').select('*').limit(1).execute()
        return jsonify({
            "success": True, 
            "message": "Supabase connection successful",
            "data": result.data
        }), 200
    except Exception as e:
        print(f"Error connecting to Supabase: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@analysis_bp.route('/user-analyses/<user_id>', methods=['GET'])
def get_user_analyses_endpoint(user_id):
    """Get all ATM analyses for a specific user"""
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    try:
        result = get_user_analyses(user_id)
        
        if isinstance(result, dict) and "error" in result:
            return jsonify({"success": False, "error": result["error"]}), 500
        
        # Transform the data into a format expected by the frontend
        transformed_data = []
        for i, analysis in enumerate(result):
            transformed_data.append({
                "id": analysis.get('id'),
                "number": i + 1,  # Auto-number the ATMs
                "location": {
                    "lat": analysis.get('location_lat'),
                    "lng": analysis.get('location_lng')
                },
                "metrics": {
                    "score": analysis.get('overall_score'),
                    "landRate": 50000 + (i * 10000),  # Placeholder - replace with real land rate data
                    "populationDensity": analysis.get('population_density'),
                    "competingATMs": analysis.get('competing_atms'),
                    "commercialActivity": analysis.get('commercial_activity'),
                    "trafficFlow": analysis.get('traffic_flow'),
                    "publicTransport": analysis.get('public_transport')
                },
                "isSelected": False,
                "created_at": analysis.get('created_at'),
                "is_favorite": analysis.get('is_favorite', False)
            })
        
        return jsonify({"success": True, "data": transformed_data}), 200
    except Exception as e:
        import traceback
        print(f"Error in get_user_analyses_endpoint: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500