import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Database, Cpu, Clock, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">About LocaCash</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  LocaCash is dedicated to helping financial institutions optimize their ATM placement 
                  strategies using data-driven insights and advanced geospatial analysis. Our platform 
                  combines demographic data, financial trends, and location intelligence to identify 
                  the most strategic locations for ATM deployment.
                </p>
                <p className="mt-4">
                  By leveraging cutting-edge AI algorithms and comprehensive data sources, we empower 
                  banks and financial institutions to make informed decisions that maximize ROI,
                  enhance customer accessibility, and strengthen market presence.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Location Analysis</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Our system analyzes potential locations using Google Maps API and 
                        proprietary geospatial algorithms to evaluate accessibility factors.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Demographic Evaluation</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        We incorporate population density, income levels, and age distribution 
                        to predict ATM usage patterns in different areas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Competitive Analysis</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Our system maps existing ATM networks to identify gaps in coverage
                        and avoid oversaturation in already competitive locations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Cpu className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">AI-Powered Recommendations</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Machine learning algorithms process all data points to provide 
                        actionable recommendations with predicted ROI metrics.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Location Intelligence</h3>
                    <p className="text-xs text-muted-foreground">
                      Advanced geospatial analysis of potential ATM locations
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Demographic Insights</h3>
                    <p className="text-xs text-muted-foreground">
                      Population data analysis for targeted deployment
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Real-time Analysis</h3>
                    <p className="text-xs text-muted-foreground">
                      Up-to-date processing of location data
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Secure & Compliant</h3>
                    <p className="text-xs text-muted-foreground">
                      Fully secure platform with regulatory compliance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Interested in optimizing your ATM network? Get in touch with our team 
                  for a demonstration of the LocaCash platform.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm"><strong>Email:</strong> info@locacash.com</p>
                  <p className="text-sm"><strong>Phone:</strong> (555) 123-4567</p>
                  <p className="text-sm"><strong>Address:</strong> 123 Financial District, Tech City</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About