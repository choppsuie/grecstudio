
import * as Tone from "tone";
import { DrumKitType } from "./types";
import drumKits from "./drumKits";

// Initialize audio context and start Tone.js
export const initializeAudio = async () => {
  if (Tone.context.state !== "running") {
    await Tone.start();
    console.log("Tone.js initialized");
  }
  return Tone.context.state === "running";
};

// Create a volume control node
export const createVolumeControl = (initialLevel: number = -10) => {
  const volumeNode = new Tone.Volume(initialLevel).toDestination();
  return volumeNode;
};

// Load samples for a specific kit with better error handling
export const loadKitSamples = async (
  kitId: DrumKitType, 
  volumeNode: Tone.Volume
) => {
  const players: Record<string, Tone.Player> = {};
  const selectedKit = drumKits[kitId];
  
  if (!selectedKit || !selectedKit.pads) {
    console.error(`Kit ${kitId} not found or has no pads defined`);
    return players;
  }
  
  try {
    // Create a player for each pad and connect to volume
    for (const pad of selectedKit.pads) {
      try {
        const player = new Tone.Player({
          url: pad.soundUrl,
          onload: () => {
            console.log(`Loaded ${pad.name} for ${kitId} kit`);
          },
          onerror: (error) => {
            console.error(`Failed to load ${pad.name}: ${error}`);
          }
        }).connect(volumeNode);
        
        players[pad.id] = player;
      } catch (error) {
        console.error(`Error creating player for ${pad.name}:`, error);
      }
    }
    
    // Wait for all samples to load with a timeout
    const loadPromise = Tone.loaded();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Loading timed out")), 10000);
    });
    
    await Promise.race([loadPromise, timeoutPromise]).catch(err => {
      console.warn("Some samples may not have loaded properly:", err);
    });
    
    return players;
  } catch (error) {
    console.error("Failed to load kit samples:", error);
    return players;
  }
};

// Convert volume percentage to decibels
export const percentToDb = (percent: number) => {
  // Convert percentage (0-100) to dB scale (-60 to 0)
  return ((percent / 100) * 60) - 60;
};

// Dispose of players to clean up memory
export const disposePlayers = (players: Record<string, Tone.Player>) => {
  Object.values(players).forEach(player => {
    try {
      if (player && typeof player.dispose === 'function') {
        player.dispose();
      }
    } catch (error) {
      console.error("Error disposing player:", error);
    }
  });
};
