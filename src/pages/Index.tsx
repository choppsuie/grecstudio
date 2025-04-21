
import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import ProjectList, { Project } from "@/components/ProjectList";

const Index = () => {
  // Mock project data
  const [recentProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Synthwave Dreams",
      description: "Collaborative 80s-inspired electronic track",
      lastModified: "1 day ago",
      collaborators: 3,
      tags: ["Electronic", "Synthwave"]
    },
    {
      id: "2",
      title: "Acoustic Session",
      description: "Live recording with vocals and guitar",
      lastModified: "3 days ago",
      collaborators: 2,
      tags: ["Acoustic", "Vocal"]
    },
    {
      id: "3",
      title: "Beat Exploration",
      description: "Hip-hop instrumental with jazz samples",
      lastModified: "1 week ago",
      collaborators: 1,
      tags: ["Hip-Hop", "Jazz"]
    }
  ]);

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Recent Projects Section */}
      <div className="py-20 container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Recent Projects</h2>
          <p className="text-white/70">Continue working on your music or start something new.</p>
        </div>
        
        <ProjectList projects={recentProjects} />
      </div>
      
      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-purple opacity-20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-blue opacity-20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl mx-auto">
            Ready to Create Music in the Cloud?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Join musicians worldwide and start collaborating on your next hit track today.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-cyber-purple to-cyber-blue hover:opacity-90 text-white px-8">
            <Link to="/studio">
              Launch Studio
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-cyber-darker border-t border-cyber-purple/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-xl font-bold bg-gradient-to-r from-cyber-purple to-cyber-blue bg-clip-text text-transparent">
                CloudJam
              </span>
            </div>
            
            <div className="flex space-x-6 text-sm text-white/60">
              <a href="#" className="hover:text-cyber-purple transition-colors">Terms</a>
              <a href="#" className="hover:text-cyber-purple transition-colors">Privacy</a>
              <a href="#" className="hover:text-cyber-purple transition-colors">Support</a>
              <a href="#" className="hover:text-cyber-purple transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-white/40">
            © {new Date().getFullYear()} CloudJam. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
