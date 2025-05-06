
import React from "react";
import { DrumPad } from "@/hooks/drum-machine/types";

interface DrumPadGridProps {
  pads: DrumPad[];
  activeKey: string | null;
  isLoaded: boolean;
  onPadClick: (padId: string) => void;
}

const DrumPadGrid: React.FC<DrumPadGridProps> = ({ 
  pads, 
  activeKey, 
  isLoaded, 
  onPadClick 
}) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {pads.map((pad) => (
        <button
          key={pad.id}
          className={`aspect-square rounded-md flex flex-col items-center justify-center transition-all duration-100 p-2 ${
            activeKey === pad.key ? 'scale-95 brightness-150' : 'hover:brightness-110'
          }`}
          style={{ 
            backgroundColor: `${pad.color}40`, 
            borderLeft: `2px solid ${pad.color}80`,
            borderBottom: `2px solid ${pad.color}80`
          }}
          onClick={() => onPadClick(pad.id)}
          disabled={!isLoaded}
        >
          <span className="text-xs font-bold mb-1" style={{ color: pad.color }}>
            {pad.name}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-dark/50 text-cyber-purple">
            {pad.key.toUpperCase()}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DrumPadGrid;
