
import * as Tone from "tone";
import { DrumKitType } from "./types";
import drumKits from "./drumKits";

// Initialize audio context and start Tone.js
export const initializeAudio = async () => {
  await Tone.start();
  console.log("Tone.js initialized");
};

// Create a volume control node
export const createVolumeControl = (initialLevel: number = -10) => {
  return new Tone.Volume(initialLevel).toDestination();
};

// Load samples for a specific kit
export const loadKitSamples = async (
  kitId: DrumKitType, 
  volumeNode: Tone.Volume
) => {
  const players: Record<string, Tone.Player> = {};
  const selectedKit = drumKits[kitId];
  
  // Create a player for each pad and connect to volume
  for (const pad of selectedKit.pads) {
    const player = new Tone.Player({
      url: pad.soundUrl,
      onload: () => {
        console.log(`Loaded ${pad.name} for ${kitId} kit`);
      }
    }).connect(volumeNode);
    
    players[pad.id] = player;
  }
  
  // Wait for all samples to load
  await Tone.loaded();
  
  return players;
};

// Convert volume percentage to decibels
export const percentToDb = (percent: number) => {
  // Convert percentage (0-100) to dB scale (-30 to 0)
  return ((percent / 100) * 30) - 30;
};

// Dispose of players to clean up memory
export const disposePlayers = (players: Record<string, Tone.Player>) => {
  Object.values(players).forEach(player => {
    player.dispose();
  });
};
