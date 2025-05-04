
import React, { createContext, ReactNode, useContext } from 'react';
import { usePatternRecorder } from '@/hooks/usePatternRecorder';

// Create a context with full type definition
const PatternRecorderContext = createContext<ReturnType<typeof usePatternRecorder> | undefined>(undefined);

// Provider component
export const PatternRecorderProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const patternRecorderState = usePatternRecorder();
  
  return (
    <PatternRecorderContext.Provider value={patternRecorderState}>
      {children}
    </PatternRecorderContext.Provider>
  );
};

// Custom hook for using the pattern recorder context
export const usePatternRecorderContext = () => {
  const context = useContext(PatternRecorderContext);
  if (context === undefined) {
    throw new Error('usePatternRecorderContext must be used within a PatternRecorderProvider');
  }
  return context;
};

export default PatternRecorderContext;
