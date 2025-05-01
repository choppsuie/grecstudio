
import React, { ReactNode } from 'react';
import { PlaybackProvider } from './PlaybackContext';
import { RecordingProvider } from './RecordingContext';
import { ProjectProvider } from './ProjectContext';

// This StudioContext now acts as a composition of our three specialized contexts
interface StudioProviderProps {
  children: ReactNode;
}

export const StudioProvider: React.FC<StudioProviderProps> = ({ children }) => {
  return (
    <PlaybackProvider>
      <RecordingProvider>
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </RecordingProvider>
    </PlaybackProvider>
  );
};
