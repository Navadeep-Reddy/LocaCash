import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  DollarSign, 
  BarChart3, 
  Calculator, 
  Check, 
  Info, 
  Star, 
  Loader2, 
  Building, 
  Users,
  Activity,
  Train,
  X
} from "lucide-react";

// Define types for our ATM locations
interface ATMLocation {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  metrics: {
    score: number;
    landRate: number;
    populationDensity: number;
    competingATMs: number;
    commercialActivity: number;
    trafficFlow: number;
    publicTransport: number;
  };
  isSelected: boolean;
}

// Knapsack algorithm implementation
const solveKnapsack = (
  locations: ATMLocation[],
  capacity: number
): { selectedLocations: ATMLocation[]; totalValue: number; usedBudget: number } => {
  // Sort locations by value-to-weight ratio (score / landRate) for greedy approach
  const sortedLocations = [...locations].sort(
    (a, b) => 
      (b.metrics.score / b.metrics.landRate) - 
      (a.metrics.score / a.metrics.landRate)
  );
  
  const selectedLocations: ATMLocation[] = [];
  let totalValue = 0;
  let usedBudget = 0;
  
  for (const location of sortedLocations) {
    if (usedBudget + location.metrics.landRate <= capacity) {
      selectedLocations.push({...location, isSelected: true});
      totalValue += location.metrics.score;
      usedBudget += location.metrics.landRate;
    }
  }
  
  return { selectedLocations, totalValue, usedBudget };
};

