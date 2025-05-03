
import React from 'react';
import { cn } from '@/lib/utils';

export interface AudioClipProps {
  id: string;
  name: string;
  start: number; // Start time in seconds
  duration: number; // Duration in seconds
  color: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

const AudioClip = ({ 
  id, 
  name, 
  start, 
  duration, 
  color, 
  selected = false,
  onSelect 
}: AudioClipProps) => {
  // Calculate position and width based on timeline
  const clipStyle = {
    left: `${start * 100}%`,
    width: `${duration * 100}%`,
    backgroundColor: `${color}30`,
    borderColor: selected ? `${color}` : `${color}60`,
  };
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };
  
  return (
    <div 
      className={cn(
        "absolute h-full rounded-sm border-l-2 border-r-2 border-t border-b",
        "flex flex-col overflow-hidden cursor-pointer group",
        selected && "ring-1 ring-white/30"
      )}
      style={clipStyle}
      onClick={handleClick}
    >
      <div className="px-2 py-1 text-xs font-medium truncate">
        {name}
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="w-full h-12 bg-gradient-to-b from-transparent to-black/20"></div>
      </div>
      
      {/* Resize handles */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 cursor-w-resize group-hover:bg-white/10" />
      <div className="absolute right-0 top-0 bottom-0 w-1.5 cursor-e-resize group-hover:bg-white/10" />
    </div>
  );
};

export default AudioClip;
