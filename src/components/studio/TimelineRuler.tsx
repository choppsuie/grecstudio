
const TimelineRuler = () => {
  return (
    <div className="h-8 mb-2 border-b border-cyber-purple/20 flex">
      {[...Array(16)].map((_, i) => (
        <div key={i} className="flex-1 border-r border-cyber-purple/10 text-xs text-white/40 pt-1">
          {i+1}
        </div>
      ))}
    </div>
  );
};

export default TimelineRuler;
