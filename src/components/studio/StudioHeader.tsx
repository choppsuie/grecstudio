
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music4, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudioHeader = () => {
  const { user } = useAuth();

  return (
    <header className="h-12 bg-cyber-darker border-b border-cyber-purple/20 flex items-center justify-between px-4">
      <Link to="/" className="flex items-center space-x-2">
        <div className="relative">
          <Music4 className="h-6 w-6 text-cyber-red animate-pulse-glow" />
          <div className="absolute inset-0 bg-cyber-red rounded-full blur-xl opacity-30 -z-10"></div>
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
          GRecStudio
        </span>
      </Link>

      <div className="flex items-center space-x-2">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-cyber-darker border-cyber-purple/20">
              <DropdownMenuItem className="text-sm">
                Signed in as {user.email}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/projects">My Projects</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default StudioHeader;
