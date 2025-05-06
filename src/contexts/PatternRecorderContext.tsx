
import React, { createContext, useContext, ReactNode } from 'react';
import { usePatternRecorder } from '@/hooks/usePatternRecorder';

// Define the context type
interface PatternRecorderContextType {
  isRecording: boolean;
  currentPattern: any | null;
  savedPatterns: any[];
  startRecording: (instrumentName: string) => void;
  stopRecording: () => any;
  recordNote: (note: number, velocity?: number) => any;
  updateNoteDuration: (note: number) => void;
  playPattern: (pattern: any, synth: any) => void;
  deletePattern: (patternId: string) => void;
  renamePattern: (patternId: string, newName: string) => void;
}

// Create the context
const PatternRecorderContext = createContext<PatternRecorderContextType | undefined>(undefined);

// Provider component
export const PatternRecorderProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Use the pattern recorder hook
  const patternRecorder = usePatternRecorder();
  
  return (
    <PatternRecorderContext.Provider value={patternRecorder}>
      {children}
    </PatternRecorderContext.Provider>
  );
};

// Hook for using the pattern recorder context
export const usePatternRecorderContext = () => {
  const context = useContext(PatternRecorderContext);
  
  if (context === undefined) {
    throw new Error('usePatternRecorderContext must be used within a PatternRecorderProvider');
  }
  
  return context;
};

export default PatternRecorderContext;
