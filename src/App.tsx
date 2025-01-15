import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Map, Settings, Shield, Target } from 'lucide-react';
import type { Resources, GameSettings, Unit, Quest, Notification, MapSector } from './types';
import ResourceBar from './components/ResourceBar';
import SettingsPanel from './components/SettingsPanel';
import HelpOverlay from './components/HelpOverlay';
import { createAWSClients } from './config/aws';

const INITIAL_RESOURCES: Resources = {
  energy: { amount: 1000, increment: 10, capacity: 5000 },
  dataShards: { amount: 500, increment: 5, capacity: 2000 },
  quantumCores: { amount: 100, increment: 1, capacity: 1000 }
};

const INITIAL_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicVolume: 70,
  sfxVolume: 80,
  graphicsQuality: 'high',
  notifications: true,
  autoSave: true,
  theme: 'neon'
};

const generateMapSectors = (): MapSector[] => {
  return Array(64).fill(null).map((_, i) => ({
    id: i,
    type: Math.random() > 0.7 ? 'enemy' : Math.random() > 0.5 ? 'neutral' : 'friendly',
    resources: Math.random() > 0.5 ? {
      energy: Math.floor(Math.random() * 1000),
      dataShards: Math.floor(Math.random() * 500),
      quantumCores: Math.floor(Math.random() * 100)
    } : undefined,
    threat: Math.floor(Math.random() * 100),
    units: []
  }));
};

