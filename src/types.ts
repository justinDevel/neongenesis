export interface Resource {
  amount: number;
  increment: number;
  capacity: number;
}

export interface Resources {
  energy: Resource;
  dataShards: Resource;
  quantumCores: Resource;
}

export interface Unit {
  id: number;
  name: string;
  type: 'attack' | 'defense' | 'support';
  level: number;
  attack: number;
  defense: number;
  cost: {
    energy: number;
    dataShards: number;
  };
  description: string;
  experience: number;
  maxExperience: number;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  progress: number;
  rewards: {
    energy?: number;
    dataShards?: number;
    quantumCores?: number;
    experience?: number;
  };
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  graphicsQuality: 'low' | 'medium' | 'high';
  notifications: boolean;
  autoSave: boolean;
  theme: 'neon' | 'cyber' | 'quantum';
}

export interface MapSector {
  id: number;
  type: 'neutral' | 'friendly' | 'enemy' | 'contested';
  resources?: {
    energy?: number;
    dataShards?: number;
    quantumCores?: number;
  };
  units?: Unit[];
  threat: number;
}