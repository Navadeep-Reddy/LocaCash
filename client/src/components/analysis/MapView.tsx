import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface MapViewProps {
  onLocationSelect: (location: {lat: number, lng: number}) => void;
  selectedLocation: {lat: number, lng: number} | null;
}

const MapView = ({ onLocationSelect, selectedLocation }: MapViewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real implementation, this would integrate with Google Maps API
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // This is just a placeholder that simulates selecting a location
    // In the real implementation, we'd get coordinates from the Google Maps click event
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert pixel position to "fake" lat/lng for demonstration
    const lat = 40.7128 - (y / rect.height) * 0.1;
    const lng = -74.006 + (x / rect.width) * 0.1;
    
    setIsLoading(true);
    
    // Simulate API loading
    setTimeout(() => {
      onLocationSelect({ lat, lng });
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <div className="bg-muted rounded-lg border shadow-sm h-[600px] relative overflow-hidden">
      {/* This would be replaced by an actual Google Maps component */}
      <div 
        className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3')] bg-cover bg-center cursor-crosshair"
        onClick={handleMapClick}
      >
        {/* Overlay instructions */}
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border">
          <p className="text-sm font-medium">Click on the map to select a location for analysis</p>
        </div>
        
        {/* Display selected location */}
        {selectedLocation && (
          <div 
            className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${((selectedLocation.lng + 74.006) / 0.1) * 100}%`, 
              top: `${((40.7128 - selectedLocation.lat) / 0.1) * 100}%` 
            }}
          >
            <MapPin className="w-8 h-8 text-primary animate-bounce" />
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded border text-xs">
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