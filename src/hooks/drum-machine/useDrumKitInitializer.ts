
import { useCallback, useEffect } from "react";
import * as Tone from "tone";
import { DrumKitType } from "./types";
import { initializeAudio, createVolumeControl } from "./audioUtils";
import { getAvailableKits } from "./drumKits";
import { useToast } from "@/hooks/use-toast";

export const useDrumKitInitializer = (
  state: any,
  volumeNodeRef: React.MutableRefObject<Tone.Volume | null>,
  setMainVolume: (volume: Tone.Volume | null) => void,
  setKitList: (kits: any[]) => void,
  updateCurrentKit: (kitId: DrumKitType) => void,
  loadKit: (kitId: DrumKitType) => Promise<boolean>
) => {
  const { toast } = useToast();
  
  // Initialize the drum machine
  useEffect(() => {
    const initDrumMachine = async () => {
      try {
        // Force start the audio context
        await Tone.start().catch(e => console.warn("Initial Tone.start() failed, will retry:", e));
        console.log("Tone.js context state:", Tone.context.state);
        
        // Create volume node with higher initial volume regardless of context state
        const volumeNode = createVolumeControl(-5);
        volumeNodeRef.current = volumeNode;
        setMainVolume(volumeNode);
        setKitList(getAvailableKits());
        
        // Update metadata even if audio isn't fully initialized yet
        updateCurrentKit('tr909');
        
        // Try to initialize audio context
        const initialized = await initializeAudio();
        
        if (!initialized) {
          console.log("Audio context not running yet. User interaction needed.");
          toast({
            title: "Audio Needs Activation",
            description: "Click 'Initialize Audio' button to enable sound playback",
          });
          return;
        }
        
        // If context is running, try to load the kit
        try {
          await loadKit('tr909');
        } catch (error) {
          console.error("Failed to load default kit:", error);
          toast({
            title: "Loading Error",
            description: "Failed to load drum kit samples. Click 'Initialize Audio' to retry.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to initialize drum machine:", error);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize audio engine. Click 'Initialize Audio' to retry.",
          variant: "destructive"
        });
      }
    };
    
    initDrumMachine();
    
    // Cleanup function
    return () => {
      if (state.players && Object.keys(state.players).length > 0) {
        Object.values(state.players).forEach((player: any) => {
          try {
            if (player && typeof player.dispose === 'function') {
              player.dispose();
            }
          } catch (error) {
            console.error("Error disposing player:", error);
          }
        });
      }
      
      if (volumeNodeRef.current) {
        volumeNodeRef.current.dispose();
      }
    };
  }, [toast]); // Removed dependencies that cause re-initialization

  // Force initialization function for UI buttons
  const forceInitialize = useCallback(async () => {
    try {
      console.log("Force initializing audio...");
      
      // This must be triggered from a user interaction
      await Tone.start();
      console.log("Tone.js context state after force init:", Tone.context.state);
      
      const success = await initializeAudio();
      if (!success) {
        console.error("Failed to initialize audio context");
        return false;
      }
      
      if (!state.mainVolume && !volumeNodeRef.current) {
        const volumeNode = createVolumeControl(-5);
        volumeNodeRef.current = volumeNode;
        setMainVolume(volumeNode);
      }
      
      // Always attempt to load kit after initialization
      return await loadKit(state.selectedKit);
    } catch (error) {
      console.error("Force initialization failed:", error);
      return false;
    }
  }, [loadKit, state.mainVolume, state.selectedKit, setMainVolume, volumeNodeRef]);

  return { forceInitialize };
};
