
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { PlusCircle, X, AudioWaveform } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuxSendProps {
  id: string;
  name: string;
  level: number;
  onLevelChange: (id: string, level: number) => void;
  onDelete: (id: string) => void;
}

const AuxSend: React.FC<AuxSendProps> = ({
  id,
  name,
  level,
  onLevelChange,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2 py-1 border-b border-cyber-purple/10">
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium truncate text-cyber-text">{name}</span>
          <span className="text-[10px] text-cyber-purple">{Math.round(level)}%</span>
        </div>
        <Slider
          value={[level]}
          min={0}
          max={100}
          step={1}
          onValueChange={(values) => onLevelChange(id, values[0])}
          className="my-1"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 rounded-full hover:bg-cyber-purple/10 text-cyber-purple/80"
        onClick={() => onDelete(id)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

interface AuxSendPanelProps {
  trackId: string;
  sends: Array<{
    id: string;
    name: string;
    level: number;
  }>;
  availableBuses: Array<{
    id: string;
    name: string;
  }>;
  onAddSend: (trackId: string, busId: string) => void;
  onRemoveSend: (trackId: string, busId: string) => void;
  onSendLevelChange: (trackId: string, busId: string, level: number) => void;
}

const AuxSendPanel: React.FC<AuxSendPanelProps> = ({
  trackId,
  sends,
  availableBuses,
  onAddSend,
  onRemoveSend,
  onSendLevelChange,
}) => {
  const handleAddSend = (busId: string) => {
    onAddSend(trackId, busId);
  };
  
  const handleDeleteSend = (busId: string) => {
    onRemoveSend(trackId, busId);
  };
  
  const handleLevelChange = (busId: string, level: number) => {
    onSendLevelChange(trackId, busId, level);
  };
  
  // Filter available buses to show only those not already added
  const unusedBuses = availableBuses.filter(
    (bus) => !sends.some((send) => send.id === bus.id)
  );
  
  return (
    <div className="p-2 bg-cyber-dark/60 rounded-md shadow-inner border border-cyber-purple/20">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-cyber-purple">Sends & Routing</h4>
        <AudioWaveform className="h-3 w-3 text-cyber-purple/70" />
      </div>
      
      <div className="space-y-1">
        {sends.length === 0 ? (
          <div className="text-xs text-center py-2 text-cyber-text-subtle">
            No sends configured
          </div>
        ) : (
          sends.map((send) => (
            <AuxSend
              key={send.id}
              id={send.id}
              name={send.name}
              level={send.level}
              onLevelChange={handleLevelChange}
              onDelete={handleDeleteSend}
            />
          ))
        )}
      </div>
      
      {unusedBuses.length > 0 && (
        <div className="mt-2 pt-2 border-t border-cyber-purple/10">
          <div className="flex flex-wrap gap-1">
            {unusedBuses.map((bus) => (
              <Button
                key={bus.id}
                variant="outline"
                size="sm"
                className="h-6 text-xs py-0 px-2 bg-cyber-darker border-cyber-purple/20 text-cyber-text"
                onClick={() => handleAddSend(bus.id)}
              >
                <PlusCircle className="h-3 w-3 mr-1" />
                {bus.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuxSendPanel;
