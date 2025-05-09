
import { useContext } from 'react';
import { usePlayback } from './PlaybackContext';
import { useRecording } from './RecordingContext';
import { useProject } from './ProjectContext';

// Combined hook that gives access to all studio functionality
export const useStudio = () => {
  const playback = usePlayback();
  const recording = useRecording();
  const project = useProject();

  // Combine all contexts into a single object
  return {
    // Playback state and methods
    isPlaying: playback.isPlaying,
    toneInitialized: playback.toneInitialized,
    bpm: playback.bpm,
    timelineRef: playback.timelineRef,
    currentTime: playback.currentTime,
    masterVolume: playback.masterVolume,
    markers: playback.markers,
    setIsPlaying: playback.setIsPlaying,
    setBpm: playback.setBpm,
    setMasterVolume: playback.setMasterVolume,
    initializeTone: playback.initializeTone,
    handlePlay: playback.handlePlay,
    handlePause: playback.handlePause,
    handleStop: playback.handleStop,
    handleBpmChange: playback.handleBpmChange,
    handleMIDINoteOn: playback.handleMIDINoteOn,
    handleMIDINoteOff: playback.handleMIDINoteOff,
    seekToPosition: playback.seekToPosition,
    addMarker: playback.addMarker,
    updateMarker: playback.updateMarker,
    deleteMarker: playback.deleteMarker,
    jumpToMarker: playback.jumpToMarker,
    
    // Recording state and methods
    isRecording: recording.isRecording,
    setIsRecording: recording.setIsRecording,
    handleRecord: recording.handleRecord,
    handleRecordingComplete: recording.handleRecordingComplete,
    
    // Project state and methods
    projectId: project.projectId,
    collaborators: project.collaborators,
    showMixer: project.showMixer,
    setShowMixer: project.setShowMixer,
    toggleMixer: project.toggleMixer,
    handleSave: project.handleSave,
    handleShare: project.handleShare,
  };
};

// Re-export individual hooks for direct access when needed
export { usePlayback } from './PlaybackContext';
export { useRecording } from './RecordingContext';
export { useProject } from './ProjectContext';
