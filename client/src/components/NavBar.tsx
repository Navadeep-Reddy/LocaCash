import { MapPin, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
  // Get current path to highlight active link
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

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
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="text-sm mr-2">{user.email}</div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-1" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;