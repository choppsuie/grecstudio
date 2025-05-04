
import React, { ReactNode } from 'react';
import { PlaybackProvider } from './PlaybackContext';
import { RecordingProvider } from './RecordingContext';
import { ProjectProvider } from './ProjectContext';
import { PatternRecorderProvider } from './PatternRecorderContext';

// This StudioContext now acts as a composition of our specialized contexts
interface StudioProviderProps {
  children: ReactNode;
}

export const StudioProvider: React.FC<StudioProviderProps> = ({ children }) => {
  return (
    <PlaybackProvider>
      <RecordingProvider>
        <ProjectProvider>
          <PatternRecorderProvider>
            {children}
          </PatternRecorderProvider>
        </ProjectProvider>
      </RecordingProvider>
    </PlaybackProvider>
  );
};
