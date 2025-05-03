
import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import { PlaybackContext } from './PlaybackContext';

// Define types
type RecordingState = {
  isRecording: boolean;
  recordedTracks: string[];
  projectId: string | null;
};

type RecordingAction = 
  | { type: 'START_RECORDING'; payload: { projectId: string } }
  | { type: 'STOP_RECORDING' }
  | { type: 'ADD_RECORDED_TRACK'; payload: { trackId: string } };

type RecordingContextType = {
  state: RecordingState;
  startRecording: (projectId: string) => void;
  stopRecording: () => void;
  addRecordedTrack: (trackId: string) => void;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  handleRecord: () => void;
  handleRecordingComplete: (trackId: string) => void;
};

// Create context
const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

// Context hook
export const useRecording = () => {
  const context = useContext(RecordingContext);
  if (context === undefined) {
    throw new Error('useRecording must be used within a RecordingProvider');
  }
  return context;
};

// Initial state
const initialState: RecordingState = {
  isRecording: false,
  recordedTracks: [],
  projectId: null
};

// Reducer function
function recordingReducer(state: RecordingState, action: RecordingAction): RecordingState {
  switch (action.type) {
    case 'START_RECORDING':
      return {
        ...state,
        isRecording: true,
        projectId: action.payload.projectId
      };
    case 'STOP_RECORDING':
      return {
        ...state,
        isRecording: false
      };
    case 'ADD_RECORDED_TRACK':
      return {
        ...state,
        recordedTracks: [...state.recordedTracks, action.payload.trackId]
      };
    default:
      return state;
  }
}

// Provider component
export const RecordingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(recordingReducer, initialState);
  const playbackContext = useContext(PlaybackContext);
  
  const startRecording = (projectId: string) => {
    dispatch({ type: 'START_RECORDING', payload: { projectId } });
  };
  
  const stopRecording = () => {
    // Using handlePause from the PlaybackContext instead of pausePlayback
    if (playbackContext) {
      playbackContext.handlePause();
    }
    dispatch({ type: 'STOP_RECORDING' });
  };
  
  const addRecordedTrack = (trackId: string) => {
    dispatch({ type: 'ADD_RECORDED_TRACK', payload: { trackId } });
  };
  
  // Additional helper methods
  const setIsRecording = (value: boolean) => {
    if (value) {
      startRecording(state.projectId || 'default-project');
    } else {
      stopRecording();
    }
  };
  
  const handleRecord = () => {
    setIsRecording(!state.isRecording);
  };
  
  const handleRecordingComplete = (trackId: string) => {
    addRecordedTrack(trackId);
    setIsRecording(false);
  };
  
  return (
    <RecordingContext.Provider value={{ 
      state,
      startRecording, 
      stopRecording,
      addRecordedTrack,
      isRecording: state.isRecording,
      setIsRecording,
      handleRecord,
      handleRecordingComplete
    }}>
      {children}
    </RecordingContext.Provider>
  );
};

export default RecordingContext;
