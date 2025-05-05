
import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, Settings, Music, RefreshCw, Save, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDrumKit } from "@/hooks/useDrumKit";
import { DrumKitType } from "@/hooks/drum-machine/types";
import { cn } from "@/lib/utils";

// Define pattern interface for drum sequences
interface DrumPattern {
  name: string;
  beats: number;
  steps: Record<string, boolean[]>;
}

const STEPS = 16;

const DrumPads: React.FC = () => {
  const { toast } = useToast();
  const [volume, setVolume] = useState(80);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showPatternEditor, setShowPatternEditor] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<DrumPattern>({
    name: "Pattern 1",
    beats: 4,
    steps: {}
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sequencerRef, setSequencerRef] = useState<Tone.Sequence | null>(null);
  
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

  // Initialize pattern steps for all pads
  useEffect(() => {
    if (currentPads.length > 0 && Object.keys(currentPattern.steps).length === 0) {
      const initialSteps: Record<string, boolean[]> = {};
      currentPads.forEach(pad => {
        initialSteps[pad.id] = Array(STEPS).fill(false);
      });
      
      setCurrentPattern(prev => ({
        ...prev,
        steps: initialSteps
      }));
    }
  }, [currentPads, currentPattern.steps]);

  // Initialize the drum kit with error handling
  useEffect(() => {
    const initKit = async () => {
      try {
        console.log("Initializing drum kit in DrumPads component");
        await Tone.start();
        console.log("Tone context started:", Tone.context.state);
        await loadKit(selectedKit);
      } catch (error) {
        console.error("Failed to load initial drum kit:", error);
      }
    };
    
    initKit();

    return () => {
      if (sequencerRef) {
        sequencerRef.stop();
        sequencerRef.dispose();
      }
    };
  }, []);

  // Update volume when slider changes
  useEffect(() => {
    setDrumVolume(volume);
  }, [volume, setDrumVolume]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pad = currentPads.find(pad => pad.key.toLowerCase() === e.key.toLowerCase());
      if (pad && isLoaded) {
        playSound(pad.id);
        setActiveKey(pad.key);
        console.log(`Key pressed: ${e.key}, playing sound: ${pad.id}`);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentPads, isLoaded, playSound]);

  // Setup sequencer
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
        [...Array(STEPS).keys()],
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

  const handleKitChange = async (kitId: string) => {
    try {
      setIsRetrying(false);
      console.log("Changing kit to:", kitId);
      // Fix: Cast the kitId to DrumKitType
      await loadKit(kitId as DrumKitType);
    } catch (error) {
      console.error("Failed to load drum kit:", error);
      toast({
        title: "Loading Error",
        description: `Failed to load ${kitId} kit. Try again later.`,
        variant: "destructive"
      });
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      console.log("Retrying initialization...");
      const success = await forceInitialize();
      setIsRetrying(false);
      
      if (success) {
        toast({
          title: "Success",
          description: "Drum kit loaded successfully",
        });
      } else {
        toast({
          title: "Loading Error",
          description: "Still unable to load samples. Please check your connection.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setIsRetrying(false);
      toast({
        title: "Loading Error",
        description: "Failed to initialize audio. Try clicking the retry button again.",
        variant: "destructive"
      });
    }
  };

  const toggleStep = (padId: string, step: number) => {
    setCurrentPattern(prev => {
      const newSteps = { ...prev.steps };
      if (!newSteps[padId]) {
        newSteps[padId] = Array(STEPS).fill(false);
      }
      newSteps[padId] = [...newSteps[padId]];
      newSteps[padId][step] = !newSteps[padId][step];
      return { ...prev, steps: newSteps };
    });
  };

  const togglePlay = async () => {
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
  };

  const clearPattern = () => {
    const emptySteps: Record<string, boolean[]> = {};
    currentPads.forEach(pad => {
      emptySteps[pad.id] = Array(STEPS).fill(false);
    });
    
    setCurrentPattern(prev => ({
      ...prev,
      steps: emptySteps
    }));
    
    toast({
      title: "Pattern Cleared",
      description: "All steps have been cleared from the pattern."
    });
  };

  const savePattern = () => {
    // In a real app, this would save to a database
    // For now, just show a toast
    toast({
      title: "Pattern Saved",
      description: `${currentPattern.name} has been saved.`
    });
  };

  const handlePadClick = (padId: string) => {
    console.log("Pad clicked:", padId);
    playSound(padId);
  };

  return (
    <div className="p-2 bg-cyber-dark rounded-md border border-cyber-purple/40">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-cyber-purple text-lg font-bold">Drum Machine</h3>
        <div className="flex items-center space-x-2">
          <Volume2 className="text-cyber-purple w-4 h-4" />
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            className="w-24"
            onValueChange={(values) => setVolume(values[0])}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {availableKits.map((kit) => (
            <Button
              key={kit.id}
              variant={selectedKit === kit.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleKitChange(kit.id)}
              disabled={!isLoaded && selectedKit !== kit.id || isRetrying}
              className={selectedKit === kit.id ? "bg-cyber-purple text-white" : "text-cyber-purple"}
            >
              {kit.name}
            </Button>
          ))}
        </div>
      </div>
      
      {!isLoaded ? (
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <div className="text-cyber-purple text-sm">
            {isRetrying ? 'Retrying...' : 'Failed to load drum samples'}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            disabled={isRetrying}
            className="text-cyber-purple border-cyber-purple"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Loading...' : 'Click to Initialize Audio'}
          </Button>
        </div>
      ) : showPatternEditor ? (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-cyber-purple">Pattern Editor</h4>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={togglePlay} 
                className={isPlaying ? "bg-cyber-purple/20 text-cyber-purple" : "text-cyber-purple"}
              >
                <PlayCircle className="w-4 h-4 mr-1" />
                {isPlaying ? "Stop" : "Play"}
              </Button>
              <Button size="sm" variant="outline" onClick={clearPattern} className="text-cyber-purple">
                Clear
              </Button>
              <Button size="sm" variant="outline" onClick={savePattern} className="text-cyber-purple">
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
          
          <div className="bg-cyber-darker p-2 rounded-md">
            <div className="grid grid-cols-16 gap-1 mb-1">
              {[...Array(STEPS)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "text-center text-xs font-mono h-6 flex items-center justify-center",
                    currentStep === i && isPlaying ? "bg-cyber-purple/30 text-white" : "text-cyber-purple"
                  )}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            
            {currentPads.map((pad) => (
              <div key={pad.id} className="flex items-center mb-1">
                <div 
                  className="w-12 text-xs truncate mr-1 py-1 px-2 text-white"
                  style={{ color: pad.color }}
                >
                  {pad.name}
                </div>
                <div className="grid grid-cols-16 gap-1 flex-1">
                  {(currentPattern.steps[pad.id] || Array(STEPS).fill(false)).map((active, step) => (
                    <div
                      key={`${pad.id}-${step}`}
                      className={cn(
                        "h-6 rounded cursor-pointer transition-all",
                        active ? "bg-opacity-80" : "bg-opacity-10",
                        currentStep === step && isPlaying ? "ring-1 ring-white" : ""
                      )}
                      style={{ 
                        backgroundColor: active ? pad.color : `${pad.color}40`
                      }}
                      onClick={() => toggleStep(pad.id, step)}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {currentPads.map((pad) => (
            <button
              key={pad.id}
              className={`aspect-square rounded-md flex flex-col items-center justify-center transition-all duration-100 p-2 ${
                activeKey === pad.key ? 'scale-95 brightness-150' : 'hover:brightness-110'
              }`}
              style={{ 
                backgroundColor: `${pad.color}40`, 
                borderLeft: `2px solid ${pad.color}80`,
                borderBottom: `2px solid ${pad.color}80`
              }}
              onClick={() => handlePadClick(pad.id)}
              disabled={!isLoaded}
            >
              <span className="text-xs font-bold mb-1 text-white">{pad.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-dark/30 text-cyber-purple">
                {pad.key.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex justify-between">
        <Button size="sm" variant="outline" className="text-cyber-purple">
          <Settings className="w-4 h-4 mr-1" />
          Settings
        </Button>
        <Button 
          size="sm" 
          variant={showPatternEditor ? "default" : "outline"}
          onClick={() => setShowPatternEditor(!showPatternEditor)}
          className={showPatternEditor ? "bg-cyber-purple text-white" : "text-cyber-purple"}
        >
          <Music className="w-4 h-4 mr-1" />
          {showPatternEditor ? "Hide Editor" : "Pattern Editor"}
        </Button>
      </div>
    </div>
  );
};

export default DrumPads;
