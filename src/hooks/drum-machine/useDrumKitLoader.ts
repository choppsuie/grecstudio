
import { useCallback } from "react";
import * as Tone from "tone";
import { DrumKitType } from "./types";
import { loadKitSamples, disposePlayers, initializeAudio } from "./audioUtils";
import { getKit } from "./drumKits";
import { useToast } from "@/hooks/use-toast";

export const useDrumKitLoader = (
  state: any,
  volumeNodeRef: React.MutableRefObject<Tone.Volume | null>,
  setPlayers: (players: Record<string, Tone.Player>) => void,
  setIsLoaded: (isLoaded: boolean) => void,
  updateCurrentKit: (kitId: DrumKitType) => void,
  setSelectedKit: (kitId: DrumKitType) => void
) => {
  const { toast } = useToast();

  // Load drum kit samples
  const loadKit = useCallback(async (kitId: DrumKitType) => {
    // Make sure audio context is running first
    const contextRunning = await initializeAudio();
    if (!contextRunning) {
      console.warn("Audio context not running, cannot load kit");
      toast({
        title: "Audio Not Initialized",
        description: "Please click the 'Initialize Audio' button first",
        variant: "destructive"
      });
      return false;
    }
    
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

      setIsLoaded(false);

      // Get kit data
      const kit = getKit(kitId);
      updateCurrentKit(kitId);

      // Show loading toast
      toast({
        title: "Loading samples",
        description: `Loading ${kit.name} drum kit...`
      });

      // Load new samples
      const players = await loadKitSamples(kitId, volumeNode);
      
      if (Object.keys(players).length === 0) {
        toast({
          title: "Loading Failed",
          description: `Could not load samples for ${kitId} kit. Try clicking Initialize Audio again.`,
          variant: "destructive"
        });
        return false;
      }
      
      // Check if we have at least some of the samples
      const loadedCount = Object.keys(players).length;
      const totalCount = kit.pads.length;
      
      setSelectedKit(kitId);
      setPlayers(players);
      setIsLoaded(true);
      
      if (loadedCount < totalCount) {
        toast({
          title: "Partial Loading",
          description: `Loaded ${loadedCount}/${totalCount} samples for ${kit.name}`,
          variant: "default"
        });
      } else {
        toast({
          title: "Kit Loaded",
          description: `${kit.name} loaded successfully`,
          variant: "default"
        });
      }
      
      console.log(`Loaded ${kitId} kit with ${Object.keys(players).length}/${totalCount} samples`);
      return true;
    } catch (error) {
      console.error(`Failed to load ${kitId} kit:`, error);
      setIsLoaded(false);
      
      toast({
        title: "Kit Loading Failed",
        description: `Could not load the ${kitId} drum kit. Try again or choose another kit.`,
        variant: "destructive"
      });
      
      return false;
    }
  }, [state.mainVolume, state.players, updateCurrentKit, setSelectedKit, setPlayers, setIsLoaded, toast, volumeNodeRef]);

  return { loadKit };
};
