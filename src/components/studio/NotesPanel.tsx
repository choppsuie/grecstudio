
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NotesPanelProps {
  onSubmitNotes: () => void;
  onInvite: () => void;
}

const NotesPanel = ({ onSubmitNotes, onInvite }: NotesPanelProps) => {
  const [projectNotes, setProjectNotes] = useState("");
  
  return (
    <div>
      <div className="glass-card p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Project Notes</h3>
        <textarea 
          className="w-full h-48 bg-cyber-darker border border-cyber-purple/20 rounded-md p-2 text-sm text-white/80 resize-none focus:outline-none focus:border-cyber-purple/50"
          placeholder="Add notes about this project..."
          value={projectNotes}
          onChange={(e) => setProjectNotes(e.target.value)}
        ></textarea>
        <div className="mt-2 flex justify-end">
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-cyber-red to-cyber-purple"
            onClick={onSubmitNotes}
          >
            <Send className="h-4 w-4 mr-2" />
            Save Notes
          </Button>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Collaborators</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center bg-cyber-darker p-2 rounded-md">
            <div className="w-6 h-6 rounded-full bg-cyber-purple/20 flex items-center justify-center mr-2">
              <span className="text-xs">JS</span>
            </div>
            <span className="text-xs">You (Owner)</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-dashed border-cyber-purple/30 text-xs"
            onClick={onInvite}
          >
            + Invite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
