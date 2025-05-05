
import { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { useToast } from "@/hooks/use-toast";
import { DrumPattern } from '../DrumPads';

export const useDrumPatternSequencer = (
  isLoaded: boolean,
  playSound: (padId: string) => void
) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sequencerRef, setSequencerRef] = useState<Tone.Sequence | null>(null);
  const [currentPattern, setCurrentPattern] = useState<DrumPattern>({
    name: "Pattern 1",
    beats: 4,
    steps: {}
  });
  
  // Toggle step on/off for a specific pad
  const toggleStep = useCallback((padId: string, step: number) => {
    setCurrentPattern(prev => {
      const newSteps = { ...prev.steps };
      if (!newSteps[padId]) {
        newSteps[padId] = Array(16).fill(false);
      }
      newSteps[padId] = [...newSteps[padId]];
      newSteps[padId][step] = !newSteps[padId][step];
      return { ...prev, steps: newSteps };
    });
  }, []);

  // Toggle play/pause of the sequencer
  const togglePlay = useCallback(async () => {
    if (!isLoaded) {
      toast({
        title: "Error",
        description: "Drum samples not loaded. Please retry loading.",
        variant: "destructive"
      });
      return;
    }

    try {
      await Tone.start();
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Failed to start audio context:", error);
      toast({
        title: "Audio Error",
        description: "Failed to start audio playback. Click retry first.",
        variant: "destructive"
      });
    }
  }, [isLoaded, isPlaying, toast]);

  // Clear the pattern
  const clearPattern = useCallback(() => {
    const emptySteps: Record<string, boolean[]> = {};
    Object.keys(currentPattern.steps).forEach(padId => {
      emptySteps[padId] = Array(16).fill(false);
    });
    
    setCurrentPattern(prev => ({
      ...prev,
      steps: emptySteps
    }));
    
    toast({
      title: "Pattern Cleared",
      description: "All steps have been cleared from the pattern."
    });
  }, [currentPattern.steps, toast]);

  // Save the pattern (placeholder functionality)
  const savePattern = useCallback(() => {
    toast({
      title: "Pattern Saved",
      description: `${currentPattern.name} has been saved.`
    });
  }, [currentPattern.name, toast]);

  // Setup sequencer when play state changes
  useEffect(() => {
    if (isLoaded && isPlaying && !sequencerRef) {
      const sequence = new Tone.Sequence(
        (time, step) => {
          setCurrentStep(step);
          
          // Play sounds for this step
          Object.entries(currentPattern.steps).forEach(([padId, steps]) => {
            if (steps[step]) {
              playSound(padId);
            }
          });
        },
        [...Array(16).keys()],
        "16n"
      );
      
      sequence.start(0);
      setSequencerRef(sequence);
      
      if (Tone.Transport.state !== "started") {
        Tone.Transport.start();
      }
    } else if (!isPlaying && sequencerRef) {
      sequencerRef.stop();
      sequencerRef.dispose();
      setSequencerRef(null);
      
      if (Tone.Transport.state === "started") {
        Tone.Transport.pause();
      }
    }
    
    return () => {
      if (sequencerRef) {
        sequencerRef.stop();
        sequencerRef.dispose();
      }
    };
  }, [isLoaded, isPlaying, currentPattern.steps, playSound]);

  return {
    isPlaying,
    currentStep,
    currentPattern,
    setCurrentPattern,
    toggleStep,
    togglePlay,
    clearPattern,
    savePattern
  };
};
