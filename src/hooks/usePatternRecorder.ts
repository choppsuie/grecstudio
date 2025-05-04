
import { useState, useCallback, useRef } from "react";
import * as Tone from "tone";
import { useToast } from "@/hooks/use-toast";

interface Note {
  time: number;
  note: number;
  duration: number;
  velocity: number;
}

interface Pattern {
  id: string;
  name: string;
  notes: Note[];
  duration: number;
  instrument: string;
}

export function usePatternRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [savedPatterns, setSavedPatterns] = useState<Pattern[]>([]);
  const recordStartTimeRef = useRef<number | null>(null);
  const recordedNotesRef = useRef<Note[]>([]);
  const { toast } = useToast();

  // Start recording a new pattern
  const startRecording = useCallback((instrumentName: string = "default") => {
    if (isRecording) return;
    
    try {
      // Initialize Tone.js if not already
      if (Tone.Transport.state !== "started") {
        Tone.Transport.start();
      }
      
      recordStartTimeRef.current = Tone.Transport.seconds;
      recordedNotesRef.current = [];
      
      setIsRecording(true);
      setCurrentPattern({
        id: `pattern-${Date.now()}`,
        name: `Pattern ${savedPatterns.length + 1}`,
        notes: [],
        duration: 0,
        instrument: instrumentName
      });
      
      toast({
        title: "Recording Started",
        description: "Your melody recording has started",
      });
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
    }
  }, [isRecording, savedPatterns.length, toast]);

  // Stop recording and save the pattern
  const stopRecording = useCallback(() => {
    if (!isRecording || recordStartTimeRef.current === null) return;
    
    const recordingDuration = Tone.Transport.seconds - recordStartTimeRef.current;
    
    // Create a new pattern from the recorded notes
    const newPattern: Pattern = {
      id: `pattern-${Date.now()}`,
      name: `Pattern ${savedPatterns.length + 1}`,
      notes: [...recordedNotesRef.current],
      duration: recordingDuration,
      instrument: currentPattern?.instrument || "default"
    };
    
    setSavedPatterns(prev => [...prev, newPattern]);
    setCurrentPattern(newPattern);
    setIsRecording(false);
    recordStartTimeRef.current = null;
    
    toast({
      title: "Recording Complete",
      description: `Recorded ${newPattern.notes.length} notes over ${recordingDuration.toFixed(2)}s`,
    });
    
    return newPattern;
  }, [isRecording, savedPatterns.length, currentPattern, toast]);

  // Record a note
  const recordNote = useCallback((note: number, velocity: number = 100) => {
    if (!isRecording || recordStartTimeRef.current === null) return;
    
    const startTime = Tone.Transport.seconds - recordStartTimeRef.current;
    
    // Store the note start time (we'll calculate duration when note is released)
    const noteObj: Note = {
      time: startTime,
      note,
      duration: 0, // Will be updated on noteOff
      velocity
    };
    
    recordedNotesRef.current.push(noteObj);
    
    return noteObj;
  }, [isRecording]);

  // Update note duration when released
  const updateNoteDuration = useCallback((note: number) => {
    if (!isRecording || recordStartTimeRef.current === null) return;
    
    const currentTime = Tone.Transport.seconds - recordStartTimeRef.current;
    
    // Find the most recent instance of this note that doesn't have a duration
    const noteIdx = [...recordedNotesRef.current].reverse().findIndex(
      n => n.note === note && n.duration === 0
    );
    
    if (noteIdx >= 0) {
      // Convert from reverse index to actual index
      const actualIdx = recordedNotesRef.current.length - 1 - noteIdx;
      const noteObj = recordedNotesRef.current[actualIdx];
      const duration = currentTime - noteObj.time;
      
      // Update the note's duration
      recordedNotesRef.current[actualIdx] = {
        ...noteObj,
        duration: Math.max(0.1, duration) // Ensure minimum duration
      };
    }
  }, [isRecording]);

  // Play a specific pattern with a synth
  const playPattern = useCallback((pattern: Pattern, synth: Tone.Synth | null = null) => {
    if (!synth) return;
    
    // Schedule all notes in the pattern
    pattern.notes.forEach(note => {
      const freq = Tone.Frequency(note.note, "midi").toFrequency();
      synth.triggerAttackRelease(
        freq,
        note.duration,
        Tone.now() + note.time,
        note.velocity / 127
      );
    });
    
    toast({
      title: "Playing Pattern",
      description: `Playing pattern: ${pattern.name}`,
    });
  }, [toast]);

  // Delete a pattern
  const deletePattern = useCallback((patternId: string) => {
    setSavedPatterns(prev => prev.filter(p => p.id !== patternId));
    
    if (currentPattern?.id === patternId) {
      setCurrentPattern(null);
    }
    
    toast({
      title: "Pattern Deleted",
      description: "The pattern has been deleted",
    });
  }, [currentPattern, toast]);

  // Rename a pattern
  const renamePattern = useCallback((patternId: string, newName: string) => {
    setSavedPatterns(prev => 
      prev.map(p => p.id === patternId ? { ...p, name: newName } : p)
    );
    
    if (currentPattern?.id === patternId) {
      setCurrentPattern(prev => prev ? { ...prev, name: newName } : null);
    }
  }, [currentPattern]);

  return {
    isRecording,
    currentPattern,
    savedPatterns,
    startRecording,
    stopRecording,
    recordNote,
    updateNoteDuration,
    playPattern,
    deletePattern,
    renamePattern
  };
}

export default usePatternRecorder;
