
import React, { createContext, useReducer, ReactNode } from 'react';
import { usePlayback } from './StudioHooks';

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
};

// Create context
const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

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
  const { pausePlayback } = usePlayback();
  
  const startRecording = (projectId: string) => {
    dispatch({ type: 'START_RECORDING', payload: { projectId } });
  };
  
  const stopRecording = () => {
    // Fixed the error: remove the argument from pausePlayback
    pausePlayback();
    dispatch({ type: 'STOP_RECORDING' });
  };
  
  const addRecordedTrack = (trackId: string) => {
    dispatch({ type: 'ADD_RECORDED_TRACK', payload: { trackId } });
  };
  
  return (
    <RecordingContext.Provider value={{ 
      state,
      startRecording, 
      stopRecording,
      addRecordedTrack
    }}>
      {children}
    </RecordingContext.Provider>
  );
};

export default RecordingContext;