// Generate a formatted location name from coordinates
const formatLocationName = (lat: number, lng: number): string => {
  const direction = {
    lat: lat > 13.07 ? "North" : "South",
    lng: lng > 80.24 ? "East" : "West"
  };
  
  return `${direction.lat}${direction.lng} Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
};

// Simulated API call to get ATM locations
const fetchAtmLocations = async (): Promise<ATMLocation[]> => {
  // In a real implementation, this would fetch from your backend
  // For now, we're generating sample data
  
  // Sample coordinates around Chennai
  const coordinates = [
    [13.083961, 80.241677],
    [13.063254, 80.255427],
    [13.052614, 80.218123],
    [13.102874, 80.265187],
    [13.041523, 80.232568],
    [13.071345, 80.198762],
    [13.095672, 80.221453],
    [13.023458, 80.243789],
    [13.112567, 80.187654],
    [13.062819, 80.273456]
  ];
  
  // Simulate fetching location data for each coordinate
  const locations: ATMLocation[] = [];
  
  for (let i = 0; i < coordinates.length; i++) {
    const [lat, lng] = coordinates[i];
    
    try {
      // In a real implementation, fetch data from your backend API
      // const response = await axios.post('http://localhost:8080/atm/v1/fetch_details', {
      //   Location: [lat, lng]
      // });
      // const locationData = response.data;
      
      // For now, simulate API response
      const score = 70 + Math.floor(Math.random() * 30);
      const landRate = 40000 + Math.floor(Math.random() * 60000);
      const populationDensity = 10 + Math.random() * 20;
      const competingATMs = Math.floor(Math.random() * 4);
      const commercialActivity = 5 + Math.floor(Math.random() * 30);
      const trafficFlow = 500 + Math.floor(Math.random() * 1700);
      const publicTransport = 5 + Math.floor(Math.random() * 40);
      
      locations.push({
        id: `atm-${i + 1}`,
        location: { lat, lng },
        metrics: {
          score,
          landRate,
          populationDensity,
          competingATMs,
          commercialActivity,
          trafficFlow,
          publicTransport
        },
        isSelected: false
      });
    } catch (error) {
      console.error(`Error fetching data for location ${lat}, ${lng}:`, error);
    }
  }
  
  return locations;
};

const DataInsights = () => {
  const [locations, setLocations] = useState<ATMLocation[]>([]);
  const [budget, setBudget] = useState<number>(200000);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizedResult, setOptimizedResult] = useState<{
    selectedLocations: ATMLocation[];
    totalValue: number;
    usedBudget: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("locations");
  const [error, setError] = useState<string | null>(null);
  
  // Load ATM locations when component mounts
  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchAtmLocations();
        setLocations(data);
      } catch (err) {
        console.error("Failed to load ATM locations:", err);
        setError("Failed to load ATM locations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLocations();
  }, []);
  
  const handleBudgetChange = (value: number[]) => {
    setBudget(value[0]);
    // Reset optimized result when budget changes
    setOptimizedResult(null);
  };
  
  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate optimization processing time
    setTimeout(() => {
      try {
        const result = solveKnapsack(locations, budget);
        setOptimizedResult(result);
        // Switch to results tab
        setActiveTab("results");
      } catch (err) {
        console.error("Optimization failed:", err);
        setError("Failed to optimize ATM locations. Please try again.");
      } finally {
        setIsOptimizing(false);
      }
    }, 1500);
  };
  
  // Format currency in Rupees
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Helper to determine color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };
  
  // Calculate efficiency ratio (score per 10,000 land rate)
  const calculateEfficiency = (score: number, landRate: number): number => {
    return (score / landRate) * 10000;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">ATM Portfolio Optimization</h1>
            <p className="text-muted-foreground">
              Use our knapsack algorithm to select the optimal ATM locations within your budget
            </p>
          </div>
          
          <Card className="w-full md:w-auto">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Budget</div>
                  <div className="font-bold text-lg">{formatCurrency(budget)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-700">Error</h4>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="locations">Available Locations</TabsTrigger>
            <TabsTrigger value="optimization">Budget Allocation</TabsTrigger>
            <TabsTrigger value="results" disabled={!optimizedResult}>
              Optimized Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="locations">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading ATM locations...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {locations.map((location) => (
                  <Card key={location.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            {location.id}
                          </CardTitle>
                          <CardDescription>
                            {location.location.lat.toFixed(6)}, {location.location.lng.toFixed(6)}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className={`text-xl font-bold ${getScoreColor(location.metrics.score)}`}>
                            {location.metrics.score}/100
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Viability Score
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Land Rate</div>
                          <div className="font-medium flex items-center gap-1">
                            
                            {formatCurrency(location.metrics.landRate)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Efficiency</div>
                          <div className="font-medium flex items-center gap-1">
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                            {calculateEfficiency(location.metrics.score, location.metrics.landRate).toFixed(1)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center bg-primary/5 rounded p-2">
                          <Users className="h-4 w-4 text-blue-600 mb-1" />
                          <span className="text-xs font-medium">{location.metrics.populationDensity.toFixed(1)}</span>
                          <span className="text-[10px] text-muted-foreground">Pop. Density</span>
                        </div>
                        
                        <div className="flex flex-col items-center bg-primary/5 rounded p-2">
                          <Building className="h-4 w-4 text-green-600 mb-1" />
                          <span className="text-xs font-medium">{location.metrics.commercialActivity}</span>
                          <span className="text-[10px] text-muted-foreground">Commercial</span>
                        </div>
                        
                        <div className="flex flex-col items-center bg-primary/5 rounded p-2">
                          <Activity className="h-4 w-4 text-amber-600 mb-1" />
                          <span className="text-xs font-medium">{location.metrics.trafficFlow}</span>
                          <span className="text-[10px] text-muted-foreground">Traffic</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="optimization">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Budget Allocation
                    </CardTitle>
                    <CardDescription>
                      Set your total budget for ATM installations and run the optimization algorithm
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Total Budget</div>
                        <div className="text-lg font-bold">{formatCurrency(budget)}</div>
                      </div>
                      
                      <Slider
                        value={[budget]}
                        min={50000}
                        max={1000000}
                        step={10000}
                        onValueChange={handleBudgetChange}
                      />
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>{formatCurrency(50000)}</div>
                        <div>{formatCurrency(1000000)}</div>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">How does the optimization work?</p>
                        <p className="text-muted-foreground">
                          Our algorithm uses the knapsack approach to maximize the cumulative
                          viability score of selected ATM locations while staying within your
                          specified budget. Locations with higher efficiency scores
                          (score-to-land-rate ratio) are prioritized.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button
                      className="w-full gap-2"
                      onClick={handleOptimize}
                      disabled={isOptimizing || locations.length === 0}
                    >
                      {isOptimizing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <Calculator className="h-4 w-4" />
                          Run Optimization
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Understanding Efficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Efficiency is calculated as the viability score divided by the land rate
                      (multiplied by 10,000 for readability). Higher efficiency means better value 
                      for your investment.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">Excellent Efficiency</span>
                        </div>
                        <span className="text-sm font-medium">{">"} 12.0</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">Good Efficiency</span>
                        </div>
                        <span className="text-sm font-medium">10.0 - 12.0</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Average Efficiency</span>
                        </div>
                        <span className="text-sm font-medium">8.0 - 10.0</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Low Efficiency</span>
                        </div>
                        <span className="text-sm font-medium">{"<"} 8.0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {optimizedResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Optimized Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {optimizedResult.selectedLocations.length} ATMs
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Selected from {locations.length} available locations
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Budget Utilization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-3xl font-bold">
                        {formatCurrency(optimizedResult.usedBudget)}
                      </div>
                      <Progress 
                        value={(optimizedResult.usedBudget / budget) * 100}
                        className="h-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        {((optimizedResult.usedBudget / budget) * 100).toFixed(1)}% of available budget
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Portfolio Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {optimizedResult.totalValue} points
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Average score: {(optimizedResult.totalValue / optimizedResult.selectedLocations.length).toFixed(1)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      Selected ATM Locations
                    </CardTitle>
                    <CardDescription>
                      The following locations represent the optimal portfolio within your budget
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="py-3 px-4 text-left font-medium text-sm">Coordinates</th>
                            <th className="py-3 px-4 text-right font-medium text-sm">Score</th>
                            <th className="py-3 px-4 text-right font-medium text-sm">Land Rate</th>
                            <th className="py-3 px-4 text-right font-medium text-sm">Efficiency</th>
                            <th className="py-3 px-4 text-right font-medium text-sm hidden md:table-cell">Pop. Density</th>
                            <th className="py-3 px-4 text-right font-medium text-sm hidden lg:table-cell">Commercial</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {optimizedResult.selectedLocations.map((location) => (
                            <tr key={location.id} className="hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="font-medium flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  {location.location.lat.toFixed(6)}, {location.location.lng.toFixed(6)}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className={`font-medium ${getScoreColor(location.metrics.score)}`}>
                                  {location.metrics.score}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-sm">
                                {formatCurrency(location.metrics.landRate)}
                              </td>
                              <td className="py-3 px-4 text-right font-medium">
                                {calculateEfficiency(location.metrics.score, location.metrics.landRate).toFixed(1)}
                              </td>
                              <td className="py-3 px-4 text-right hidden md:table-cell">
                                {location.metrics.populationDensity.toFixed(1)}
                              </td>
                              <td className="py-3 px-4 text-right hidden lg:table-cell">
                                {location.metrics.commercialActivity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Cost-Benefit Analysis</CardTitle>
                    <CardDescription>
                      Comparison of investment cost versus cumulative score benefit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted rounded">
                      <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                      <span className="ml-3 text-sm text-muted-foreground">Chart visualization would appear here</span>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Key Insights</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your optimized ATM portfolio achieves 
                            <span className="font-medium text-green-600"> {optimizedResult.totalValue} </span> 
                            total score points while utilizing 
                            <span className="font-medium"> {((optimizedResult.usedBudget / budget) * 100).toFixed(1)}% </span> 
                            of your available budget. This represents a cost efficiency of 
                            <span className="font-medium"> {(optimizedResult.totalValue / (optimizedResult.usedBudget / 10000)).toFixed(1)} </span> 
                            score points per ₹10,000 invested.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Recommendations</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Based on the optimization results, we recommend proceeding with the{' '}
                            {optimizedResult.selectedLocations.length} ATM locations identified, 
                            prioritizing implementation in order of efficiency score. 
                            Consider increasing your budget allocation for even greater coverage.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2">
                      <DollarSign className="h-4 w-4" />
                      Generate Investment Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataInsights;