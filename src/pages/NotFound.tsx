import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <MapPin className="h-16 w-16 text-red-500 opacity-50" />
        </div>
        <h1 className="text-6xl font-bold mb-2 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">This item seems to be lost too!</p>
        <Button asChild>
          <Link to="/" className="inline-flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Return to Lost & Found
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
