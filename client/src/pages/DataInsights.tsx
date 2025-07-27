import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "@/components/NavBar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
// Import Recharts components
import {
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    ComposedChart,
    Scatter,
} from "recharts";
import {
    MapPin,
    DollarSign,
    Calculator,
    Check,
    Info,
    Star,
    Loader2,
    Building,
    Users,
    Activity,
    X,
} from "lucide-react";
// Import the report generator
import { generateInvestmentReport } from "@/utils/reportGenerator";
import { useAuth } from "@/context/AuthContext"; // Update this import to use useAuth

// Define types for our ATM locations
interface ATMLocation {
    id: string;
    number: number; // Auto-numbered by backend
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
    created_at?: string;
    is_favorite?: boolean;
}

// Knapsack algorithm implementation
const solveKnapsack = (
    locations: ATMLocation[],
    capacity: number
): {
    selectedLocations: ATMLocation[];
    totalValue: number;
    usedBudget: number;
} => {
    // Sort locations by value-to-weight ratio (score / landRate) for greedy approach
    const sortedLocations = [...locations].sort(
        (a, b) =>
            b.metrics.score / b.metrics.landRate -
            a.metrics.score / a.metrics.landRate
    );

    const selectedLocations: ATMLocation[] = [];
    let totalValue = 0;
    let usedBudget = 0;

    for (const location of sortedLocations) {
        if (usedBudget + location.metrics.landRate <= capacity) {
            selectedLocations.push({ ...location, isSelected: true });
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
        lng: lng > 80.24 ? "East" : "West",
    };

    return `${direction.lat}${direction.lng} Location (${lat.toFixed(
        4
    )}, ${lng.toFixed(4)})`;
};

// Fetch ATM locations from Flask API
const fetchAtmLocations = async (): Promise<ATMLocation[]> => {
    // Get the current user ID from Supabase
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id;

    if (!userId) {
        throw new Error("User not authenticated");
    }

    try {
        // Fetch from your Flask backend
        const response = await axios.get(
            `http://localhost:8080/analysis/v1/user-analyses/${userId}`
        );

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(
                response.data.error || "Failed to fetch ATM locations"
            );
        }
    } catch (error) {
        console.error("Error fetching ATM locations:", error);
        throw error;
    }
};

// Add this function to prepare data for cost-benefit chart
const prepareCostBenefitData = (selectedLocations: ATMLocation[]) => {
    // Sort locations by efficiency (best value first)
    const sortedLocations = [...selectedLocations].sort(
        (a, b) =>
            b.metrics.score / b.metrics.landRate -
            a.metrics.score / a.metrics.landRate
    );

    // Create accumulating data for the chart
    const data = [];
    let accumulatedCost = 0;
    let accumulatedScore = 0;

    // Add a zero point for the chart
    data.push({
        name: "Start",
        cost: 0,
        score: 0,
        location: "Initial",
        efficiency: 0,
    });

    // Add each location's cumulative contribution
    sortedLocations.forEach((location, index) => {
        accumulatedCost += location.metrics.landRate;
        accumulatedScore += location.metrics.score;

        data.push({
            name: `ATM ${index + 1}`,
            cost: accumulatedCost,
            score: accumulatedScore,
            location: `Location ${location.number}`,
            efficiency:
                (location.metrics.score / location.metrics.landRate) * 10000,
        });
    });

    return data;
};

// Add this formatter for tooltips
const formatTooltipValue = (value: number, name: string) => {
    if (name === "cost") {
        return [`₹${value.toLocaleString()}`, "Cumulative Cost"];
    }
    if (name === "score") {
        return [value, "Cumulative Score"];
    }
    if (name === "efficiency") {
        return [`${value.toFixed(1)}`, "Efficiency"];
    }
    return [value, name];
};

