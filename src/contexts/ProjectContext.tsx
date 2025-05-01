
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface ProjectContextType {
  projectId: string;
  collaborators: any[];
  showMixer: boolean;
  setShowMixer: (value: boolean) => void;
  toggleMixer: () => void;
  handleSave: () => Promise<void>;
  handleShare: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [projectId, setProjectId] = useState("demo-project");
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [showMixer, setShowMixer] = useState(true);

  useEffect(() => {
    if (user) {
      setCollaborators([
        { id: '1', name: 'Alice Cooper', avatar: '', status: 'online' },
        { id: '2', name: 'Bob Dylan', avatar: '', status: 'offline' },
      ]);
      
      const channel = supabase.channel('studio_collaboration');
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          console.log('Current collaborators:', state);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          toast({
            title: "Collaborator joined",
            description: `${newPresences[0]?.name || 'Someone'} has joined the session.`,
          });
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          toast({
            title: "Collaborator left",
            description: `${leftPresences[0]?.name || 'Someone'} has left the session.`,
          });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && user) {
            await channel.track({
              userId: user.id,
              name: user.email || 'Anonymous',
              online_at: new Date().toISOString(),
            });
          }
        });
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, toast]);
  
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your project.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Project saved",
      description: "All your changes have been saved to the cloud.",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share project",
      description: "Project link copied to clipboard. You can now share it with collaborators.",
    });
  };
  
  const toggleMixer = () => {
    setShowMixer(!showMixer);
  };

  const value: ProjectContextType = {
    projectId,
    collaborators,
    showMixer,
    setShowMixer,
    toggleMixer,
    handleSave,
    handleShare,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
