import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, AlertCircle } from "lucide-react";

interface ResultsPanelProps {
  selectedLocation: {lat: number, lng: number} | null;
  weights: {
    populationDensity: number;
    competingATMs: number;
    commercialActivity: number;
    trafficFlow: number;
    publicTransport: number;
  };
}

const ResultsPanel = ({ selectedLocation, weights }: ResultsPanelProps) => {
  // This would be calculated from backend
  const overallScore = 78;
  
  // Mock data - in real app would be from API
  const factorScores = {
    populationDensity: 85,
    competingATMs: 65,
    commercialActivity: 90,
    trafficFlow: 70,
    publicTransport: 80,
  };
  
  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">High</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">Medium</Badge>;
    return <Badge className="bg-red-500">Low</Badge>;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Analysis Results</span>
          {overallScore >= 75 ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          )}
        </CardTitle>
        <CardDescription>
          {selectedLocation && `Results for location (${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)})`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall score */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Overall Viability Score</span>
            <span className="font-bold">{overallScore}/100</span>
          </div>
          <Progress value={overallScore} className="h-2.5" />
          <p className="text-xs text-muted-foreground">
            {overallScore >= 75 
              ? "This location is highly suitable for an ATM placement."
              : overallScore >= 60 
                ? "This location is moderately suitable for an ATM placement."
                : "This location has low suitability for an ATM placement."
            }
          </p>
        </div>
        
        {/* Factor breakdown */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Factor Breakdown</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Population Density</span>
              <div className="flex items-center gap-2">
                {getScoreBadge(factorScores.populationDensity)}
                <span className="text-sm font-medium w-8 text-right">{factorScores.populationDensity}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Competing ATMs</span>
              <div className="flex items-center gap-2">
                {getScoreBadge(factorScores.competingATMs)}
                <span className="text-sm font-medium w-8 text-right">{factorScores.competingATMs}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Commercial Activity</span>
              <div className="flex items-center gap-2">
                {getScoreBadge(factorScores.commercialActivity)}
                <span className="text-sm font-medium w-8 text-right">{factorScores.commercialActivity}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Traffic Flow</span>
              <div className="flex items-center gap-2">
                {getScoreBadge(factorScores.trafficFlow)}
                <span className="text-sm font-medium w-8 text-right">{factorScores.trafficFlow}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Public Transport</span>
              <div className="flex items-center gap-2">
                {getScoreBadge(factorScores.publicTransport)}
                <span className="text-sm font-medium w-8 text-right">{factorScores.publicTransport}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="bg-muted p-3 rounded border">
          <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• This location has excellent commercial activity nearby</li>
            <li>• Good public transportation access increases potential foot traffic</li>
            <li>• Consider the moderate competition from existing ATMs in a 500m radius</li>
          </ul>
        </div>
        
        <Button size="sm" variant="outline" className="w-full gap-2">
          <Download className="h-4 w-4" />
          Export Report as PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResultsPanel;