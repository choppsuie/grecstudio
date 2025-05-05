
import * as Tone from "tone";
import { DrumKitType } from "./types";
import drumKits from "./drumKits";

// Initialize audio context and start Tone.js with better error handling
export const initializeAudio = async () => {
  try {
    if (Tone.context.state !== "running") {
      await Tone.start();
      await Tone.context.resume();
      console.log("Tone.js initialized with state:", Tone.context.state);
    }
    return Tone.context.state === "running";
  } catch (error) {
    console.error("Error initializing Tone.js:", error);
    return false;
  }
};

// Create a volume control node with better defaults
export const createVolumeControl = (initialLevel: number = -5) => {
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
    console.log(`Loading kit ${kitId} with ${selectedKit.pads.length} samples`);
    
    // Create a player for each pad and connect to volume
    for (const pad of selectedKit.pads) {
      try {
        console.log(`Attempting to load sound: ${pad.name} (${pad.soundUrl})`);
        
        const player = new Tone.Player({
          url: pad.soundUrl,
          onload: () => {
            console.log(`Successfully loaded ${pad.name} for ${kitId} kit`);
          },
          onerror: (error) => {
            console.error(`Failed to load ${pad.name}: ${error}`);
          },
          volume: 0, // Neutral volume
          fadeIn: 0.01, // Small fade in to avoid clicks
          fadeOut: 0.01 // Small fade out
        }).connect(volumeNode);
        
        players[pad.id] = player;
      } catch (error) {
        console.error(`Error creating player for ${pad.name}:`, error);
      }
    }
    
    // Wait for all samples to load with a longer timeout
    const loadPromise = Tone.loaded();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Loading timed out")), 15000);
    });
    
    await Promise.race([loadPromise, timeoutPromise]).catch(err => {
      console.warn("Some samples may not have loaded properly:", err);
    });
    
    console.log(`Successfully created ${Object.keys(players).length} players for kit ${kitId}`);
    return players;
  } catch (error) {
    console.error("Failed to load kit samples:", error);
    return players;
  }
};

// Convert volume percentage to decibels with a better curve
export const percentToDb = (percent: number) => {
  // Convert percentage (0-100) to dB scale (-60 to 0) with a more natural curve
  if (percent <= 0) return -Infinity;
  if (percent >= 100) return 6; // Allow some boost
  
  // Logarithmic scale feels more natural for volume
  return 40 * Math.log10(percent / 100);
};

// Dispose of players to clean up memory
export const disposePlayers = (players: Record<string, Tone.Player>) => {
  console.log(`Disposing ${Object.keys(players).length} players`);
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
