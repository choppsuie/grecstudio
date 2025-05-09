
import { useState, useCallback } from 'react';
import * as Tone from 'tone';
import { useToast } from '@/hooks/use-toast';

export type ChordProgressionType = 'pop' | 'jazz' | 'classical' | 'lofi' | 'electronic' | 'random';

interface PianoPattern {
  chords: string[][];
  melody: string[];
  duration: string[];
  velocity: number[];
}

export function usePianoGenerator() {
  const { toast } = useToast();
  const [activePattern, setActivePattern] = useState<PianoPattern | null>(null);
  const [progressionType, setProgressionType] = useState<ChordProgressionType>('pop');
  const [isPlaying, setIsPlaying] = useState(false);

  // Define some common scales and chords for different progressions
  const scales = {
    c_major: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    g_major: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    f_major: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    a_minor: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    e_minor: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
    d_minor: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C']
  };
  
  const chordTypes = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    dom7: [0, 4, 7, 10],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dim: [0, 3, 6],
    sus4: [0, 5, 7]
  };
  
  // Generate note from scale degree (1-indexed)
  const getNoteFromScale = (scale: string[], degree: number, octave: number = 4) => {
    const idx = (degree - 1) % scale.length;
    const octaveOffset = Math.floor((degree - 1) / scale.length);
    return `${scale[idx]}${octave + octaveOffset}`;
  };
  
  // Generate chord from root note and type
  const buildChord = (root: string, octave: number, type: keyof typeof chordTypes) => {
    const rootNoteWithoutOctave = root.replace(/\d/g, '');
    const noteIndices = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = noteIndices.indexOf(rootNoteWithoutOctave);
    
    return chordTypes[type].map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      const noteOctave = octave + Math.floor((rootIndex + interval) / 12);
      return `${noteIndices[noteIndex]}${noteOctave}`;
    });
  };
  
  // Generate a piano pattern based on selected progression type
  const generatePattern = useCallback((type: ChordProgressionType = 'pop') => {
    let chordProgression: string[][] = [];
    let melodyNotes: string[] = [];
    let noteDurations: string[] = [];
    let noteVelocities: number[] = [];
    
    // Helper for random selection
    const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    
    // Set up the progression pattern based on type
    switch (type) {
      case 'pop':
        // Common I-V-vi-IV progression
        chordProgression = [
          buildChord('C', 3, 'major'),  // I
          buildChord('G', 3, 'major'),  // V
          buildChord('A', 3, 'minor'),  // vi
          buildChord('F', 3, 'major'),  // IV
        ];
        
        // Generate a melody that follows the chord tones
        const popScale = scales.c_major;
        for (let i = 0; i < 16; i++) {
          const chordIndex = Math.floor(i / 4);
          // More likely to use chord tones
          const useChordTone = Math.random() < 0.6;
          
          if (useChordTone) {
            // Use a note from the current chord
            melodyNotes.push(randomChoice(chordProgression[chordIndex]));
          } else {
            // Use a note from the scale
            const scaleDegree = Math.floor(Math.random() * 7) + 1;
            melodyNotes.push(getNoteFromScale(popScale, scaleDegree, 4));
          }
          
          // Simple rhythmic pattern
          noteDurations.push(i % 4 === 0 ? '8n' : '16n');
          noteVelocities.push(i % 4 === 0 ? 0.8 : 0.6);
        }
        break;
        
      case 'jazz':
        // Jazz ii-V-I progression with extended chords
        chordProgression = [
          buildChord('D', 3, 'min7'),   // ii7
          buildChord('G', 3, 'dom7'),   // V7
          buildChord('C', 3, 'maj7'),   // Imaj7
          buildChord('A', 3, 'min7'),   // vi7
        ];
        
        // Generate a more jazzy melody with some chromaticism
        const jazzScale = [...scales.c_major];
        // Add some chromatic passing tones
        jazzScale.push('C#', 'D#', 'F#', 'G#', 'A#');
        
        for (let i = 0; i < 16; i++) {
          const chordIndex = Math.floor(i / 4);
          
          if (Math.random() < 0.7) {
            // Use chord tones more often in jazz
            melodyNotes.push(randomChoice(chordProgression[chordIndex]));
          } else {
            // Occasional scale or chromatic tones
            melodyNotes.push(randomChoice(jazzScale) + '4');
          }
          
          // More varied rhythmic pattern
          const rhythmChoice = Math.random();
          if (rhythmChoice < 0.3) noteDurations.push('8n');
          else if (rhythmChoice < 0.6) noteDurations.push('16n');
          else if (rhythmChoice < 0.8) noteDurations.push('4n');
          else noteDurations.push('8t'); // Triplet feel
          
          noteVelocities.push(0.5 + Math.random() * 0.4);
        }
        break;
        
      case 'classical':
        // Circle of fifths progression
        chordProgression = [
          buildChord('C', 3, 'major'),  // I
          buildChord('G', 3, 'major'),  // V
          buildChord('D', 3, 'minor'),  // ii
          buildChord('G', 3, 'dom7'),   // V7
        ];
        
        // Classical-style melody often follows scale patterns
        const classicalScale = scales.c_major;
        let direction = 1; // Ascending or descending
        let currentDegree = 1;
        
        for (let i = 0; i < 16; i++) {
          melodyNotes.push(getNoteFromScale(classicalScale, currentDegree, 4));
          
          // Move up or down scale in a pattern
          if (i % 4 === 0) {
            direction = -direction; // Change direction every 4 notes
          }
          
          currentDegree += direction;
          if (currentDegree < 1) currentDegree = 7;
          if (currentDegree > 7) currentDegree = 1;
          
          // Classical often uses even note values
          noteDurations.push(['8n', '16n', '8n', '16n'][i % 4]);
          noteVelocities.push(i % 4 === 0 ? 0.8 : 0.7);
        }
        break;
        
      case 'lofi':
        // Lo-fi tends to use jazz-inspired chords with a chill feel
        chordProgression = [
          buildChord('F', 3, 'maj7'),   // IVmaj7
          buildChord('D', 3, 'min7'),   // iim7
          buildChord('G', 3, 'dom7'),   // V7
          buildChord('C', 3, 'maj7'),   // Imaj7
        ];
        
        // Lo-fi melodies are often simple and repetitive
        const lofiScale = scales.c_major;
        const lofiPattern = [5, 3, 2, 1, 2, 3, 5, 3]; // Simple pattern
        
        for (let i = 0; i < 16; i++) {
          const patternPos = i % lofiPattern.length;
          const degree = lofiPattern[patternPos];
          
          melodyNotes.push(getNoteFromScale(lofiScale, degree, 4));
          
          // Lo-fi often has a swing feel
          noteDurations.push(i % 2 === 0 ? '8n.' : '16n');
          // Usually mellow dynamics
          noteVelocities.push(0.5 + Math.random() * 0.2);
        }
        break;
        
      case 'electronic':
        // Electronic music often uses simpler but colorful chords
        chordProgression = [
          buildChord('C', 3, 'major'),  
          buildChord('G', 3, 'sus4'),   
          buildChord('A', 3, 'minor'),  
          buildChord('E', 3, 'minor'),  
        ];
        
        // Electronic melodies can be repetitive with arpeggiated patterns
        for (let i = 0; i < 16; i++) {
          const chordIndex = Math.floor(i / 4);
          const chordNotes = chordProgression[chordIndex];
          
          // Arpeggiate the chord
          const arpNote = chordNotes[i % chordNotes.length];
          melodyNotes.push(arpNote);
          
          // Electronic music often has consistent 16th notes
          noteDurations.push('16n');
          
          // Programmed velocity pattern
          const velocityPattern = [0.8, 0.6, 0.7, 0.6];
          noteVelocities.push(velocityPattern[i % velocityPattern.length]);
        }
        break;
        
      case 'random':
      default:
        // Random chord progression
        const possibleRoots = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const possibleTypes: (keyof typeof chordTypes)[] = ['major', 'minor', 'dom7', 'min7', 'maj7'];
        
        for (let i = 0; i < 4; i++) {
          const root = randomChoice(possibleRoots);
          const type = randomChoice(possibleTypes);
          chordProgression.push(buildChord(root, 3, type));
        }
        
        // Random melody
        for (let i = 0; i < 16; i++) {
          const chordIndex = Math.floor(i / 4);
          
          if (Math.random() < 0.5) {
            melodyNotes.push(randomChoice(chordProgression[chordIndex]));
          } else {
            const randomNote = randomChoice(['C', 'D', 'E', 'F', 'G', 'A', 'B']) + 
                              randomChoice(['3', '4', '5']);
            melodyNotes.push(randomNote);
          }
          
          noteDurations.push(randomChoice(['8n', '16n', '4n', '8n.']));
          noteVelocities.push(0.4 + Math.random() * 0.6);
        }
    }
    
    const newPattern: PianoPattern = {
      chords: chordProgression,
      melody: melodyNotes,
      duration: noteDurations,
      velocity: noteVelocities
    };
    
    setActivePattern(newPattern);
    setProgressionType(type);
    
    toast({
      title: "Piano Pattern Generated",
      description: `Created a new ${type} piano pattern`,
    });
    
    return newPattern;
  }, [toast]);

  // Play the generated piano pattern
  const playPattern = useCallback(async (pattern: PianoPattern = activePattern!) => {
    if (!pattern) return;
    
    try {
      await Tone.start();
      
      // Create piano sampler
      const piano = new Tone.Sampler({
        urls: {
          C4: "https://tonejs.github.io/audio/salamander/C4.mp3",
          "D#4": "https://tonejs.github.io/audio/salamander/Ds4.mp3",
          "F#4": "https://tonejs.github.io/audio/salamander/Fs4.mp3",
          A4: "https://tonejs.github.io/audio/salamander/A4.mp3",
        },
        release: 1,
        onload: () => {
          console.log("Piano sampler loaded");
        },
      }).toDestination();
      
      // Create a sequence for the chord progression
      const chordSeq = new Tone.Sequence(
        (time, idx) => {
          if (idx < pattern.chords.length) {
            piano.triggerAttackRelease(pattern.chords[idx], '2n', time, 0.7);
          }
        },
        [0, 1, 2, 3],
        '1m'
      );
      
      // Create a sequence for the melody
      const melodySeq = new Tone.Sequence(
        (time, step) => {
          const note = pattern.melody[step];
          const duration = pattern.duration[step];
          const velocity = pattern.velocity[step];
          
          piano.triggerAttackRelease(note, duration, time, velocity);
        },
        [...Array(pattern.melody.length).keys()],
        '8n'
      );
      
      // Start all sequences
      chordSeq.start(0);
      melodySeq.start(0);
      
      Tone.Transport.start();
      setIsPlaying(true);
      
      // Return a function to stop the pattern
      return () => {
        chordSeq.stop();
        melodySeq.stop();
        
        chordSeq.dispose();
        melodySeq.dispose();
        
        piano.dispose();
        
        Tone.Transport.stop();
        setIsPlaying(false);
      };
    } catch (error) {
      console.error("Failed to play piano pattern:", error);
      toast({
        title: "Playback Error",
        description: "Failed to start piano playback. Please try again.",
        variant: "destructive",
      });
    }
  }, [activePattern, toast]);

  // Stop playing the pattern
  const stopPattern = useCallback(() => {
    Tone.Transport.stop();
    setIsPlaying(false);
  }, []);

  return {
    activePattern,
    progressionType,
    isPlaying,
    generatePattern,
    playPattern,
    stopPattern,
    setProgressionType
  };
}
