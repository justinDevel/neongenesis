import React from 'react';
import { Volume2, Monitor, Bell, Save, Palette } from 'lucide-react';
import type { GameSettings } from '../types';

interface SettingsPanelProps {
  settings: GameSettings;
  onSettingChange: (key: keyof GameSettings, value: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingChange }) => {
  return (
    <div className="bg-black/50 p-6 rounded-lg backdrop-blur-sm">
      <h3 className="text-xl mb-6 font-bold text-purple-400">Game Settings</h3>
      
      <div className="space-y-6">
        {/* Audio Settings */}
        <div className="space-y-4">
          <h4 className="text-purple-300 flex items-center gap-2">
            <Volume2 className="w-4 h-4" /> Audio
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <label className="text-purple-200">Enable Sound</label>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onSettingChange('soundEnabled', e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-purple-200 block">Music Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.musicVolume}
                onChange={(e) => onSettingChange('musicVolume', Number(e.target.value))}
                className="w-full accent-purple-500"
                disabled={!settings.soundEnabled}
              />
            </div>
            <div className="space-y-2">
              <label className="text-purple-200 block">SFX Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sfxVolume}
                onChange={(e) => onSettingChange('sfxVolume', Number(e.target.value))}
                className="w-full accent-purple-500"
                disabled={!settings.soundEnabled}
              />
            </div>
          </div>
        </div>

        {/* Graphics Settings */}
        <div className="space-y-4">
          <h4 className="text-purple-300 flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Graphics
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <label className="text-purple-200">Quality</label>
              <select
                value={settings.graphicsQuality}
                onChange={(e) => onSettingChange('graphicsQuality', e.target.value)}
                className="bg-purple-900/30 border border-purple-500/20 rounded px-3 py-1 text-purple-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-purple-200">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => onSettingChange('theme', e.target.value)}
                className="bg-purple-900/30 border border-purple-500/20 rounded px-3 py-1 text-purple-200"
              >
                <option value="neon">Neon</option>
                <option value="cyber">Cyber</option>
                <option value="quantum">Quantum</option>
              </select>
            </div>
          </div>
        </div>

        {/* Game Settings */}
        <div className="space-y-4">
          <h4 className="text-purple-300 flex items-center gap-2">
            <Save className="w-4 h-4" /> Game
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <label className="text-purple-200">Auto Save</label>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => onSettingChange('autoSave', e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-purple-200">Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => onSettingChange('notifications', e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;