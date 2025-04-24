
import React from "react";
import { cn } from "@/lib/utils";

interface KeyProps {
  note: number;
  isWhite: boolean;
  isActive: boolean;
  keyWidth: number;
  keyHeight: number;
  blackKeyWidth?: number;
  blackKeyHeight?: number;
  position?: {
    left: number;
  };
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  label: string;
}

const Key: React.FC<KeyProps> = ({
  note,
  isWhite,
  isActive,
  keyWidth,
  keyHeight,
  blackKeyWidth,
  blackKeyHeight,
  position,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  label
}) => {
  if (!isWhite) {
    return (
      <div
        className={cn(
          "absolute border border-gray-800/80",
          isActive ? 
            "bg-gradient-to-b from-cyber-red to-cyber-red/80" : 
            "bg-gradient-to-b from-black to-gray-800"
        )}
        style={{
          left: position?.left,
          width: blackKeyWidth,
          height: blackKeyHeight,
          borderRadius: "0 0 4px 4px",
          zIndex: 2,
          userSelect: "none",
          cursor: "pointer",
          pointerEvents: "auto",
          boxShadow: isActive ? 
            "inset 0 -5px 8px rgba(0,0,0,0.3), 0 1px 1px rgba(255, 255, 255, 0.1)" : 
            "inset 0 -8px 10px rgba(0,0,0,0.4), 0 3px 5px rgba(0, 0, 0, 0.5)"
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="button"
        aria-pressed={isActive}
        tabIndex={-1}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col justify-end items-center transition-all",
        isActive ? 
          "bg-gradient-to-b from-cyber-purple/90 to-cyber-purple/70 text-white shadow-lg" : 
          "bg-gradient-to-b from-white to-white/90 hover:bg-cyber-light-red/10",
        "border border-gray-900/50"
      )}
      style={{
        width: keyWidth,
        height: keyHeight,
        zIndex: 1,
        userSelect: "none",
        boxShadow: isActive ? 
          "inset 0 -5px 10px rgba(0,0,0,0.2), 0 2px 10px rgba(0, 0, 0, 0.2)" : 
          "inset 0 -10px 15px rgba(0,0,0,0.1), 0 0 1px rgba(0, 0, 0, 0.4)"
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="button"
      aria-pressed={isActive}
      tabIndex={-1}
    >
      <span className={cn(
        "mb-2 pointer-events-none text-[10px]", 
        isActive ? "text-white font-bold" : "text-gray-500"
      )}>
        {label}
      </span>
    </div>
  );
};

export default Key;
