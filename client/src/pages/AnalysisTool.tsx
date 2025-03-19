import { useState } from "react";
import NavBar from "@/components/NavBar";
import MapView from "@/components/analysis/MapView";
import AnalysisPanel from "@/components/analysis/AnalysisPanel";
import FactorWeights from "@/components/analysis/FactorWeights";
import ResultsPanel from "@/components/analysis/ResultsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AnalysisTool = () => {
  const [analysisInProgress, setAnalysisInProgress] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [activeTab, setActiveTab] = useState("location");
  const [analysisReady, setAnalysisReady] = useState(false);
  
  // Mock weights state for different factors
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
    
    // Simulate API call with timeout
    setTimeout(() => {
      setAnalysisInProgress(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const handleLocationSelect = (location: {lat: number, lng: number}) => {
    setSelectedLocation(location);
    setAnalysisComplete(false);
    setAnalysisReady(false);
  };

  const handleWeightChange = (factor: string, value: number) => {
    setWeights(prev => ({
      ...prev,
      [factor]: value
    }));
    
    // Reset analysis ready state when weights change
    setAnalysisReady(false);
  };
  
  const handleRunAnalysis = () => {
    setAnalysisReady(true);
    console.log("Analysis run with weights:", weights);
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
                <TabsTrigger value="factors">Factors</TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  disabled={!analysisReady || !analysisComplete}
                >
                  Results
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="location">
                <AnalysisPanel 
                  selectedLocation={selectedLocation}
                  onStartAnalysis={handleStartAnalysis}
                  analysisInProgress={analysisInProgress}
                />
              </TabsContent>
              
              <TabsContent value="factors">
                <FactorWeights 
                  weights={weights}
                  onWeightChange={handleWeightChange}
                  onRunAnalysis={handleRunAnalysis}
                />
              </TabsContent>
              
              <TabsContent value="results">
                {analysisComplete && analysisReady && (
                  <ResultsPanel 
                    selectedLocation={selectedLocation}
                    weights={weights}
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