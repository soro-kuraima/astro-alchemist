import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Github, ExternalLink, Play, Eye, Telescope, Rocket, Zap, Star, Navigation } from 'lucide-react';
import { projects } from '../../data/portfolio';
import { Project } from '../../types';
import { CosmicProject } from '../3d/CosmicProject';
import { CosmicParticleField } from '../3d/CosmicParticleField';
import { CosmicEnvironment } from '../3d/CosmicEnvironment';
import * as THREE from 'three';

// Camera controller for smooth focus transitions
const CameraController: React.FC<{ focusedProject: Project | null }> = ({ focusedProject }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    if (focusedProject) {
      // Focus on specific project
      camera.position.lerp(new THREE.Vector3(0, 5, 15), 0.03);
      camera.lookAt(0, 0, 0);
    } else {
      // Default orbital view
      camera.position.lerp(new THREE.Vector3(0, 8, 25), 0.03);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

// Main 3D scene component
const CosmicScene: React.FC<{
  mousePosition: THREE.Vector2;
  onProjectHover: (project: Project | null) => void;
  onProjectClick: (project: Project) => void;
  focusedProject: Project | null;
}> = ({ mousePosition, onProjectHover, onProjectClick, focusedProject }) => {
  return (
    <>
      {/* Cosmic lighting setup */}
      <ambientLight intensity={0.2} />
      <pointLight position={[20, 20, 20]} intensity={1.5} color="#10B981" />
      <pointLight position={[-20, -20, -20]} intensity={0.8} color="#3B82F6" />
      <pointLight position={[0, 20, -20]} intensity={0.6} color="#8B5CF6" />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#F59E0B" />
      
      {/* Cosmic environment */}
      <CosmicEnvironment />
      <CosmicParticleField count={1500} radius={60} speed={0.3} />
      
      {/* Project celestial bodies */}
      {projects.map((project, index) => (
        <CosmicProject
          key={project.id}
          project={project}
          index={index}
          onHover={onProjectHover}
          onClick={onProjectClick}
          isSelected={focusedProject?.id === project.id}
          mousePosition={mousePosition}
        />
      ))}
      
      {/* Camera controller */}
      <CameraController focusedProject={focusedProject} />
    </>
  );
};

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [focusedProject, setFocusedProject] = useState<Project | null>(null);
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0, 0));
  const canvasRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Effect to disable body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedProject]);

  // Mouse tracking for interactive movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePosition(new THREE.Vector2(x * 0.5, y * 0.5));
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!canvasRef.current || event.touches.length === 0) return;
      
      const touch = event.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePosition(new THREE.Vector2(x * 0.5, y * 0.5));
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('touchmove', handleTouchMove);
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, []);

  const handleProjectClick = (project: Project) => {
    if (focusedProject?.id === project.id) {
      setSelectedProject(project);
    } else {
      setFocusedProject(project);
    }
  };

  const handleProjectHover = (project: Project | null) => {
    setHoveredProject(project);
  };

  // Generate cosmic statistics
  const cosmicStats = useMemo(() => [
    { 
      icon: Rocket, 
      count: projects.length, 
      label: 'Cosmic Worlds', 
      color: '#10B981',
      description: 'Digital universes explored'
    },
    { 
      icon: Zap, 
      count: Array.from(new Set(projects.flatMap(p => p.technologies))).length, 
      label: 'Star Technologies', 
      color: '#3B82F6',
      description: 'Technological constellations'
    },
    { 
      icon: Eye, 
      count: projects.filter(p => p.liveUrl).length, 
      label: 'Active Portals', 
      color: '#F59E0B',
      description: 'Live dimensional gateways'
    },
    { 
      icon: Star, 
      count: '∞', 
      label: 'Possibilities', 
      color: '#8B5CF6',
      description: 'Infinite potential energy'
    }
  ], []);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen relative overflow-hidden bg-gray-950"
    >
      {/* Enhanced Header */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
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
            <span className="block xs:inline">PROJECTS_</span>
            <span className="block xs:inline">GALAXY</span>
            <span className="block text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-1 xs:mt-0">.EXE</span>
          </motion.h2>
          <motion.p 
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-mono mb-6 sm:mb-8 px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Enter the Projects Galaxy - a mesmerizing 3D realm where each project orbits like a unique star. 
            <br className="hidden sm:block" />
            Navigate this stellar collection by guiding your cursor through space.
          </motion.p>

          {/* Enhanced Status Indicators */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/50">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-emerald-300 text-xs sm:text-sm font-mono">
                {projects.length} STELLAR_OBJECTS
              </span>
            </div>
            {focusedProject && (
              <motion.div 
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-400/50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Telescope className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                <span className="text-purple-300 text-xs sm:text-sm font-mono">
                  FOCUSED: {focusedProject.title.toUpperCase()}
                </span>
              </motion.div>
            )}
            {hoveredProject && (
              <motion.div 
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Navigation className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                <span className="text-blue-300 text-xs sm:text-sm font-mono">
                  SCANNING: {hoveredProject.title.toUpperCase()}
                </span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* 3D Cosmic Galaxy */}
      <div className="relative z-10 mb-8">
        <motion.div
          ref={canvasRef}
          className="h-[70vh] sm:h-[80vh] w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Canvas
            camera={{ position: [0, 8, 25], fov: 60 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance"
            }}
            performance={{ min: 0.8 }}
            dpr={[1, 2]}
          >
            <CosmicScene
              mousePosition={mousePosition}
              onProjectHover={handleProjectHover}
              onProjectClick={handleProjectClick}
              focusedProject={focusedProject}
            />
            
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              autoRotate={!focusedProject && !hoveredProject}
              autoRotateSpeed={0.3}
              minDistance={15}
              maxDistance={40}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Canvas>
        </motion.div>

        {/* 3D Scene Controls Overlay */}
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-emerald-400/50">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
              <div className="text-emerald-400 text-xs font-mono">GALAXY_CONTROLS</div>
            </div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-emerald-400">🖱️ NAVIGATE: Drag to orbit</div>
              <div className="text-blue-400">🎯 FOCUS: Click celestial body</div>
              <div className="text-purple-400">📡 SCAN: Hover for details</div>
              <div className="text-yellow-400">🔍 ZOOM: Scroll wheel</div>
            </div>
            
            {/* Reset button */}
            {focusedProject && (
              <motion.button
                onClick={() => setFocusedProject(null)}
                className="mt-3 w-full px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 rounded border border-emerald-400/50 text-emerald-300 text-xs font-mono transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                RESET_VIEW()
              </motion.button>
            )}
          </div>
        </div>

        {/* Project Info Panel */}
        <AnimatePresence>
          {(hoveredProject || focusedProject) && (
            <motion.div
              className="absolute bottom-4 left-4 bg-gray-900/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border-2 border-emerald-400/50 max-w-sm z-30"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-white">
                <h3 className="text-lg sm:text-xl font-bold text-emerald-400 mb-2 font-mono">
                  {(focusedProject || hoveredProject)?.title}
                </h3>
                <div className="text-emerald-300 text-xs sm:text-sm font-mono mb-3 capitalize">
                  STELLAR_CLASSIFICATION: {(focusedProject || hoveredProject)?.technologies[0]}
                </div>
                
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  {(focusedProject || hoveredProject)?.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {(focusedProject || hoveredProject)?.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-400/30 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="text-xs text-gray-400 font-mono">
                  STATUS: {focusedProject ? 'FOCUSED_ANALYSIS' : 'PASSIVE_SCAN'}
                </div>
                
                {focusedProject && (
                  <motion.button
                    onClick={() => setSelectedProject(focusedProject)}
                    className="mt-3 w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-mono text-sm transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    DEEP_SCAN()
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="bg-gray-900/95 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-emerald-400/50"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-48 sm:h-64 object-cover rounded-t-2xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent rounded-t-2xl" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-gray-800/80 transition-colors duration-300 border border-emerald-400/50 font-mono"
                >
                  ×
                </button>
                <div className="absolute bottom-4 left-4 sm:left-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono mb-2">
                    {selectedProject.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 font-mono text-sm">DEEP_SCAN_ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-emerald-400 mb-3 font-mono">
                    STELLAR_ANALYSIS_REPORT
                  </h4>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-blue-400 mb-3 font-mono">
                    TECHNOLOGICAL_COMPOSITION
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedProject.technologies.map((tech) => (
                      <div
                        key={tech}
                        className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-500/20 backdrop-blur-sm text-blue-200 rounded-lg border border-blue-400/30 text-center font-mono text-sm"
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-purple-400 mb-3 font-mono">
                    DIMENSIONAL_PORTALS
                  </h4>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <motion.a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 bg-gray-700/80 hover:bg-gray-600/80 rounded-lg text-white transition-all duration-300 backdrop-blur-sm border border-gray-500/50 hover:border-gray-400/70 font-mono text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>SOURCE_CODE</span>
                    </motion.a>
                    {selectedProject.liveUrl && (
                      <motion.a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600/80 hover:bg-emerald-500/80 rounded-lg text-white transition-all duration-300 backdrop-blur-sm border border-emerald-400/50 hover:border-emerald-300/70 font-mono text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                        <span>LIVE_PORTAL</span>
                      </motion.a>
                    )}
                    {selectedProject.videoUrl && (
                      <motion.a
                        href={selectedProject.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 bg-red-600/80 hover:bg-red-500/80 rounded-lg text-white transition-all duration-300 backdrop-blur-sm border border-red-400/50 hover:border-red-300/70 font-mono text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                        <span>DEMO_TRANSMISSION</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cosmic Statistics */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {cosmicStats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.label}
                className="text-center bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-emerald-400/50 transition-all duration-300 group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                viewport={{ once: true }}
              >
                <div
                  className="inline-flex p-2 sm:p-3 rounded-xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon size={20} style={{ color: stat.color }} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 font-mono">
                  {stat.count}
                </div>
                <div className="text-gray-300 text-xs sm:text-sm font-mono mb-1 sm:mb-2">
                  {stat.label}
                </div>
                <div className="text-gray-500 text-xs">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Ambient Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-blue-500/10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
    </section>
  );
};