
import * as Tone from "tone";
import { DrumKitType } from "./types";
import drumKits from "./drumKits";

// Initialize audio context and start Tone.js with better error handling
export const initializeAudio = async () => {
  try {
    console.log("Initializing audio context...");
    
    // Try to start/resume the audio context
    if (Tone.context.state !== "running") {
      // Attempt to resume the context
      await Tone.context.resume();
      console.log("After resume, Tone.js state:", Tone.context.state);
      
      // If still not running, try more aggressive approach
      if (Tone.context.state !== "running") {
        // Create user gesture that will be used to start audio
        console.log("Context still not running, trying Tone.start()...");
        await Tone.start();
        console.log("After Tone.start(), state:", Tone.context.state);
      }
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
    
    // Create a buffer for each pad
    const bufferPromises = selectedKit.pads.map(pad => {
      return new Promise((resolve, reject) => {
        // Create the player
        const player = new Tone.Player({
          url: pad.soundUrl,
          onload: () => {
            console.log(`Successfully loaded ${pad.name} for ${kitId} kit`);
            players[pad.id] = player;
            resolve(player);
          },
          onerror: (error) => {
            console.error(`Failed to load ${pad.name}: ${error}`);
            reject(error);
          }
        }).connect(volumeNode);
        
        // Set a timeout for each individual sample
        setTimeout(() => {
          if (!player.loaded) {
            console.warn(`Loading timeout for ${pad.name}, marking as failed`);
            reject(new Error(`Timeout loading ${pad.name}`));
          }
        }, 5000);
      }).catch(err => {
        console.warn(`Skipping failed sample ${pad.id}:`, err);
        return null; // Return null for failed samples
      });
    });
    
    // Wait for all samples with a timeout of 10 seconds for the entire kit
    console.log("Waiting for all samples to load...");
    const loadingTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Overall kit loading timed out")), 10000)
    );
    
    try {
      // Use Promise.race to implement a timeout
      await Promise.race([
        Promise.allSettled(bufferPromises),
        loadingTimeout
      ]);
      
      console.log(`Successfully loaded ${Object.keys(players).length}/${selectedKit.pads.length} samples for kit ${kitId}`);
    } catch (error) {
      console.warn("Some samples may not have loaded:", error);
      // Continue with whatever samples did load
    }
    
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
