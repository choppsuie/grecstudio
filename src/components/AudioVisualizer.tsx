import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  isPlaying?: boolean;
  color?: string;
}

const AudioVisualizer = ({ isPlaying = true, color = "#8B5CF6" }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);
    
    // For animation
    let animationId: number;
    let barValues: number[] = [];
    
    // Initialize bar values
    const barCount = 128;
    for (let i = 0; i < barCount; i++) {
      barValues[i] = Math.random() * 0.4 + 0.1; // Random values between 0.1 and 0.5
    }
    
    // Animation function
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      const barWidth = canvas.offsetWidth / barCount;
      const barMaxHeight = canvas.offsetHeight * 0.8;
      
      // Draw bars
      for (let i = 0; i < barCount; i++) {
        // If playing, animate the bars
        if (isPlaying) {
          // Create a "moving" effect
          barValues[i] += (Math.random() * 0.1 - 0.05);
          
          // Keep values between 0.1 and 1
          barValues[i] = Math.max(0.1, Math.min(1, barValues[i]));
        }
        
        const barHeight = barValues[i] * barMaxHeight;
        
        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, canvas.offsetHeight - barHeight, 0, canvas.offsetHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(139, 92, 246, 0.3)");
        
        ctx.fillStyle = gradient;
        
        // Draw rounded bars
        const x = i * barWidth;
        const y = canvas.offsetHeight - barHeight;
        const width = barWidth * 0.8;
        const height = barHeight;
        const radius = Math.min(width / 2, 4);
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      }
      
      // Request next frame
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, color]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
    />
  );
};

export default AudioVisualizer;
