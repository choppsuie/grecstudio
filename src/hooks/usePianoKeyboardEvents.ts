
import { useCallback } from 'react';

type KeyboardHandlers = {
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleKeyUp: (e: React.KeyboardEvent) => void;
};

export const usePianoKeyboardEvents = (
  handleDown: (note: number) => void,
  handleUp: (note: number) => void
): KeyboardHandlers => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const keyMap: { [key: string]: number } = {
      a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66,
      g: 67, y: 68, h: 69, u: 70, j: 71, k: 72
    };
    if (keyMap[e.key]) handleDown(keyMap[e.key]);
  }, [handleDown]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    const keyMap: { [key: string]: number } = {
      a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66,
      g: 67, y: 68, h: 69, u: 70, j: 71, k: 72
    };
    if (keyMap[e.key]) handleUp(keyMap[e.key]);
  }, [handleUp]);

  return { handleKeyDown, handleKeyUp };
};
