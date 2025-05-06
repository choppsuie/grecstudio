
import * as Tone from "tone";
import { DrumKitType } from "./types";
import drumKits from "./drumKits";

// Initialize audio context and start Tone.js with better error handling
export const initializeAudio = async () => {
  try {
    console.log("Initializing audio context...");
    
    // Try to start/resume the audio context
    // Fixed type checking for context state
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
    
    // Use a more reliable loading approach with Buffer instead of direct Player loading
    // This helps avoid timeouts by pre-loading the audio files
    for (const pad of selectedKit.pads) {
      try {
        console.log(`Starting to load ${pad.name} (${pad.soundUrl})`);
        
        // Create buffer first to pre-load
        const buffer = new Tone.Buffer();
        
        // Set up a loading promise with timeout
        const loadingPromise = new Promise((resolve, reject) => {
          buffer.load(pad.soundUrl)
            .then(() => {
              console.log(`Buffer loaded for ${pad.name}`);
              // Create player with the loaded buffer
              const player = new Tone.Player({
                url: pad.soundUrl,
                onload: () => {
                  console.log(`Player created for ${pad.name}`);
                  players[pad.id] = player;
                  resolve(player);
                }
              }).connect(volumeNode);
            })
            .catch(error => {
              console.error(`Failed to load buffer for ${pad.name}:`, error);
              reject(error);
            });
            
          // Add timeout for individual sample loading
          setTimeout(() => {
            if (!buffer.loaded) {
              const fallbackUrl = "https://tonejs.github.io/audio/berklee/gong_1.mp3";
              console.warn(`Loading timeout for ${pad.name}, using fallback sound`);
              
              // Create a fallback player with a reliable sample
              const fallbackPlayer = new Tone.Player({
                url: fallbackUrl,
                onload: () => {
                  console.log(`Fallback loaded for ${pad.name}`);
                  players[pad.id] = fallbackPlayer;
                  resolve(fallbackPlayer);
                }
              }).connect(volumeNode);
            }
          }, 3000);
        });
      } catch (err) {
        console.warn(`Error in load process for ${pad.id}:`, err);
      }
    }
    
    // Short wait to allow some samples to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Loaded ${Object.keys(players).length}/${selectedKit.pads.length} samples for kit ${kitId}`);
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
