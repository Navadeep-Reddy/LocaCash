import requests
import math
import json
import os

cache = {}

def overpass_query_executor(query):
    response = requests.get("http://overpass-api.de/api/interpreter", params={"data": query})
    if response.status_code != 200:
        return None
    return response.json()

def fetch_data_from_overpass(lat, lng, radius, tag_filter):
    query = f"""
    [out:json];
    (
        node(around:{radius},{lat},{lng}){tag_filter};
        way(around:{radius},{lat},{lng}){tag_filter};
    );
    out body;
    """
    if query in cache:
        return cache[query]
    data = overpass_query_executor(query)
    if data:
        cache[query] = data
    return data

def save_data_to_json(lat, lng, data):
    file_path = "data_log.json"
    record = {
        "latitude": lat,
        "longitude": lng,
        **data
    }
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            existing_data = json.load(file)
    else:
        existing_data = []

    existing_data.append(record)

    with open(file_path, 'w') as file:
        json.dump(existing_data, file, indent=4)

def calculate_location_data(lat, lng, radius=1500):
    density_data = fetch_data_from_overpass(lat, lng, radius, '["amenity"]')
    atm_data = fetch_data_from_overpass(lat, lng, radius, '["amenity"="atm"]')
    shop_data = fetch_data_from_overpass(lat, lng, radius, '["shop"]')
    highway_data = fetch_data_from_overpass(lat, lng, radius, '["highway"]')
    transport_data = fetch_data_from_overpass(lat, lng, radius, '["public_transport"]')

    population_density = len(density_data["elements"]) / (math.pi * (radius / 1000) ** 2) if density_data else 0
    competing_atms = len(atm_data["elements"]) if atm_data else 0

    atm_locations = []
    if atm_data:
        for element in atm_data["elements"]:
            if 'lat' in element and 'lon' in element:
                atm_locations.append({'lat': element['lat'], 'lng': element['lon']})

    commercial_activity = len(shop_data["elements"]) if shop_data else 0
    traffic_flow = len(highway_data["elements"]) if highway_data else 0
    public_transport = len(transport_data["elements"]) if transport_data else 0

    base_rate = 2000  # base price per sq.ft. (example)
    land_rate = base_rate + (population_density * 200) + (commercial_activity * 100) + (traffic_flow * 50)

    result = {
        "population_density": population_density,
        "competing_atms": competing_atms,
        "atm_locations": atm_locations,
        "commercial_activity": commercial_activity,
        "traffic_flow": traffic_flow,
        "public_transport": public_transport,
        "land_rate": round(land_rate, 2)
    }

    save_data_to_json(lat, lng, result)
    return result
