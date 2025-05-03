
import { useState, useEffect, useCallback } from "react";
import * as Tone from "tone";
import { DrumKit, DrumKitType, DrumKitInfo, DrumMachineState } from "./drum-machine/types";
import { initializeAudio, createVolumeControl, loadKitSamples, percentToDb, disposePlayers } from "./drum-machine/audioUtils";
import { getAvailableKits, getKit } from "./drum-machine/drumKits";

export const useDrumKit = () => {
  const [state, setState] = useState<DrumMachineState>({
    selectedKit: 'basic' as DrumKitType,
    players: {},
    isLoaded: false,
    mainVolume: null
  });

  const [currentKit, setCurrentKit] = useState<DrumKit | null>(null);
  const [availableKits, setAvailableKits] = useState<DrumKitInfo[]>([]);

  // Initialize the drum machine
  useEffect(() => {
    const initDrumMachine = async () => {
      try {
        await initializeAudio();
        const volumeNode = createVolumeControl(-10);
        
        setState(prevState => ({
          ...prevState,
          mainVolume: volumeNode
        }));

        setAvailableKits(getAvailableKits());
      } catch (error) {
        console.error("Failed to initialize drum machine:", error);
      }
    };
    
    initDrumMachine();
    
    // Cleanup function
    return () => {
      if (state.players && Object.keys(state.players).length > 0) {
        disposePlayers(state.players);
      }
      
      if (state.mainVolume) {
        state.mainVolume.dispose();
      }
    };
  }, []);

  // Load drum kit samples
  const loadKit = useCallback(async (kitId: DrumKitType) => {
    if (!state.mainVolume) {
      console.error("Volume node not initialized");
      return;
    }
    
    try {
      // Clean up previous players if they exist
      if (state.players && Object.keys(state.players).length > 0) {
        disposePlayers(state.players);
      }

      setState(prevState => ({
        ...prevState,
        isLoaded: false
      }));

      // Load new samples
      const players = await loadKitSamples(kitId, state.mainVolume);
      const kit = getKit(kitId);

      setCurrentKit(kit);
      
      setState(prevState => ({
        ...prevState,
        selectedKit: kitId,
        players,
        isLoaded: true
      }));
      
      console.log(`Loaded ${kitId} kit successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to load ${kitId} kit:`, error);
      setState(prevState => ({
        ...prevState,
        isLoaded: false
      }));
      throw error;
    }
  }, [state.mainVolume, state.players]);

  // Play a drum sound
  const playSound = useCallback((padId: string) => {
    if (!state.isLoaded || !state.players[padId]) {
      console.warn(`Cannot play ${padId}: samples not loaded`);
      return;
    }
    
    try {
      const player = state.players[padId];
      player.start();
    } catch (error) {
      console.error(`Failed to play ${padId}:`, error);
    }
  }, [state.isLoaded, state.players]);

  // Set the volume
  const setVolume = useCallback((volumePercent: number) => {
    if (!state.mainVolume) return;
    
    const dbValue = percentToDb(volumePercent);
    state.mainVolume.volume.value = dbValue;
  }, [state.mainVolume]);

  return {
    currentPads: currentKit?.pads || [],
    selectedKit: state.selectedKit,
    availableKits,
    isLoaded: state.isLoaded,
    loadKit,
    playSound,
    setVolume
  };
};

export default useDrumKit;
