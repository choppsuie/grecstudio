
import { DrumKit, DrumKitType, DrumKitInfo } from "./drum-machine/types";
import { useDrumKitState } from "./drum-machine/useDrumKitState";
import { useDrumKitLoader } from "./drum-machine/useDrumKitLoader";
import { useDrumSoundPlayer } from "./drum-machine/useDrumSoundPlayer";
import { useDrumKitInitializer } from "./drum-machine/useDrumKitInitializer";

export const useDrumKit = () => {
  // Use the separated state hook
  const {
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
  } = useDrumKitState();

  // Use the separated loader hook
  const { loadKit } = useDrumKitLoader(
    state,
    volumeNodeRef,
    setPlayers,
    setIsLoaded,
    updateCurrentKit,
    setSelectedKit
  );

  // Use the separated sound player hook
  const { playSound, setVolume } = useDrumSoundPlayer(state);

  // Use the separated initializer hook
  const { forceInitialize } = useDrumKitInitializer(
    state,
    volumeNodeRef,
    setMainVolume,
    setKitList,
    updateCurrentKit,
    loadKit
  );

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
