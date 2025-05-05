
import { useState, useCallback } from 'react';
import * as Tone from 'tone';

interface UseClipInteractionProps {
  id: string;
  start: number;
  duration: number;
  onMove?: (id: string, newStart: number) => void;
  onResize?: (id: string, newStart: number, newDuration: number) => void;
}

export const useClipInteraction = ({
  id,
  start,
  duration,
  onMove,
  onResize
}: UseClipInteractionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Calculate offset from the left edge of the clip
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    setDragOffset(offsetX);
    
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);
  
  const handleResizeLeftStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizingLeft(true);
    document.addEventListener('mousemove', handleResizeLeftMove);
    document.addEventListener('mouseup', handleResizeLeftEnd);
  }, []);
  
  const handleResizeRightStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizingRight(true);
    document.addEventListener('mousemove', handleResizeRightMove);
    document.addEventListener('mouseup', handleResizeRightEnd);
  }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !onMove) return;
    
    // Get parent element (track) dimensions
    const trackElement = (e.target as HTMLElement)?.closest('.track-timeline') as HTMLElement;
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
  }, [id, isDragging, dragOffset, onMove]);
  
  const handleResizeLeftMove = useCallback((e: MouseEvent) => {
    if (!isResizingLeft || !onResize) return;
    
    // Get parent dimensions and calculate new start
    const trackElement = (e.target as HTMLElement)?.closest('.track-timeline') as HTMLElement;
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
  }, [id, isResizingLeft, onResize, start, duration]);
  
  const handleResizeRightMove = useCallback((e: MouseEvent) => {
    if (!isResizingRight || !onResize) return;
    
    // Calculate new right edge position
    const trackElement = (e.target as HTMLElement)?.closest('.track-timeline') as HTMLElement;
    if (!trackElement) return;
    
    const trackRect = trackElement.getBoundingClientRect();
    const newRightPixels = e.clientX - trackRect.left;
    const newRightPercent = Math.min(1, Math.max(0, newRightPixels / trackRect.width));
    
    // Convert to time
    const timelineScale = 16;
    const newEnd = newRightPercent * timelineScale;
    
    // Calculate new duration
    const newDuration = Math.max(0.1, newEnd - start);
    
    // Call onResize callback
    onResize(id, start, newDuration);
  }, [id, isResizingRight, onResize, start]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);
  
  const handleResizeLeftEnd = useCallback(() => {
    setIsResizingLeft(false);
    document.removeEventListener('mousemove', handleResizeLeftMove);
    document.removeEventListener('mouseup', handleResizeLeftEnd);
  }, [handleResizeLeftMove]);
  
  const handleResizeRightEnd = useCallback(() => {
    setIsResizingRight(false);
    document.removeEventListener('mousemove', handleResizeRightMove);
    document.removeEventListener('mouseup', handleResizeRightEnd);
  }, [handleResizeRightMove]);
  
  return {
    isDragging,
    isResizingLeft,
    isResizingRight,
    handleMouseDown,
    handleResizeLeftStart,
    handleResizeRightStart,
  };
};

export default useClipInteraction;
