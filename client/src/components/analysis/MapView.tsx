import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Create custom icon for markers
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Set default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  onLocationSelect: (location: {lat: number, lng: number}) => void;
  selectedLocation: {lat: number, lng: number} | null;
}

// Component to handle map click events
function LocationMarker({ onLocationSelect }: { onLocationSelect: (location: {lat: number, lng: number}) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  
  return null;
}

const MapView = ({ onLocationSelect, selectedLocation }: MapViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const defaultPosition: [number, number] = [40.7128, -74.0060]; // New York
  
  const handleLocationSelect = (location: {lat: number, lng: number}) => {
    setIsLoading(true);
    
    // Simulate API loading (replace with actual API call if needed)
    setTimeout(() => {
      onLocationSelect(location);
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <div className="bg-muted rounded-lg border shadow-sm h-[600px] relative overflow-hidden">
      {/* Overlay instructions */}
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border z-[1000]">
        <p className="text-sm font-medium">Click on the map to select a location for analysis</p>
      </div>
      
      {/* LeafletJS map */}
      <MapContainer 
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : defaultPosition} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Click handler */}
        <LocationMarker onLocationSelect={handleLocationSelect} />
        
        {/* Display selected location */}
        {selectedLocation && (
          <Marker 
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={DefaultIcon}
          />
        )}
      </MapContainer>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center z-[1001]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
      
      {/* Coordinates display */}
      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded border text-xs z-[1000]">
        {selectedLocation ? (
          <span>Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}</span>
        ) : (
          <span>No location selected</span>
        )}
      </div>
    </div>
  );
};

export default MapView;