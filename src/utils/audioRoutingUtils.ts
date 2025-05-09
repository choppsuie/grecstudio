
import * as Tone from 'tone';

export interface AuxSend {
  id: string;
  name: string;
  sendLevel: number;
  effect: any | null; // Changed from Tone.Effect to any
}

export interface AudioBus {
  id: string;
  name: string;
  type: "main" | "aux" | "group";
  input: Tone.Gain;
  output: Tone.Gain;
  effects: any[]; // Changed from Tone.Effect[] to any[]
  isActive: boolean;
}

// Create a flexible routing system similar to ProTools
export class AudioRouting {
  private buses: Map<string, AudioBus> = new Map();
  private mainBus: AudioBus;
  private auxSends: Map<string, AuxSend> = new Map();
  
  constructor() {
    // Create main stereo bus
    const mainInput = new Tone.Gain();
    const mainOutput = new Tone.Gain().toDestination();
    mainInput.connect(mainOutput);
    
    this.mainBus = {
      id: "main",
      name: "Main Output",
      type: "main",
      input: mainInput,
      output: mainOutput,
      effects: [],
      isActive: true
    };
    
    this.buses.set("main", this.mainBus);
  }
  
  // Create a new routing bus (group or aux)
  createBus(id: string, name: string, type: "aux" | "group" = "group"): AudioBus {
    const input = new Tone.Gain();
    const output = new Tone.Gain();
    input.connect(output);
    
    // Connect to main bus by default
    output.connect(this.mainBus.input);
    
    const bus: AudioBus = {
      id,
      name,
      type,
      input,
      output,
      effects: [],
      isActive: true
    };
    
    this.buses.set(id, bus);
    return bus;
  }
  
  // Add an effect to a bus
  addEffect(busId: string, effect: any): void { // Changed from Tone.Effect to any
    const bus = this.buses.get(busId);
    if (!bus) return;
    
    // Disconnect the direct path
    bus.input.disconnect();
    
    // If there are existing effects
    if (bus.effects.length > 0) {
      // Disconnect the last effect from output
      bus.effects[bus.effects.length - 1].disconnect();
      // Connect the last effect to the new effect
      bus.effects[bus.effects.length - 1].connect(effect);
    } else {
      // Connect the input to the new effect
      bus.input.connect(effect);
    }
    
    // Connect the new effect to the output
    effect.connect(bus.output);
    
    // Add the effect to the effects array
    bus.effects.push(effect);
  }
  
  // Create an aux send (like in ProTools)
  createAuxSend(id: string, name: string, effectType: "reverb" | "delay" | "chorus" | null = null): AuxSend {
    let effect: any | null = null; // Changed from Tone.Effect to any
    
    // Create the specified effect
    if (effectType) {
      switch (effectType) {
        case "reverb":
          effect = new Tone.Reverb(3);
          break;
        case "delay":
          effect = new Tone.FeedbackDelay("8n", 0.5);
          break;
        case "chorus":
          effect = new Tone.Chorus(4, 2.5, 0.5);
          break;
      }
    }
    
    const send: AuxSend = {
      id,
      name,
      sendLevel: 0,
      effect
    };
    
    this.auxSends.set(id, send);
    
    // Create a bus for this aux send
    this.createBus(id, name, "aux");
    
    // Add the effect to the bus if one was created
    if (effect) {
      this.addEffect(id, effect);
    }
    
    return send;
  }
  
  // Route a track to a bus
  routeTrackToBus(trackOutput: Tone.ToneAudioNode, busId: string): void {
    const bus = this.buses.get(busId);
    if (!bus) return;
    
    trackOutput.disconnect();
    trackOutput.connect(bus.input);
  }
  
  // Send a track to an aux (with send level)
  sendTrackToAux(trackOutput: Tone.ToneAudioNode, auxId: string, level: number): void {
    const bus = this.buses.get(auxId);
    if (!bus || bus.type !== "aux") return;
    
    const send = new Tone.Gain(level / 100);
    trackOutput.connect(send);
    send.connect(bus.input);
    
    // Update aux send level
    const auxSend = this.auxSends.get(auxId);
    if (auxSend) {
      auxSend.sendLevel = level;
    }
  }
  
  // Get all available buses
  getAllBuses(): AudioBus[] {
    return Array.from(this.buses.values());
  }
  
  // Get all aux sends
  getAllAuxSends(): AuxSend[] {
    return Array.from(this.auxSends.values());
  }
  
  // Cleanup and dispose all routing
  dispose(): void {
    this.buses.forEach((bus) => {
      bus.effects.forEach((effect) => effect.dispose());
      bus.input.dispose();
      bus.output.dispose();
    });
    
    this.buses.clear();
    this.auxSends.clear();
  }
}

// Create ProTools-style automation curves for parameters
export class AutomationCurve {
  private points: { time: number, value: number }[] = [];
  private parameter: Tone.Param<any>;
  
  constructor(parameter: Tone.Param<any>) {
    this.parameter = parameter;
  }
  
  // Add a point to the automation curve
  addPoint(time: number, value: number): void {
    // Keep points sorted by time
    this.points.push({ time, value });
    this.points.sort((a, b) => a.time - b.time);
  }
  
  // Remove a point from the curve
  removePoint(index: number): void {
    if (index >= 0 && index < this.points.length) {
      this.points.splice(index, 1);
    }
  }
  
  // Clear all automation points
  clearPoints(): void {
    this.points = [];
  }
  
  // Apply the automation to the parameter
  applyAutomation(transportTime: number = 0): void {
    // Cancel any scheduled automation
    this.parameter.cancelScheduledValues(transportTime);
    
    // Apply each point in sequence
    this.points.forEach((point) => {
      if (point.time >= transportTime) {
        this.parameter.linearRampToValueAtTime(point.value, point.time);
      }
    });
  }
  
  // Get all automation points
  getPoints(): { time: number, value: number }[] {
    return [...this.points];
  }
}

// Create effects presets like ProTools
export const effectsPresets = {
  reverbs: {
    smallRoom: {
      decay: 1.0,
      preDelay: 0.01,
      wet: 0.3
    },
    largeHall: {
      decay: 3.0,
      preDelay: 0.03,
      wet: 0.4
    },
    cathedral: {
      decay: 5.0,
      preDelay: 0.1,
      wet: 0.5
    },
    plate: {
      decay: 2.0,
      preDelay: 0.0,
      wet: 0.4
    }
  },
  delays: {
    slap: {
      delayTime: 0.1,
      feedback: 0.2,
      wet: 0.3
    },
    echo: {
      delayTime: 0.25,
      feedback: 0.4,
      wet: 0.4
    },
    pingPong: {
      delayTime: 0.25,
      feedback: 0.6,
      wet: 0.5
    }
  },
  compressors: {
    gentle: {
      threshold: -20,
      ratio: 2,
      attack: 0.1,
      release: 0.2
    },
    drums: {
      threshold: -18,
      ratio: 4,
      attack: 0.01,
      release: 0.1
    },
    vocal: {
      threshold: -24,
      ratio: 3,
      attack: 0.05,
      release: 0.2
    },
    master: {
      threshold: -12,
      ratio: 2,
      attack: 0.02,
      release: 0.2
    }
  },
  applyPreset: (effect: any, preset: Record<string, any>): void => { // Changed from Tone.Effect to any
    Object.entries(preset).forEach(([key, value]) => {
      if ((effect as any)[key] !== undefined) {
        (effect as any)[key] = value;
      }
    });
  }
};
