import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { SpaceBackground } from '../3d/SpaceBackground';
import { InteractiveConstellation } from '../3d/InteractiveConstellation';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { ChevronDown, Terminal, Code, Rocket } from 'lucide-react';
import * as THREE from 'three';

const FloatingCode = () => {
  const groupRef = useRef<THREE.Group>(null);

  const codeSnippets = useMemo(() => [
    'const dev = new AstroAlchemist();',
    'function buildUniverse() {',
    'return React.createElement();',
    'async function deploy() {',
    'git push origin main',
    'npm run build --production'
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.5;
        child.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {codeSnippets.map((code, index) => (
        <Text
          key={index}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            -15 - Math.random() * 10
          ]}
          fontSize={0.5}
          color="#10B981"
          anchorX="center"
          anchorY="middle"
          transparent
          opacity={0.4}
        >
          {code}
        </Text>
      ))}
    </group>
  );
};

interface HeroSectionProps {
  onScrollNext: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollNext }) => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-gray-950 overflow-hidden">
      {/* 3D Space Scene */}
      <div className="absolute inset-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <ambientLight intensity={0.15} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#10B981" />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#3B82F6" />

          <SpaceBackground count={3000} />
          <InteractiveConstellation />
          <FloatingCode />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.2}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>

      {/* Content Overlay - Properly Spaced */}
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-6 sm:space-y-8 mb-auto mt-20 lg:mt-24"
        >
          {/* Terminal Header */}
          <motion.div
            className="flex items-center justify-center space-x-3 mb-6 sm:mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            <span className="text-lg sm:text-xl text-emerald-400 font-mono">~/astro-alchemy $</span>
          </motion.div>

          {/* Animated Title - Properly Spaced */}
          <motion.div className="space-y-4 sm:space-y-6">
            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-mono bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              FULL_STACK
            </motion.h1>
            <motion.h2
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-white leading-tight"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              ASTRO_ALCHEMIST
            </motion.h2>
          </motion.div>

          {/* Code-style Description */}
          <motion.div
            className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-emerald-400/50 max-w-4xl mx-auto shadow-2xl shadow-emerald-400/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <div className="text-left font-mono text-xs sm:text-sm md:text-base">
              <div className="text-gray-400">// Exploring the digital cosmos</div>
              <div className="text-emerald-400">const <span className="text-white">technologies</span> = [</div>
              <div className="ml-2 sm:ml-4 text-green-400">'React', 'Next.js', 'TypeScript',</div>
              <div className="ml-2 sm:ml-4 text-yellow-400">'Node.js', 'Python', 'Rust',</div>
              <div className="ml-2 sm:ml-4 text-purple-400">'PostgreSQL', 'Docker', 'AWS'</div>
              <div className="text-emerald-400">];</div>
              <div className="mt-2 text-pink-400">
                export default <span className="text-white">AstroAlchemist</span>;
              </div>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/50">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 font-mono text-xs sm:text-sm">STATUS: ONLINE</span>
            </div>
            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/50">
              <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-blue-300 font-mono text-xs sm:text-sm">READY_FOR_LAUNCH</span>
            </div>
            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-400/50">
              <Code className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-purple-300 font-mono text-xs sm:text-sm">REMOTE_ENABLED</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator - Properly Positioned */}
        <motion.div
          className="mb-8 sm:mb-12 mt-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <motion.button
            onClick={onScrollNext}
            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300 group"
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
              <div className="text-center">
                <div className="text-xs sm:text-sm font-mono mb-1">INITIATE_EXPLORATION()</div>
                <div className="text-xs text-gray-400">Scroll to navigate the cosmos</div>
              </div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 sm:p-3 rounded-full border border-emerald-400/50 group-hover:border-emerald-400/80 transition-colors bg-emerald-500/10"
              >
                <ChevronDown size={20} className="sm:w-6 sm:h-6" />
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-blue-500/10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};