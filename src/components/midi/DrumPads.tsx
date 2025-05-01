
import React, { useState, useEffect, useCallback } from "react";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, Settings, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DrumPad {
  id: string;
  name: string;
  soundUrl: string;
  color: string;
  key: string;
}

const DrumPads: React.FC = () => {
  const { toast } = useToast();
  const [volume, setVolume] = useState(80);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedKit, setSelectedKit] = useState("basic");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const drumPads: DrumPad[] = [
    { id: "kick", name: "Kick", soundUrl: "https://tonejs.github.io/audio/drum-samples/kick.mp3", color: "#F9636F", key: "1" },
    { id: "snare", name: "Snare", soundUrl: "https://tonejs.github.io/audio/drum-samples/snare.mp3", color: "#8B5CF6", key: "2" },
    { id: "hihat", name: "Hi-Hat", soundUrl: "https://tonejs.github.io/audio/drum-samples/hihat.mp3", color: "#0CFCFC", key: "3" },
    { id: "clap", name: "Clap", soundUrl: "https://tonejs.github.io/audio/drum-samples/clap.mp3", color: "#F97316", key: "4" },
    { id: "tom1", name: "Tom 1", soundUrl: "https://tonejs.github.io/audio/drum-samples/tom1.mp3", color: "#3C71D0", key: "q" },
    { id: "tom2", name: "Tom 2", soundUrl: "https://tonejs.github.io/audio/drum-samples/tom2.mp3", color: "#D946EF", key: "w" },
    { id: "crash", name: "Crash", soundUrl: "https://tonejs.github.io/audio/drum-samples/crash.mp3", color: "#0EA5E9", key: "e" },
    { id: "ride", name: "Ride", soundUrl: "https://tonejs.github.io/audio/drum-samples/ride.mp3", color: "#ED213A", key: "r" },
    { id: "perc1", name: "Perc 1", soundUrl: "https://tonejs.github.io/audio/drum-samples/perc1.mp3", color: "#F9636F", key: "a" },
    { id: "perc2", name: "Perc 2", soundUrl: "https://tonejs.github.io/audio/drum-samples/perc2.mp3", color: "#8B5CF6", key: "s" },
    { id: "fx1", name: "FX 1", soundUrl: "https://tonejs.github.io/audio/drum-samples/fx.mp3", color: "#0CFCFC", key: "d" },
    { id: "fx2", name: "FX 2", soundUrl: "https://tonejs.github.io/audio/drum-samples/loop.mp3", color: "#F97316", key: "f" },
  ];

  // Initialize Tone.js players
  const [players, setPlayers] = useState<Record<string, Tone.Player>>({});
  const [mainVolume, setMainVolume] = useState<Tone.Volume | null>(null);

  useEffect(() => {
    const initSamples = async () => {
      await Tone.start();
      
      const volume = new Tone.Volume(-10).toDestination();
      setMainVolume(volume);

      const loadedPlayers: Record<string, Tone.Player> = {};
      
      for (const pad of drumPads) {
        const player = new Tone.Player({
          url: pad.soundUrl,
          onload: () => {
            console.log(`Loaded ${pad.name}`);
          }
        }).connect(volume);
        
        loadedPlayers[pad.id] = player;
      }
      
      setPlayers(loadedPlayers);
      setIsLoaded(true);
      
      toast({
        title: "Drum Kit Loaded",
        description: "Drum pads are ready to play"
      });
    };

    initSamples();

    return () => {
      // Clean up players when component unmounts
      Object.values(players).forEach(player => {
        player.dispose();
      });
      
      if (mainVolume) {
        mainVolume.dispose();
      }
    };
  }, []);

  // Update volume when slider changes
  useEffect(() => {
    if (mainVolume) {
      const dbValue = ((volume / 100) * 30) - 30; // Convert to dB scale
      mainVolume.volume.value = dbValue;
    }
  }, [volume, mainVolume]);

  // Keyboard event handling
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const pad = drumPads.find(pad => pad.key.toLowerCase() === e.key.toLowerCase());
    if (pad && players[pad.id]) {
      playSound(pad.id);
      setActiveKey(pad.key);
    }
  }, [players, drumPads]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setActiveKey(null);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const playSound = (id: string) => {
    if (!players[id]) return;
    
    // Stop if already playing
    if (players[id].state === "started") {
      players[id].stop();
    }
    
    // Play from the beginning
    players[id].start();
  };

  const kits = [
    { id: "basic", name: "Basic Kit" },
    { id: "tr808", name: "TR-808" },
    { id: "tr909", name: "TR-909" },
    { id: "acoustic", name: "Acoustic" }
  ];

  const handleKitChange = (kitId: string) => {
    setSelectedKit(kitId);
    toast({
      title: "Kit Changed",
      description: `Changed to ${kits.find(k => k.id === kitId)?.name}`
    });
    // In a real app, this would load new samples
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
          {kits.map((kit) => (
            <Button
              key={kit.id}
              variant={selectedKit === kit.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleKitChange(kit.id)}
            >
              {kit.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {drumPads.map((pad) => (
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
