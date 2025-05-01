
import { useState, useMemo } from "react";
import * as Tone from "tone";
import { useToast } from '@/hooks/use-toast';

export type DrumKitType = "basic" | "tr808" | "tr909" | "acoustic";

export interface DrumPad {
  id: string;
  name: string;
  soundUrl: string;
  color: string;
  key: string;
}

interface DrumKit {
  id: DrumKitType;
  name: string;
  pads: DrumPad[];
}

// Define sound libraries for different drum kits
const drumKits: Record<DrumKitType, DrumKit> = {
  basic: {
    id: "basic",
    name: "Basic Kit",
    pads: [
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
    ]
  },
  tr808: {
    id: "tr808",
    name: "TR-808",
    pads: [
      { id: "kick", name: "808 Kick", soundUrl: "https://static.wixstatic.com/mp3/309238_108879d3f41a490f9b295fca3c1ca3fb.mp3", color: "#FF3131", key: "1" },
      { id: "snare", name: "808 Snare", soundUrl: "https://static.wixstatic.com/mp3/309238_08963837e638410ea7fa9a835b17c364.mp3", color: "#FF5E5E", key: "2" },
      { id: "clap", name: "808 Clap", soundUrl: "https://static.wixstatic.com/mp3/309238_c1f925cb028e4d59b60a01f106e211e7.mp3", color: "#FF8A8A", key: "3" },
      { id: "rimshot", name: "Rimshot", soundUrl: "https://static.wixstatic.com/mp3/309238_17c7d245be284f8c8efe9ff5a5baa7d9.mp3", color: "#FFB6B6", key: "4" },
      { id: "closedhat", name: "Closed Hat", soundUrl: "https://static.wixstatic.com/mp3/309238_2486568276d24015b739d5ef6f22ec6f.mp3", color: "#4D4DFF", key: "q" },
      { id: "openhat", name: "Open Hat", soundUrl: "https://static.wixstatic.com/mp3/309238_adb33ef53fe24f22891c3bc1ab273ce8.mp3", color: "#7979FF", key: "w" },
      { id: "cowbell", name: "Cowbell", soundUrl: "https://static.wixstatic.com/mp3/309238_4e0c66217bbc4a529269069089528938.mp3", color: "#A5A5FF", key: "e" },
      { id: "conga", name: "Conga", soundUrl: "https://static.wixstatic.com/mp3/309238_da52645676674e18ac10c309649da7fa.mp3", color: "#D1D1FF", key: "r" },
      { id: "tom", name: "808 Tom", soundUrl: "https://static.wixstatic.com/mp3/309238_258a4875aea6463ea45ee15096c639f5.mp3", color: "#00CC00", key: "a" },
      { id: "maracas", name: "Maracas", soundUrl: "https://static.wixstatic.com/mp3/309238_90543874b6b842a9b5f5353141ef3cae.mp3", color: "#33FF33", key: "s" },
      { id: "cymbal", name: "Cymbal", soundUrl: "https://static.wixstatic.com/mp3/309238_9522ac0ef0984e4589e4170d467a6e2f.mp3", color: "#66FF66", key: "d" },
      { id: "claves", name: "Claves", soundUrl: "https://static.wixstatic.com/mp3/309238_a500ad3dd6844b50ac6ea84c7ed3c238.mp3", color: "#99FF99", key: "f" },
    ]
  },
  tr909: {
    id: "tr909",
    name: "TR-909",
    pads: [
      { id: "kick", name: "909 Kick", soundUrl: "https://static.wixstatic.com/mp3/309238_28e3b2c563c04dc7bc2e318a909e952e.mp3", color: "#FF8000", key: "1" },
      { id: "snare", name: "909 Snare", soundUrl: "https://static.wixstatic.com/mp3/309238_ff5ff43b9fce4026bdacf94caca763a9.mp3", color: "#FFA040", key: "2" },
      { id: "clap", name: "909 Clap", soundUrl: "https://static.wixstatic.com/mp3/309238_11305c7c71c043b5b71efd5e949c7bf4.mp3", color: "#FFC080", key: "3" },
      { id: "rim", name: "909 Rim", soundUrl: "https://static.wixstatic.com/mp3/309238_31d7c2c0b49a42ecba5448bfbaada346.mp3", color: "#FFE0C0", key: "4" },
      { id: "closedhat", name: "909 CH", soundUrl: "https://static.wixstatic.com/mp3/309238_972c905a130440b6bc642e0c8092ef11.mp3", color: "#8000FF", key: "q" },
      { id: "openhat", name: "909 OH", soundUrl: "https://static.wixstatic.com/mp3/309238_060081c051434cc0a395f2ecd9fc3a01.mp3", color: "#A040FF", key: "w" },
      { id: "crash", name: "909 Crash", soundUrl: "https://static.wixstatic.com/mp3/309238_bf622a1c776b453392367ccc8ae09cae.mp3", color: "#C080FF", key: "e" },
      { id: "ride", name: "909 Ride", soundUrl: "https://static.wixstatic.com/mp3/309238_c80dc23c208f4b438efb0573fc2055d3.mp3", color: "#E0C0FF", key: "r" },
      { id: "lowtom", name: "Low Tom", soundUrl: "https://static.wixstatic.com/mp3/309238_d6eec87b2eae4e0c8bebe5c0a3aa5b5e.mp3", color: "#00CCCC", key: "a" },
      { id: "midtom", name: "Mid Tom", soundUrl: "https://static.wixstatic.com/mp3/309238_f6d217fe55844cc7aae493c4f41da233.mp3", color: "#40E0E0", key: "s" },
      { id: "hitom", name: "Hi Tom", soundUrl: "https://static.wixstatic.com/mp3/309238_fcf94b990b1f485398ca6d35184b2817.mp3", color: "#80F0F0", key: "d" },
      { id: "shaker", name: "Shaker", soundUrl: "https://static.wixstatic.com/mp3/309238_cfc2a413f66e4544b8fc1874057b1b1e.mp3", color: "#C0FFFF", key: "f" },
    ]
  },
  acoustic: {
    id: "acoustic",
    name: "Acoustic",
    pads: [
      { id: "kick", name: "Kick", soundUrl: "https://static.wixstatic.com/mp3/309238_9e291b0f2abe4d1ca1e7f59aff74a6cc.mp3", color: "#8C1BAB", key: "1" },
      { id: "snare", name: "Snare", soundUrl: "https://static.wixstatic.com/mp3/309238_2da1e10e4a724e879e3c660ac71baed5.mp3", color: "#AB1B86", key: "2" },
      { id: "rimshot", name: "Rim Shot", soundUrl: "https://static.wixstatic.com/mp3/309238_62f6cd334afb4cf0b286d72602fb2b5c.mp3", color: "#D71B71", key: "3" },
      { id: "sidestick", name: "Side Stick", soundUrl: "https://static.wixstatic.com/mp3/309238_d1b0228f9db94e8f9c55c5ab81eb95cc.mp3", color: "#E01B5C", key: "4" },
      { id: "hihat", name: "Closed Hat", soundUrl: "https://static.wixstatic.com/mp3/309238_c17c01dbebde47ebb8d528c551927126.mp3", color: "#EC8B5E", key: "q" },
      { id: "openhat", name: "Open Hat", soundUrl: "https://static.wixstatic.com/mp3/309238_2672c8bd2ff14d9e88f626cb8883a435.mp3", color: "#FFBC5E", key: "w" },
      { id: "crash", name: "Crash", soundUrl: "https://static.wixstatic.com/mp3/309238_7d3b29342c9140b297eb8eb41eff353e.mp3", color: "#FFDF5E", key: "e" },
      { id: "ride", name: "Ride", soundUrl: "https://static.wixstatic.com/mp3/309238_adde4ade609249c3a7e47e754213a1f5.mp3", color: "#EDEF85", key: "r" },
      { id: "floortom", name: "Floor Tom", soundUrl: "https://static.wixstatic.com/mp3/309238_460b70caeeff41658000db4c197a5768.mp3", color: "#9EFF5E", key: "a" },
      { id: "midtom", name: "Mid Tom", soundUrl: "https://static.wixstatic.com/mp3/309238_bcfe642f440440248b856cddce526073.mp3", color: "#5EFF7F", key: "s" },
      { id: "hightom", name: "High Tom", soundUrl: "https://static.wixstatic.com/mp3/309238_d6eb38cd18414f9d8a2ab80a290b9e86.mp3", color: "#5EFFAB", key: "d" },
      { id: "cowbell", name: "Cowbell", soundUrl: "https://static.wixstatic.com/mp3/309238_b6179406bd92462981d047cd6ad83850.mp3", color: "#5EFFD6", key: "f" },
    ]
  }
};

