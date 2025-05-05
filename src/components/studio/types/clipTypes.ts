
export interface AudioClipProps {
  id: string;
  name: string;
  start: number; // Start time in seconds
  duration: number; // Duration in seconds
  color: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onResize?: (id: string, newStart: number, newDuration: number) => void;
  onMove?: (id: string, newStart: number) => void;
}

export interface ClipResizeHandleProps {
  position: 'left' | 'right';
  onResizeStart: (e: React.MouseEvent) => void;
}

export interface WaveformVisualizationProps {
  color?: string;
}
