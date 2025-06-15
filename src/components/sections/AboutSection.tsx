import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Html } from '@react-three/drei';
import { SpaceBackground } from '../3d/SpaceBackground';
import { Rocket, Zap, Globe, Bitcoin } from 'lucide-react';

const OrbitingElements = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const skills = [
    { name: 'Blockchain', icon: '⛓️', position: [4, 0, 0], color: '#10B981' },
    { name: 'Smart Contracts', icon: '📜', position: [-4, 0, 0], color: '#3B82F6' },
    { name: 'Web3', icon: '🌐', position: [0, 4, 0], color: '#F59E0B' },
    { name: 'DeFi', icon: '💰', position: [0, -4, 0], color: '#8B5CF6' },
    { name: 'NFTs', icon: '🎨', position: [3, 3, 0], color: '#EF4444' },
    { name: 'dApps', icon: '🚀', position: [-3, -3, 0], color: '#06B6D4' },
  ];

  return (
    <group ref={groupRef}>
      {/* Central core */}
      <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#10B981"
          emissive="#10B981"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {skills.map((skill, index) => (
        <group key={skill.name} position={skill.position}>
          <Sphere args={[0.4, 16, 16]}>
            <meshStandardMaterial
              color={skill.color}
              emissive={skill.color}
              emissiveIntensity={0.3}
              transparent
              opacity={0.8}
            />
          </Sphere>
          <Html distanceFactor={15}>
            <div className="text-2xl pointer-events-none">
              {skill.icon}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

export const AboutSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="min-h-screen bg-gray-950 relative overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* 3D Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <Canvas>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#10B981" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3B82F6" />

          <SpaceBackground count={800} />
          <OrbitingElements />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left Content */}
          <motion.div
            className="text-white space-y-6 sm:space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent font-mono">
                MISSION_CONTROL.EXE
              </h2>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-mono">
                I'm a space-obsessed Full Stack Developer who believes in pushing the boundaries
                of what's possible in the digital universe. Like exploring the cosmos, I love
                discovering new technologies and building applications that reach for the stars.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
              variants={itemVariants}
            >
              {[
                { icon: Rocket, title: 'Launch Ready', desc: 'React, Next.js, Typescript', color: 'text-emerald-400' },
                { icon: Zap, title: 'High Performance', desc: 'Node.js, Python, Rust', color: 'text-blue-400' },
                { icon: Globe, title: 'Universal Scale', desc: 'PostgreSQL, MongoDB', color: 'text-yellow-400' },
                { icon: Bitcoin, title: 'Blockchain', desc: 'Smart Contracts, Web3', color: 'text-purple-400' }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border-2 border-gray-700/50 hover:border-emerald-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${item.color} mb-2`} />
                  <h3 className="font-semibold text-white font-mono text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-emerald-400 font-mono">MISSION_OBJECTIVES</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-300">
                {[
                  'Build scalable applications that can handle interstellar traffic',
                  'Design user experiences as smooth as zero gravity',
                  'Architect backend systems with the reliability of NASA',
                  'Optimize performance to light-speed standards',
                  'Collaborate with teams across different time zones (like space stations)'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="font-mono text-sm sm:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-emerald-400/50"
              variants={itemVariants}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 font-mono">SYSTEM_STATUS</h3>

              <div className="space-y-4 sm:space-y-6">
                {[
                  { label: 'CODE_QUALITY', value: 98, color: '#10B981' },
                  { label: 'PERFORMANCE', value: 95, color: '#3B82F6' },
                  { label: 'RELIABILITY', value: 99, color: '#F59E0B' },
                  { label: 'INNOVATION', value: 92, color: '#8B5CF6' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-mono text-xs sm:text-sm">{stat.label}</span>
                      <span className="text-emerald-400 font-mono text-xs sm:text-sm">{stat.value}%</span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: stat.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.value}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-3 sm:gap-4"
              variants={itemVariants}
            >
              {[
                { number: '5+', label: 'Years in Orbit', color: '#10B981' },
                { number: '50+', label: 'Missions Complete', color: '#3B82F6' },
                { number: '25+', label: 'Technologies', color: '#F59E0B' },
                { number: '100%', label: 'Success Rate', color: '#8B5CF6' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border-2 border-gray-700/50 text-center"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div
                    className="text-xl sm:text-2xl font-bold mb-1 font-mono"
                    style={{ color: stat.color }}
                  >
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-xs sm:text-sm font-mono">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};