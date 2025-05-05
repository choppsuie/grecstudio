
import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";
import { DrumKit, DrumKitType, DrumKitInfo, DrumMachineState } from "./drum-machine/types";
import { initializeAudio, createVolumeControl, loadKitSamples, percentToDb, disposePlayers } from "./drum-machine/audioUtils";
import drumKits, { getAvailableKits, getKit } from "./drum-machine/drumKits";
import { useToast } from "@/hooks/use-toast";

export const useDrumKit = () => {
  const { toast } = useToast();
  const [state, setState] = useState<DrumMachineState>({
    selectedKit: 'tr909' as DrumKitType, // Changed default to tr909 for better sound
    players: {},
    isLoaded: false,
    mainVolume: null
  });

  const [currentKit, setCurrentKit] = useState<DrumKit | null>(null);
  const [availableKits, setAvailableKits] = useState<DrumKitInfo[]>([]);
  const volumeNodeRef = useRef<Tone.Volume | null>(null);

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
        
        setState(prevState => ({
          ...prevState,
          mainVolume: volumeNode
        }));

        setAvailableKits(getAvailableKits());
        
        // Load default kit
        try {
          const kit = getKit('tr909');
          setCurrentKit(kit);
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
        disposePlayers(state.players);
      }
      
      if (volumeNodeRef.current) {
        volumeNodeRef.current.dispose();
      }
    };
  }, [toast]);

  // Load drum kit samples
  const loadKit = useCallback(async (kitId: DrumKitType) => {
    const volumeNode = state.mainVolume || volumeNodeRef.current;
    if (!volumeNode) {
      console.error("Volume node not initialized");
      return false;
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

      // Get kit data
      const kit = getKit(kitId);
      setCurrentKit(kit);

      // Load new samples
      const players = await loadKitSamples(kitId, volumeNode);
      
      if (Object.keys(players).length === 0) {
        toast({
          title: "Loading Warning",
          description: `Could not load all samples for ${kitId} kit`,
          variant: "destructive"
        });
        return false;
      }
      
      setState(prevState => ({
        ...prevState,
        selectedKit: kitId,
        players,
        isLoaded: true,
        mainVolume: volumeNode
      }));
      
      console.log(`Loaded ${kitId} kit successfully with ${Object.keys(players).length} samples`);
      return true;
    } catch (error) {
      console.error(`Failed to load ${kitId} kit:`, error);
      setState(prevState => ({
        ...prevState,
        isLoaded: false
      }));
      
      toast({
        title: "Kit Loading Failed",
        description: `Could not load the ${kitId} drum kit`,
        variant: "destructive"
      });
      
      return false;
    }
  }, [state.mainVolume, state.players, toast]);

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
    if (!state.mainVolume && !volumeNodeRef.current) return;
    
    const volumeNode = state.mainVolume || volumeNodeRef.current;
    if (volumeNode) {
      const dbValue = percentToDb(volumePercent);
      volumeNode.volume.value = dbValue;
    }
  }, [state.mainVolume]);

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
        
        setState(prevState => ({
          ...prevState,
          mainVolume: volumeNode
        }));
      }
      
      return loadKit(state.selectedKit);
    } catch (error) {
      console.error("Force initialization failed:", error);
      return false;
    }
  }, [loadKit, state.mainVolume, state.selectedKit]);

  return {
    currentPads: currentKit?.pads || [],
    selectedKit: state.selectedKit,
    availableKits,
    isLoaded: state.isLoaded,
    loadKit,
    playSound,
    setVolume,
    forceInitialize
  };
};

export default useDrumKit;
