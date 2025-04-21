
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MusicIcon, Clock, Users, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export interface Project {
  id: string;
  title: string;
  description?: string;
  lastModified: string;
  collaborators: number;
  tags: string[];
  thumbnail?: string;
}

interface ProjectListProps {
  projects: Project[];
  onProjectSelect?: (projectId: string) => void;
}

const ProjectList = ({ projects, onProjectSelect }: ProjectListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Create New Project Card */}
      <Card className="glass-card border-dashed border-cyber-purple/30 flex flex-col items-center justify-center text-center p-8 hover:bg-cyber-purple/5 transition-colors cursor-pointer h-full">
        <div className="mb-4 w-16 h-16 rounded-full bg-cyber-purple/10 flex items-center justify-center">
          <MusicIcon className="h-8 w-8 text-cyber-purple" />
        </div>
        <CardTitle className="text-xl mb-2">Create New Project</CardTitle>
        <CardDescription className="text-white/70 mb-4">
          Start a fresh project and invite collaborators
        </CardDescription>
        <Button className="bg-gradient-to-r from-cyber-purple to-cyber-blue text-white">
          New Project
        </Button>
      </Card>
      
      {/* Project Cards */}
      {projects.map((project) => (
        <Link 
          to={`/studio/${project.id}`} 
          key={project.id}
          onClick={() => onProjectSelect?.(project.id)}
        >
          <Card className="glass-card border-cyber-purple/20 overflow-hidden group h-full flex flex-col">
            {/* Project Thumbnail */}
            <div className="h-32 bg-gradient-to-r from-cyber-darker to-cyber-dark relative overflow-hidden">
              {project.thumbnail ? (
                <img 
                  src={project.thumbnail} 
                  alt={project.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <AudioWaveformPlaceholder />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-darker to-transparent opacity-60"></div>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg group-hover:text-cyber-purple transition-colors">
                  {project.title}
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2 flex-grow">
              {project.description && (
                <CardDescription className="text-white/70 mb-3">
                  {project.description}
                </CardDescription>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-cyber-purple/10 text-cyber-light-purple border-cyber-purple/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 text-xs text-white/60 flex justify-between border-t border-cyber-purple/10">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {project.lastModified}
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {project.collaborators} {project.collaborators === 1 ? 'collaborator' : 'collaborators'}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

// Simple audio waveform placeholder
const AudioWaveformPlaceholder = () => {
  return (
    <div className="flex items-center justify-center h-10 gap-[2px]">
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className="bg-cyber-purple/40 w-1 rounded-full"
          style={{ 
            height: `${Math.sin(i * 0.5) * 30 + 40}%`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default ProjectList;
