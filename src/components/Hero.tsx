
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-red opacity-20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple opacity-20 rounded-full blur-[100px]"></div>
        
        {/* Grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(237,33,58,0.15)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      <div className="container mx-auto px-4 py-20 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-cyber-red/10 border border-cyber-red/20">
            <span className="text-cyber-red text-sm font-medium">Now in Beta</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
              Create Music Together
            </span>
            <br />
            <span className="text-cyber-text">in Real-Time, Anywhere</span>
          </h1>
          
          <p className="text-lg md:text-xl text-cyber-text-muted mb-8 max-w-2xl mx-auto">
            GRecStudio brings musicians, producers, and creators together in a cloud-based studio.
            Compose, record, and mix together, just like being in the same room.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90 text-white px-6 py-6">
              <Link to="/studio">
                Launch Studio
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-cyber-red/50 hover:bg-cyber-red/20 text-cyber-text px-6 py-6">
              <Link to="/features">
                See Features
              </Link>
            </Button>
          </div>
          
          {/* Waveform Animation */}
          <div className="flex items-center justify-center h-16 gap-[2px] mt-12">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="waveform-bar animate-waveform"
                style={{ 
                  animationDelay: `${i * 0.05}s`, 
                  height: `${Math.sin(i * 0.3) * 50 + 50}%`,
                  backgroundColor: i % 3 === 0 ? '#ED213A' : i % 3 === 1 ? '#8B5CF6' : '#F9636F'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
