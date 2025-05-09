import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";

// Define types for our synths
export type SynthType = "basic" | "fm" | "am" | "membrane" | "pluck";

// Common type for all our synth instances - using a more flexible approach
type SynthInstance = {
  triggerAttack: (note: string | number, time?: Tone.Unit.Time, velocity?: number) => any;
  triggerRelease: (time?: Tone.Unit.Time) => any;
  dispose: () => any;
  set: (params: Record<string, any>) => any;
};

export const useSynth = () => {
  const [currentSynth, setCurrentSynth] = useState<SynthType>("basic");
  const [synth, setSynth] = useState<SynthInstance | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Remove PatternRecorderContext dependency
  const activeNotesRef = useRef<Set<number>>(new Set());
  const volumeRef = useRef<number>(-10);

  // Initialize Tone.js and create the synth
  useEffect(() => {
    const initSynth = async () => {
      try {
        // Initialize Tone.js audio context
        if (Tone.context.state !== "running") {
          await Tone.start();
        }

        // Create the default synth
        createSynth("basic");
        setInitialized(true);
      } catch (error) {
        console.error("Failed to initialize synth:", error);
      }
    };

    initSynth();

    // Clean up synth on unmount
    return () => {
      if (synth) {
        synth.dispose();
      }
    };
  }, []);

  // Create a synth based on the selected type
  const createSynth = useCallback((type: SynthType) => {
    // Dispose previous synth if it exists
    if (synth) {
      synth.dispose();
    }

    let newSynthInst: SynthInstance;

    // Create the appropriate synth type
    switch (type) {
      case "fm":
        const fmSynth = new Tone.FMSynth({
          harmonicity: 3,
          modulationIndex: 10,
          oscillator: { type: "sine" },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.8,
            release: 1.5,
          },
          modulation: { type: "square" },
          modulationEnvelope: {
            attack: 0.5,
            decay: 0.1,
            sustain: 0.2,
            release: 0.5,
          },
        }).toDestination();
        
        fmSynth.volume.value = volumeRef.current;
        newSynthInst = fmSynth;
        break;

      case "am":
        const amSynth = new Tone.AMSynth({
          harmonicity: 2,
          oscillator: { type: "square" },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.8,
            release: 1,
          },
          modulation: { type: "sine" },
          modulationEnvelope: {
            attack: 0.5,
            decay: 0.1,
            sustain: 0.5,
            release: 0.5,
          },
        }).toDestination();
        
        amSynth.volume.value = volumeRef.current;
        newSynthInst = amSynth;
        break;

      case "membrane":
        const membraneSynth = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 4,
          oscillator: { type: "sine" },
          envelope: {
            attack: 0.001,
            decay: 0.4,
            sustain: 0.01,
            release: 1.4,
            attackCurve: "exponential",
          },
        }).toDestination();
        
        membraneSynth.volume.value = volumeRef.current;
        newSynthInst = membraneSynth;
        break;

      case "pluck":
        // Pluck synth requires special handling as it doesn't extend Synth
        const pluck = new Tone.PluckSynth({
          attackNoise: 1,
          dampening: 4000,
          resonance: 0.7,
        }).toDestination();
        
        // Set volume
        pluck.volume.value = volumeRef.current;
        
        // Create a wrapper object that matches our SynthInstance interface
        newSynthInst = {
          triggerAttack: (note, time) => {
            pluck.triggerAttack(note, time);
            return newSynthInst;
          },
          triggerRelease: () => {
            // PluckSynth doesn't have triggerRelease, but we need to include it
            return newSynthInst;
          },
          dispose: () => {
            pluck.dispose();
            return newSynthInst;
          },
          set: (params) => {
            // Handle setting params
            if (params.volume !== undefined) {
              pluck.volume.value = params.volume;
              volumeRef.current = params.volume;
            }
            return newSynthInst;
          }
        };
        break;

      case "basic":
      default:
        const basicSynth = new Tone.Synth({
          oscillator: { type: "triangle8" },
          envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 0.8,
          },
        }).toDestination();
        
        basicSynth.volume.value = volumeRef.current;
        newSynthInst = basicSynth;
        break;
    }

    setSynth(newSynthInst);
    setCurrentSynth(type);
    
    return newSynthInst;
  }, [synth]);

  // Change synth type
  const changeSynthType = useCallback((type: SynthType) => {
    createSynth(type);
  }, [createSynth]);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    if (!synth) return;
    
    volumeRef.current = volume;
    
    // Different synth types have different ways to set volume
    if ('volume' in synth && synth.volume && typeof synth.volume === 'object' && 'value' in synth.volume) {
      // Standard Tone.js synths
      synth.volume.value = volume;
    } else {
      // Our custom wrapper
      synth.set({ volume });
    }
  }, [synth]);

  // Play a note
  const playNote = useCallback((midiNote: number, velocity: number = 100) => {
    if (!synth || !initialized) return;
    
    try {
      // Convert MIDI note to frequency
      const freq = Tone.Frequency(midiNote, "midi").toFrequency();
      
      // Normalize velocity (0-127) to Tone.js range (0-1)
      const normalizedVelocity = velocity / 127;
      
      // Play the note
      synth.triggerAttack(freq, undefined, normalizedVelocity);
      
      // Keep track of active notes
      activeNotesRef.current.add(midiNote);
    } catch (error) {
      console.error("Failed to play note:", error);
    }
  }, [synth, initialized]);

  // Stop a note
  const stopNote = useCallback((midiNote: number) => {
    if (!synth || !initialized) return;
    
    try {
      // Only trigger release if the note was actually playing
      if (activeNotesRef.current.has(midiNote)) {
        synth.triggerRelease();
        activeNotesRef.current.delete(midiNote);
      }
    } catch (error) {
      console.error("Failed to stop note:", error);
    }
  }, [synth, initialized]);

  return {
    currentSynth,
    synth,
    initialized,
    changeSynthType,
    playNote,
    stopNote,
    setVolume
  };
};

export default useSynth;
