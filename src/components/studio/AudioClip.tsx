
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AudioClipProps } from './types/clipTypes';
import AudioClipResizeHandle from './AudioClipResizeHandle';
import WaveformVisualization from './WaveformVisualization';
import { useClipInteraction } from '@/hooks/useClipInteraction';

const AudioClip = ({ 
  id, 
  name, 
  start, 
  duration, 
  color, 
  selected = false,
  onSelect,
  onResize,
  onMove
}: AudioClipProps) => {
  // Use the clip interaction hook
  const {
    isDragging,
    isResizingLeft,
    isResizingRight,
    handleMouseDown,
    handleResizeLeftStart,
    handleResizeRightStart,
  } = useClipInteraction({
    id,
    start,
    duration,
    onMove,
    onResize
  });
  
  // Calculate position and width based on timeline
  const clipStyle = {
    left: `${start * 100}%`,
    width: `${duration * 100}%`,
    backgroundColor: `${color}30`,
    borderColor: selected ? `${color}` : `${color}60`,
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect && !isDragging && !isResizingLeft && !isResizingRight) {
      onSelect(id);
    }
  };
  
  return (
    <div 
      className={cn(
        "absolute h-full rounded-sm border-l-2 border-r-2 border-t border-b",
        "flex flex-col overflow-hidden cursor-pointer group",
        selected && "ring-1 ring-white/30",
        isDragging && "opacity-70",
        (isResizingLeft || isResizingRight) && "cursor-ew-resize"
      )}
      style={clipStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <div className="px-2 py-1 text-xs font-medium truncate bg-black/20">
        {name}
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="w-full h-full relative">
          {/* Waveform visualization */}
          <WaveformVisualization color={color} />
        </div>
      </div>
      
      {/* Resize handles */}
      <AudioClipResizeHandle 
        position="left"
        onResizeStart={handleResizeLeftStart}
      />
      <AudioClipResizeHandle 
        position="right"
        onResizeStart={handleResizeRightStart}
      />
    </div>
  );
};

export default AudioClip;

// Export the type for use in other components
export type { AudioClipProps };
