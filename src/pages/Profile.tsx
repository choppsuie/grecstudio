import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  User, Mail, Key, Bell, Music, Settings,
  Shield, Save, UserCircle, Mic, Headphones, Users
} from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "",
    email: user?.email || "",
    bio: "",
    avatar: ""
  });
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    collaborationRequests: true,
    projectUpdates: true,
    marketingEmails: false,
    darkTheme: true,
    autoSave: true,
    lowLatencyMode: false
  });
  
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Summer EP",
      lastUpdated: "2025-04-20",
      tracks: 8,
      collaborators: 2,
      status: "In Progress"
    },
    {
      id: "2",
      name: "Acoustic Cover",
      lastUpdated: "2025-04-15",
      tracks: 4,
      collaborators: 0,
      status: "Completed"
    },
    {
      id: "3",
      name: "Beat Collection",
      lastUpdated: "2025-04-10",
      tracks: 12,
      collaborators: 1,
      status: "In Progress"
    }
  ]);
  
  useEffect(() => {
    if (user?.email) {
      setProfile(prev => ({ ...prev, email: user.email || "" }));
      fetchUserProfile();
    }
  }, [user]);
  
  const fetchUserProfile = async () => {
    try {
      if (!user?.id) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setProfile({
          displayName: data.display_name || "",
          email: user?.email || "",
          bio: data.bio || "",
          avatar: data.avatar_url || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.displayName,
          bio: profile.bio,
          avatar_url: profile.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSettingsUpdate = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated."
      });
      setIsLoading(false);
    }, 600);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSettingToggle = (setting: string) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };
  
  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
              Your Profile
            </h1>
            
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid grid-cols-3 max-w-md mb-8">
                <TabsTrigger value="account" className="text-sm">
                  <User className="h-4 w-4 mr-2" /> Account
                </TabsTrigger>
                <TabsTrigger value="projects" className="text-sm">
                  <Music className="h-4 w-4 mr-2" /> Projects
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-sm">
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="glass-card p-6 rounded-lg text-center">
                      <div className="relative mx-auto w-32 h-32 mb-4">
                        {profile.avatar ? (
                          <img
                            src={profile.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-cyber-purple/20 flex items-center justify-center">
                            <UserCircle className="h-16 w-16 text-white/70" />
                          </div>
                        )}
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="absolute bottom-0 right-0 bg-cyber-darker border-cyber-purple/50"
                        >
                          <UserCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <h2 className="text-xl font-bold mb-1">
                        {profile.displayName || user?.email?.split('@')[0] || "User"}
                      </h2>
                      <p className="text-white/70 text-sm mb-4">
                        {profile.email}
                      </p>
                      
                      <div className="flex justify-center space-x-2">
                        <div className="text-center px-3 py-2 bg-cyber-purple/10 rounded-md">
                          <p className="text-lg font-bold">{projects.length}</p>
                          <p className="text-xs text-white/70">Projects</p>
                        </div>
                        <div className="text-center px-3 py-2 bg-cyber-red/10 rounded-md">
                          <p className="text-lg font-bold">3</p>
                          <p className="text-xs text-white/70">Collaborators</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <p className="text-sm text-white/70 mb-2">Member since</p>
                        <p className="text-sm font-semibold">April 2025</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="glass-card p-6 rounded-lg">
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <User className="h-5 w-5 mr-2 text-cyber-red" />
                        Profile Information
                      </h2>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="displayName" className="mb-2 block">
                              Display Name
                            </Label>
                            <Input
                              id="displayName"
                              name="displayName"
                              value={profile.displayName}
                              onChange={handleInputChange}
                              className="bg-cyber-darker border-cyber-purple/20 text-white focus:border-cyber-red/50"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="email" className="mb-2 block">
                              Email Address
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              value={profile.email}
                              disabled
                              className="bg-cyber-darker border-cyber-purple/20 text-white focus:border-cyber-red/50 opacity-70"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="bio" className="mb-2 block">
                            Bio
                          </Label>
                          <Input
                            id="bio"
                            name="bio"
                            value={profile.bio}
                            onChange={handleInputChange}
                            className="bg-cyber-darker border-cyber-purple/20 text-white focus:border-cyber-red/50"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <Button
                          className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90"
                          onClick={handleProfileUpdate}
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="glass-card p-6 rounded-lg mt-6">
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-cyber-purple" />
                        Security
                      </h2>
                      
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="currentPassword" className="mb-2 block">
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="••••••••"
                            className="bg-cyber-darker border-cyber-purple/20 text-white focus:border-cyber-red/50"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="newPassword" className="mb-2 block">
                              New Password
                            </Label>
                            <Input
                              id="newPassword"
                              type="password"
                              placeholder="••••••••"
                              className="bg-cyber-darker border-cyber-purple/20 text-white focus:border-cyber-red/50"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="confirmPassword" className="mb-2 block">
                              Confirm New Password
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              className="bg-cyber-darker border-cyber-purple/20 text-white focus:border-cyber-red/50"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <Button
                          className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90"
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="projects">
                <div className="glass-card p-6 rounded-lg mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Music className="h-5 w-5 mr-2 text-cyber-red" />
                      Your Projects
                    </h2>
                    <Button
                      className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90"
                      asChild
                    >
                      <a href="/studio">New Project</a>
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="border-b border-cyber-purple/20">
                          <th className="py-3 px-4 text-left">Project Name</th>
                          <th className="py-3 px-4 text-left">Last Updated</th>
                          <th className="py-3 px-4 text-center">Tracks</th>
                          <th className="py-3 px-4 text-center">Collaborators</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map(project => (
                          <tr key={project.id} className="border-b border-cyber-purple/10 hover:bg-cyber-purple/5">
                            <td className="py-4 px-4">
                              <a href={`/studio/${project.id}`} className="text-cyber-red hover:underline">
                                {project.name}
                              </a>
                            </td>
                            <td className="py-4 px-4 text-white/70">{project.lastUpdated}</td>
                            <td className="py-4 px-4 text-center">{project.tracks}</td>
                            <td className="py-4 px-4 text-center">{project.collaborators}</td>
                            <td className="py-4 px-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                project.status === "Completed" 
                                  ? "bg-cyber-purple/20 text-cyber-purple" 
                                  : "bg-cyber-red/20 text-cyber-red"
                              }`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={`/studio/${project.id}`}>Open</a>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {projects.length === 0 && (
                    <div className="text-center py-12">
                      <Music className="h-12 w-12 mx-auto mb-4 text-white/30" />
                      <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                      <p className="text-white/70 mb-6">Create your first music project to get started</p>
                      <Button className="bg-gradient-to-r from-cyber-red to-cyber-purple">
                        Create Project
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="glass-card p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-cyber-blue" />
                    Collaborations
                  </h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="border-b border-cyber-purple/20">
                          <th className="py-3 px-4 text-left">Project</th>
                          <th className="py-3 px-4 text-left">Owner</th>
                          <th className="py-3 px-4 text-center">Role</th>
                          <th className="py-3 px-4 text-center">Last Active</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-cyber-purple/10 hover:bg-cyber-purple/5">
                          <td className="py-4 px-4">
                            <a href="/studio/collab1" className="text-cyber-blue hover:underline">
                              Jazz Ensemble
                            </a>
                          </td>
                          <td className="py-4 px-4 text-white/70">Miles D.</td>
                          <td className="py-4 px-4 text-center">
                            <span className="px-2 py-1 rounded-full text-xs bg-cyber-blue/20 text-cyber-blue">
                              Editor
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-white/70">2025-04-21</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm" asChild>
                                <a href="/studio/collab1">Open</a>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="glass-card p-6 rounded-lg mb-8">
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-cyber-red" />
                        Notification Settings
                      </h2>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-white/70">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={() => handleSettingToggle('emailNotifications')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Collaboration Requests</p>
                            <p className="text-sm text-white/70">Get notified about collaboration invites</p>
                          </div>
                          <Switch
                            checked={settings.collaborationRequests}
                            onCheckedChange={() => handleSettingToggle('collaborationRequests')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Project Updates</p>
                            <p className="text-sm text-white/70">Notifications when collaborators make changes</p>
                          </div>
                          <Switch
                            checked={settings.projectUpdates}
                            onCheckedChange={() => handleSettingToggle('projectUpdates')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-white/70">Receive updates about new features and offers</p>
                          </div>
                          <Switch
                            checked={settings.marketingEmails}
                            onCheckedChange={() => handleSettingToggle('marketingEmails')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-6 rounded-lg">
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <Key className="h-5 w-5 mr-2 text-cyber-purple" />
                        Connected Accounts
                      </h2>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">GitHub</p>
                              <p className="text-sm text-white/70">Not connected</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="border-cyber-purple/30">
                            Connect
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center mr-4">
                              <svg className="h-6 w-6 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"></path>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Spotify</p>
                              <p className="text-sm text-white/70">Connected as user123</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="border-cyber-red/30">
                            Disconnect
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF0000]/10 flex items-center justify-center mr-4">
                              <svg className="h-6 w-6 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"></path>
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">YouTube</p>
                              <p className="text-sm text-white/70">Not connected</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="border-cyber-purple/30">
                            Connect
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="glass-card p-6 rounded-lg mb-8">
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <Mic className="h-5 w-5 mr-2 text-cyber-blue" />
                        Audio Settings
                      </h2>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auto-Save Projects</p>
                            <p className="text-sm text-white/70">Automatically save your work</p>
                          </div>
                          <Switch
                            checked={settings.autoSave}
                            onCheckedChange={() => handleSettingToggle('autoSave')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Low-Latency Mode</p>
                            <p className="text-sm text-white/70">Optimize for recording (uses more CPU)</p>
                          </div>
                          <Switch
                            checked={settings.lowLatencyMode}
                            onCheckedChange={() => handleSettingToggle('lowLatencyMode')}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="inputDevice" className="mb-2 block">
                            Default Input Device
                          </Label>
                          <select
                            id="inputDevice"
                            className="w-full bg-cyber-darker border border-cyber-purple/20 rounded-md p-2 text-white"
                          >
                            <option value="default">System Default</option>
                            <option value="mic1">Built-in Microphone</option>
                            <option value="mic2">External USB Microphone</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="outputDevice" className="mb-2 block">
                            Default Output Device
                          </Label>
                          <select
                            id="outputDevice"
                            className="w-full bg-cyber-darker border border-cyber-purple/20 rounded-md p-2 text-white"
                          >
                            <option value="default">System Default</option>
                            <option value="speakers">Built-in Speakers</option>
                            <option value="headphones">Headphones</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-6 rounded-lg">
                      <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <Headphones className="h-5 w-5 mr-2 text-cyber-red" />
                        Appearance
                      </h2>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Dark Theme</p>
                            <p className="text-sm text-white/70">Use dark mode for the interface</p>
                          </div>
                          <Switch
                            checked={settings.darkTheme}
                            onCheckedChange={() => handleSettingToggle('darkTheme')}
                          />
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2">Color Theme</p>
                          <div className="grid grid-cols-5 gap-2">
                            <button className="w-8 h-8 rounded-full bg-gradient-to-r from-cyber-red to-cyber-purple ring-2 ring-white"></button>
                            <button className="w-8 h-8 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-cyan opacity-60 hover:opacity-100 transition-opacity"></button>
                            <button className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-teal-500 opacity-60 hover:opacity-100 transition-opacity"></button>
                            <button className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 opacity-60 hover:opacity-100 transition-opacity"></button>
                            <button className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-60 hover:opacity-100 transition-opacity"></button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="fontSize" className="mb-2 block">
                            Font Size
                          </Label>
                          <select
                            id="fontSize"
                            className="w-full bg-cyber-darker border border-cyber-purple/20 rounded-md p-2 text-white"
                          >
                            <option value="small">Small</option>
                            <option value="medium" selected>Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90"
                    onClick={handleSettingsUpdate}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </span>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
