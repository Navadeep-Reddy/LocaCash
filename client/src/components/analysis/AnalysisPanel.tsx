import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Ruler, Building, Users, ArrowRight, Loader2 } from "lucide-react";

interface AnalysisPanelProps {
  selectedLocation: {lat: number, lng: number} | null;
  onStartAnalysis: () => void;
  analysisInProgress: boolean;
}

const AnalysisPanel = ({ 
  selectedLocation, 
  onStartAnalysis,
  analysisInProgress 
}: AnalysisPanelProps) => {
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
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>Nearby businesses</span>
                </div>
                <span className="text-sm font-medium">12</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Est. foot traffic</span>
                </div>
                <span className="text-sm font-medium">High</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span>Closest ATM</span>
                </div>
                <span className="text-sm font-medium">0.8 km</span>
              </div>
            </div>
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
        
        {analysisInProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Analysis in progress...</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full gap-2" 
          disabled={!selectedLocation || analysisInProgress}
          onClick={onStartAnalysis}
        >
          {analysisInProgress ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Run Analysis
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisPanel;