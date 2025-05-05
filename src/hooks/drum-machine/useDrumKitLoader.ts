
import { useCallback } from "react";
import * as Tone from "tone";
import { DrumKitType } from "./types";
import { loadKitSamples, disposePlayers } from "./audioUtils";
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
      
      setSelectedKit(kitId);
      setPlayers(players);
      setIsLoaded(true);
      
      console.log(`Loaded ${kitId} kit successfully with ${Object.keys(players).length} samples`);
      return true;
    } catch (error) {
      console.error(`Failed to load ${kitId} kit:`, error);
      setIsLoaded(false);
      
      toast({
        title: "Kit Loading Failed",
        description: `Could not load the ${kitId} drum kit`,
        variant: "destructive"
      });
      
      return false;
    }
  }, [state.mainVolume, state.players, updateCurrentKit, setSelectedKit, setPlayers, setIsLoaded, toast, volumeNodeRef]);

  return { loadKit };
};
