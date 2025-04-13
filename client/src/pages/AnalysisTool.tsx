import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import MapView from "@/components/analysis/MapView";
import AnalysisPanel from "@/components/analysis/AnalysisPanel";
import FactorWeights from "@/components/analysis/FactorWeights";
import ResultsPanel from "@/components/analysis/ResultsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabaseClient';
import { ATMAnalysisAPI } from '@/lib/api';
import { toast } from "@/hooks/use-toast";
import { Save, MapPin } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

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

  const saveAnalysisResults = async () => {
    if (!selectedLocation || !locationData || !scoreResult) return;

    try {
      // Prepare the analysis data
      const analysisData = {
        location_lat: selectedLocation.lat,
        location_lng: selectedLocation.lng,
        
        // Raw factors
        population_density: locationData.population_density,
        competing_atms: locationData.competing_atms,
        commercial_activity: locationData.commercial_activity,
        traffic_flow: locationData.traffic_flow,
        public_transport: locationData.public_transport,
        land_rate: locationData.land_rate,
        
        // Scores
        overall_score: scoreResult.overall_score,
        population_density_score: scoreResult.factor_scores.population_density.score,
        competing_atms_score: scoreResult.factor_scores.competing_atms.score,
        commercial_activity_score: scoreResult.factor_scores.commercial_activity.score,
        traffic_flow_score: scoreResult.factor_scores.traffic_flow.score,
        public_transport_score: scoreResult.factor_scores.public_transport.score,
        land_rate_score: scoreResult.factor_scores.land_rate.score,
        
        // Weights
        population_density_weight: weights.populationDensity,
        competing_atms_weight: weights.competingATMs,
        commercial_activity_weight: weights.commercialActivity,
        traffic_flow_weight: weights.trafficFlow,
        public_transport_weight: weights.publicTransport,
        land_rate_weight: weights.landRate,
        
        // Recommendations
        recommendations: scoreResult.recommendations
      };
      
      // Save to database via Flask API
      const result = await ATMAnalysisAPI.saveAnalysis(analysisData);
      
      if (result.success) {
        toast({
          title: "Analysis saved",
          description: "Your analysis has been saved to your history."
        });
      } else {
        toast({
          title: "Error saving analysis",
          description: "There was a problem saving your analysis.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast({
        title: "Error saving analysis",
        description: "There was a problem saving your analysis.",
        variant: "destructive"
      });
    }
  };

  // Improved test function
  const saveTestAnalysis = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;
      
      if (!userId) {
        console.error("No user logged in");
        toast({
          title: "Authentication Error",
          description: "Please log in first",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Using User ID:", userId);
      
      // Simpler test data
      const testData = {
        user_id: userId,
        location_lat: 40.7128,
        location_lng: -74.0060,
        population_density: 1000,
        competing_atms: 5,
        commercial_activity: 50,
        traffic_flow: 60,
        public_transport: 40,
        land_rate: 70,
        overall_score: 65,
        population_density_score: 50,
        competing_atms_score: 60,
        commercial_activity_score: 70,
        traffic_flow_score: 65,
        public_transport_score: 55,
        land_rate_score: 75,
        population_density_weight: 20,
        competing_atms_weight: 20,
        commercial_activity_weight: 20,
        traffic_flow_weight: 15,
        public_transport_weight: 15,
        land_rate_weight: 10,
        recommendations: ["Test recommendation"]
      };
      
      console.log("Sending test data:", testData);
      
      // Send to Flask backend
      const response = await axios.post('http://localhost:8080/analysis/v1/save', testData);
      
      console.log("Server response:", response.data);
      
      if (response.data.success) {
        toast({
          title: "Test Successful",
          description: "Test analysis saved successfully!",
        });
      } else {
        toast({
          title: "Save Failed",
          description: response.data.error || "Unknown error",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error in test save:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message || "Unknown error",
        variant: "destructive"
      });
    }
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
                  <>
                    <ResultsPanel 
                      selectedLocation={selectedLocation}
                      scoreResult={scoreResult}
                    />
                    <div className="mt-4">
                      <Button 
                        onClick={saveAnalysisResults} 
                        className="w-full"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Analysis to My Account
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
            <div className="mt-4">
              <Button onClick={saveTestAnalysis} variant="outline" size="sm">
                Test Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AnalysisTool;