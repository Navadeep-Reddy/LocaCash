import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, BarChart3, Users, Building, ThumbsUp, Search } from "lucide-react"
import { Link } from "react-router-dom"
import NavBar from "@/components/NavBar"

const Home = () => {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {/* Header Navigation */}
        <NavBar  />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Optimize Your ATM Network Placement
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
                Make data-driven decisions for your ATM placement strategy using advanced
                geospatial analysis and demographic insights.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
                <Button className="gap-2" asChild>
                  <Link to="/analysis">
                    <Search size={18} />
                    Start Analysis
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2">
                Learn More
                </Button>
            </div>
            </div>
            <div className="md:w-1/2 bg-muted rounded-lg p-4 shadow-lg border">
            <div className="aspect-video bg-card rounded relative overflow-hidden">
                {/* Placeholder for map */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3')] bg-cover bg-center opacity-60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/60 backdrop-blur-sm p-4 rounded shadow-md">
                    <Button className="gap-2" asChild>
                      <Link to="/analysis">
                        <MapPin size={16} />
                        Explore Map
                      </Link>
                    </Button>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16">
            <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Analysis Factors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Population Density */}
                <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Population Density</h3>
                <p className="text-muted-foreground">
                    Analyze population distribution patterns to identify high-density areas 
                    with potential for high ATM usage.
                </p>
                </div>
                
                {/* Competing ATMs */}
                <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Competing ATMs</h3>
                <p className="text-muted-foreground">
                    Map existing ATM networks to identify underserved areas and avoid 
                    oversaturation in already competitive locations.
                </p>
                </div>
                
                {/* Optimization Score */}
                <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Location Scoring</h3>
                <p className="text-muted-foreground">
                    Our algorithm aggregates multiple factors to generate comprehensive 
                    location scores to guide your decision making.
                </p>
                </div>
            </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
            <div className="bg-card border rounded-lg p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to optimize your ATM network?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our data-driven approach helps banks and financial institutions maximize ROI by
                placing ATMs in locations with the highest potential usage and visibility.
            </p>
            <Button size="lg" className="gap-2">
                <ThumbsUp size={18} />
                Get Started Today
            </Button>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted/30 border-t mt-12">
            <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-semibold">ATM Placement Analyzer</span>
                </div>
                <div className="text-sm text-muted-foreground">
                © 2025 BankTech Solutions. All rights reserved.
                </div>
            </div>
            </div>
        </footer>
        </div>
  )
}

export default Home