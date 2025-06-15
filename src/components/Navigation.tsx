import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Code, Briefcase, Trophy, Award, Mail, Rocket, Terminal, Menu, X } from 'lucide-react';
import { Section } from '../types';

interface NavigationProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  progress: number;
}

const navigationItems = [
  { id: 'hero' as Section, icon: Terminal, label: 'INIT' },
  { id: 'about' as Section, icon: User, label: 'ABOUT' },
  { id: 'skills' as Section, icon: Code, label: 'TECH' },
  { id: 'experience' as Section, icon: Briefcase, label: 'EXP' },
  { id: 'projects' as Section, icon: Trophy, label: 'PROJ' },
  { id: 'achievements' as Section, icon: Award, label: 'ACHV' },
  { id: 'contact' as Section, icon: Mail, label: 'COMM' },
];

export const Navigation: React.FC<NavigationProps> = ({ 
  currentSection, 
  onSectionChange, 
  progress 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[70] lg:hidden w-12 h-12 bg-gray-900 backdrop-blur-lg rounded-xl border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-400/20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Desktop Navigation Panel */}
      <motion.nav
        className="fixed left-0 top-0 h-full z-[60] hidden lg:flex flex-col justify-center"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-gray-900/95 backdrop-blur-lg rounded-r-2xl p-4 border-r-2 border-emerald-400 shadow-2xl shadow-emerald-400/20 max-h-[80vh] overflow-y-auto">
          {/* Progress Ring */}
          <div className="relative mb-6">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="rgba(16, 185, 129, 0.3)"
                strokeWidth="3"
                fill="transparent"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="#10B981"
                strokeWidth="3"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress)}`}
                transition={{ duration: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-bold font-mono">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = currentSection === item.id;
              const Icon = item.icon;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    relative group flex items-center justify-center w-12 h-12 rounded-lg
                    transition-all duration-300 overflow-hidden font-mono border-2
                    ${isActive 
                      ? 'bg-emerald-500 text-gray-900 shadow-lg shadow-emerald-500/50 border-emerald-400' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-emerald-400 border-gray-600 hover:border-emerald-400'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Icon size={20} />
                  
                  {/* Enhanced Tooltip */}
                  <motion.div
                    className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-emerald-400 text-sm rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-emerald-400 backdrop-blur-sm z-[70]"
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                  >
                    <div className="font-mono font-bold text-white">{item.label}</div>
                    <div className="text-xs text-gray-400 capitalize">{item.id} section</div>
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-emerald-400" />
                  </motion.div>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-emerald-400 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* System Status */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-xs font-mono">SYS_OK</span>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[50] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 h-full z-[60] lg:hidden"
            >
              <div className="bg-gray-900/95 backdrop-blur-lg h-full w-64 p-6 border-r-2 border-emerald-400 shadow-2xl shadow-emerald-400/20 overflow-y-auto">
                {/* Progress Ring */}
                <div className="relative mb-8 flex justify-center">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="rgba(16, 185, 129, 0.3)"
                      strokeWidth="3"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#10B981"
                      strokeWidth="3"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress)}`}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm font-bold font-mono">
                      {Math.round(progress * 100)}%
                    </span>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="space-y-3">
                  {navigationItems.map((item, index) => {
                    const isActive = currentSection === item.id;
                    const Icon = item.icon;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          onSectionChange(item.id);
                          setIsOpen(false);
                        }}
                        className={`
                          w-full flex items-center space-x-4 p-4 rounded-lg
                          transition-all duration-300 font-mono border-2
                          ${isActive 
                            ? 'bg-emerald-500 text-gray-900 shadow-lg shadow-emerald-500/50 border-emerald-400' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-emerald-400 border-gray-600 hover:border-emerald-400'
                          }
                        `}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Icon size={20} />
                        <div className="text-left">
                          <div className="font-bold">{item.label}</div>
                          <div className="text-xs opacity-70 capitalize">{item.id} section</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* System Status */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-sm font-mono">SYSTEM_ONLINE</span>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};