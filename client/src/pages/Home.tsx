import { Button } from "@/components/ui/button"
import { MapPin, BarChart3, Users, Building, ThumbsUp, Search, Calculator } from "lucide-react"
import { Link } from "react-router-dom"
import NavBar from "@/components/NavBar"
import { TypeAnimation } from 'react-type-animation';
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const featureVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut" 
    }
  }
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted overflow-hidden">
        {/* Header Navigation */}
        <NavBar />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              className="md:w-1/2"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <TypeAnimation
                  sequence={[
                    'Optimize Your ATM Network Placement', 
                    2000,
                    'Maximize ATM Location ROI',
                    2000,
                    'Data-Driven ATM Placement Strategy',
                    2000
                  ]}
                  wrapper="span"
                  speed={30}
                  repeat={Infinity}
                />
              </h1>
              <motion.p 
                className="mt-6 text-lg text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Make data-driven decisions for your ATM placement strategy using advanced
                geospatial analysis and demographic insights.
              </motion.p>
              <motion.div 
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button className="gap-2" asChild>
                  <Link to="/analysis">
                    <Search size={18} />
                    Start Analysis
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                  <Link to="/portfolio">
                    <Calculator size={18} />
                    Portfolio Optimization
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 bg-muted rounded-lg p-4 shadow-lg border"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            >
              <div className="aspect-video bg-card rounded relative overflow-hidden">
                {/* Placeholder for map */}
                <motion.div 
                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3')] bg-cover bg-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.7, duration: 1 }}
                ></motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="bg-background/60 backdrop-blur-sm p-4 rounded shadow-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Button className="gap-2" asChild>
                      <Link to="/analysis">
                        <MapPin size={16} />
                        Explore Map
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16 relative">
            <motion.div 
              className="container mx-auto px-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <motion.h2 
                className="text-3xl font-bold text-center mb-4"
                variants={fadeIn}
              >
                Key Analysis Factors
              </motion.h2>
              <div className="text-center mb-12 h-6">
                <TypeAnimation
                  sequence={[
                    'Identify the perfect locations for your ATMs',
                    2000,
                    'Optimize your ATM placement budget',
                    2000,
                    'Maximize return on your ATM investments',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  className="text-lg text-primary/80 font-medium"
                  repeat={Infinity}
                />
              </div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
              >
                {/* Population Density */}
                <motion.div 
                  className="bg-card p-6 rounded-lg shadow-sm border"
                  variants={featureVariant}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
                  }}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Population Density</h3>
                  <p className="text-muted-foreground">
                    Analyze population distribution patterns to identify high-density areas 
                    with potential for high ATM usage.
                  </p>
                </motion.div>
                
                {/* Competing ATMs */}
                <motion.div 
                  className="bg-card p-6 rounded-lg shadow-sm border"
                  variants={featureVariant}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
                  }}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Competing ATMs</h3>
                  <p className="text-muted-foreground">
                    Map existing ATM networks to identify underserved areas and avoid 
                    oversaturation in already competitive locations.
                  </p>
                </motion.div>
                
                {/* Optimization Score */}
                <motion.div 
                  className="bg-card p-6 rounded-lg shadow-sm border"
                  variants={featureVariant}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
                  }}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Location Scoring</h3>
                  <p className="text-muted-foreground">
                    Our algorithm aggregates multiple factors to generate comprehensive 
                    location scores to guide your decision making.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section 
          className="container mx-auto px-4 py-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
            <motion.div 
              className="bg-card border rounded-lg p-8 text-center"
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Ready to optimize your ATM network?
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Our data-driven approach helps banks and financial institutions maximize ROI by
                placing ATMs in locations with the highest potential usage and visibility.
              </motion.p>
              <motion.div 
                className="flex justify-center gap-4 flex-wrap"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="gap-2" asChild>
                    <Link to="/analysis">
                      <ThumbsUp size={18} />
                      Get Started with Analysis
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="outline" className="gap-2" asChild>
                    <Link to="/portfolio">
                      <Calculator size={18} />
                      Try Portfolio Optimization
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="bg-muted/30 border-t mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.03 }}
                >
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-semibold">LocaCash ATM Optimizer</span>
                </motion.div>
                <div className="text-sm text-muted-foreground">
                  © 2025 BankTech Solutions. All rights reserved.
                </div>
              </div>
            </div>
        </motion.footer>
    </div>
  )
}

export default Home