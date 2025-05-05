
import { useState, useEffect } from 'react';
import { DrumPad } from '@/hooks/drum-machine/types';

export const useDrumKeyboardHandler = (
  currentPads: DrumPad[],
  isLoaded: boolean,
  playSound: (padId: string) => void
) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pad = currentPads.find(pad => pad.key.toLowerCase() === e.key.toLowerCase());
      if (pad && isLoaded) {
        playSound(pad.id);
        setActiveKey(pad.key);
        console.log(`Key pressed: ${e.key}, playing sound: ${pad.id}`);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentPads, isLoaded, playSound]);

  return {
    activeKey
  };
};
