import React, { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";
import { useToast } from "@/hooks/use-toast";
import { useSynth, SynthType } from "@/hooks/useSynth";

const StudioMenubar = () => {
  const { toast } = useToast();
  const { changeSynthType, currentSynth } = useSynth();

  const handleAction = (action: string) => {
    toast({
      title: action,
      description: `${action} action triggered`,
    });
  };

  const handleSynthChange = (type: SynthType) => {
    changeSynthType(type);
    toast({
      title: "Synth Changed",
      description: `Changed to ${type} synthesizer`,
    });
  };

  return (
    <Menubar className="h-8 px-0 rounded-none border-0 border-b border-cyber-purple/20 bg-cyber-darker">
      <MenubarMenu>
        <MenubarTrigger className="h-8 px-3 text-xs font-medium">File</MenubarTrigger>
        <MenubarContent className="bg-cyber-darker border-cyber-purple/30">
          <MenubarItem onClick={() => handleAction("New Project")}>
            New Project <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Open Project")}>
            Open Project <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Save")}>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Save As")}>
            Save As... <MenubarShortcut>⇧⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent className="bg-cyber-darker border-cyber-purple/30">
              <MenubarItem onClick={() => handleAction("Export as MP3")}>
                MP3
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Export as WAV")}>
                WAV
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Export as Stems")}>
                Stems
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Project Settings")}>
            Project Settings
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Exit")}>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="h-8 px-3 text-xs font-medium">Edit</MenubarTrigger>
        <MenubarContent className="bg-cyber-darker border-cyber-purple/30">
          <MenubarItem onClick={() => handleAction("Undo")}>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Redo")}>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Cut")}>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Copy")}>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Paste")}>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Select All")}>
            Select All <MenubarShortcut>⌘A</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Split at Playhead")}>
            Split at Playhead <MenubarShortcut>⌘B</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Group Selected")}>
            Group Selected <MenubarShortcut>⌘G</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="h-8 px-3 text-xs font-medium">Mix</MenubarTrigger>
        <MenubarContent className="bg-cyber-darker border-cyber-purple/30">
          <MenubarItem onClick={() => handleAction("Show Mixer")}>
            Show Mixer
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Add Effects</MenubarSubTrigger>
            <MenubarSubContent className="bg-cyber-darker border-cyber-purple/30">
              <MenubarItem onClick={() => handleAction("Add Reverb")}>Reverb</MenubarItem>
              <MenubarItem onClick={() => handleAction("Add Delay")}>Delay</MenubarItem>
              <MenubarItem onClick={() => handleAction("Add Compressor")}>Compressor</MenubarItem>
              <MenubarItem onClick={() => handleAction("Add EQ")}>Equalizer</MenubarItem>
              <MenubarItem onClick={() => handleAction("Add Chorus")}>Chorus</MenubarItem>
              <MenubarItem onClick={() => handleAction("Add Distortion")}>Distortion</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem onClick={() => handleAction("Add Instrument")}>
            Add Instrument
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Master Output</MenubarSubTrigger>
            <MenubarSubContent className="bg-cyber-darker border-cyber-purple/30">
              <MenubarItem onClick={() => handleAction("Set Output to Main")}>
                Main
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Set Output to Headphones")}>
                Headphones
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Normalize Levels")}>
            Normalize Levels
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Auto-Mix")}>
            Auto-Mix
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="h-8 px-3 text-xs font-medium">Track</MenubarTrigger>
        <MenubarContent className="bg-cyber-darker border-cyber-purple/30">
          <MenubarItem onClick={() => handleAction("Add Audio Track")}>
            Add Audio Track <MenubarShortcut>⇧⌘A</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Add MIDI Track")}>
            Add MIDI Track <MenubarShortcut>⇧⌘M</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Add Instrument Track")}>
            Add Instrument Track <MenubarShortcut>⇧⌘I</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Add Drum Track")}>
            Add Drum Track <MenubarShortcut>⇧⌘D</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Delete Selected Track")}>
            Delete Selected Track <MenubarShortcut>⌫</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Track Settings</MenubarSubTrigger>
            <MenubarSubContent className="bg-cyber-darker border-cyber-purple/30">
              <MenubarItem onClick={() => handleAction("Track Color")}>
                Change Color
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Track Rename")}>
                Rename
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Track Duplicate")}>
                Duplicate
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Track Freeze")}>
                Freeze Track
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Track Bounce")}>
                Bounce to Audio
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="h-8 px-3 text-xs font-medium">Sound</MenubarTrigger>
        <MenubarContent className="bg-cyber-darker border-cyber-purple/30">
          <MenubarItem onClick={() => handleAction("Open Sound Browser")}>
            Sound Browser
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Synthesizers</MenubarSubTrigger>
            <MenubarSubContent className="bg-cyber-darker border-cyber-purple/30">
              <MenubarRadioGroup value={currentSynth}>
                <MenubarRadioItem value="basic" onClick={() => handleSynthChange("basic")}>
                  Basic Synth
                </MenubarRadioItem>
                <MenubarRadioItem value="fm" onClick={() => handleSynthChange("fm")}>
                  FM Synth
                </MenubarRadioItem>
                <MenubarRadioItem value="am" onClick={() => handleSynthChange("am")}>
                  AM Synth
                </MenubarRadioItem>
                <MenubarRadioItem value="membrane" onClick={() => handleSynthChange("membrane")}>
                  Membrane Synth
                </MenubarRadioItem>
                <MenubarRadioItem value="pluck" onClick={() => handleSynthChange("pluck")}>
                  Pluck Synth
                </MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSub>
            <MenubarSubTrigger>Virtual Instruments</MenubarSubTrigger>
            <MenubarSubContent className="bg-cyber-darker border-cyber-purple/30">
              <MenubarItem onClick={() => handleAction("Open Piano")}>
                Piano
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Open Drums")}>
                Drum Pads
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Open Bass")}>
                Bass
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Open Guitar")}>
                Guitar
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Open Strings")}>
                Strings
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Open Brass")}>
                Brass
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Import Sample")}>
            Import Sample
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Record Audio")}>
            Record Audio
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Plugins</MenubarSubTrigger>
            <MenubarSubContent className="bg-cyber-darker border-cyber-purple/30">
              <MenubarItem onClick={() => handleAction("Manage Plugins")}>
                Manage Plugins
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => handleAction("Add Reverb Plugin")}>
                Reverb
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Add Delay Plugin")}>
                Delay
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Add Compressor Plugin")}>
                Compressor
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Add EQ Plugin")}>
                Equalizer
              </MenubarItem>
              <MenubarItem onClick={() => handleAction("Add VST Plugin")}>
                Load VST...
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem onClick={() => handleAction("Create Drum Pattern")}>
            Create Drum Pattern
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="h-8 px-3 text-xs font-medium">View</MenubarTrigger>
        <MenubarContent className="bg-cyber-darker border-cyber-purple/30">
          <MenubarCheckboxItem onClick={() => handleAction("Toggle Track List")}>
            Track List
          </MenubarCheckboxItem>
          <MenubarCheckboxItem onClick={() => handleAction("Toggle Mixer")}>
            Mixer
          </MenubarCheckboxItem>
          <MenubarCheckboxItem onClick={() => handleAction("Toggle Piano Roll")}>
            Piano Roll
          </MenubarCheckboxItem>
          <MenubarCheckboxItem onClick={() => handleAction("Toggle Effects Panel")}>
            Effects Panel
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Windows</MenubarSubTrigger>
            <MenubarSubContent className="bg-cyber-darker border-cyber-purple/30">
              <MenubarCheckboxItem onClick={() => handleAction("Toggle Drum Editor")}>
                Drum Editor
              </MenubarCheckboxItem>
              <MenubarCheckboxItem onClick={() => handleAction("Toggle Automation")}>
                Automation
              </MenubarCheckboxItem>
              <MenubarCheckboxItem onClick={() => handleAction("Toggle Sample Browser")}>
                Sample Browser
              </MenubarCheckboxItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Zoom In")}>
            Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Zoom Out")}>
            Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Fit to Window")}>
            Fit to Window
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="h-8 px-3 text-xs font-medium">Help</MenubarTrigger>
        <MenubarContent className="bg-cyber-darker border-cyber-purple/30">
          <MenubarItem onClick={() => handleAction("User Manual")}>
            User Manual
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Keyboard Shortcuts")}>
            Keyboard Shortcuts
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Video Tutorials")}>
            Video Tutorials
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Check for Updates")}>
            Check for Updates
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("About CyberDAW")}>
            About CyberDAW
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default StudioMenubar;
