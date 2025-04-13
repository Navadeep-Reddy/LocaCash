import NavBar from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Database, Cpu, Clock, Shield, Code, Server, Cloud } from "lucide-react";

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
                  By leveraging cutting-edge algorithms and comprehensive data sources, we empower 
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
                        Our system analyzes potential locations using geospatial data and 
                        proprietary algorithms to evaluate accessibility factors. Users can select 
                        any location on the interactive map for detailed analysis.
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
                        We incorporate population density metrics to help predict ATM usage patterns
                        in different areas, ensuring optimal placement in high-traffic locations.
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
                      <h3 className="font-medium">Portfolio Optimization</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Our knapsack algorithm optimizes ATM deployment within budget constraints,
                        maximizing the total viability score while prioritizing cost-effective locations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Code className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Frontend</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Built with React, TypeScript, and Tailwind CSS with the Shadcn UI component library.
                        Interactive maps powered by Leaflet for location selection. Framer Motion for smooth animations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Server className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Backend</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Python Flask API handles location analysis and scoring calculations.
                        RESTful architecture ensures clean separation between frontend and backend services.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Cloud className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Database & Authentication</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Supabase powers our user authentication system and PostgreSQL database, 
                        storing analysis history and user preferences securely with Row Level Security.
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
                    <h3 className="font-medium text-sm">Interactive Analysis</h3>
                    <p className="text-xs text-muted-foreground">
                      Select any location on the map for detailed viability analysis
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Multi-Factor Scoring</h3>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive analysis of 6 key location factors
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Analysis History</h3>
                    <p className="text-xs text-muted-foreground">
                      Save and retrieve previous location analyses
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Budget Optimization</h3>
                    <p className="text-xs text-muted-foreground">
                      Maximize ATM network effectiveness within budget constraints
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Secure Account System</h3>
                    <p className="text-xs text-muted-foreground">
                      Email and Google OAuth authentication with Supabase
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Analysis Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our ATM viability score is calculated using these key factors, 
                  each with customizable weights:
                </p>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span>Population Density</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-red-100 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span>Competing ATMs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Commercial Activity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-amber-100 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                    </div>
                    <span>Traffic Flow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-indigo-100 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                    </div>
                    <span>Public Transport</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-emerald-100 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                    </div>
                    <span>Land Rate</span>
                  </li>
                </ul>
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

export default About;