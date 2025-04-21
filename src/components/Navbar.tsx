
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MusicIcon, User, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-darker/80 backdrop-blur-md border-b border-cyber-purple/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <MusicIcon className="h-8 w-8 text-cyber-purple animate-pulse-glow" />
              <div className="absolute inset-0 bg-cyber-purple rounded-full blur-xl opacity-30 -z-10"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyber-purple to-cyber-blue bg-clip-text text-transparent">
              CloudJam
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-white/80 hover:text-cyber-purple transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-white/80 hover:text-cyber-purple transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-white/80 hover:text-cyber-purple transition-colors">
              Pricing
            </Link>
            <div className="ml-4 flex items-center space-x-2">
              <Button variant="outline" className="border-cyber-purple/50 hover:bg-cyber-purple/20 text-white">
                Login
              </Button>
              <Button className="bg-gradient-to-r from-cyber-purple to-cyber-blue hover:opacity-90 text-white">
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              to="/"
              className="block px-2 py-2 text-white/80 hover:bg-cyber-purple/20 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block px-2 py-2 text-white/80 hover:bg-cyber-purple/20 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block px-2 py-2 text-white/80 hover:bg-cyber-purple/20 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Button variant="outline" className="w-full border-cyber-purple/50 hover:bg-cyber-purple/20 text-white">
                Login
              </Button>
              <Button className="w-full bg-gradient-to-r from-cyber-purple to-cyber-blue hover:opacity-90 text-white">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
