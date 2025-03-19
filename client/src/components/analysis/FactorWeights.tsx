import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Users, Building, ShoppingBag, Car, Train, DollarSign, BarChart3 } from "lucide-react";

interface FactorWeightsProps {
  weights: {
    populationDensity: number;
    competingATMs: number;
    commercialActivity: number;
    trafficFlow: number;
    publicTransport: number;
    landRate: number;
  };
  onWeightChange: (factor: string, value: number) => void;
  onRunAnalysis: () => void;
}

const FactorWeights = ({ weights, onWeightChange, onRunAnalysis }: FactorWeightsProps) => {
  
  const handleRunAnalysis = () => {
    // Log all slider values to console
    console.log("Analysis run with weights:", {
      populationDensity: weights.populationDensity,
      competingATMs: weights.competingATMs,
      commercialActivity: weights.commercialActivity,
      trafficFlow: weights.trafficFlow,
      publicTransport: weights.publicTransport,
      landRate: weights.landRate
    });
    
    // Call the parent component's handler
    onRunAnalysis();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Factors</CardTitle>
        <CardDescription>
          Adjust the importance of each factor in the analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">Population Density</span>
            </div>
            <span className="text-sm font-medium">{weights.populationDensity}%</span>
          </div>
          <Slider 
            value={[weights.populationDensity]} 
            min={0} 
            max={100}
            step={5}
            onValueChange={(value) => onWeightChange('populationDensity', value[0])}
            className="w-full" 
          />
          <p className="text-xs text-muted-foreground">
            Areas with higher population density generally yield more ATM transactions.
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full">
                <Building className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="font-medium">Competing ATMs</span>
            </div>
            <span className="text-sm font-medium">{weights.competingATMs}%</span>
          </div>
          <Slider 
            value={[weights.competingATMs]} 
            min={0} 
            max={100} 
            step={5}
            onValueChange={(value) => onWeightChange('competingATMs', value[0])}
            className="w-full" 
          />
          <p className="text-xs text-muted-foreground">
            Consider the proximity and number of existing ATMs in the area.
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                <ShoppingBag className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-medium">Commercial Activity</span>
            </div>
            <span className="text-sm font-medium">{weights.commercialActivity}%</span>
          </div>
          <Slider 
            value={[weights.commercialActivity]} 
            min={0} 
            max={100} 
            step={5}
            onValueChange={(value) => onWeightChange('commercialActivity', value[0])}
            className="w-full" 
          />
          <p className="text-xs text-muted-foreground">
            Proximity to shopping centers, businesses, and entertainment venues.
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full">
                <Car className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="font-medium">Traffic Flow</span>
            </div>
            <span className="text-sm font-medium">{weights.trafficFlow}%</span>
          </div>
          <Slider 
            value={[weights.trafficFlow]} 
            min={0} 
            max={100} 
            step={5}
            onValueChange={(value) => onWeightChange('trafficFlow', value[0])}
            className="w-full" 
          />
          <p className="text-xs text-muted-foreground">
            Vehicle traffic can influence visibility and accessibility.
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
                <Train className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium">Public Transport</span>
            </div>
            <span className="text-sm font-medium">{weights.publicTransport}%</span>
          </div>
          <Slider 
            value={[weights.publicTransport]} 
            min={0} 
            max={100} 
            step={5}
            onValueChange={(value) => onWeightChange('publicTransport', value[0])}
            className="w-full" 
          />
          <p className="text-xs text-muted-foreground">
            Proximity to bus stops, train stations, and other transit points.
          </p>
        </div>
        
        {/* New Land Rate Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-full">
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-medium">Land Rate</span>
            </div>
            <span className="text-sm font-medium">{weights.landRate}%</span>
          </div>
          <Slider 
            value={[weights.landRate || 15]} 
            min={0} 
            max={100} 
            step={5}
            onValueChange={(value) => onWeightChange('landRate', value[0])}
            className="w-full" 
          />
          <p className="text-xs text-muted-foreground">
            Property costs affect the long-term ROI of ATM placement.
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full gap-2" 
          onClick={handleRunAnalysis}
        >
          <BarChart3 className="h-4 w-4" />
          Run Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FactorWeights;