import math

def calculate_scores(location_data, weights=None):
    """
    Calculate ATM location viability scores based on raw location data metrics
    
    Args:
        location_data (dict): Raw metrics from the factors API
        weights (dict, optional): Custom weights for each factor (0-100)
        
    Returns:
        dict: Comprehensive scoring data for the Results panel
    """
    # Default weights if none provided
    if weights is None:
        weights = {
            "population_density": 25,
            "competing_atms": 20,
            "commercial_activity": 20, 
            "traffic_flow": 15,
            "public_transport": 10,
            "land_rate": 10
        }
    
    # Normalize weights to sum to 100
    weight_sum = sum(weights.values())
    normalized_weights = {k: (v / weight_sum) * 100 for k, v in weights.items()}
    
    # Calculate individual factor scores (0-100)
    factor_scores = {}
    
    # Population density (higher is better, with diminishing returns)
    # Calibrated to score 80+ when density > 15 per km²
    if location_data["population_density"] > 0:
        factor_scores["population_density"] = min(100, 40 + 45 * math.log10(location_data["population_density"]))
    else:
        factor_scores["population_density"] = 10
    
    # Competing ATMs (fewer is better, but some competition indicates good location)
    # 0-1 ATMs = 85-100, 2-3 = 65-75, 4-5 = 50-60, 6+ = <50
    atm_count = location_data["competing_atms"]
    if atm_count == 0:
        factor_scores["competing_atms"] = 85  # No competition, but possibly untested market
    elif atm_count == 1:
        factor_scores["competing_atms"] = 95  # Some competition validates market, but not saturated
    elif atm_count <= 3:
        factor_scores["competing_atms"] = 80 - (atm_count - 1) * 5
    else:
        factor_scores["competing_atms"] = max(30, 65 - (atm_count - 3) * 7)
    
    # Commercial activity (higher is better)
    # Score calibrated to give 80+ when >10 commercial establishments
    commercial = location_data["commercial_activity"]
    factor_scores["commercial_activity"] = min(100, 40 + commercial * 5)
    
    # Traffic flow (higher is better with diminishing returns)
    # Calibrated for typical urban traffic counts (100-2000 road segments)
    traffic = location_data["traffic_flow"]
    if traffic > 0:
        factor_scores["traffic_flow"] = min(100, 30 + 35 * math.log10(traffic))
    else:
        factor_scores["traffic_flow"] = 10
    
    # Public transport (higher is better)
    # Each transport point is valuable, diminishing after 10+
    transport = location_data["public_transport"]
    factor_scores["public_transport"] = min(100, 40 + 5 * transport)
    
    # Land rate (lower is better - affects ROI)
    # Calibrated for typical urban land rates (30k-150k per sq.ft)
    land_rate = location_data["land_rate"]
    if land_rate > 0:
        factor_scores["land_rate"] = max(30, 110 - 15 * math.log10(land_rate))
    else:
        factor_scores["land_rate"] = 90
    
    # Calculate overall score as weighted average
    overall_score = 0
    for factor, score in factor_scores.items():
        overall_score += score * (normalized_weights[factor] / 100)
    
    overall_score = round(overall_score)
    
    # Generate recommendations based on scores
    recommendations = generate_recommendations(factor_scores, location_data)
    
    # Determine rating categories
    def get_rating(score):
        if score >= 80:
            return "High"
        elif score >= 60:
            return "Medium"
        else:
            return "Low"
    
    # Format the response for the UI
    result = {
        "overall_score": overall_score,
        "suitability": get_overall_suitability(overall_score),
        "factor_scores": {
            factor: {
                "score": round(score),
                "rating": get_rating(score)
            } for factor, score in factor_scores.items()
        },
        "recommendations": recommendations
    }
    
    return result

def get_overall_suitability(score):
    """Determine the overall suitability description based on score"""
    if score >= 75:
        return "This location is highly suitable for an ATM placement."
    elif score >= 60:
        return "This location is moderately suitable for an ATM placement."
    else:
        return "This location has low suitability for an ATM placement."

def generate_recommendations(scores, raw_data):
    """Generate specific recommendations based on factor scores and raw data"""
    recommendations = []
    
    # Commercial activity recommendations
    if scores["commercial_activity"] >= 80:
        recommendations.append("This location has excellent commercial activity nearby")
    elif scores["commercial_activity"] >= 60:
        recommendations.append("Moderate commercial presence offers good potential foot traffic")
    else:
        recommendations.append("Limited commercial activity may reduce potential transactions")
    
    # Public transport recommendations
    if scores["public_transport"] >= 70:
        recommendations.append("Good public transportation access increases potential foot traffic")
    
    # Competition recommendations
    if raw_data["competing_atms"] == 0:
        recommendations.append("No competing ATMs in the area - opportunity to establish presence")
    elif raw_data["competing_atms"] <= 3:
        recommendations.append(f"Consider the moderate competition from {raw_data['competing_atms']} existing ATM(s) in a 1.5km radius")
    else:
        recommendations.append(f"High competition with {raw_data['competing_atms']} existing ATMs may limit transaction volume")
    
    # Land rate considerations
    if scores["land_rate"] < 50:
        recommendations.append("High land rates in this area may affect long-term ROI - consider lease options")
    
    return recommendations

# Example usage
if __name__ == "__main__":
    sample_data = {
        "commercial_activity": 14,
        "competing_atms": 1,
        "land_rate": 69237.54,
        "population_density": 20.93771695786712,
        "public_transport": 33,
        "traffic_flow": 1233
    }
    
    sample_weights = {
        "population_density": 30,
        "competing_atms": 25,
        "commercial_activity": 20,
        "traffic_flow": 15,
        "public_transport": 10,
        "land_rate": 15
    }
    
    result = calculate_scores(sample_data, sample_weights)
    import json
    print(json.dumps(result, indent=2))