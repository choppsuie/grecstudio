
import { useCallback, useEffect } from 'react';

type KeyboardHandlers = {
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleKeyUp: (e: React.KeyboardEvent) => void;
};

// Map of keyboard keys to MIDI note numbers (middle C = 60)
const DEFAULT_KEY_MAP: { [key: string]: number } = {
  a: 60, // C4
  w: 61, // C#4
  s: 62, // D4
  e: 63, // D#4
  d: 64, // E4
  f: 65, // F4
  t: 66, // F#4
  g: 67, // G4
  y: 68, // G#4
  h: 69, // A4
  u: 70, // A#4
  j: 71, // B4
  k: 72, // C5
  o: 73, // C#5
  l: 74, // D5
  p: 75, // D#5
  ';': 76, // E5
  "'": 77, // F5
  // Lower octave
  z: 48, // C3
  x: 50, // D3
  c: 52, // E3
  v: 53, // F3
  b: 55, // G3
  n: 57, // A3
  m: 59  // B3
};

export const usePianoKeyboardEvents = (
  handleDown: (note: number) => void,
  handleUp: (note: number) => void,
  keyMap: { [key: string]: number } = DEFAULT_KEY_MAP,
  enabled: boolean = true
): KeyboardHandlers => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!enabled) return;
    if (keyMap[e.key.toLowerCase()]) {
      handleDown(keyMap[e.key.toLowerCase()]);
    }
  }, [handleDown, keyMap, enabled]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (!enabled) return;
    if (keyMap[e.key.toLowerCase()]) {
      handleUp(keyMap[e.key.toLowerCase()]);
    }
  }, [handleUp, keyMap, enabled]);

  // Global keyboard events for when focus is anywhere in the window
  useEffect(() => {
    if (!enabled) return;
    
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Skip if the event target is an input element or textarea
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      
      if (keyMap[e.key.toLowerCase()]) {
        handleDown(keyMap[e.key.toLowerCase()]);
      }
    };

    const handleGlobalKeyUp = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      
      if (keyMap[e.key.toLowerCase()]) {
        handleUp(keyMap[e.key.toLowerCase()]);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [handleDown, handleUp, keyMap, enabled]);

  return { handleKeyDown, handleKeyUp };
};
