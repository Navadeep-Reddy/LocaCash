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
    data = overpass_query_executor(query)

    return data

def fetch_all_location_data(lat, lng, radius):
    query = f"""
    [out:json];
    (
        node(around:{radius},{lat},{lng})["amenity"];
        way(around:{radius},{lat},{lng})["amenity"];
        node(around:{radius},{lat},{lng})["amenity"="atm"];
        way(around:{radius},{lat},{lng})["amenity"="atm"];
        node(around:{radius},{lat},{lng})["shop"];
        way(around:{radius},{lat},{lng})["shop"];
        node(around:{radius},{lat},{lng})["highway"];
        way(around:{radius},{lat},{lng})["highway"];
        node(around:{radius},{lat},{lng})["public_transport"];
        way(around:{radius},{lat},{lng})["public_transport"];
    );
    out body;
    """
    
    data = overpass_query_executor(query)

    return data

def calculate_location_data(lat, lng, radius=1500):
    all_data = fetch_all_location_data(lat, lng, radius)
    
    density_elements = [e for e in all_data.get("elements", []) if "amenity" in e.get("tags", {})]
    atm_elements = [e for e in all_data.get("elements", []) if e.get("tags", {}).get("amenity") == "atm"]
    shop_elements = [e for e in all_data.get("elements", []) if "shop" in e.get("tags", {})]
    highway_elements = [e for e in all_data.get("elements", []) if "highway" in e.get("tags", {})]
    transport_elements = [e for e in all_data.get("elements", []) if "public_transport" in e.get("tags", {})]
    
    population_density = len(density_elements) / (math.pi * (radius / 1000) ** 2)
    competing_atms = len(atm_elements)

    atm_locations = []
    for element in atm_elements:
        if 'lat' in element and 'lon' in element:
            atm_locations.append({'lat': element['lat'], 'lng': element['lon']})

    commercial_activity = len(shop_elements)
    traffic_flow = len(highway_elements)
    public_transport = len(transport_elements)

    base_rate = 2000  # base price per sq.ft. (example)
    land_rate = base_rate + (population_density * 200) + (commercial_activity * 100) + (traffic_flow * 50)

    result = {
        "coords": [lat, lng],
        "population_density": population_density,
        "competing_atms": competing_atms,
        #"atm_locations": atm_locations,
        "commercial_activity": commercial_activity,
        "traffic_flow": traffic_flow,
        "public_transport": public_transport,
        "land_rate": round(land_rate, 2)
    }

    return result

if __name__ == "__main__": 
    print(calculate_location_data(13.063961, 80.241677))
