
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Volume2, 
  Waves, 
  Clock, 
  Activity, 
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  RotateCw,
  Power
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Plugin {
  id: string;
  name: string;
  type: string;
  active: boolean;
  settings: Record<string, number>;
}

const PluginsPanel: React.FC = () => {
  const { toast } = useToast();
  const [activePluginId, setActivePluginId] = useState<string | null>(null);
  
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: "reverb-1",
      name: "Reverb",
      type: "reverb",
      active: true,
      settings: {
        decay: 50,
        mix: 70,
        preDelay: 20,
        size: 80
      }
    },
    {
      id: "delay-1",
      name: "Delay",
      type: "delay",
      active: true,
      settings: {
        time: 35,
        feedback: 60,
        mix: 50,
        pingPong: 100
      }
    },
    {
      id: "eq-1",
      name: "Equalizer",
      type: "eq",
      active: true,
      settings: {
        low: 60,
        mid: 50,
        high: 55,
        gain: 70
      }
    }
  ]);
  
  // Plugin that's currently being edited
  const activePlugin = plugins.find(plugin => plugin.id === activePluginId);

  const togglePlugin = (id: string) => {
    setPlugins(plugins.map(plugin => 
      plugin.id === id ? { ...plugin, active: !plugin.active } : plugin
    ));
    
    const plugin = plugins.find(p => p.id === id);
    if (plugin) {
      toast({
        title: `${plugin.name} ${plugin.active ? 'Disabled' : 'Enabled'}`,
        description: `${plugin.name} plugin is now ${plugin.active ? 'off' : 'on'}`
      });
    }
  };

  const removePlugin = (id: string) => {
    const pluginToRemove = plugins.find(p => p.id === id);
    
    setPlugins(plugins.filter(plugin => plugin.id !== id));
    
    if (activePluginId === id) {
      setActivePluginId(null);
    }
    
    toast({
      title: "Plugin Removed",
      description: `${pluginToRemove?.name} has been removed from the chain`
    });
  };
  
  const movePlugin = (id: string, direction: 'up' | 'down') => {
    const index = plugins.findIndex(p => p.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === plugins.length - 1)
    ) {
      return;
    }
    
    const newPlugins = [...plugins];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newPlugins[index], newPlugins[targetIndex]] = [newPlugins[targetIndex], newPlugins[index]];
    setPlugins(newPlugins);
    
    toast({
      title: "Plugin Reordered",
      description: `${plugins[index].name} moved ${direction}`
    });
  };
  
  const updatePluginSetting = (id: string, setting: string, value: number) => {
    setPlugins(plugins.map(plugin => 
      plugin.id === id ? 
        { 
          ...plugin, 
          settings: { 
            ...plugin.settings, 
            [setting]: value 
          } 
        } 
        : plugin
    ));
  };
  
  const addPlugin = (type: string) => {
    const newPlugin: Plugin = {
      id: `${type}-${plugins.length + 1}`,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type: type,
      active: true,
      settings: type === 'reverb' 
        ? { decay: 50, mix: 50, preDelay: 30, size: 60 }
        : type === 'delay' 
          ? { time: 40, feedback: 50, mix: 50, pingPong: 0 }
          : { low: 50, mid: 50, high: 50, gain: 50 }
    };
    
    setPlugins([...plugins, newPlugin]);
    setActivePluginId(newPlugin.id);
    
    toast({
      title: "Plugin Added",
      description: `${newPlugin.name} has been added to the chain`
    });
  };
  
  const renderPluginControls = (plugin: Plugin) => {
    switch (plugin.type) {
      case 'reverb':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Decay</label>
                <span className="text-xs">{plugin.settings.decay}%</span>
              </div>
              <Slider 
                value={[plugin.settings.decay]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'decay', values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Size</label>
                <span className="text-xs">{plugin.settings.size}%</span>
              </div>
              <Slider 
                value={[plugin.settings.size]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'size', values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Pre-Delay</label>
                <span className="text-xs">{plugin.settings.preDelay}ms</span>
              </div>
              <Slider 
                value={[plugin.settings.preDelay]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'preDelay', values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Mix</label>
                <span className="text-xs">{plugin.settings.mix}%</span>
              </div>
              <Slider 
                value={[plugin.settings.mix]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'mix', values[0])} 
              />
            </div>
          </div>
        );
      
      case 'delay':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Time</label>
                <span className="text-xs">{plugin.settings.time}ms</span>
              </div>
              <Slider 
                value={[plugin.settings.time]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'time', values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Feedback</label>
                <span className="text-xs">{plugin.settings.feedback}%</span>
              </div>
              <Slider 
                value={[plugin.settings.feedback]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'feedback', values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Mix</label>
                <span className="text-xs">{plugin.settings.mix}%</span>
              </div>
              <Slider 
                value={[plugin.settings.mix]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'mix', values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Ping Pong</label>
                <span className="text-xs">{plugin.settings.pingPong}%</span>
              </div>
              <Slider 
                value={[plugin.settings.pingPong]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'pingPong', values[0])} 
              />
            </div>
          </div>
        );
        
      case 'eq':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Low</label>
                <span className="text-xs">{plugin.settings.low}%</span>
              </div>
              <Slider 
                value={[plugin.settings.low]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'low', values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Mid</label>
                <span className="text-xs">{plugin.settings.mid}%</span>
              </div>
              <Slider 
                value={[plugin.settings.mid]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'mid', values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">High</label>
                <span className="text-xs">{plugin.settings.high}%</span>
              </div>
              <Slider 
                value={[plugin.settings.high]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'high', values[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs">Gain</label>
                <span className="text-xs">{plugin.settings.gain}%</span>
              </div>
              <Slider 
                value={[plugin.settings.gain]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(values) => updatePluginSetting(plugin.id, 'gain', values[0])} 
              />
            </div>
          </div>
        );
        
      default:
        return <div>No controls available</div>;
    }
  };
  
  const getPluginIcon = (type: string) => {
    switch (type) {
      case 'reverb':
        return <Waves className="w-4 h-4" />;
      case 'delay':
        return <Clock className="w-4 h-4" />;
      case 'eq':
        return <Activity className="w-4 h-4" />;
      default:
        return <Volume2 className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <div className="space-y-2 mb-4">
        <h3 className="text-sm font-medium mb-2">Audio Effects Chain</h3>
        
        {plugins.length === 0 ? (
          <div className="text-xs text-center py-8 text-cyber-purple/60">
            No plugins added yet. Add one below!
          </div>
        ) : (
          <div className="space-y-2">
            {plugins.map((plugin) => (
              <div 
                key={plugin.id}
                className={`p-2 rounded-md flex justify-between items-center cursor-pointer border transition-colors ${
                  activePluginId === plugin.id 
                    ? 'bg-cyber-dark border-cyber-purple' 
                    : 'bg-cyber-darker border-cyber-purple/20'
                } ${
                  !plugin.active ? 'opacity-50' : ''
                }`}
                onClick={() => setActivePluginId(plugin.id === activePluginId ? null : plugin.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${
                    plugin.active ? 'bg-cyber-purple/20' : 'bg-cyber-dark/50'
                  }`}>
                    {getPluginIcon(plugin.type)}
                  </div>
                  <span className="text-xs">{plugin.name}</span>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlugin(plugin.id);
                    }}
                  >
                    <Power className={`h-3 w-3 ${plugin.active ? 'text-green-400' : 'text-gray-400'}`} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      movePlugin(plugin.id, 'up');
                    }}
                    disabled={plugins.indexOf(plugin) === 0}
                  >
                    <MoveUp className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      movePlugin(plugin.id, 'down');
                    }}
                    disabled={plugins.indexOf(plugin) === plugins.length - 1}
                  >
                    <MoveDown className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePlugin(plugin.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {activePlugin && (
        <div className="p-3 bg-cyber-darker rounded-md border border-cyber-purple/30 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-semibold flex items-center">
              {getPluginIcon(activePlugin.type)}
              <span className="ml-2">{activePlugin.name} Settings</span>
            </h4>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setActivePluginId(null)}>
              <RotateCw className="h-3 w-3" />
            </Button>
          </div>
          
          {renderPluginControls(activePlugin)}
        </div>
      )}
      
      <div>
        <h4 className="text-xs font-medium mb-2">Add Plugin</h4>
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center" 
            onClick={() => addPlugin('reverb')}
          >
            <Plus className="w-3 h-3 mr-1" />
            <Waves className="w-3 h-3 mr-1" />
            Reverb
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center"
            onClick={() => addPlugin('delay')}
          >
            <Plus className="w-3 h-3 mr-1" />
            <Clock className="w-3 h-3 mr-1" />
            Delay
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center"
            onClick={() => addPlugin('eq')}
          >
            <Plus className="w-3 h-3 mr-1" />
            <Activity className="w-3 h-3 mr-1" />
            EQ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PluginsPanel;
