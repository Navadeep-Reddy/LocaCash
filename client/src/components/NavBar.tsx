import { MapPin, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const NavBar = () => {
    // Get current path to highlight active link
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl hidden sm:inline">
                        LocaCash - ATM Placement Analyser
                    </span>
                    <span className="font-bold text-xl sm:hidden">
                        LocaCash
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <Link
                        to="/"
                        className={`${
                            currentPath === "/"
                                ? "text-primary font-medium"
                                : "text-muted-foreground"
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/analysis"
                        className={`${
                            currentPath === "/analysis"
                                ? "text-primary font-medium"
                                : "text-muted-foreground"
                        }`}
                    >
                        Analysis Tool
                    </Link>
                    <Link
                        to="/data"
                        className={`${
                            currentPath === "/data"
                                ? "text-primary font-medium"
                                : "text-muted-foreground"
                        }`}
                    >
                        Data Insights
                    </Link>
                    <Link
                        to="/about"
                        className={`${
                            currentPath === "/about"
                                ? "text-primary font-medium"
                                : "text-muted-foreground"
                        }`}
                    >
                        About
                    </Link>
                </nav>

                {/* Desktop User Actions */}
                <div className="hidden md:flex items-center gap-2">
                    {user ? (
                        <>
                            <div className="text-sm mr-2">{user.email}</div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                            >
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

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-4 space-y-3">
                        <Link
                            to="/"
                            className={`block py-2 px-3 rounded-md ${
                                currentPath === "/"
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                            onClick={closeMobileMenu}
                        >
                            Home
                        </Link>
                        <Link
                            to="/analysis"
                            className={`block py-2 px-3 rounded-md ${
                                currentPath === "/analysis"
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                            onClick={closeMobileMenu}
                        >
                            Analysis Tool
                        </Link>
                        <Link
                            to="/data"
                            className={`block py-2 px-3 rounded-md ${
                                currentPath === "/data"
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                            onClick={closeMobileMenu}
                        >
                            Data Insights
                        </Link>
                        <Link
                            to="/about"
                            className={`block py-2 px-3 rounded-md ${
                                currentPath === "/about"
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                            onClick={closeMobileMenu}
                        >
                            About
                        </Link>

                        {/* Mobile User Actions */}
                        <div className="pt-3 border-t">
                            {user ? (
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground px-3">
                                        {user.email}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                        onClick={() => {
                                            handleSignOut();
                                            closeMobileMenu();
                                        }}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <Link to="/login" onClick={closeMobileMenu}>
                                        <User className="h-4 w-4 mr-2" />
                                        Sign In
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default NavBar;
