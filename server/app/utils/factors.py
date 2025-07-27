import requests
import math
import json
import os

cache = {}

def overpass_query_executor(query):
    # Try multiple Overpass API endpoints for better reliability
    endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
        "https://z.overpass-api.de/api/interpreter"
    ]
    
    for endpoint in endpoints:
        try:
            print(f"Trying endpoint: {endpoint}")
            response = requests.get(
                endpoint, 
                params={"data": query}, 
                timeout=30,
                headers={'User-Agent': 'LocaCash ATM Analysis Tool'}
            )
            
            if response.status_code == 200:
                print(f"Success with endpoint: {endpoint}")
                return response.json()
            elif response.status_code == 429:
                print(f"Rate limited on {endpoint}, trying next...")
                continue
            else:
                print(f"HTTP {response.status_code} from {endpoint}")
                continue
                
        except requests.exceptions.Timeout:
            print(f"Timeout on {endpoint}, trying next...")
            continue
        except requests.exceptions.RequestException as e:
            print(f"Request error on {endpoint}: {e}")
            continue
    
    print("All Overpass API endpoints failed")
    return None

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
    try:
        print(f"Fetching data for coordinates: {lat}, {lng} with radius: {radius}m")
        all_data = fetch_all_location_data(lat, lng, radius)
        
        if not all_data or "elements" not in all_data:
            print("No data received from Overpass API")
            # Return default values if API fails
            return {
                "coords": [float(f"{round(lat, 3):.3f}"), float(f"{round(lng, 3):.3f}")],
                "population_density": 10.0,  # Default fallback values
                "competing_atms": 2,
                "commercial_activity": 5,
                "traffic_flow": 3,
                "public_transport": 1,
                "land_rate": 5000.0
            }
        
        elements = all_data.get("elements", [])
        print(f"Received {len(elements)} elements from Overpass API")
        
        density_elements = [e for e in elements if "amenity" in e.get("tags", {})]
        atm_elements = [e for e in elements if e.get("tags", {}).get("amenity") == "atm"]
        shop_elements = [e for e in elements if "shop" in e.get("tags", {})]
        highway_elements = [e for e in elements if "highway" in e.get("tags", {})]
        transport_elements = [e for e in elements if "public_transport" in e.get("tags", {})]
        
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
            # Round the coordinates to 3 decimals and remove trailing zeroes
            "coords": [float(f"{round(lat, 3):.3f}"), float(f"{round(lng, 3):.3f}")],
            "population_density": population_density,
            "competing_atms": competing_atms,
            "commercial_activity": commercial_activity,
            "traffic_flow": traffic_flow,
            "public_transport": public_transport,
            "land_rate": round(land_rate, 2)
        }

        print(f"Calculated data: {result}")
        return result
        
    except Exception as e:
        print(f"Error in calculate_location_data: {e}")
        # Return default fallback values on any error
        return {
            "coords": [float(f"{round(lat, 3):.3f}"), float(f"{round(lng, 3):.3f}")],
            "population_density": 10.0,
            "competing_atms": 2,
            "commercial_activity": 5,
            "traffic_flow": 3,
            "public_transport": 1,
            "land_rate": 5000.0
        }

if __name__ == "__main__": 
    print(calculate_location_data(13.0639, 80.2416))