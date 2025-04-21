
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music4, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-darker/80 backdrop-blur-md border-b border-cyber-red/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Music4 className="h-8 w-8 text-cyber-red animate-pulse-glow" />
              <div className="absolute inset-0 bg-cyber-red rounded-full blur-xl opacity-30 -z-10"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
              GRecStudio
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-white/80 hover:text-cyber-red transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-white/80 hover:text-cyber-red transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-white/80 hover:text-cyber-red transition-colors">
              Pricing
            </Link>
            
            <div className="ml-4 flex items-center space-x-2">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    className="border-cyber-red/50 hover:bg-cyber-red/20 text-white"
                    asChild
                  >
                    <Link to="/studio">Studio</Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 rounded-full">
                        <User className="h-5 w-5 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleSignOut}>
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="border-cyber-red/50 hover:bg-cyber-red/20 text-white"
                    asChild
                  >
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90 text-white"
                    asChild
                  >
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
