
import { useCallback } from "react";
import * as Tone from "tone";
import { percentToDb } from "./audioUtils";
import { useToast } from "@/hooks/use-toast";

export const useDrumSoundPlayer = (
  state: any
) => {
  const { toast } = useToast();

  // Play a drum sound
  const playSound = useCallback((padId: string) => {
    if (!state.isLoaded) {
      console.warn(`Cannot play ${padId}: samples not loaded`);
      return;
    }
    
    const player = state.players[padId];
    if (!player) {
      console.warn(`Player not found for ${padId}`);
      return;
    }
    
    try {
      // Make sure Tone.js context is running
      if (Tone.context.state !== "running") {
        Tone.context.resume();
      }
      
      // Add a check for loaded state
      if (!player.loaded) {
        console.warn(`Player for ${padId} is not loaded yet, cannot play`);
        return;
      }
      
      // Restart the player if it's already playing
      if (player.state === "started") {
        player.stop();
      }
      
      // Use a safer play method with error handling
      try {
        player.start();
        console.log(`Playing sound: ${padId}`);
      } catch (error) {
        console.error(`Failed to play ${padId}:`, error);
        
        // Try reloading the player if there's an error
        if (error.toString().includes("buffer is either not set or not loaded")) {
          toast({
            title: "Sound playback failed",
            description: "Click 'Initialize Audio' button to reload sounds",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error(`Failed to play ${padId}:`, error);
    }
  }, [state.isLoaded, state.players, toast]);

  // Set the volume
  const setVolume = useCallback((volumePercent: number) => {
    if (!state.mainVolume && !state.volumeNodeRef?.current) return;
    
    const volumeNode = state.mainVolume || state.volumeNodeRef?.current;
    if (volumeNode) {
      const dbValue = percentToDb(volumePercent);
      volumeNode.volume.value = dbValue;
    }
  }, [state.mainVolume, state.volumeNodeRef]);

  return {
    playSound,
    setVolume
  };
};
