
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
      <div className="relative">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-red opacity-20 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="text-center glass-card p-12 max-w-md">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">404</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-red to-cyber-purple mx-auto mb-6"></div>
          <p className="text-xl text-white mb-8">Oops! This page seems to be lost in the digital void.</p>
          <Button asChild className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
