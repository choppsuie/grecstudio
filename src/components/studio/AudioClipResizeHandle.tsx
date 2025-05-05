
import React from 'react';
import { ClipResizeHandleProps } from './types/clipTypes';

const AudioClipResizeHandle: React.FC<ClipResizeHandleProps> = ({ 
  position, 
  onResizeStart 
}) => {
  return (
    <div 
      className={`absolute ${position}-0 top-0 bottom-0 w-1.5 cursor-${position === 'left' ? 'w' : 'e'}-resize group-hover:bg-white/20`}
      onMouseDown={onResizeStart}
    />
  );
};

export default AudioClipResizeHandle;
