import React from 'react';
import { Database, Battery, Cpu } from 'lucide-react';
import type { Resources } from '../types';

interface ResourceBarProps {
  resources: Resources;
}

const ResourceBar: React.FC<ResourceBarProps> = ({ resources }) => {
  const resourceIcons = {
    energy: Battery,
    dataShards: Database,
    quantumCores: Cpu,
  };

  return (
    <div className="flex gap-6 bg-black/30 p-3 rounded-lg backdrop-blur-sm">
      {Object.entries(resources).map(([key, resource]) => {
        const Icon = resourceIcons[key as keyof typeof resourceIcons];
        return (
          <div key={key} className="flex items-center gap-2 group relative">
            <Icon className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-cyan-200">{resource.amount}</span>
                <span className="text-cyan-400/60 text-sm">/ {resource.capacity}</span>
              </div>
              <div className="w-full bg-cyan-900/30 h-1 rounded-full mt-1">
                <div
                  className="bg-cyan-400 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(resource.amount / resource.capacity) * 100}%` }}
                />
              </div>
            </div>
            <div className="absolute -bottom-8 left-0 bg-black/90 text-xs text-cyan-300 px-2 py-1 rounded
                          opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              +{resource.increment}/s
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResourceBar;