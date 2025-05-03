
import React, { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { usePlayback } from '@/contexts/PlaybackContext';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Volume2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Metronome = () => {
  const { isPlaying, bpm, toneInitialized } = usePlayback();
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(75);
  const [flash, setFlash] = useState(false);
  
  const clickRef = useRef<Tone.Player | null>(null);
  const accentRef = useRef<Tone.Player | null>(null);
  const volumeNodeRef = useRef<Tone.Volume | null>(null);
  const eventIdRef = useRef<number | null>(null);
  const beatCountRef = useRef<number>(0);
  
  // Initialize metronome sounds
  useEffect(() => {
    if (!toneInitialized) return;
    
    // Create volume node
    const volumeNode = new Tone.Volume((volume / 100) * 24 - 24).toDestination();
    volumeNodeRef.current = volumeNode;
    
    // Create click and accent sounds
    const click = new Tone.Player({
      url: "https://tonejs.github.io/audio/drum-samples/side-stick.mp3",
      volume: -6
    }).connect(volumeNode);
    
    const accent = new Tone.Player({
      url: "https://tonejs.github.io/audio/drum-samples/kick.mp3",
      volume: -3
    }).connect(volumeNode);
    
    clickRef.current = click;
    accentRef.current = accent;
    
    return () => {
      // Clean up on unmount
      if (clickRef.current) clickRef.current.dispose();
      if (accentRef.current) accentRef.current.dispose();
      if (volumeNodeRef.current) volumeNodeRef.current.dispose();
      if (eventIdRef.current !== null) Tone.Transport.clear(eventIdRef.current);
    };
  }, [toneInitialized]);
  
  // Update volume
  useEffect(() => {
    if (volumeNodeRef.current) {
      // Convert 0-100 scale to -24 to 0dB
      volumeNodeRef.current.volume.value = (volume / 100) * 24 - 24;
    }
  }, [volume]);
  
  // Toggle metronome on/off
  useEffect(() => {
    if (!toneInitialized || !clickRef.current || !accentRef.current) return;

    if (enabled) {
      // Create recurring event for metronome
      const eventId = Tone.Transport.scheduleRepeat((time) => {
        // Play accent on first beat of measure, click on other beats
        if (beatCountRef.current % 4 === 0) {
          accentRef.current?.start(time);
          // Flash visual indicator
          setFlash(true);
          setTimeout(() => setFlash(false), 100);
        } else {
          clickRef.current?.start(time);
        }
        
        // Increment beat counter
        beatCountRef.current = (beatCountRef.current + 1) % 4;
      }, "4n"); // Quarter note interval
      
      eventIdRef.current = eventId;
    } else {
      // Clear the scheduled events
      if (eventIdRef.current !== null) {
        Tone.Transport.clear(eventIdRef.current);
        eventIdRef.current = null;
      }
    }
    
    return () => {
      if (eventIdRef.current !== null) {
        Tone.Transport.clear(eventIdRef.current);
      }
    };
  }, [enabled, toneInitialized]);
  
  return (
    <div className="flex items-center space-x-3">
      <div 
        className={cn(
          "w-3 h-3 rounded-full transition-colors duration-100",
          flash ? "bg-cyber-red" : "bg-cyber-purple/30"
        )}
      />
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-cyber-purple/70" />
        <Switch 
          checked={enabled}
          onCheckedChange={setEnabled}
          className="data-[state=checked]:bg-cyber-purple"
        />
        <div className="flex items-center space-x-1">
          <Volume2 className="h-3 w-3 text-cyber-purple/70" />
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            className="w-16"
            onValueChange={(val) => setVolume(val[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default Metronome;
