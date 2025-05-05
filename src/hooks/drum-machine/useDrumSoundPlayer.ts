
import { useCallback } from "react";
import * as Tone from "tone";
import { percentToDb } from "./audioUtils";

export const useDrumSoundPlayer = (
  state: any
) => {
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
      
      // Restart the player if it's already playing
      if (player.state === "started") {
        player.stop();
      }
      player.start();
      console.log(`Playing sound: ${padId}`);
    } catch (error) {
      console.error(`Failed to play ${padId}:`, error);
    }
  }, [state.isLoaded, state.players]);

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
