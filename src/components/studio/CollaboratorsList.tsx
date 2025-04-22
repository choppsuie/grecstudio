
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, User, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
}

const CollaboratorsList = ({ collaborators }: CollaboratorsListProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  
  const handleInvite = () => {
    if (!email.trim()) return;
    
    // In a complete implementation, we would send an invite via Supabase
    toast({
      title: "Invitation sent",
      description: `Invitation email sent to ${email}`,
    });
    
    setEmail("");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Collaborators</h3>
        <span className="text-xs bg-cyber-purple/30 px-2 py-1 rounded-full">
          {collaborators.filter(c => c.status === 'online').length} online
        </span>
      </div>
      
      <div className="space-y-2">
        {collaborators.map((collaborator) => (
          <div 
            key={collaborator.id}
            className="flex items-center p-2 rounded-lg bg-cyber-darker/50"
          >
            <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center mr-3">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{collaborator.name}</p>
              <p className="text-xs text-white/60">
                {collaborator.status === 'online' ? 'Currently online' : 'Offline'}
              </p>
            </div>
            <div 
              className={`w-2 h-2 rounded-full ${
                collaborator.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
              }`}
            />
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-cyber-purple/10">
        <h4 className="text-sm font-medium mb-2">Invite collaborators</h4>
        <div className="flex items-center space-x-2">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            className="flex-1 bg-cyber-darker border-cyber-purple/20 focus-visible:ring-cyber-purple/30"
          />
          <Button 
            onClick={handleInvite}
            className="bg-cyber-purple hover:bg-cyber-purple/80"
            disabled={!email.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Invite</span>
          </Button>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full mt-4 border-cyber-purple/30 hover:bg-cyber-purple/10"
        onClick={() => {
          toast({
            title: "Manage permissions",
            description: "Permission management will be available in the next update.",
          });
        }}
      >
        <Users className="h-4 w-4 mr-2" />
        <span>Manage permissions</span>
      </Button>
    </div>
  );
};

export default CollaboratorsList;
