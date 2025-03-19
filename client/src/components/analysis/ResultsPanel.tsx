import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  BarChart3, 
  Building, 
  Users, 
  AtSign, 
  Activity,
  Train,
  DollarSign,
  Check,
  AlertCircle
} from "lucide-react";

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

interface ResultsPanelProps {
  selectedLocation: {lat: number, lng: number};
  scoreResult: ScoreResult;
}

const ResultsPanel = ({ selectedLocation, scoreResult }: ResultsPanelProps) => {
  // Helper function to determine the color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  // Helper function to determine the color based on rating
  const getRatingColor = (rating: string) => {
    if (rating === "High") return "text-green-600";
    if (rating === "Medium") return "text-amber-600";
    return "text-red-600";
  };

  // Helper function to get the icon based on factor
  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case "population_density":
        return <Users className="h-5 w-5 text-blue-600" />;
      case "competing_atms":
        return <AtSign className="h-5 w-5 text-red-600" />;
      case "commercial_activity":
        return <Building className="h-5 w-5 text-green-600" />;
      case "traffic_flow":
        return <Activity className="h-5 w-5 text-amber-600" />;
      case "public_transport":
        return <Train className="h-5 w-5 text-purple-600" />;
      case "land_rate":
        return <DollarSign className="h-5 w-5 text-emerald-600" />;
      default:
        return <BarChart3 className="h-5 w-5 text-slate-600" />;
    }
  };

  // Format factor name for display
  const formatFactorName = (factor: string) => {
    return factor
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <div className={`px-2 py-1 rounded-full text-white font-medium ${getScoreColor(scoreResult.overall_score)}`}>
              {scoreResult.overall_score}/100
            </div>
          </div>
          <CardDescription>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span className="text-xs">
                Results for location ({selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)})
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="mb-2 font-medium">Overall Viability Score</div>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className={`font-medium ${getScoreColor(scoreResult.overall_score).replace('bg-', 'text-')}`}>
                    {scoreResult.overall_score}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div 
                  style={{ width: `${scoreResult.overall_score}%` }} 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getScoreColor(scoreResult.overall_score)}`}
                ></div>
              </div>
            </div>
            <p className="text-sm mt-2">
              {scoreResult.suitability}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Factor Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(scoreResult.factor_scores).map(([factor, { score, rating }]) => (
                <div key={factor}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getFactorIcon(factor)}
                      <span className="font-medium">{formatFactorName(factor)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${getRatingColor(rating)}`}>{rating}</span>
                      <span className="text-sm font-mono">{score}</span>
                    </div>
                  </div>
                  <Progress 
                    value={score} 
                    className="h-2" 
                    indicatorClassName={getScoreColor(score)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {scoreResult.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPanel;