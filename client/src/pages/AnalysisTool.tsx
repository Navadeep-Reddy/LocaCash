import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import MapView from "@/components/analysis/MapView";
import AnalysisPanel from "@/components/analysis/AnalysisPanel";
import FactorWeights from "@/components/analysis/FactorWeights";
import ResultsPanel from "@/components/analysis/ResultsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LocationData {
  commercial_activity: number;
  competing_atms: number;
  land_rate: number;
  population_density: number;
  public_transport: number;
  traffic_flow: number;
}

interface FactorScore {
  score: number;
  rating: string;
}

interface ScoreResult {
  factor_scores: {
    commercial_activity: FactorScore;
    competing_atms: FactorScore;
    land_rate: FactorScore;
    population_density: FactorScore;
    public_transport: FactorScore;
    traffic_flow: FactorScore;
  };
  overall_score: number;
  recommendations: string[];
  suitability: string;
}

const AnalysisTool = () => {
  const [analysisInProgress, setAnalysisInProgress] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [activeTab, setActiveTab] = useState("location");
  const [analysisReady, setAnalysisReady] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [isScoreLoading, setIsScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);
  
  // Weights state for different factors
  const [weights, setWeights] = useState({
    populationDensity: 30,
    competingATMs: 25,
    commercialActivity: 20,
    trafficFlow: 15,
    publicTransport: 10,
    landRate: 15,
  });

  const handleStartAnalysis = () => {
    if (!selectedLocation) return;
    setAnalysisInProgress(true);
  };

  const handleLocationSelect = (location: {lat: number, lng: number}) => {
    setSelectedLocation(location);
    setAnalysisComplete(false);
    setAnalysisReady(false);
    setLocationData(null);
    setScoreResult(null);
  };

  const handleWeightChange = (factor: string, value: number) => {
    setWeights(prev => ({
      ...prev,
      [factor]: value
    }));
    
    // Reset analysis ready state when weights change
    setAnalysisReady(false);
  };
  
  const handleRunAnalysis = async () => {
    if (!locationData) {
      console.error("No location data available");
      return;
    }

    setScoreError(null);
    setIsScoreLoading(true);

    try {
      // Prepare the weights in the format expected by the backend
      const apiWeights = {
        population_density: weights.populationDensity,
        competing_atms: weights.competingATMs,
        commercial_activity: weights.commercialActivity,
        traffic_flow: weights.trafficFlow,
        public_transport: weights.publicTransport,
        land_rate: weights.landRate,
      };

      // Make API call to get score
      const response = await axios.post('http://localhost:8080/atm/v1/get_score', {
        location_data: locationData,
        weights: apiWeights
      });

      setScoreResult(response.data);
      setAnalysisReady(true);
      
      // Automatically switch to results tab
      setActiveTab("results");
      
      console.log("Analysis complete with score:", response.data.overall_score);
    } catch (error) {
      console.error("Error getting score:", error);
      setScoreError("Failed to calculate score. Please try again.");
    } finally {
      setIsScoreLoading(false);
    }
  };

  // Handle successful location data retrieval
  const handleLocationDataReceived = (data: LocationData) => {
    setLocationData(data);
    setAnalysisInProgress(false);
    setAnalysisComplete(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">ATM Location Analysis Tool</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapView 
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />
          </div>
          
          <div className="space-y-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="factors" disabled={!analysisComplete}>Factors</TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  disabled={!analysisReady}
                >
                  Results
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="location">
                <AnalysisPanel 
                  selectedLocation={selectedLocation}
                  onStartAnalysis={handleStartAnalysis}
                  analysisInProgress={analysisInProgress}
                  onLocationDataReceived={handleLocationDataReceived}
                />
              </TabsContent>
              
              <TabsContent value="factors">
                <FactorWeights 
                  weights={weights}
                  onWeightChange={handleWeightChange}
                  onRunAnalysis={handleRunAnalysis}
                  isLoading={isScoreLoading}
                  error={scoreError}
                />
              </TabsContent>
              
              <TabsContent value="results">
                {analysisReady && scoreResult && selectedLocation && (
                  <ResultsPanel 
                    selectedLocation={selectedLocation}
                    scoreResult={scoreResult}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTool;