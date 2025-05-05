
import React, { useState, useEffect } from "react";
import { useDrumKit } from "@/hooks/useDrumKit";
import { DrumKitType } from "@/hooks/drum-machine/types";

// Import refactored components
import DrumControls from "./drum-machine/DrumControls";
import DrumInitializer from "./drum-machine/DrumInitializer";
import DrumPadGrid from "./drum-machine/DrumPadGrid";
import PatternEditor from "./drum-machine/PatternEditor";
import DrumFooter from "./drum-machine/DrumFooter";
import { useDrumPatternSequencer } from "./drum-machine/useDrumPatternSequencer";
import { useDrumKeyboardHandler } from "./drum-machine/useDrumKeyboardHandler";

// Define pattern interface for drum sequences
export interface DrumPattern {
  name: string;
  beats: number;
  steps: Record<string, boolean[]>;
}

const DrumPads: React.FC = () => {
  const [volume, setVolume] = useState(80);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showPatternEditor, setShowPatternEditor] = useState(false);
  
  // Use our refactored hook
  const {
    currentPads,
    selectedKit,
    availableKits,
    isLoaded,
    loadKit,
    playSound,
    setVolume: setDrumVolume,
    forceInitialize
  } = useDrumKit();

  // Use our custom hooks
  const {
    isPlaying,
    currentStep,
    currentPattern,
    setCurrentPattern,
    toggleStep,
    togglePlay,
    clearPattern,
    savePattern
  } = useDrumPatternSequencer(isLoaded, playSound);

  const { activeKey } = useDrumKeyboardHandler(currentPads, isLoaded, playSound);

  // Initialize pattern steps for all pads
  useEffect(() => {
    if (currentPads.length > 0 && Object.keys(currentPattern.steps).length === 0) {
      const initialSteps: Record<string, boolean[]> = {};
      currentPads.forEach(pad => {
        initialSteps[pad.id] = Array(16).fill(false);
      });
      
      setCurrentPattern(prev => ({
        ...prev,
        steps: initialSteps
      }));
    }
  }, [currentPads, currentPattern.steps]);

  // Update volume when slider changes
  useEffect(() => {
    setDrumVolume(volume);
  }, [volume, setDrumVolume]);

  const handleKitChange = async (kitId: string) => {
    try {
      setIsRetrying(false);
      console.log("Changing kit to:", kitId);
      // Fix: Cast the kitId to DrumKitType
      await loadKit(kitId as DrumKitType);
    } catch (error) {
      console.error("Failed to load drum kit:", error);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      console.log("Retrying initialization...");
      const success = await forceInitialize();
      setIsRetrying(false);
    } catch (error) {
      setIsRetrying(false);
    }
  };

  const handlePadClick = (padId: string) => {
    console.log("Pad clicked:", padId);
    playSound(padId);
  };

  return (
    <div className="p-2 bg-cyber-dark rounded-md border border-cyber-purple/40">
      <DrumControls
        selectedKit={selectedKit}
        availableKits={availableKits}
        volume={volume}
        isRetrying={isRetrying}
        isLoaded={isLoaded}
        onKitChange={handleKitChange}
        onVolumeChange={(values) => setVolume(values[0])}
        onRetry={handleRetry}
      />
      
      {!isLoaded ? (
        <DrumInitializer isRetrying={isRetrying} onRetry={handleRetry} />
      ) : showPatternEditor ? (
        <PatternEditor
          currentPattern={currentPattern}
          currentStep={currentStep}
          isPlaying={isPlaying}
          currentPads={currentPads}
          togglePlay={togglePlay}
          clearPattern={clearPattern}
          savePattern={savePattern}
          toggleStep={toggleStep}
        />
      ) : (
        <DrumPadGrid 
          pads={currentPads} 
          activeKey={activeKey} 
          isLoaded={isLoaded} 
          onPadClick={handlePadClick} 
        />
      )}
      
      <DrumFooter
        showPatternEditor={showPatternEditor}
        onTogglePatternEditor={() => setShowPatternEditor(!showPatternEditor)}
      />
    </div>
  );
};

export default DrumPads;
