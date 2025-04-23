
import React from "react";
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
} from "@/components/ui/menubar";
import { useToast } from "@/hooks/use-toast";

const StudioMenubar = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: action,
      description: `${action} action triggered`,
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
          <MenubarItem onClick={() => handleAction("Export")}>
            Export <MenubarShortcut>⌘E</MenubarShortcut>
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
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="h-8 px-3 text-xs font-medium">Mix</MenubarTrigger>
        <MenubarContent className="bg-cyber-darker border-cyber-purple/30">
          <MenubarItem onClick={() => handleAction("Show Mixer")}>
            Show Mixer
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Add Audio Effect")}>
            Add Audio Effect
          </MenubarItem>
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
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="h-8 px-3 text-xs font-medium">Track</MenubarTrigger>
        <MenubarContent className="bg-cyber-darker border-cyber-purple/30">
          <MenubarItem onClick={() => handleAction("Add Audio Track")}>
            Add Audio Track
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Add MIDI Track")}>
            Add MIDI Track
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Delete Selected Track")}>
            Delete Selected Track
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
          <MenubarItem onClick={() => handleAction("Import Sample")}>
            Import Sample
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Record Audio")}>
            Record Audio
          </MenubarItem>
          <MenubarSeparator />
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
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("Zoom In")}>
            Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => handleAction("Zoom Out")}>
            Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
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
          <MenubarSeparator />
          <MenubarItem onClick={() => handleAction("About")}>
            About CyberDAW
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default StudioMenubar;
