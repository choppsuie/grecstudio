
import { useState, useRef } from "react";
import * as Tone from "tone";
import { DrumKitType, DrumKit, DrumMachineState } from "./types";
import { getKit } from "./drumKits";

export const useDrumKitState = () => {
  const [state, setState] = useState<DrumMachineState>({
    selectedKit: 'tr909' as DrumKitType,
    players: {},
    isLoaded: false,
    mainVolume: null
  });

  const [currentKit, setCurrentKit] = useState<DrumKit | null>(null);
  const [availableKits, setAvailableKits] = useState<{ id: DrumKitType; name: string }[]>([]);
  const volumeNodeRef = useRef<Tone.Volume | null>(null);
  
  // State update methods
  const updateState = (updates: Partial<DrumMachineState>) => {
    setState(prevState => ({
      ...prevState,
      ...updates
    }));
  };
  
  const setSelectedKit = (kitId: DrumKitType) => {
    updateState({ selectedKit: kitId });
  };
  
  const setPlayers = (players: Record<string, Tone.Player>) => {
    updateState({ players });
  };
  
  const setIsLoaded = (isLoaded: boolean) => {
    updateState({ isLoaded });
  };
  
  const setMainVolume = (volume: Tone.Volume | null) => {
    updateState({ mainVolume: volume });
  };
  
  const updateCurrentKit = (kitId: DrumKitType) => {
    const kit = getKit(kitId);
    setCurrentKit(kit);
  };
  
  const setKitList = (kits: { id: DrumKitType; name: string }[]) => {
    setAvailableKits(kits);
  };

  return {
    state,
    currentKit,
    availableKits,
    volumeNodeRef,
    updateState,
    setSelectedKit,
    setPlayers,
    setIsLoaded,
    setMainVolume,
    updateCurrentKit,
    setKitList
  };
};
