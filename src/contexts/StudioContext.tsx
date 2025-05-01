
import React, { ReactNode } from 'react';
import { PlaybackProvider } from './PlaybackContext';
import { RecordingProvider } from './RecordingContext';
import { ProjectProvider } from './ProjectContext';

// This StudioContext now acts as a composition of our three specialized contexts
interface StudioProviderProps {
  children: ReactNode;
}

// Create a combined hook for easier access to all studio functionality
export const useStudio = () => {
  // This function will be implemented below
  throw new Error('useStudio must be imported from StudioHooks.ts');
};

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
