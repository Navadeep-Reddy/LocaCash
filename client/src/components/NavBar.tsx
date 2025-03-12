import React from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  // Get current path to highlight active link
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">LocaCash - ATM Placement Analyser</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className={`${currentPath === "/" ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            Home
          </Link>
          <Link
            to="/analysis"
            className={`${currentPath === "/analysis" ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            Analysis Tool
          </Link>
          <Link
            to="/data"
            className={`${currentPath === "/data" ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            Data Insights
          </Link>
          <Link
            to="/about"
            className={`${currentPath === "/about" ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            About
          </Link>
        </nav>
        <div>
          <Button size="sm">Login</Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;