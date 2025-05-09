
import { useState, useCallback } from 'react';
import * as Tone from 'tone';
import { useToast } from '@/hooks/use-toast';

export type PatternType = 'house' | 'trap' | 'techno' | 'hiphop' | 'ambient' | 'random';

interface DrumPattern {
  kick: boolean[];
  snare: boolean[];
  hihat: boolean[];
  clap: boolean[];
  tom: boolean[];
  perc: boolean[];
}

export function useBeatGenerator() {
  const { toast } = useToast();
  const [activePattern, setActivePattern] = useState<DrumPattern | null>(null);
  const [patternType, setPatternType] = useState<PatternType>('house');
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);

  // Generate a drum pattern based on selected type
  const generatePattern = useCallback((type: PatternType = 'house') => {
    let newPattern: DrumPattern = {
      kick: Array(16).fill(false),
      snare: Array(16).fill(false),
      hihat: Array(16).fill(false),
      clap: Array(16).fill(false),
      tom: Array(16).fill(false),
      perc: Array(16).fill(false)
    };
    
    // Helper for random generation with probability
    const randomStep = (probability: number) => Math.random() < probability;
    
    switch (type) {
      case 'house':
        // Four-on-the-floor kick pattern
        newPattern.kick = [true, false, false, false, true, false, false, false, 
                           true, false, false, false, true, false, false, false];
        // Offbeat hi-hats
        newPattern.hihat = [false, false, true, false, false, false, true, false,
                           false, false, true, false, false, false, true, false];
        // Snare on beats 2 and 4
        newPattern.snare = [false, false, false, false, true, false, false, false,
                           false, false, false, false, true, false, false, false];
        // Random claps
        newPattern.clap = [false, false, false, false, false, false, false, true,
                          false, false, false, false, false, false, true, false];
        break;
        
      case 'trap':
        // Trap-style 808 pattern
        newPattern.kick = [true, false, false, false, false, false, true, false,
                          false, false, true, false, false, true, false, false];
        // Fast hi-hats with varying density
        for (let i = 0; i < 16; i++) {
          // More dense hi-hats in the second half of the pattern
          newPattern.hihat[i] = i % 2 === 0 || (i > 8 && i % 3 === 0);
        }
        // Snare on beats 2 and 4
        newPattern.snare = [false, false, false, false, true, false, false, false,
                           false, false, false, false, true, false, true, false];
        break;
        
      case 'techno':
        // Pulsing kick pattern
        newPattern.kick = [true, false, false, false, true, false, false, false,
                          true, false, false, false, true, false, false, false];
        // Offbeat percussion
        newPattern.perc = [false, false, true, false, false, false, true, false,
                          false, true, false, false, false, false, true, true];
        // Hi-hats on every 16th note
        for (let i = 0; i < 16; i++) {
          newPattern.hihat[i] = i % 2 === 0;
        }
        // Clap on beats 2 and 4
        newPattern.clap = [false, false, false, false, true, false, false, false,
                          false, false, false, false, true, false, false, false];
        break;
        
      case 'hiphop':
        // Boom bap style
        newPattern.kick = [true, false, false, false, false, false, false, true,
                          false, false, true, false, false, false, false, false];
        // Snare on beats 2 and 4
        newPattern.snare = [false, false, false, false, true, false, false, false,
                           false, false, false, false, true, false, false, false];
        // Pitched tom hits
        newPattern.tom = [false, false, true, false, false, false, false, false,
                         false, true, false, false, false, false, true, false];
        break;
        
      case 'ambient':
        // Sparse, atmospheric pattern
        newPattern.kick = [true, false, false, false, false, false, false, false,
                          false, false, false, false, true, false, false, false];
        // Light hi-hats
        for (let i = 0; i < 16; i++) {
          newPattern.hihat[i] = i % 4 === 0;
        }
        // Occasional claps
        newPattern.clap = [false, false, false, false, false, false, false, true,
                          false, false, false, false, false, false, false, false];
        // Toms for atmosphere
        newPattern.tom = [false, false, false, false, false, false, true, false,
                         false, false, false, false, false, true, false, false];
        break;
        
      case 'random':
      default:
        // Completely random pattern
        for (let i = 0; i < 16; i++) {
          newPattern.kick[i] = randomStep(0.3);
          newPattern.snare[i] = randomStep(0.25);
          newPattern.hihat[i] = randomStep(0.5);
          newPattern.clap[i] = randomStep(0.15);
          newPattern.tom[i] = randomStep(0.1);
          newPattern.perc[i] = randomStep(0.2);
        }
        // Ensure there's at least one kick and snare
        newPattern.kick[0] = true;
        newPattern.snare[4] = true;
    }
    
    setActivePattern(newPattern);
    setPatternType(type);
    
    toast({
      title: "Pattern Generated",
      description: `Created a new ${type} pattern`,
    });
    
    return newPattern;
  }, [toast]);

  // Start playing the pattern
  const playPattern = useCallback(async (pattern: DrumPattern = activePattern!) => {
    if (!pattern) return;
    
    try {
      await Tone.start();
      Tone.Transport.bpm.value = bpm;
      
      // Create sampler for drum sounds
      const drumSampler = new Tone.Sampler({
        urls: {
          C2: "https://tonejs.github.io/audio/drum-samples/kicks/kick.wav",
          D2: "https://tonejs.github.io/audio/drum-samples/snare/snare.wav",
          E2: "https://tonejs.github.io/audio/drum-samples/hh/hh.wav",
          F2: "https://tonejs.github.io/audio/drum-samples/clap/clap.wav",
          G2: "https://tonejs.github.io/audio/drum-samples/tom/tom1.wav",
          A2: "https://tonejs.github.io/audio/drum-samples/808/808.wav",
        },
        onload: () => {
          console.log("Drum sampler loaded");
        },
      }).toDestination();
      
      // Create a sequence for each drum sound
      const kickSeq = new Tone.Sequence(
        (time, step) => {
          if (pattern.kick[step]) {
            drumSampler.triggerAttack("C2", time);
          }
        },
        [...Array(16).keys()],
        "16n"
      );
      
      const snareSeq = new Tone.Sequence(
        (time, step) => {
          if (pattern.snare[step]) {
            drumSampler.triggerAttack("D2", time);
          }
        },
        [...Array(16).keys()],
        "16n"
      );
      
      const hihatSeq = new Tone.Sequence(
        (time, step) => {
          if (pattern.hihat[step]) {
            drumSampler.triggerAttack("E2", time, { velocity: 0.7 });
          }
        },
        [...Array(16).keys()],
        "16n"
      );
      
      const clapSeq = new Tone.Sequence(
        (time, step) => {
          if (pattern.clap[step]) {
            drumSampler.triggerAttack("F2", time);
          }
        },
        [...Array(16).keys()],
        "16n"
      );
      
      const tomSeq = new Tone.Sequence(
        (time, step) => {
          if (pattern.tom[step]) {
            drumSampler.triggerAttack("G2", time);
          }
        },
        [...Array(16).keys()],
        "16n"
      );
      
      const percSeq = new Tone.Sequence(
        (time, step) => {
          if (pattern.perc[step]) {
            drumSampler.triggerAttack("A2", time, { velocity: 0.8 });
          }
        },
        [...Array(16).keys()],
        "16n"
      );
      
      // Start all sequences
      kickSeq.start(0);
      snareSeq.start(0);
      hihatSeq.start(0);
      clapSeq.start(0);
      tomSeq.start(0);
      percSeq.start(0);
      
      Tone.Transport.start();
      setIsPlaying(true);
      
      // Return a function to stop the pattern
      return () => {
        kickSeq.stop();
        snareSeq.stop();
        hihatSeq.stop();
        clapSeq.stop();
        tomSeq.stop();
        percSeq.stop();
        
        kickSeq.dispose();
        snareSeq.dispose();
        hihatSeq.dispose();
        clapSeq.dispose();
        tomSeq.dispose();
        percSeq.dispose();
        
        drumSampler.dispose();
        
        Tone.Transport.stop();
        setIsPlaying(false);
      };
    } catch (error) {
      console.error("Failed to play pattern:", error);
      toast({
        title: "Playback Error",
        description: "Failed to start audio playback. Please try again.",
        variant: "destructive",
      });
    }
  }, [activePattern, bpm, toast]);

  // Stop playing the pattern
  const stopPattern = useCallback(() => {
    Tone.Transport.stop();
    setIsPlaying(false);
  }, []);

  // Change the BPM
  const changeBpm = useCallback((newBpm: number) => {
    setBpm(newBpm);
    Tone.Transport.bpm.value = newBpm;
  }, []);

  return {
    activePattern,
    patternType,
    isPlaying,
    bpm,
    generatePattern,
    playPattern,
    stopPattern,
    changeBpm,
    setPatternType
  };
}
