
import { useRef, useState } from "react";
import * as Tone from "tone";

type PlayNote = (midi: number, velocity?: number) => void;
type StopNote = (midi: number) => void;
type SynthType = "basic" | "fm" | "am" | "membrane" | "pluck" | "duo" | "metal" | "piano";

interface CustomPolySynth extends Tone.PolySynth {
  set: (options: any) => void;
}

export function useSynth() {
  const synthRef = useRef<CustomPolySynth | null>(null);
  const [currentSynth, setCurrentSynth] = useState<SynthType>("basic");
  
  const createSynth = (type: SynthType) => {
    if (synthRef.current) {
      synthRef.current.dispose();
    }
    
    let newSynth: CustomPolySynth;
    
    switch (type) {
      case "fm":
        newSynth = new Tone.PolySynth(Tone.FMSynth).toDestination() as CustomPolySynth;
        newSynth.set({
          volume: -8,
          modulationIndex: 10,
          harmonicity: 3.01
        });
        break;
      case "am":
        newSynth = new Tone.PolySynth(Tone.AMSynth).toDestination() as CustomPolySynth;
        newSynth.set({
          volume: -8,
          harmonicity: 2.5
        });
        break;
      case "membrane":
        newSynth = new Tone.PolySynth(Tone.MembraneSynth).toDestination() as CustomPolySynth;
        newSynth.set({
          volume: -8,
          octaves: 4,
          pitchDecay: 0.1
        });
        break;
      case "duo":
        newSynth = new Tone.PolySynth(Tone.DuoSynth).toDestination() as CustomPolySynth;
        newSynth.set({
          volume: -12,
          vibratoAmount: 0.5,
          harmonicity: 1.5,
        });
        break;
      case "metal":
        newSynth = new Tone.PolySynth(Tone.MetalSynth).toDestination() as CustomPolySynth;
        newSynth.set({
          volume: -15,
          resonance: 100,
          harmonicity: 5.1
        });
        break;
      case "piano":
        newSynth = new Tone.PolySynth(Tone.Synth).toDestination() as CustomPolySynth;
        newSynth.set({
          volume: -8,
          oscillator: {
            type: "sine"
          },
          envelope: {
            attack: 0.005,
            decay: 3,
            sustain: 0,
            release: 1
          }
        });
        break;
      case "pluck":
        newSynth = new Tone.PolySynth(Tone.PluckSynth).toDestination() as CustomPolySynth;
        newSynth.set({
          volume: -8,
          attackNoise: 1,
          dampening: 4000,
          resonance: 0.95
        });
        break;
      default: // "basic"
        newSynth = new Tone.PolySynth(Tone.Synth).toDestination() as CustomPolySynth;
        newSynth.set({
          volume: -8,
          oscillator: {
            type: "triangle8"
          },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.2,
            release: 0.8,
          }
        });
    }
    
    const reverb = new Tone.Reverb(1.5).toDestination();
    newSynth.connect(reverb);
    synthRef.current = newSynth;
  };
  
  if (!synthRef.current) {
    createSynth(currentSynth);
  }

  const changeSynthType = (type: SynthType) => {
    setCurrentSynth(type);
    createSynth(type);
  };

  const playNote: PlayNote = (midi, velocity = 100) => {
    Tone.start();
    const note = Tone.Frequency(midi, "midi").toNote();
    synthRef.current!.triggerAttack(note, undefined, velocity / 127);
  };

  const stopNote: StopNote = (midi) => {
    const note = Tone.Frequency(midi, "midi").toNote();
    synthRef.current!.triggerRelease(note);
  };

  return { playNote, stopNote, changeSynthType, currentSynth };
}
