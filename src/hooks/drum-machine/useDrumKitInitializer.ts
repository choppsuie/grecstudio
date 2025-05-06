
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
        console.log("Setting up drum machine");
        
        // Force start the audio context
        try {
          await Tone.start().catch(e => console.warn("Initial Tone.start() failed, will retry:", e));
          console.log("Tone.js context state:", Tone.context.state);
        } catch (e) {
          console.warn("Failed to start Tone.js initially:", e);
        }
        
        // Create volume node regardless of context state
        const volumeNode = createVolumeControl(-5);
        volumeNodeRef.current = volumeNode;
        setMainVolume(volumeNode);
        setKitList(getAvailableKits());
        
        // Update metadata even if audio isn't fully initialized yet
        updateCurrentKit('tr909');
        
        // Don't automatically try to initialize audio on page load
        // This now requires explicit user interaction
        toast({
          title: "Audio Ready",
          description: "Click 'Initialize Audio' button when you're ready to play sounds",
        });
      } catch (error) {
        console.error("Failed to initialize drum machine:", error);
        toast({
          title: "Setup Issue",
          description: "There was a problem setting up the drum machine. Click 'Initialize Audio' to retry.",
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
  }, []);  // Run only once on component mount

  // Force initialization function for UI buttons
  const forceInitialize = useCallback(async () => {
    try {
      console.log("Force initializing audio...");
      
      // This must be triggered from a user interaction
      await Tone.start();
      console.log("Tone.js context state after force init:", Tone.context.state);
      
      // Ensure audio context is running
      const success = await initializeAudio();
      if (!success) {
        console.error("Failed to initialize audio context");
        toast({
          title: "Audio Error",
          description: "Browser prevented audio playback. Please try again with a click.",
          variant: "destructive"
        });
        return false;
      }
      
      // Set up the volume node if needed
      if (!state.mainVolume && !volumeNodeRef.current) {
        const volumeNode = createVolumeControl(-5);
        volumeNodeRef.current = volumeNode;
        setMainVolume(volumeNode);
      }
      
      // Show loading toast
      toast({
        title: "Loading Sounds",
        description: "Loading drum samples, please wait..."
      });
      
      // Always attempt to load kit after initialization
      const kitLoaded = await loadKit(state.selectedKit);
      
      if (kitLoaded) {
        toast({
          title: "Ready to Play",
          description: "Drum machine initialized successfully!",
        });
        return true;
      } else {
        toast({
          title: "Loading Issue",
          description: "Some sounds may not have loaded. You can still try to play.",
          variant: "default"
        });
        return true; // Return true so user can still interact
      }
    } catch (error) {
      console.error("Force initialization failed:", error);
      toast({
        title: "Initialization Failed",
        description: "Could not initialize audio. Please click the button again.",
        variant: "destructive"
      });
      return false;
    }
  }, [loadKit, state.mainVolume, state.selectedKit, setMainVolume, toast, volumeNodeRef]);

  return { forceInitialize };
};
