import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere } from '@react-three/drei';
import { Award, Trophy, Star, Target } from 'lucide-react';
import { achievements } from '../../data/portfolio';

const Trophy3D = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <group position={position}>
      <Box args={[0.4, 0.6, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </Box>
      <Sphere args={[0.3]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </Sphere>
    </group>
  );
};

export const AchievementsSection: React.FC = () => {
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'award': return Award;
      case 'certification': return Trophy;
      case 'milestone': return Star;
      default: return Target;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'award': return '#FFD700';
      case 'certification': return '#3B82F6';
      case 'milestone': return '#10B981';
      default: return '#8B5CF6';
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 to-purple-950 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Achievements & Recognition
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
            Celebrating milestones, certifications, and recognition earned throughout my journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* 3D Trophy Display - Hidden on mobile (max-width: 768px) */}
          <motion.div
            className="hidden md:block h-80 sm:h-96 lg:h-[500px] bg-black/20 rounded-2xl overflow-hidden border border-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              
              <Trophy3D position={[-2, 1, 0]} color="#FFD700" />
              <Trophy3D position={[2, 1, 0]} color="#3B82F6" />
              <Trophy3D position={[0, -1, 2]} color="#10B981" />
              <Trophy3D position={[-1, -1, -1]} color="#8B5CF6" />
              
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={1}
              />
            </Canvas>
          </motion.div>

          {/* Mobile Alternative Visual Element - Visible only on mobile */}
          <motion.div
            className="md:hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 sm:p-8 border border-white/20 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Award, color: '#FFD700', label: 'Awards' },
                  { icon: Trophy, color: '#3B82F6', label: 'Certifications' },
                  { icon: Star, color: '#10B981', label: 'Milestones' },
                  { icon: Target, color: '#8B5CF6', label: 'Achievements' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      className="flex flex-col items-center p-4 bg-white/10 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Icon size={32} style={{ color: item.color }} className="mb-2" />
                      <span className="text-white text-sm font-medium">{item.label}</span>
                    </motion.div>
                  );
                })}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Recognition Gallery</h3>
              <p className="text-gray-300 text-sm">
                Professional achievements and certifications earned throughout my career journey.
              </p>
            </div>
          </motion.div>

          {/* Achievements List - Full width on mobile when 3D is hidden */}
          <div className="space-y-4 sm:space-y-6 md:col-span-1 lg:col-span-1">
            {achievements.map((achievement, index) => {
              const Icon = getAchievementIcon(achievement.type);
              const color = getAchievementColor(achievement.type);

              return (
                <motion.div
                  key={achievement.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div
                      className="p-2 sm:p-3 rounded-xl flex-shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon
                        size={20}
                        style={{ color }}
                        className="sm:w-6 sm:h-6"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-0 truncate">
                          {achievement.title}
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                          {achievement.date}
                        </span>
                      </div>
                      
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-2 sm:mb-3">
                        {achievement.description}
                      </p>
                      
                      <div>
                        <span
                          className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium capitalize"
                          style={{
                            backgroundColor: `${color}20`,
                            color: color
                          }}
                        >
                          {achievement.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Achievement Stats - Enhanced responsive design */}
        <motion.div
          className="mt-16 sm:mt-20 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              { icon: Award, count: '12+', label: 'Awards Won', color: '#FFD700' },
              { icon: Trophy, count: '8+', label: 'Certifications', color: '#3B82F6' },
              { icon: Star, count: '25+', label: 'Milestones', color: '#10B981' },
              { icon: Target, count: '100%', label: 'Goals Achieved', color: '#8B5CF6' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              
              return (
                <motion.div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div
                    className="inline-flex p-2 sm:p-3 rounded-xl mb-2 sm:mb-3"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon size={20} style={{ color: stat.color }} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                    {stat.count}
                  </div>
                  <div className="text-gray-300 text-xs sm:text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};