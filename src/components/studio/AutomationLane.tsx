
import React, { useState, useRef, useEffect } from 'react';
import { useStudio } from '@/contexts/StudioHooks';

interface AutomationPoint {
  time: number;
  value: number;
}

interface AutomationLaneProps {
  trackId: string;
  parameter: string;
  height?: number;
  initialPoints?: AutomationPoint[];
  min?: number;
  max?: number;
  color?: string;
  onChange?: (points: AutomationPoint[]) => void;
}

const AutomationLane: React.FC<AutomationLaneProps> = ({
  trackId,
  parameter,
  height = 60,
  initialPoints = [],
  min = 0,
  max = 1,
  color = "#8B5CF6",
  onChange
}) => {
  const { timelineRef } = useStudio();
  const [points, setPoints] = useState<AutomationPoint[]>(initialPoints);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Handle adding a new point
  const handleAddPoint = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to normalized coordinates (0-1)
    const time = x / rect.width;
    const value = 1 - (y / rect.height);
    
    // Scale to parameter range
    const scaledValue = min + (value * (max - min));
    
    // Add the new point
    const newPoint: AutomationPoint = {
      time: time * 16, // Scale to our timeline range (16 seconds)
      value: scaledValue
    };
    
    // Add to existing points and sort by time
    const newPoints = [...points, newPoint].sort((a, b) => a.time - b.time);
    setPoints(newPoints);
    
    // Notify parent component
    onChange?.(newPoints);
  };
  
  // Handle starting to drag a point
  const handlePointMouseDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(index);
  };
  
  // Handle mouse move while dragging a point
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging === null || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    
    // Convert to normalized coordinates (0-1)
    const time = x / rect.width;
    const value = 1 - (y / rect.height);
    
    // Scale to parameter range
    const scaledValue = min + (value * (max - min));
    
    // Update the point
    const newPoints = [...points];
    newPoints[isDragging] = {
      time: time * 16, // Scale to our timeline range (16 seconds)
      value: scaledValue
    };
    
    // Sort by time
    const sortedPoints = [...newPoints].sort((a, b) => a.time - b.time);
    setPoints(sortedPoints);
    
    // Notify parent component
    onChange?.(sortedPoints);
  };
  
  // Handle mouse up after dragging a point
  const handleMouseUp = () => {
    setIsDragging(null);
  };
  
  // Set up event listeners for dragging
  useEffect(() => {
    if (isDragging !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, points]);
  
  // Generate the SVG path for the automation curve
  const generatePath = () => {
    if (points.length === 0) {
      return "";
    }
    
    const svgWidth = svgRef.current?.clientWidth || 0;
    const svgHeight = svgRef.current?.clientHeight || 0;
    
    if (svgWidth === 0 || svgHeight === 0) {
      return "";
    }
    
    // Create SVG path
    let path = `M${(points[0].time / 16) * svgWidth},${svgHeight - ((points[0].value - min) / (max - min)) * svgHeight}`;
    
    for (let i = 1; i < points.length; i++) {
      const x = (points[i].time / 16) * svgWidth;
      const y = svgHeight - ((points[i].value - min) / (max - min)) * svgHeight;
      path += ` L${x},${y}`;
    }
    
    return path;
  };
  
  return (
    <div className="w-full my-1" style={{ height: `${height}px` }}>
      <div className="bg-cyber-darker rounded-sm w-full h-full p-0.5">
        <div className="text-[8px] text-white/60 absolute left-1 top-1">
          {parameter}
        </div>
        
        <svg 
          ref={svgRef}
          className="w-full h-full cursor-crosshair"
          onClick={handleAddPoint}
        >
          {/* Grid lines */}
          <g className="grid-lines">
            {[0.25, 0.5, 0.75].map((pos) => (
              <line 
                key={`h-${pos}`}
                x1="0%" 
                y1={`${pos * 100}%`} 
                x2="100%" 
                y2={`${pos * 100}%`}
                stroke="#8B5CF620"
                strokeWidth="1"
              />
            ))}
            {[0.25, 0.5, 0.75].map((pos) => (
              <line 
                key={`v-${pos}`}
                x1={`${pos * 100}%`} 
                y1="0%" 
                x2={`${pos * 100}%`} 
                y2="100%"
                stroke="#8B5CF620"
                strokeWidth="1"
              />
            ))}
          </g>
          
          {/* Automation curve path */}
          <path 
            d={generatePath()} 
            fill="none" 
            stroke={color} 
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          
          {/* Control points */}
          {points.map((point, index) => {
            // Calculate the SVG coordinates
            const svgWidth = svgRef.current?.clientWidth || 0;
            const svgHeight = svgRef.current?.clientHeight || 0;
            
            const x = (point.time / 16) * svgWidth;
            const y = svgHeight - ((point.value - min) / (max - min)) * svgHeight;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={isDragging === index ? 5 : 4}
                fill={isDragging === index ? "#ffffff" : color}
                stroke="#000000"
                strokeWidth="1"
                onMouseDown={(e) => handlePointMouseDown(index, e)}
                className="cursor-move"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default AutomationLane;