const NeonGenesisUI = () => {

  const aws = createAWSClients();


  const [settings, setSettings] = useState<GameSettings>(INITIAL_SETTINGS);
  const [resources, setResources] = useState<Resources>(INITIAL_RESOURCES);
  const [mapSectors, setMapSectors] = useState<MapSector[]>(generateMapSectors());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activePanel, setActivePanel] = useState('map');
  const [selectedSector, setSelectedSector] = useState<MapSector | null>(null);

  const [units, setUnits] = useState<Unit[]>([
    {
      id: 1,
      name: 'Quantum Striker',
      type: 'attack',
      level: 5,
      attack: 75,
      defense: 60,
      cost: { energy: 100, dataShards: 50 },
      description: 'High-damage assault unit',
      experience: 450,
      maxExperience: 1000
    },
    {
      id: 2,
      name: 'Data Guardian',
      type: 'defense',
      level: 4,
      attack: 45,
      defense: 90,
      cost: { energy: 150, dataShards: 75 },
      description: 'Specialized defensive unit',
      experience: 300,
      maxExperience: 1000
    }
  ]);

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 1,
      title: 'Secure the Grid',
      description: 'Eliminate enemy presence in Sector 7',
      progress: 60,
      rewards: {
        energy: 500,
        dataShards: 200,
        experience: 100
      },
      difficulty: 'medium'
    },
    {
      id: 2,
      title: 'Data Mining Operation',
      description: 'Extract valuable data from contested zones',
      progress: 30,
      rewards: {
        dataShards: 400,
        quantumCores: 50,
        experience: 150
      },
      difficulty: 'hard'
    }
  ]);


  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    if (!settings.notifications) return;
    
    setNotifications(prev => [{
      ...notification,
      id: Date.now(),
      timestamp: Date.now()
    }, ...prev].slice(0, 5));
  };

  const handleSectorClick = (sector: MapSector) => {
    setSelectedSector(sector);
    if (sector.type === 'enemy') {
      addNotification({
        message: `Warning: High threat level detected in Sector ${sector.id}`,
        type: 'warning'
      });
    }
  };


  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?') {
        const helpButton = document.querySelector('[data-help-trigger]');
        if (helpButton instanceof HTMLElement) {
          helpButton.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);


  useEffect(() => {
    if (settings.autoSave) {
      const saveInterval = setInterval(async () => {
        try {
          await aws.db.saveGameState('current-user', {
            resources,
            units,
            quests,
            mapSectors,
            settings
          });
        } catch (error) {
          console.error('Failed to auto-save game state:', error);
          addNotification({
            message: 'Failed to auto-save game state. Your progress might not be saved.',
            type: 'error'
          });
        }
      }, 60000);

      return () => clearInterval(saveInterval);
    }
  }, [settings.autoSave, resources, units, quests, mapSectors]);


  useEffect(() => {
    const loadGameState = async () => {
      try {
        const savedState = await aws.db.loadGameState('current-user');
        if (savedState) {
          setResources(savedState.resources || INITIAL_RESOURCES);
          setUnits(savedState.units || []);
          setQuests(savedState.quests || []);
          setMapSectors(savedState.mapSectors || generateMapSectors());
          setSettings(savedState.settings || INITIAL_SETTINGS);
          addNotification({
            message: 'Game state loaded successfully',
            type: 'success'
          });
        }
      } catch (error) {
        console.error('Failed to load game state:', error);
        addNotification({
          message: 'Failed to load saved game state. Starting new game.',
          type: 'warning'
        });
      }
    };

    loadGameState();
  }, []);

  const handleSettingChange = (key: keyof GameSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'map':
        return (
          <div className="bg-black/50 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl mb-4 font-bold text-cyan-400">Strategic Map</h3>
            <div className="grid grid-cols-8 gap-2 h-96">
              {mapSectors.map((sector) => (
                <div
                  key={sector.id}
                  onClick={() => handleSectorClick(sector)}
                  className={`
                    relative border rounded transition-all cursor-pointer
                    ${sector.type === 'enemy' ? 'bg-red-900/30 border-red-500/20 hover:bg-red-700/30' :
                      sector.type === 'friendly' ? 'bg-green-900/30 border-green-500/20 hover:bg-green-700/30' :
                      'bg-cyan-900/30 border-cyan-500/20 hover:bg-cyan-700/30'}
                  `}
                >
                  {sector.resources && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {selectedSector && (
              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">
                  Sector {selectedSector.id} Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-cyan-200">Type: {selectedSector.type}</p>
                    <p className="text-cyan-200">Threat Level: {selectedSector.threat}%</p>
                  </div>
                  {selectedSector.resources && (
                    <div>
                      <p className="text-cyan-200">Resources Available:</p>
                      <ul className="list-disc list-inside text-cyan-300">
                        {Object.entries(selectedSector.resources).map(([key, value]) => (
                          <li key={key}>{key}: {value}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        case 'units':
          return (
            <div className="bg-black/50 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl mb-4 font-bold text-purple-400">AI Units</h3>
              <div className="grid gap-4">
                {units.map(unit => (
                  <div key={unit.id} className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-400/20 flex items-center justify-center">
                        <Cpu className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-purple-200 font-semibold">{unit.name}</h4>
                          <span className="text-purple-400 text-sm">Level {unit.level}</span>
                        </div>
                        <p className="text-purple-300 text-sm mb-2">{unit.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-purple-200">ATK: {unit.attack}</span>
                          <span className="text-purple-200">DEF: {unit.defense}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-purple-300 text-xs mb-1">
                            <span>Experience</span>
                            <span>{unit.experience} / {unit.maxExperience}</span>
                          </div>
                          <div className="w-full bg-purple-900/30 rounded-full h-1">
                            <div
                              className="bg-purple-400 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${(unit.experience / unit.maxExperience) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'quests':
          return (
            <div className="bg-black/50 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl mb-4 font-bold text-emerald-400">Active Quests</h3>
              <div className="space-y-4">
                {quests.map(quest => (
                  <div key={quest.id} className="p-4 bg-emerald-900/30 rounded-lg border border-emerald-500/20">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-emerald-200 font-semibold">{quest.title}</h4>
                        <p className="text-emerald-300 text-sm">{quest.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs
                        ${quest.difficulty === 'easy' ? 'bg-green-900/50 text-green-300' :
                          quest.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                          'bg-red-900/50 text-red-300'}`}>
                        {quest.difficulty}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-emerald-200 text-sm">
                        <span>Progress</span>
                        <span>{quest.progress}%</span>
                      </div>
                      <div className="w-full bg-emerald-900/30 rounded-full h-2">
                        <div
                          className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${quest.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <h5 className="text-emerald-300 text-sm mb-1">Rewards:</h5>
                      <div className="flex gap-4 text-sm">
                        {Object.entries(quest.rewards).map(([key, value]) => (
                          <span key={key} className="text-emerald-200">
                            {key}: +{value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
      case 'research':
        return (
          <div className="bg-black/50 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl mb-4 font-bold text-blue-400">Research Lab</h3>
            <p className="text-blue-200">Research module coming soon...</p>
          </div>
        );
      case 'settings':
        return <SettingsPanel settings={settings} onSettingChange={handleSettingChange} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-900 text-white p-6 ${
      settings.theme === 'cyber' ? 'bg-gradient-to-br from-blue-900 to-purple-900' :
      settings.theme === 'quantum' ? 'bg-gradient-to-br from-violet-900 to-indigo-900' :
      'bg-gradient-to-br from-cyan-900 to-purple-900'
    }`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-3xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-cyan-400 to-purple-400">
          NeonGenesis
        </div>
        <ResourceBar resources={resources} />
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Side Navigation */}
        <div className="flex flex-col gap-2">
          {[
            { id: 'map', icon: Map, label: 'Map' },
            { id: 'units', icon: Shield, label: 'Units' },
            { id: 'quests', icon: Target, label: 'Quests' },
            { id: 'research', icon: Activity, label: 'Research' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActivePanel(id)}
              className={`p-4 rounded-lg flex items-center gap-3 transition-all
                ${activePanel === id 
                  ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-500/20' 
                  : 'hover:bg-cyan-900/30 text-gray-400 border border-transparent'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Main Panel */}
        <div className="flex-1">
          {renderPanel()}
        </div>

        {/* Notifications */}
        <div className="w-80">
          <div className="bg-black/50 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl mb-4 font-bold text-pink-400">Notifications</h3>
            <div className="space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border text-sm
                    ${notification.type === 'warning' 
                      ? 'bg-orange-900/30 border-orange-500/20 text-orange-200'
                      : notification.type === 'error'
                      ? 'bg-red-900/30 border-red-500/20 text-red-200'
                      : notification.type === 'success'
                      ? 'bg-green-900/30 border-green-500/20 text-green-200'
                      : 'bg-pink-900/30 border-pink-500/20 text-pink-200'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <span>{notification.message}</span>
                    <span className="text-xs opacity-60">
                      {Math.floor((Date.now() - notification.timestamp) / 1000)}s ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Help Overlay */}
      <HelpOverlay />
    </div>
  );
};

export default NeonGenesisUI;