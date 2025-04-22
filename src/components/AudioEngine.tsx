
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

interface AudioEngineProps {
  isPlaying: boolean;
  tracks: {
    id: string;
    type: string;
    muted: boolean;
    soloed: boolean;
    volume: number;
  }[];
}

const AudioEngine = ({ isPlaying, tracks }: AudioEngineProps) => {
  const [initialized, setInitialized] = useState(false);
  const playersRef = useRef<Record<string, Tone.Player>>({});
  const masterVolumeRef = useRef<Tone.Volume | null>(null);

  // Initialize Tone.js on first user interaction
  useEffect(() => {
    const initAudio = async () => {
      if (!initialized) {
        await Tone.start();
        console.log("Tone.js initialized");
        
        // Set up master volume
        masterVolumeRef.current = new Tone.Volume(-6).toDestination();
        
        // Create sample players for demo tracks
        const drumPlayer = new Tone.Player({
          url: "https://tonejs.github.io/audio/drum-samples/loops/ominous.mp3",
          loop: true,
        }).connect(masterVolumeRef.current);
        
        const bassPlayer = new Tone.Player({
          url: "https://tonejs.github.io/audio/drum-samples/breakbeat.mp3",
          loop: true,
        }).connect(masterVolumeRef.current);
        
        const synthPlayer = new Tone.Player({
          url: "https://tonejs.github.io/audio/berklee/gong_1.mp3",
          loop: true,
        }).connect(masterVolumeRef.current);
        
        const vocalsPlayer = new Tone.Player({
          url: "https://tonejs.github.io/audio/berklee/gurgling_theremin_1.mp3",
          loop: true,
        }).connect(masterVolumeRef.current);
        
        // Store players by track ID
        playersRef.current = {
          "1": drumPlayer,
          "2": bassPlayer,
          "3": synthPlayer,
          "4": vocalsPlayer,
        };
        
        setInitialized(true);
      }
    };
    
    initAudio();
    
    return () => {
      // Clean up players when component unmounts
      Object.values(playersRef.current).forEach(player => {
        player.stop();
        player.dispose();
      });
      
      if (masterVolumeRef.current) {
        masterVolumeRef.current.dispose();
      }
    };
  }, [initialized]);
  
  // Handle play/pause
  useEffect(() => {
    if (!initialized) return;
    
    const soloedTracks = tracks.filter(track => track.soloed);
    const hasSoloedTracks = soloedTracks.length > 0;
    
    Object.entries(playersRef.current).forEach(([trackId, player]) => {
      const track = tracks.find(t => t.id === trackId);
      
      if (!track) return;
      
      // Set volume based on track settings
      const volumeValue = track.volume / 100 * 30 - 30; // Convert 0-100 to -30 to 0 dB
      player.volume.value = volumeValue;
      
      // Handle muting logic
      const shouldBeMuted = track.muted || (hasSoloedTracks && !track.soloed);
      player.mute = shouldBeMuted;
      
      // Play or pause based on global playback state
      if (isPlaying && !player.state) {
        player.start();
      } else if (!isPlaying && player.state === "started") {
        player.stop();
      }
    });
  }, [isPlaying, tracks, initialized]);
  
  return null; // This is a non-visual component
};

export default AudioEngine;
