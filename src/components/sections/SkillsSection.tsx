import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SkillConstellation } from '../3d/SkillConstellation';
import { SpaceBackground } from '../3d/SpaceBackground';
import { skills } from '../../data/portfolio';
import { Skill } from '../../types';
import { Terminal, Cpu, Database, Cloud, Code, Zap, Eye, Filter, AlertCircle } from 'lucide-react';

export const SkillsSection: React.FC = React.memo(() => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(12);

  // Enhanced skill categories with proper Smart Contract mapping
  const skillCategories = useMemo(() => [
    {
      name: 'Frontend',
      color: '#10B981',
      icon: Code,
      skills: skills.filter(s => s.category === 'frontend'),
      description: 'User Interface & Experience',
      key: 'frontend'
    },
    {
      name: 'Backend',
      color: '#3B82F6',
      icon: Cpu,
      skills: skills.filter(s => s.category === 'backend'),
      description: 'Server & API Development',
      key: 'backend'
    },
    {
      name: 'Database',
      color: '#F59E0B',
      icon: Database,
      skills: skills.filter(s => s.category === 'database'),
      description: 'Data Storage & Management',
      key: 'database'
    },
    {
      name: 'Tools',
      color: '#8B5CF6',
      icon: Cloud,
      skills: skills.filter(s => s.category === 'tools'),
      description: 'DevOps & Development Tools',
      key: 'tools'
    },
    {
      name: 'Blockchain',
      color: '#EF4444',
      icon: Zap,
      skills: skills.filter(s => s.category === 'blockchain'),
      description: 'Blockchain & Web3',
      key: 'blockchain'
    }
  ], []);

  // Enhanced event handlers with validation
  const handleCategorySelect = useCallback((categoryKey: string | null) => {
    console.log('Category selected:', categoryKey);
    setSelectedCategory(categoryKey);
    setHoveredSkill(null); // Clear hover state when changing categories
  }, []);

  const handleSkillHover = useCallback((skill: Skill | null) => {
    setHoveredSkill(skill);
  }, []);

  // Get current category info with validation
  const currentCategoryInfo = useMemo(() => {
    if (!selectedCategory) return null;
    const categoryInfo = skillCategories.find(cat => cat.key === selectedCategory);
    if (!categoryInfo) {
      console.warn('Category not found:', selectedCategory);
      return null;
    }
    return categoryInfo;
  }, [selectedCategory, skillCategories]);

  // Filter validation
  const filteredSkillsCount = useMemo(() => {
    if (!selectedCategory) return skills.length;
    const categoryInfo = currentCategoryInfo;
    return categoryInfo ? categoryInfo.skills.length : 0;
  }, [selectedCategory, currentCategoryInfo]);

  return (
    <section className="min-h-screen bg-gray-950 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 font-mono leading-tight"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 25%, #8B5CF6 50%, #F59E0B 75%, #EF4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
              // Ensure text doesn't break awkwardly on mobile
              wordBreak: 'keep-all',
              hyphens: 'none'
            }}
          >
            <span className="block xs:inline">SKILL_</span>
            <span className="block xs:inline">CONSTELLATION</span>
            <span className="block text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-1 xs:mt-0">.EXE</span>
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-mono mb-6 sm:mb-8 px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Navigate through the skill constellation. Each star cluster represents a technology domain.
            <br className="hidden sm:block" />
            <span className="text-emerald-400 block sm:inline mt-1 sm:mt-0">Click nodes to select, hover for details.</span>
          </motion.p>

          {/* Enhanced Filter Status Display */}
          <AnimatePresence>
            {selectedCategory && (
              <motion.div
                className="inline-flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-emerald-400/50 mt-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-400 font-mono text-xs sm:text-sm">
                  ACTIVE_FILTER: {selectedCategory.toUpperCase()}
                </span>
                <span className="text-gray-400 font-mono text-xs">
                  ({filteredSkillsCount} skills visible)
                </span>
                {filteredSkillsCount === 0 && (
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Enhanced 3D Constellation Viewer */}
          <div className="lg:col-span-2">
            <motion.div
              className="h-96 sm:h-[500px] lg:h-[600px] bg-gray-900/30 rounded-2xl overflow-hidden border-2 border-emerald-400/50 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Canvas
                camera={{ position: [0, 0, zoomLevel], fov: 65 }}
                gl={{
                  antialias: true,
                  powerPreference: "high-performance",
                  alpha: true,
                  stencil: false,
                  depth: true
                }}
                performance={{ min: 0.5 }}
                dpr={[1, 2]}
                onCreated={({ gl }) => {
                  gl.setClearColor('#0a0a0a', 0);
                }}
              >
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#10B981" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
                <pointLight position={[0, 10, -10]} intensity={0.3} color="#8B5CF6" />

                <SpaceBackground count={300} />
                <SkillConstellation
                  skills={skills}
                  selectedCategory={selectedCategory}
                  onSkillHover={handleSkillHover}
                />

                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  enableRotate={true}
                  autoRotate={!selectedCategory && !hoveredSkill}
                  autoRotateSpeed={0.2}
                  minDistance={3}
                  maxDistance={25}
                  maxPolarAngle={Math.PI / 1.5}
                  minPolarAngle={Math.PI / 3}
                  enableDamping={true}
                  dampingFactor={0.05}
                  zoomSpeed={0.8}
                  rotateSpeed={0.5}
                />
              </Canvas>

              {/* Enhanced Status Display - Hidden on mobile */}
              <div className="absolute top-4 right-4 space-y-2 hidden md:block">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-emerald-400/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <div className="text-emerald-400 text-xs font-mono">CONSTELLATION_STATUS</div>
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="text-emerald-400">
                      MODE: {selectedCategory ? 'FILTERED' : 'FULL_SCAN'}
                    </div>
                    <div className="text-emerald-400">
                      NODES: {filteredSkillsCount}
                    </div>
                    <div className="text-emerald-400">
                      ZOOM: {Math.round((25 - zoomLevel) / 22 * 100)}%
                    </div>
                    {selectedCategory && (
                      <div className="text-blue-400">
                        FILTER: {selectedCategory.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Filter Warning for Empty Results */}
              {selectedCategory && filteredSkillsCount === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-900/80 backdrop-blur-sm rounded-lg p-4 border border-red-400/50 text-center">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-red-400 font-mono text-sm">NO_SKILLS_FOUND</div>
                    <div className="text-red-300 font-mono text-xs mt-1">
                      Category: {selectedCategory}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Enhanced Skill Categories & Details */}
          <div className="space-y-6">
            {/* Enhanced Category Filters */}
            <motion.div
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-emerald-400/50"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2 font-mono">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span>CATEGORY_FILTER</span>
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 border ${selectedCategory === null
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-emerald-400/50'
                    }`}
                >
                  <div className="font-mono text-sm">ALL_CATEGORIES</div>
                  <div className="text-xs text-gray-400">{skills.length} total skills</div>
                </button>

                {skillCategories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.key;
                  const hasSkills = category.skills.length > 0;

                  return (
                    <button
                      key={category.key}
                      onClick={() => handleCategorySelect(isSelected ? null : category.key)}
                      disabled={!hasSkills}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 border ${isSelected
                        ? 'border-emerald-400 text-emerald-300'
                        : hasSkills
                          ? 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-emerald-400/50'
                          : 'bg-gray-800/30 border-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      style={isSelected ? { backgroundColor: `${category.color}20` } : {}}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          size={16}
                          style={{ color: hasSkills ? category.color : '#6B7280' }}
                        />
                        <div>
                          <div className="font-mono text-sm">{category.name.toUpperCase()}</div>
                          <div className="text-xs text-gray-400">
                            {category.skills.length} skills • {category.description}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="text-xs text-emerald-400 mt-1 font-mono">● ACTIVE</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Enhanced Skill Details Panel */}
            <motion.div
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-emerald-400/50 min-h-48"
              layout
            >
              <div className="flex items-center space-x-2 mb-4">
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span className="text-emerald-400 font-mono text-xs sm:text-sm">SKILL_SCANNER</span>
              </div>

              <AnimatePresence mode="wait">
                {hoveredSkill ? (
                  <motion.div
                    key={hoveredSkill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-2xl font-bold text-white font-mono">{hoveredSkill.name}</h3>
                        <div className="text-emerald-400 text-xs sm:text-sm font-mono capitalize">
                          {hoveredSkill.category === 'blockchain' ? 'Blockchain' : hoveredSkill.category}_DOMAIN
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-mono text-xs sm:text-sm">PROFICIENCY_LEVEL</span>
                          <span className="text-emerald-400 font-mono text-xs sm:text-sm">{hoveredSkill.level}%</span>
                        </div>

                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${hoveredSkill.level}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>

                        <div className="text-xs text-gray-400 font-mono">
                          STATUS: {hoveredSkill.level >= 90 ? 'EXPERT_LEVEL' : hoveredSkill.level >= 75 ? 'ADVANCED_USER' : hoveredSkill.level >= 60 ? 'INTERMEDIATE' : 'LEARNING_MODE'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-400 flex flex-col items-center justify-center h-full"
                  >
                    <div className="text-3xl sm:text-4xl mb-3">⭐</div>
                    <p className="font-mono text-xs sm:text-sm text-white">SCANNING_FOR_SKILLS...</p>
                    <p className="text-xs mt-2 text-gray-500">Hover over constellation stars</p>
                    {selectedCategory && (
                      <div className="mt-2 text-xs text-emerald-400 font-mono">
                        FILTER: {selectedCategory.toUpperCase()}
                        <br />
                        NODES: {filteredSkillsCount}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});

SkillsSection.displayName = 'SkillsSection';