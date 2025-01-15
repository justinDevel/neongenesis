import React, { useState } from 'react';
import { HelpCircle, X, ChevronRight } from 'lucide-react';

interface HelpSection {
  title: string;
  content: string;
  icon?: JSX.Element;
}

const helpSections: HelpSection[] = [
  {
    title: "Getting Started",
    content: "Welcome to NeoGenesis! Begin by exploring the strategic map and managing your resources. Click on sectors to view details and plan your expansion."
  },
  {
    title: "Resources",
    content: "Monitor your Energy, Data Shards, and Quantum Cores. These resources are essential for building units, researching technologies, and expanding your influence."
  },
  {
    title: "Units",
    content: "Create and manage your AI units. Each unit has unique abilities and can be upgraded using resources. Deploy them strategically to secure sectors and complete missions."
  },
  {
    title: "Quests",
    content: "Accept and complete quests to earn rewards and advance the story. Track your progress in the Quests panel and prioritize missions based on their difficulty and rewards."
  },
  {
    title: "Research",
    content: "Advance your technology through the Research panel. New discoveries unlock powerful units, resource bonuses, and strategic advantages."
  }
];

const HelpOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-500/20 rounded-lg max-w-2xl w-full mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-purple-500/20">
              <h2 className="text-2xl font-bold text-purple-400">Game Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex h-[60vh]">
              {/* Sections Navigation */}
              <div className="w-1/3 border-r border-purple-500/20 overflow-y-auto">
                {helpSections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`w-full text-left p-4 transition-colors flex items-center justify-between
                      ${activeSection === index 
                        ? 'bg-purple-900/50 text-purple-300' 
                        : 'text-gray-400 hover:bg-purple-900/30'}`}
                  >
                    <span>{section.title}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform
                      ${activeSection === index ? 'rotate-90' : ''}`} />
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <h3 className="text-xl font-bold text-purple-400 mb-4">
                  {helpSections[activeSection].title}
                </h3>
                <div className="prose prose-invert">
                  <p className="text-gray-300 leading-relaxed">
                    {helpSections[activeSection].content}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-purple-500/20 bg-gray-900/50">
              <p className="text-sm text-gray-400">
                Tip: Press '?' key anytime to open this help overlay
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpOverlay;