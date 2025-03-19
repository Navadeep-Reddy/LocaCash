from flask import Blueprint, request, jsonify
from app.utils import factors
from app.utils.score import calculate_scores

atm_bp = Blueprint("atm", __name__, url_prefix='/atm/v1')

@atm_bp.route('/fetch_details', methods=['POST'])
def get_data():
    data = request.get_json()
    x = data.get('Location')

    response = factors.calculate_location_data(x[0], x[1])
    return response

@atm_bp.route('/get_score', methods=['POST'])
def get_score():
    data = request.get_json()
    location_data = data.get('location_data')
    weights = data.get('weights')
    
    if not location_data:
        return jsonify({"error": "Missing location data"}), 400
    
    scores = calculate_scores(location_data, weights)
    return jsonify(scores)