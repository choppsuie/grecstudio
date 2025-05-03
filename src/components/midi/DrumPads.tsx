
import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, Settings, Music, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDrumKit, DrumKitType } from "@/hooks/useDrumKit";

const DrumPads: React.FC = () => {
  const { toast } = useToast();
  const [volume, setVolume] = useState(80);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const {
    currentPads,
    selectedKit,
    availableKits,
    isLoaded,
    loadKit,
    playSound,
    setVolume: setDrumVolume
  } = useDrumKit();

  // Initialize the drum kit with error handling
  useEffect(() => {
    const initKit = async () => {
      try {
        await loadKit(selectedKit as DrumKitType);
      } catch (error) {
        console.error("Failed to load initial drum kit:", error);
        toast({
          title: "Loading Error",
          description: "Failed to load drum samples. Check your internet connection.",
          variant: "destructive"
        });
      }
    };
    
    initKit();
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

  const handleKitChange = async (kitId: DrumKitType) => {
    try {
      setIsRetrying(false);
      await loadKit(kitId);
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
      await Tone.start();
      await loadKit(selectedKit as DrumKitType);
      setIsRetrying(false);
    } catch (error) {
      setIsRetrying(false);
      toast({
        title: "Loading Error",
        description: "Still unable to load samples. Please check your connection.",
        variant: "destructive"
      });
    }
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
              onClick={() => handleKitChange(kit.id as DrumKitType)}
              disabled={!isLoaded && selectedKit !== kit.id || isRetrying}
            >
              {kit.name}
            </Button>
          ))}
        </div>
      </div>
      
      {!isLoaded ? (
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <div className="text-cyber-purple/70 text-sm">
            {isRetrying ? 'Retrying...' : 'Failed to load drum samples'}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            disabled={isRetrying}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Loading...' : 'Retry'}
          </Button>
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
              onClick={() => playSound(pad.id)}
              disabled={!isLoaded}
            >
              <span className="text-xs font-bold mb-1">{pad.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-dark/30">
                {pad.key.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex justify-between">
        <Button size="sm" variant="outline">
          <Settings className="w-4 h-4 mr-1" />
          Settings
        </Button>
        <Button size="sm" variant="outline">
          <Music className="w-4 h-4 mr-1" />
          Pattern Editor
        </Button>
      </div>
    </div>
  );
};

export default DrumPads;