const DataInsights = () => {
    const { user } = useAuth(); // Replace useUserProfile with useAuth

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
    const [isGeneratingReport, setIsGeneratingReport] =
        useState<boolean>(false);

    // Load ATM locations when component mounts
    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                // Redirect to login if not authenticated
                window.location.href = "/login";
                return;
            }

            loadLocations();
        };

        checkAuth();
    }, []);

    const loadLocations = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchAtmLocations();
            setLocations(data);
        } catch (err: any) {
            console.error("Failed to load ATM locations:", err);
            setError(
                err.message ||
                    "Failed to load ATM locations. Please try again later."
            );

            // Show a toast notification
            toast({
                title: "Error loading data",
                description: err.message || "Failed to load ATM locations",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleGenerateReport = () => {
        if (!optimizedResult) return;

        setIsGeneratingReport(true);

        try {
            // Use the user information from AuthContext
            const userName =
                user?.user_metadata?.full_name ||
                user?.email?.split("@")[0] ||
                "LocaCash User";

            // Generate report with the user's name
            generateInvestmentReport(optimizedResult, budget, userName);

            toast({
                title: "Report Generated",
                description:
                    "Your investment portfolio report has been downloaded.",
            });
        } catch (error) {
            console.error("Error generating report:", error);
            toast({
                title: "Report Generation Failed",
                description:
                    "There was an error generating your report. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsGeneratingReport(false);
        }
    };

    // Format currency in Rupees
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
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
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            ATM Portfolio Optimization
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            Use our knapsack algorithm to select the optimal ATM
                            locations within your budget
                        </p>
                    </div>

                    <Card className="w-full lg:w-auto lg:min-w-[240px]">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                        Total Budget
                                    </div>
                                    <div className="font-bold text-base sm:text-lg">
                                        {formatCurrency(budget)}
                                    </div>
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

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-3 mb-6 w-full">
                        <TabsTrigger
                            value="locations"
                            className="text-xs sm:text-sm"
                        >
                            <span className="hidden sm:inline">
                                Available Locations
                            </span>
                            <span className="sm:hidden">Locations</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="optimization"
                            className="text-xs sm:text-sm"
                        >
                            <span className="hidden sm:inline">
                                Budget Allocation
                            </span>
                            <span className="sm:hidden">Budget</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="results"
                            disabled={!optimizedResult}
                            className="text-xs sm:text-sm"
                        >
                            <span className="hidden sm:inline">
                                Optimized Results
                            </span>
                            <span className="sm:hidden">Results</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="locations">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                    <p className="text-muted-foreground">
                                        Loading ATM locations...
                                    </p>
                                </div>
                            </div>
                        ) : locations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="bg-muted rounded-full p-3 mb-3">
                                    <MapPin className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium mb-1">
                                    No analysis data found
                                </h3>
                                <p className="text-muted-foreground max-w-md mb-4">
                                    You haven't saved any ATM location analyses
                                    yet. Run some analyses in the Analysis Tool
                                    to see them here.
                                </p>
                                <Button
                                    onClick={() =>
                                        (window.location.href = "/analysis")
                                    }
                                >
                                    Go to Analysis Tool
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {locations.map((location) => (
                                    <Card
                                        key={location.id}
                                        className="overflow-hidden"
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div className="flex-1">
                                                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                                        <span className="hidden sm:inline">
                                                            ATM Location{" "}
                                                            {location.number}
                                                        </span>
                                                        <span className="sm:hidden">
                                                            ATM{" "}
                                                            {location.number}
                                                        </span>
                                                    </CardTitle>
                                                    <CardDescription className="text-xs sm:text-sm">
                                                        {location.location.lat.toFixed(
                                                            4
                                                        )}
                                                        ,{" "}
                                                        {location.location.lng.toFixed(
                                                            4
                                                        )}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                                                    <div
                                                        className={`text-lg sm:text-xl font-bold ${getScoreColor(
                                                            location.metrics
                                                                .score
                                                        )}`}
                                                    >
                                                        {location.metrics.score}
                                                        /100
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                                        Viability Score
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pb-2">
                                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                <div>
                                                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                                                        Land Rate
                                                    </div>
                                                    <div className="font-medium flex items-center gap-1 text-sm sm:text-base">
                                                        <span className="hidden sm:inline">
                                                            {formatCurrency(
                                                                location.metrics
                                                                    .landRate
                                                            )}
                                                        </span>
                                                        <span className="sm:hidden">
                                                            ₹
                                                            {(
                                                                location.metrics
                                                                    .landRate /
                                                                1000
                                                            ).toFixed(0)}
                                                            k
                                                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                                                        Efficiency
                                                    </div>
                                                    <div className="font-medium flex items-center gap-1 text-sm sm:text-base">
                                                        <Calculator className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                                        {calculateEfficiency(
                                                            location.metrics
                                                                .score,
                                                            location.metrics
                                                                .landRate
                                                        ).toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1 sm:gap-2">
                                                <div className="flex flex-col items-center bg-primary/5 rounded p-1 sm:p-2">
                                                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mb-1" />
                                                    <span className="text-[10px] sm:text-xs font-medium">
                                                        {location.metrics.populationDensity.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                    <span className="text-[8px] sm:text-[10px] text-muted-foreground text-center">
                                                        Pop. Density
                                                    </span>
                                                </div>

                                                <div className="flex flex-col items-center bg-primary/5 rounded p-1 sm:p-2">
                                                    <Building className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mb-1" />
                                                    <span className="text-[10px] sm:text-xs font-medium">
                                                        {
                                                            location.metrics
                                                                .commercialActivity
                                                        }
                                                    </span>
                                                    <span className="text-[8px] sm:text-[10px] text-muted-foreground">
                                                        Commercial
                                                    </span>
                                                </div>

                                                <div className="flex flex-col items-center bg-primary/5 rounded p-1 sm:p-2">
                                                    <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 mb-1" />
                                                    <span className="text-[10px] sm:text-xs font-medium">
                                                        {
                                                            location.metrics
                                                                .trafficFlow
                                                        }
                                                    </span>
                                                    <span className="text-[8px] sm:text-[10px] text-muted-foreground">
                                                        Traffic
                                                    </span>
                                                </div>
                                            </div>

                                            {location.created_at && (
                                                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t text-[10px] sm:text-xs text-muted-foreground">
                                                    Analyzed on{" "}
                                                    {new Date(
                                                        location.created_at
                                                    ).toLocaleDateString()}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="optimization">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <div className="xl:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                                            Budget Allocation
                                        </CardTitle>
                                        <CardDescription className="text-sm">
                                            Set your total budget for ATM
                                            installations and run the
                                            optimization algorithm
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4 sm:space-y-6">
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium text-sm sm:text-base">
                                                    Total Budget
                                                </div>
                                                <div className="text-base sm:text-lg font-bold">
                                                    {formatCurrency(budget)}
                                                </div>
                                            </div>

                                            <Slider
                                                value={[budget]}
                                                min={50000}
                                                max={1000000}
                                                step={10000}
                                                onValueChange={
                                                    handleBudgetChange
                                                }
                                                className="py-2"
                                            />

                                            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                                                <div>₹50k</div>
                                                <div>₹10L</div>
                                            </div>
                                        </div>

                                        <div className="bg-muted p-3 sm:p-4 rounded flex items-start gap-2 sm:gap-3">
                                            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <div className="text-xs sm:text-sm">
                                                <p className="font-medium mb-1">
                                                    How does the optimization
                                                    work?
                                                </p>
                                                <p className="text-muted-foreground">
                                                    Our algorithm uses the
                                                    knapsack approach to
                                                    maximize the cumulative
                                                    viability score of selected
                                                    ATM locations while staying
                                                    within your specified
                                                    budget. Locations with
                                                    higher efficiency scores
                                                    (score-to-land-rate ratio)
                                                    are prioritized.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-4 sm:pt-6">
                                        <Button
                                            className="w-full gap-2 text-sm sm:text-base h-9 sm:h-10"
                                            onClick={handleOptimize}
                                            disabled={
                                                isOptimizing ||
                                                locations.length === 0
                                            }
                                        >
                                            {isOptimizing ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span className="hidden sm:inline">
                                                        Optimizing...
                                                    </span>
                                                    <span className="sm:hidden">
                                                        Loading...
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Calculator className="h-4 w-4" />
                                                    <span className="hidden sm:inline">
                                                        Run Optimization
                                                    </span>
                                                    <span className="sm:hidden">
                                                        Optimize
                                                    </span>
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>

                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                            <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                                            <span className="hidden sm:inline">
                                                Understanding Efficiency
                                            </span>
                                            <span className="sm:hidden">
                                                Efficiency Guide
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                            Efficiency is calculated as the
                                            viability score divided by the land
                                            rate (multiplied by 10,000 for
                                            readability). Higher efficiency
                                            means better value for your
                                            investment.
                                        </p>

                                        <div className="space-y-2 sm:space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                                                    <span className="text-xs sm:text-sm">
                                                        Excellent
                                                    </span>
                                                </div>
                                                <span className="text-xs sm:text-sm font-medium">
                                                    {">"} 12.0
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                                                    <span className="text-xs sm:text-sm">
                                                        Good
                                                    </span>
                                                </div>
                                                <span className="text-xs sm:text-sm font-medium">
                                                    10.0 - 12.0
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                                    <span className="text-xs sm:text-sm">
                                                        Average
                                                    </span>
                                                </div>
                                                <span className="text-xs sm:text-sm font-medium">
                                                    8.0 - 10.0
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                                    <span className="text-xs sm:text-sm">
                                                        Low
                                                    </span>
                                                </div>
                                                <span className="text-xs sm:text-sm font-medium">
                                                    {"<"} 8.0
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="results">
                        {optimizedResult && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                    <Card className="bg-primary/5 border-primary/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base sm:text-lg">
                                                Optimized Portfolio
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl sm:text-3xl font-bold">
                                                {
                                                    optimizedResult
                                                        .selectedLocations
                                                        .length
                                                }{" "}
                                                ATMs
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                Selected from {locations.length}{" "}
                                                available locations
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-primary/5 border-primary/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base sm:text-lg">
                                                Budget Utilization
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="text-2xl sm:text-3xl font-bold">
                                                <span className="hidden sm:inline">
                                                    {formatCurrency(
                                                        optimizedResult.usedBudget
                                                    )}
                                                </span>
                                                <span className="sm:hidden">
                                                    ₹
                                                    {(
                                                        optimizedResult.usedBudget /
                                                        100000
                                                    ).toFixed(1)}
                                                    L
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    (optimizedResult.usedBudget /
                                                        budget) *
                                                    100
                                                }
                                                className="h-2"
                                            />
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                {(
                                                    (optimizedResult.usedBudget /
                                                        budget) *
                                                    100
                                                ).toFixed(1)}
                                                % of available budget
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-primary/5 border-primary/20 sm:col-span-2 lg:col-span-1">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base sm:text-lg">
                                                Portfolio Score
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl sm:text-3xl font-bold">
                                                {optimizedResult.totalValue}{" "}
                                                points
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                Average score:{" "}
                                                {(
                                                    optimizedResult.totalValue /
                                                    optimizedResult
                                                        .selectedLocations
                                                        .length
                                                ).toFixed(1)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                            Selected ATM Locations
                                        </CardTitle>
                                        <CardDescription className="text-sm">
                                            The following locations represent
                                            the optimal portfolio within your
                                            budget
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border rounded-md overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[640px]">
                                                    <thead className="bg-muted">
                                                        <tr>
                                                            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium text-xs sm:text-sm">
                                                                Coordinates
                                                            </th>
                                                            <th className="py-2 sm:py-3 px-2 sm:px-4 text-right font-medium text-xs sm:text-sm">
                                                                Score
                                                            </th>
                                                            <th className="py-2 sm:py-3 px-2 sm:px-4 text-right font-medium text-xs sm:text-sm">
                                                                Land Rate
                                                            </th>
                                                            <th className="py-2 sm:py-3 px-2 sm:px-4 text-right font-medium text-xs sm:text-sm">
                                                                Efficiency
                                                            </th>
                                                            <th className="py-2 sm:py-3 px-2 sm:px-4 text-right font-medium text-xs sm:text-sm hidden md:table-cell">
                                                                Pop. Density
                                                            </th>
                                                            <th className="py-2 sm:py-3 px-2 sm:px-4 text-right font-medium text-xs sm:text-sm hidden lg:table-cell">
                                                                Commercial
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {optimizedResult.selectedLocations.map(
                                                            (location) => (
                                                                <tr
                                                                    key={
                                                                        location.id
                                                                    }
                                                                    className="hover:bg-muted/50"
                                                                >
                                                                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                                                                        <div className="font-medium flex items-center gap-1 text-xs sm:text-sm">
                                                                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                                                            <span className="hidden sm:inline">
                                                                                {location.location.lat.toFixed(
                                                                                    6
                                                                                )}
                                                                                ,{" "}
                                                                                {location.location.lng.toFixed(
                                                                                    6
                                                                                )}
                                                                            </span>
                                                                            <span className="sm:hidden">
                                                                                {location.location.lat.toFixed(
                                                                                    3
                                                                                )}
                                                                                ,{" "}
                                                                                {location.location.lng.toFixed(
                                                                                    3
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                                                                        <span
                                                                            className={`font-medium text-xs sm:text-sm ${getScoreColor(
                                                                                location
                                                                                    .metrics
                                                                                    .score
                                                                            )}`}
                                                                        >
                                                                            {
                                                                                location
                                                                                    .metrics
                                                                                    .score
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-mono text-xs sm:text-sm">
                                                                        <span className="hidden sm:inline">
                                                                            {formatCurrency(
                                                                                location
                                                                                    .metrics
                                                                                    .landRate
                                                                            )}
                                                                        </span>
                                                                        <span className="sm:hidden">
                                                                            ₹
                                                                            {(
                                                                                location
                                                                                    .metrics
                                                                                    .landRate /
                                                                                1000
                                                                            ).toFixed(
                                                                                0
                                                                            )}
                                                                            k
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-medium text-xs sm:text-sm">
                                                                        {calculateEfficiency(
                                                                            location
                                                                                .metrics
                                                                                .score,
                                                                            location
                                                                                .metrics
                                                                                .landRate
                                                                        ).toFixed(
                                                                            1
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right hidden md:table-cell text-xs sm:text-sm">
                                                                        {location.metrics.populationDensity.toFixed(
                                                                            1
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right hidden lg:table-cell text-xs sm:text-sm">
                                                                        {
                                                                            location
                                                                                .metrics
                                                                                .commercialActivity
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl">
                                            Cost-Benefit Analysis
                                        </CardTitle>
                                        <CardDescription className="text-sm">
                                            Comparison of investment cost versus
                                            cumulative score benefit
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-64 sm:h-80">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <ComposedChart
                                                    data={prepareCostBenefitData(
                                                        optimizedResult.selectedLocations
                                                    )}
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 30,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="cost"
                                                        tickFormatter={(
                                                            value
                                                        ) =>
                                                            `₹${(
                                                                value / 1000
                                                            ).toFixed(0)}k`
                                                        }
                                                        label={{
                                                            value: "Cost (₹)",
                                                            position:
                                                                "insideBottom",
                                                            offset: -15,
                                                        }}
                                                        tick={{ fontSize: 12 }}
                                                    />
                                                    <YAxis
                                                        yAxisId="left"
                                                        label={{
                                                            value: "Score",
                                                            angle: -90,
                                                            position:
                                                                "insideLeft",
                                                        }}
                                                        tick={{ fontSize: 12 }}
                                                    />
                                                    <YAxis
                                                        yAxisId="right"
                                                        orientation="right"
                                                        domain={[0, 15]}
                                                        label={{
                                                            value: "Efficiency",
                                                            angle: 90,
                                                            position:
                                                                "insideRight",
                                                        }}
                                                        tick={{ fontSize: 12 }}
                                                    />
                                                    <Tooltip
                                                        formatter={
                                                            formatTooltipValue
                                                        }
                                                    />
                                                    <Legend
                                                        layout="horizontal"
                                                        verticalAlign="top"
                                                        align="center"
                                                        wrapperStyle={{
                                                            paddingBottom: 10,
                                                            marginTop: -10,
                                                            fontSize: "12px",
                                                        }}
                                                        iconType="circle"
                                                        iconSize={8}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="score"
                                                        fill="rgba(37, 99, 235, 0.2)"
                                                        stroke="#2563eb"
                                                        yAxisId="left"
                                                        name="Cumulative Score"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="efficiency"
                                                        stroke="#10b981"
                                                        strokeWidth={2}
                                                        yAxisId="right"
                                                        name="Efficiency"
                                                        dot={{ r: 5 }}
                                                    />
                                                    <Scatter
                                                        dataKey="score"
                                                        fill="#2563eb"
                                                        yAxisId="left"
                                                        name="Score Points"
                                                    />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-sm sm:text-base">
                                                        Key Insights
                                                    </h4>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                                        Your optimized ATM
                                                        portfolio achieves
                                                        <span className="font-medium text-green-600">
                                                            {" "}
                                                            {
                                                                optimizedResult.totalValue
                                                            }{" "}
                                                        </span>
                                                        total score points while
                                                        utilizing
                                                        <span className="font-medium">
                                                            {" "}
                                                            {(
                                                                (optimizedResult.usedBudget /
                                                                    budget) *
                                                                100
                                                            ).toFixed(1)}
                                                            %{" "}
                                                        </span>
                                                        of your available
                                                        budget. This represents
                                                        a cost efficiency of
                                                        <span className="font-medium">
                                                            {" "}
                                                            {(
                                                                optimizedResult.totalValue /
                                                                (optimizedResult.usedBudget /
                                                                    10000)
                                                            ).toFixed(1)}{" "}
                                                        </span>
                                                        score points per ₹10,000
                                                        invested.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-sm sm:text-base">
                                                        Recommendations
                                                    </h4>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                                        Based on the
                                                        optimization results, we
                                                        recommend proceeding
                                                        with the{" "}
                                                        {
                                                            optimizedResult
                                                                .selectedLocations
                                                                .length
                                                        }{" "}
                                                        ATM locations
                                                        identified, prioritizing
                                                        implementation in order
                                                        of efficiency score.
                                                        {optimizedResult.usedBudget <
                                                        budget * 0.9 ? (
                                                            <span>
                                                                There's still{" "}
                                                                {formatCurrency(
                                                                    budget -
                                                                        optimizedResult.usedBudget
                                                                )}{" "}
                                                                remaining in
                                                                your budget that
                                                                could be
                                                                allocated to
                                                                maintenance or
                                                                future
                                                                expansion.
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                {" "}
                                                                Consider
                                                                increasing your
                                                                budget
                                                                allocation for
                                                                even greater
                                                                coverage.
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-4 sm:pt-6">
                                        <Button
                                            className="w-full gap-2 text-sm sm:text-base h-9 sm:h-10"
                                            onClick={handleGenerateReport}
                                            disabled={isGeneratingReport}
                                        >
                                            {isGeneratingReport ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span className="hidden sm:inline">
                                                        Generating Report...
                                                    </span>
                                                    <span className="sm:hidden">
                                                        Generating...
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <DollarSign className="h-4 w-4" />
                                                    <span className="hidden sm:inline">
                                                        Generate Investment
                                                        Report
                                                    </span>
                                                    <span className="sm:hidden">
                                                        Generate Report
                                                    </span>
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg sm:text-xl">
                                            Budget Allocation by Location
                                        </CardTitle>
                                        <CardDescription className="text-sm">
                                            Distribution of your investment
                                            across selected locations
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-64 sm:h-80">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    data={optimizedResult.selectedLocations.map(
                                                        (location) => ({
                                                            name: `ATM ${location.number}`,
                                                            cost: location
                                                                .metrics
                                                                .landRate,
                                                            score: location
                                                                .metrics.score,
                                                        })
                                                    )}
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 20,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="name"
                                                        angle={0}
                                                        textAnchor="middle"
                                                        height={40}
                                                        tick={{ fontSize: 10 }}
                                                        interval={0}
                                                    />
                                                    <YAxis
                                                        yAxisId="left"
                                                        tickFormatter={(
                                                            value
                                                        ) =>
                                                            `₹${(
                                                                value / 1000
                                                            ).toFixed(0)}k`
                                                        }
                                                        label={{
                                                            value: "Cost (₹)",
                                                            angle: -90,
                                                            position:
                                                                "insideLeft",
                                                        }}
                                                        tick={{ fontSize: 10 }}
                                                    />
                                                    <YAxis
                                                        yAxisId="right"
                                                        orientation="right"
                                                        label={{
                                                            value: "Score",
                                                            angle: 90,
                                                            position:
                                                                "insideRight",
                                                        }}
                                                        tick={{ fontSize: 10 }}
                                                    />
                                                    <Tooltip
                                                        formatter={(
                                                            value,
                                                            name
                                                        ) => {
                                                            if (name === "cost")
                                                                return [
                                                                    `₹${value.toLocaleString()}`,
                                                                    "Investment Cost",
                                                                ];
                                                            return [
                                                                value,
                                                                name,
                                                            ];
                                                        }}
                                                    />
                                                    <Legend
                                                        layout="horizontal"
                                                        verticalAlign="top"
                                                        align="center"
                                                        wrapperStyle={{
                                                            paddingBottom: 10,
                                                            marginTop: -10,
                                                            fontSize: "12px",
                                                        }}
                                                        iconType="circle"
                                                        iconSize={8}
                                                    />
                                                    <Bar
                                                        yAxisId="left"
                                                        dataKey="cost"
                                                        name="Investment Cost"
                                                        fill="#3b82f6"
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                    <Line
                                                        yAxisId="right"
                                                        type="monotone"
                                                        dataKey="score"
                                                        name="Viability Score"
                                                        stroke="#10b981"
                                                        strokeWidth={2}
                                                        dot={{
                                                            r: 4,
                                                            fill: "#10b981",
                                                        }}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
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
