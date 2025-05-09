
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Sliders, 
  Music, 
  Layers, 
  Settings, 
  Share2, 
  User2, 
  Users,
  X
} from "lucide-react";
import { useStudio } from "@/contexts/StudioHooks";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EffectsPanel from './EffectsPanel';

const StudioSidebar = () => {
  const { showMixer, setShowMixer, projectId, collaborators, handleShare } = useStudio();
  
  if (!showMixer) return null;
  
  return (
    <div className="w-72 bg-cyber-darker border-l border-cyber-purple/20 flex flex-col">
      <div className="flex justify-between items-center p-2 border-b border-cyber-purple/20">
        <h3 className="text-sm font-medium text-cyber-text">Studio Controls</h3>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7 text-cyber-text-subtle hover:bg-cyber-purple/10 hover:text-cyber-text"
          onClick={() => setShowMixer(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="mixer" className="flex-1 flex flex-col">
        <TabsList className="justify-between px-2 pt-2 bg-transparent">
          <TabsTrigger value="mixer" className="data-[state=active]:bg-cyber-purple/20 text-cyber-text-muted data-[state=active]:text-cyber-text">
            <Sliders className="h-4 w-4 mr-1" />
            <span className="text-xs">Mixer</span>
          </TabsTrigger>
          <TabsTrigger value="instruments" className="data-[state=active]:bg-cyber-purple/20 text-cyber-text-muted data-[state=active]:text-cyber-text">
            <Music className="h-4 w-4 mr-1" />
            <span className="text-xs">Instruments</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-cyber-purple/20 text-cyber-text-muted data-[state=active]:text-cyber-text">
            <Layers className="h-4 w-4 mr-1" />
            <span className="text-xs">Projects</span>
          </TabsTrigger>
        </TabsList>
        
        <Separator className="bg-cyber-purple/20 my-2" />
        
        <div className="flex-1 overflow-y-auto px-4">
          <TabsContent value="mixer" className="h-full">
            <EffectsPanel />
          </TabsContent>
          
          <TabsContent value="instruments" className="h-full">
            <div className="space-y-4">
              <div className="glass-card p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-2 text-cyber-text">Available Instruments</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-cyber-text">
                    <Music className="h-4 w-4 mr-2" />
                    Synth Lead
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-cyber-text">
                    <Music className="h-4 w-4 mr-2" />
                    Bass Synth
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-cyber-text">
                    <Music className="h-4 w-4 mr-2" />
                    TR-909 Drums
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="h-full">
            <div className="space-y-4">
              <div className="glass-card p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-2 text-cyber-text">Project: {projectId || 'Untitled'}</h4>
                <p className="text-xs text-cyber-text-muted mb-2">
                  Collaborative DAW session
                </p>
                <Button variant="default" size="sm" onClick={handleShare} className="w-full mb-2 text-cyber-text">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Project
                </Button>
                
                {collaborators.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs text-cyber-text-muted mb-2">Collaborators</h5>
                    <div className="space-y-2">
                      {collaborators.map(collab => (
                        <div key={collab.id} className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${collab.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <span className="text-xs text-cyber-text">{collab.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
        
        <div className="p-3 border-t border-cyber-purple/20">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="flex-1 text-cyber-text">
              <User2 className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 text-cyber-text">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default StudioSidebar;
