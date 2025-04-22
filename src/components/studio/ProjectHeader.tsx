
import { MessageSquare, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProjectHeaderProps {
  onOpenCommentsPanel: () => void;
  onOpenCollaboratorsPanel: () => void;
  onOpenSettingsPanel: () => void;
}

const ProjectHeader = ({ 
  onOpenCommentsPanel, 
  onOpenCollaboratorsPanel, 
  onOpenSettingsPanel 
}: ProjectHeaderProps) => {
  return (
    <div className="p-4 border-b border-cyber-purple/20 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Untitled Project</h1>
        <p className="text-sm text-white/60">120 BPM - 4/4 - 00:00:00</p>
      </div>
      
      <div className="flex space-x-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-cyber-purple hover:bg-cyber-purple/10"
          onClick={onOpenCommentsPanel}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-cyber-purple hover:bg-cyber-purple/10"
          onClick={onOpenCollaboratorsPanel}
        >
          <Users className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-cyber-purple hover:bg-cyber-purple/10"
          onClick={onOpenSettingsPanel}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectHeader;
