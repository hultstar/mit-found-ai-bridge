
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, PlusCircle, User, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if current route is active
  const isActive = (path: string) => location.pathname === path;
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <nav className={`glass sticky top-0 z-20 transition-all duration-300 ${
      isScrolled ? "shadow-md py-2" : "py-3"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-mit-red" />
            <span className="text-xl font-bold text-gray-800">MIT Lost & Found</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant={isActive("/") ? "default" : "ghost"} 
              onClick={() => navigate("/")}
              className={isActive("/") ? "bg-mit-red text-white" : ""}
            >
              Home
            </Button>
            <Button 
              variant={isActive("/report") ? "default" : "ghost"} 
              onClick={() => navigate("/report")}
              className={isActive("/report") ? "bg-mit-red text-white" : ""}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Report Item
            </Button>
            
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Button 
                    variant={isActive("/admin") ? "default" : "ghost"} 
                    onClick={() => navigate("/admin")}
                    className={isActive("/admin") ? "bg-mit-red text-white" : ""}
                  >
                    Admin Dashboard
                  </Button>
                ) : (
                  <Button 
                    variant={isActive("/student-dashboard") ? "default" : "ghost"} 
                    onClick={() => navigate("/student-dashboard")}
                    className={isActive("/student-dashboard") ? "bg-mit-red text-white" : ""}
                  >
                    My Dashboard
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-mit-red text-mit-red hover:bg-mit-red/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="border-mit-red text-mit-red hover:bg-mit-red/10"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <Button 
                variant={isActive("/") ? "default" : "ghost"} 
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
                className={`justify-start ${isActive("/") ? "bg-mit-red text-white" : ""}`}
              >
                Home
              </Button>
              <Button 
                variant={isActive("/report") ? "default" : "ghost"} 
                onClick={() => {
                  navigate("/report");
                  setMobileMenuOpen(false);
                }}
                className={`justify-start ${isActive("/report") ? "bg-mit-red text-white" : ""}`}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Report Item
              </Button>
              
              {user ? (
                <>
                  {user.role === "admin" ? (
                    <Button 
                      variant={isActive("/admin") ? "default" : "ghost"} 
                      onClick={() => {
                        navigate("/admin");
                        setMobileMenuOpen(false);
                      }}
                      className={`justify-start ${isActive("/admin") ? "bg-mit-red text-white" : ""}`}
                    >
                      Admin Dashboard
                    </Button>
                  ) : (
                    <Button 
                      variant={isActive("/student-dashboard") ? "default" : "ghost"} 
                      onClick={() => {
                        navigate("/student-dashboard");
                        setMobileMenuOpen(false);
                      }}
                      className={`justify-start ${isActive("/student-dashboard") ? "bg-mit-red text-white" : ""}`}
                    >
                      My Dashboard
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start border-mit-red text-mit-red hover:bg-mit-red/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start border-mit-red text-mit-red hover:bg-mit-red/10"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
