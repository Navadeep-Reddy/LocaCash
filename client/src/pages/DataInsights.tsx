import NavBar from "@/components/NavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart, PieChart, Users, MapPin } from "lucide-react";

const DataInsights = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">ATM Location Data Insights</h1>
        <p className="text-muted-foreground mb-6">
          Explore data trends and patterns to inform your ATM placement strategy
        </p>
        
        <Tabs defaultValue="demographics" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="transactions">Transaction Analysis</TabsTrigger>
            <TabsTrigger value="competition">Competition</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Population Density
                  </CardTitle>
                  <CardDescription>Regional population distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded">
                    <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <strong>Key Insight:</strong> Urban centers show 3x higher ATM usage compared to suburban areas.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Areas with population density 5,000/km² typically support multiple ATMs within 500m.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Regional Distribution
                  </CardTitle>
                  <CardDescription>ATM coverage by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded">
                    <PieChart className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <strong>Key Insight:</strong> Northwest regions are currently underserved with 22% less coverage.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Eastern districts show optimal ATM-to-population ratios of 1:3,200.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Age Demographics
                  </CardTitle>
                  <CardDescription>ATM usage by age group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted rounded">
                    <LineChart className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <strong>Key Insight:</strong> 25-44 age group represents 68% of all ATM transactions.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Areas with higher proportion of 25-44 year old residents show 40% higher transaction volume.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Other tab contents would be implemented similarly */}
          <TabsContent value="transactions">
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              Transaction data analysis content would go here
            </div>
          </TabsContent>
          
          <TabsContent value="competition">
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              Competitive analysis content would go here
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              Market trends and forecasting content would go here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default DataInsights