export function useDrumKit() {
  const [selectedKit, setSelectedKit] = useState<DrumKitType>("basic");
  const [players, setPlayers] = useState<Record<string, Tone.Player>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [mainVolume, setMainVolume] = useState<Tone.Volume | null>(null);
  const { toast } = useToast();

  // The current set of drum pads based on selected kit
  const currentPads = useMemo(() => drumKits[selectedKit].pads, [selectedKit]);
  
  // List of available kits
  const availableKits = useMemo(() => 
    Object.values(drumKits).map(kit => ({ id: kit.id, name: kit.name })), 
    []
  );

  // Load samples for the selected kit
  const loadKit = async (kitId: DrumKitType) => {
    setIsLoaded(false);
    
    // Dispose old players
    Object.values(players).forEach(player => {
      player.dispose();
    });
    
    // Create volume control if it doesn't exist
    let volume = mainVolume;
    if (!volume) {
      volume = new Tone.Volume(-10).toDestination();
      setMainVolume(volume);
    }
    
    // Create new players
    const newPlayers: Record<string, Tone.Player> = {};
    const selectedDrumKit = drumKits[kitId];
    
    try {
      await Tone.start();
      
      // Create a player for each pad
      for (const pad of selectedDrumKit.pads) {
        const player = new Tone.Player({
          url: pad.soundUrl,
          onload: () => {
            console.log(`Loaded ${pad.name} for ${kitId} kit`);
          }
        }).connect(volume);
        
        newPlayers[pad.id] = player;
      }
      
      // Wait for all samples to load
      await Tone.loaded();
      
      setPlayers(newPlayers);
      setSelectedKit(kitId);
      setIsLoaded(true);
      
      toast({
        title: "Drum Kit Loaded",
        description: `${selectedDrumKit.name} is ready to play`
      });
    } catch (error) {
      console.error("Error loading drum kit:", error);
      toast({
        title: "Loading Error",
        description: "Failed to load drum samples",
        variant: "destructive"
      });
    }
  };

  // Play a sound by pad ID
  const playSound = (id: string) => {
    if (!players[id] || !isLoaded) return;
    
    // Stop if already playing
    if (players[id].state === "started") {
      players[id].stop();
    }
    
    // Play from beginning
    players[id].start();
  };

  // Update volume level
  const setVolume = (value: number) => {
    if (mainVolume) {
      const dbValue = ((value / 100) * 30) - 30; // Convert to dB scale
      mainVolume.volume.value = dbValue;
    }
  };

  return {
    currentPads,
    selectedKit,
    availableKits,
    isLoaded,
    loadKit,
    playSound,
    setVolume
  };
}
