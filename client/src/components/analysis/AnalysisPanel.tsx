import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Ruler, Building, Users, ArrowRight, Loader2, AtSign, Activity, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface AnalysisData {
  commercial_activity: number;
  competing_atms: number;
  land_rate: number;
  population_density: number;
  public_transport: number;
  traffic_flow: number;
}

interface AnalysisPanelProps {
  selectedLocation: {lat: number, lng: number} | null;
  onStartAnalysis: () => void;
  analysisInProgress: boolean;
  onLocationDataReceived: (data: AnalysisData) => void;
}

const AnalysisPanel = ({ 
  selectedLocation, 
  onStartAnalysis,
  analysisInProgress,
  onLocationDataReceived 
}: AnalysisPanelProps) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Reset analysis data when a new location is selected
  useEffect(() => {
    setAnalysisData(null);
    setError(null);
  }, [selectedLocation]);

  const handleAnalysis = async () => {
    if (!selectedLocation) return;

    try {
      setError(null);
      onStartAnalysis();
      
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      // Make API call
      const response = await axios.post('http://localhost:8080/atm/v1/fetch_details', {
        Location: [selectedLocation.lat, selectedLocation.lng]
      });

      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisData(response.data);
      
      // Pass the data back to the parent component
      onLocationDataReceived(response.data);
      
      // Reset progress after showing 100%
      setTimeout(() => {
        setProgress(0);
      }, 500);

    } catch (err) {
      setError("Failed to analyze location. Please try again.");
      console.error("Analysis failed:", err);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Analysis
        </CardTitle>
        <CardDescription>
          Select a location on the map and analyze its potential for ATM placement
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {selectedLocation ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Selected coordinates:</span>
              </div>
              <div className="font-mono bg-muted p-2 rounded text-sm">
                Lat: {selectedLocation.lat.toFixed(6)}, Long: {selectedLocation.lng.toFixed(6)}
              </div>
            </div>
            
            {analysisData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>Commercial Activity</span>
                  </div>
                  <span className="text-sm font-medium">{analysisData.commercial_activity}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    <span>Competing ATMs</span>
                  </div>
                  <span className="text-sm font-medium">{analysisData.competing_atms}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Population Density</span>
                  </div>
                  <span className="text-sm font-medium">
                    {analysisData.population_density.toFixed(2)} per km²
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span>Traffic Flow</span>
                  </div>
                  <span className="text-sm font-medium">{analysisData.traffic_flow}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Public Transport</span>
                  </div>
                  <span className="text-sm font-medium">{analysisData.public_transport}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Land Rate</span>
                  </div>
                  <span className="text-sm font-medium">₹{analysisData.land_rate.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>Commercial Activity</span>
                  </div>
                  <span className="text-sm font-medium">-</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    <span>Competing ATMs</span>
                  </div>
                  <span className="text-sm font-medium">-</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Population Density</span>
                  </div>
                  <span className="text-sm font-medium">-</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span>Traffic Flow</span>
                  </div>
                  <span className="text-sm font-medium">-</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Public Transport</span>
                  </div>
                  <span className="text-sm font-medium">-</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Land Rate</span>
                  </div>
                  <span className="text-sm font-medium">-</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-red-500 text-sm border border-red-200 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center border border-dashed rounded-md">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No location selected</p>
              <p className="text-sm">Click on the map to select a location</p>
            </div>
          </div>
        )}
        
        {progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Analysis in progress...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full gap-2" 
          disabled={!selectedLocation || analysisInProgress}
          onClick={handleAnalysis}
        >
          {analysisInProgress ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Retrieving...
            </>
          ) : analysisData ? (
            <>
              Re-Fetch
              <Activity className="h-4 w-4" />
            </>
          ) : (
            <>
              Retrieve Data
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisPanel;