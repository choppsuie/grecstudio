
import { useCallback, useEffect } from "react";
import * as Tone from "tone";
import { DrumKitType } from "./types";
import { initializeAudio, createVolumeControl, loadKitSamples } from "./audioUtils";
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
        await Tone.start();
        console.log("Tone.js context state:", Tone.context.state);
        
        const initialized = await initializeAudio();
        if (!initialized) {
          console.log("Audio initialization failed, trying again...");
          await Tone.start();
          toast({
            title: "Audio Initialization",
            description: "Click anywhere to enable audio playback",
          });
          return;
        }
        
        // Create volume node with higher initial volume
        const volumeNode = createVolumeControl(-5);
        volumeNodeRef.current = volumeNode;
        
        setMainVolume(volumeNode);
        setKitList(getAvailableKits());
        
        // Load default kit
        try {
          updateCurrentKit('tr909');
          await loadKit('tr909');
        } catch (error) {
          console.error("Failed to load default kit metadata:", error);
          toast({
            title: "Loading Error",
            description: "Failed to load drum kit samples",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to initialize drum machine:", error);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize audio engine",
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
  }, [toast]);

  // Force initialization function for UI buttons
  const forceInitialize = useCallback(async () => {
    try {
      console.log("Force initializing audio...");
      await Tone.start();
      console.log("Tone.js context state after force init:", Tone.context.state);
      
      await initializeAudio();
      if (!state.mainVolume && !volumeNodeRef.current) {
        const volumeNode = createVolumeControl(-5);
        volumeNodeRef.current = volumeNode;
        setMainVolume(volumeNode);
      }
      
      return loadKit(state.selectedKit);
    } catch (error) {
      console.error("Force initialization failed:", error);
      return false;
    }
  }, [loadKit, state.mainVolume, state.selectedKit, setMainVolume, volumeNodeRef]);

  return { forceInitialize };
};
