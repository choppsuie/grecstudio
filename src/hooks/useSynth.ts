import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";
import { usePatternRecorder } from "./usePatternRecorder";

type SynthType = "basic" | "fm" | "am" | "membrane" | "pluck";

export const useSynth = () => {
  const [currentSynth, setCurrentSynth] = useState<SynthType>("basic");
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { isRecording, recordNote, updateNoteDuration } = usePatternRecorder();
  const activeNotesRef = useRef<Set<number>>(new Set());

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

    let newSynth: Tone.Synth;

    // Create the appropriate synth type
    switch (type) {
      case "fm":
        newSynth = new Tone.FMSynth({
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
        break;

      case "am":
        newSynth = new Tone.AMSynth({
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
        break;

      case "membrane":
        newSynth = new Tone.MembraneSynth({
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
        break;

      case "pluck":
        // Pluck synth requires special handling as it doesn't extend Synth
        const pluck = new Tone.PluckSynth({
          attackNoise: 1,
          dampening: 4000,
          resonance: 0.7,
        }).toDestination();
        
        // Wrap PluckSynth in a standard Synth API
        newSynth = new Tone.Synth({
          oscillator: { type: "sine" },
          envelope: {
            attack: 0.001,
            decay: 0.1,
            sustain: 0.3,
            release: 0.5,
          },
        });
        
        // Override the triggerAttack and triggerRelease methods
        newSynth.triggerAttack = (note, time, velocity) => {
          pluck.triggerAttack(note, time, velocity);
          return newSynth;
        };
        
        newSynth.triggerRelease = (time) => {
          // PluckSynth doesn't have triggerRelease, but we need to include it
          return newSynth;
        };
        
        newSynth.dispose = () => {
          pluck.dispose();
          return newSynth;
        };
        
        break;

      case "basic":
      default:
        newSynth = new Tone.Synth({
          oscillator: { type: "triangle8" },
          envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 0.8,
          },
        }).toDestination();
        break;
    }

    // Set volume to a reasonable level
    newSynth.volume.value = -10;
    setSynth(newSynth);
    
    return newSynth;
  }, [synth]);

  // Change synth type
  const changeSynthType = useCallback((type: SynthType) => {
    createSynth(type);
    setCurrentSynth(type);
  }, [createSynth]);

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
      
      // Record the note if recording is active
      if (isRecording) {
        recordNote(midiNote, velocity);
      }
    } catch (error) {
      console.error("Failed to play note:", error);
    }
  }, [synth, initialized, isRecording, recordNote]);

  // Stop a note
  const stopNote = useCallback((midiNote: number) => {
    if (!synth || !initialized) return;
    
    try {
      // Only trigger release if the note was actually playing
      if (activeNotesRef.current.has(midiNote)) {
        synth.triggerRelease();
        activeNotesRef.current.delete(midiNote);
        
        // Update note duration if recording
        if (isRecording) {
          updateNoteDuration(midiNote);
        }
      }
    } catch (error) {
      console.error("Failed to stop note:", error);
    }
  }, [synth, initialized, isRecording, updateNoteDuration]);

  return {
    currentSynth,
    synth,
    initialized,
    changeSynthType,
    playNote,
    stopNote
  };
};

export default useSynth;
