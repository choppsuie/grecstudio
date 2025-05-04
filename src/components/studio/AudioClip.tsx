
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

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
  // State for tracking drag operations
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
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
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Calculate offset from the left edge of the clip
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    setDragOffset(offsetX);
    
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleResizeLeftStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizingLeft(true);
    document.addEventListener('mousemove', handleResizeLeftMove);
    document.addEventListener('mouseup', handleResizeLeftEnd);
  };
  
  const handleResizeRightStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizingRight(true);
    document.addEventListener('mousemove', handleResizeRightMove);
    document.addEventListener('mouseup', handleResizeRightEnd);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !onMove) return;
    
    // Get parent element (track) dimensions
    const trackElement = (e.currentTarget as HTMLElement).closest('.track-timeline') as HTMLElement;
    if (!trackElement) return;
    
    const trackRect = trackElement.getBoundingClientRect();
    const trackWidth = trackRect.width;
    
    // Calculate new position relative to track
    const newPosPixels = e.clientX - trackRect.left - dragOffset;
    const newPosPercent = Math.max(0, newPosPixels / trackWidth);
    
    // Convert to time units (assuming track width = total duration)
    const timelineScale = 16; // 16 seconds per track width
    const newStartTime = newPosPercent * timelineScale;
    
    // Call the onMove callback
    onMove(id, newStartTime);
  };
  
  const handleResizeLeftMove = (e: MouseEvent) => {
    if (!isResizingLeft || !onResize) return;
    
    // Get parent dimensions and calculate new start
    const trackElement = (e.currentTarget as HTMLElement).closest('.track-timeline') as HTMLElement;
    if (!trackElement) return;
    
    const trackRect = trackElement.getBoundingClientRect();
    const newLeftPixels = e.clientX - trackRect.left;
    const newLeftPercent = Math.max(0, newLeftPixels / trackRect.width);
    
    // Convert to time
    const timelineScale = 16;
    const newStart = newLeftPercent * timelineScale;
    
    // Ensure new duration is valid
    const newDuration = Math.max(0.1, (start + duration) - newStart);
    
    // Call onResize callback
    onResize(id, newStart, newDuration);
  };
  
  const handleResizeRightMove = (e: MouseEvent) => {
    if (!isResizingRight || !onResize) return;
    
    // Calculate new right edge position
    const trackElement = (e.currentTarget as HTMLElement).closest('.track-timeline') as HTMLElement;
    if (!trackElement) return;
    
    const trackRect = trackRect.getBoundingClientRect();
    const newRightPixels = e.clientX - trackRect.left;
    const newRightPercent = Math.min(1, Math.max(0, newRightPixels / trackRect.width));
    
    // Convert to time
    const timelineScale = 16;
    const newEnd = newRightPercent * timelineScale;
    
    // Calculate new duration
    const newDuration = Math.max(0.1, newEnd - start);
    
    // Call onResize callback
    onResize(id, start, newDuration);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  const handleResizeLeftEnd = () => {
    setIsResizingLeft(false);
    document.removeEventListener('mousemove', handleResizeLeftMove);
    document.removeEventListener('mouseup', handleResizeLeftEnd);
  };
  
  const handleResizeRightEnd = () => {
    setIsResizingRight(false);
    document.removeEventListener('mousemove', handleResizeRightMove);
    document.removeEventListener('mouseup', handleResizeRightEnd);
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
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="w-[2px] mx-[1px] bg-white/40"
                style={{
                  height: `${20 + Math.sin(i / 2) * 20}%`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Resize handles */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-w-resize group-hover:bg-white/20" 
        onMouseDown={handleResizeLeftStart}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-e-resize group-hover:bg-white/20"
        onMouseDown={handleResizeRightStart}
      />
    </div>
  );
};

export default AudioClip;
