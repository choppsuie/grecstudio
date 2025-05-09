import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Music, Users, Wand2, Cloud, 
  Headphones, Laptop, TabletSmartphone, Save, 
  MessageSquare, Sliders, Clock, Shield
} from "lucide-react";

const features = [
  {
    icon: <Music className="h-12 w-12 text-cyber-red" />,
    title: "Professional DAW Tools",
    description: "Full suite of recording, editing, and mixing tools right in your browser. Multi-track recording, non-destructive editing, and professional effects."
  },
  {
    icon: <Users className="h-12 w-12 text-cyber-blue" />,
    title: "Real-Time Collaboration",
    description: "Work on tracks with musicians across the globe in real-time. See changes as they happen, and communicate directly within the platform."
  },
  {
    icon: <Wand2 className="h-12 w-12 text-cyber-purple" />,
    title: "AI-Powered Assistance",
    description: "Smart tools that help with mixing decisions, suggest accompaniment, and enhance your creativity without replacing it."
  },
  {
    icon: <Cloud className="h-12 w-12 text-cyber-cyan" />,
    title: "Cloud Storage & Versioning",
    description: "Never lose a take or idea with automatic cloud storage and project versioning. Revert to previous versions at any time."
  },
  {
    icon: <Headphones className="h-12 w-12 text-cyber-light-red" />,
    title: "Low-Latency Monitoring",
    description: "Record with minimal delay for a seamless experience, as if everyone is in the same room, thanks to our optimized audio engine."
  },
  {
    icon: <Laptop className="h-12 w-12 text-cyber-red" />,
    title: "Cross-Platform Access",
    description: "Access your studio from any device with a browser. Start a project on your desktop and continue on your tablet or another computer."
  },
  {
    icon: <TabletSmartphone className="h-12 w-12 text-cyber-purple" />,
    title: "Responsive Design",
    description: "Optimized interface that adapts to any screen size, giving you a functional studio experience even on mobile devices."
  },
  {
    icon: <Save className="h-12 w-12 text-cyber-blue" />,
    title: "Import & Export",
    description: "Compatible with industry-standard formats. Import your existing tracks and export in high-quality formats for distribution."
  },
  {
    icon: <MessageSquare className="h-12 w-12 text-cyber-cyan" />,
    title: "Integrated Communication",
    description: "Built-in chat, video calls, and commenting system to streamline collaboration without switching between apps."
  },
  {
    icon: <Sliders className="h-12 w-12 text-cyber-light-red" />,
    title: "Virtual Instruments & Effects",
    description: "Access to a growing library of virtual instruments and effects to expand your sonic palette without additional plugins."
  },
  {
    icon: <Clock className="h-12 w-12 text-cyber-red" />,
    title: "Time-Saving Workflows",
    description: "Customizable templates, keyboard shortcuts, and smart tools designed to speed up your production process."
  },
  {
    icon: <Shield className="h-12 w-12 text-cyber-purple" />,
    title: "Secure Project Sharing",
    description: "Control who can view, edit, or export your music with granular permission settings for collaborators."
  }
];

const Features = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
                Professional Studio Tools
              </span>
              <br />
              <span className="text-cyber-text">
                In Your Browser
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-cyber-text-muted mb-8">
              GRecStudio combines the power of professional digital audio workstations with the accessibility of cloud technology, enabling seamless music creation and collaboration.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90 text-cyber-text px-6 py-6">
                <Link to="/studio">
                  Try Studio Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-cyber-red/50 hover:bg-cyber-red/20 text-cyber-text px-6 py-6">
                <Link to="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="container mx-auto px-4 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
            Powerful Features for Music Creators
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 rounded-lg transition-transform hover:translate-y-[-5px]">
                <div className="mb-4 relative">
                  {feature.icon}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyber-red to-cyber-purple rounded-full blur-2xl opacity-20 -z-10"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-cyber-text/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Comparison Section */}
        <div className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
              Why Choose GRecStudio?
            </h2>
            
            <div className="glass-card p-8 rounded-lg overflow-hidden">
              <div className="w-full overflow-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-cyber-purple/20">
                      <th className="py-4 px-6 text-left text-lg text-cyber-text">Feature</th>
                      <th className="py-4 px-6 text-center text-lg">
                        <span className="bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent font-bold">GRecStudio</span>
                      </th>
                      <th className="py-4 px-6 text-center text-lg text-cyber-text">Traditional DAWs</th>
                      <th className="py-4 px-6 text-center text-lg text-cyber-text">Basic Cloud Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-cyber-purple/10">
                      <td className="py-4 px-6 text-cyber-text">Professional Audio Quality</td>
                      <td className="py-4 px-6 text-center text-cyber-red">✓</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">✓</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">Limited</td>
                    </tr>
                    <tr className="border-b border-cyber-purple/10">
                      <td className="py-4 px-6 text-cyber-text">Real-time Collaboration</td>
                      <td className="py-4 px-6 text-center text-cyber-red">✓</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">Limited</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">Sometimes</td>
                    </tr>
                    <tr className="border-b border-cyber-purple/10">
                      <td className="py-4 px-6 text-cyber-text">No Software Installation</td>
                      <td className="py-4 px-6 text-center text-cyber-red">✓</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">✗</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">✓</td>
                    </tr>
                    <tr className="border-b border-cyber-purple/10">
                      <td className="py-4 px-6 text-cyber-text">Cross-Platform</td>
                      <td className="py-4 px-6 text-center text-cyber-red">✓</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">Some</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">✓</td>
                    </tr>
                    <tr className="border-b border-cyber-purple/10">
                      <td className="py-4 px-6 text-cyber-text">Advanced Mixing Tools</td>
                      <td className="py-4 px-6 text-center text-cyber-red">✓</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">✓</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">Limited</td>
                    </tr>
                    <tr className="border-b border-cyber-purple/10">
                      <td className="py-4 px-6 text-cyber-text">AI-Enhanced Production</td>
                      <td className="py-4 px-6 text-center text-cyber-red">✓</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">Limited</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">Limited</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-cyber-text">Built-in Communication</td>
                      <td className="py-4 px-6 text-center text-cyber-red">✓</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">✗</td>
                      <td className="py-4 px-6 text-center text-cyber-text-muted">Some</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center glass-card p-12 rounded-lg relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyber-red/20 to-cyber-purple/20 opacity-50"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-red opacity-20 rounded-full blur-[80px]"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-cyber-text">
              Ready to Transform Your Production Workflow?
            </h2>
            
            <p className="text-lg text-cyber-text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of musicians and producers who are already creating amazing music with GRecStudio's powerful cloud platform.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90 text-cyber-text px-6 py-6">
                <Link to="/auth?sign-up=true">
                  Get Started Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 hover:bg-white/10 text-cyber-text px-6 py-6">
                <Link to="/studio">
                  View Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Features;
