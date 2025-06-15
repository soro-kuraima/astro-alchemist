import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { experiences } from '../../data/portfolio';

export const ExperienceSection: React.FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Professional Journey
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
            My career progression and key experiences in building amazing digital products.
          </p>
        </motion.div>

        {/* Timeline Container - Mobile-first responsive design */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line - Responsive positioning */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-500 to-purple-600 z-10" />

          {/* Timeline Items - Enhanced mobile layout */}
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                className={`relative flex items-start ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {/* Timeline Dot - Fixed positioning for all screen sizes */}
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-gray-950 shadow-lg z-20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>

                {/* Content Card - Responsive margins and positioning */}
                <motion.div
                  className={`ml-12 md:ml-0 w-full ${
                    index % 2 === 0 
                      ? 'md:mr-8 lg:mr-12 xl:mr-16 md:text-right md:pr-8 lg:pr-12 xl:pr-16' 
                      : 'md:ml-8 lg:ml-12 xl:ml-16 md:pl-8 lg:pl-12 xl:pl-16'
                  } md:w-5/12 relative z-30`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
                    {/* Company & Duration Header */}
                    <div className={`flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center ${
                      index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''
                    } sm:justify-between mb-4`}>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                        {experience.company}
                      </h3>
                      <div className="flex items-center text-blue-400 text-sm">
                        <Calendar size={14} className="mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">{experience.duration}</span>
                      </div>
                    </div>

                    {/* Position */}
                    <h4 className={`text-base sm:text-lg lg:text-xl font-semibold text-blue-300 mb-3 sm:mb-4 ${
                      index % 2 === 0 ? 'md:text-right' : ''
                    }`}>
                      {experience.position}
                    </h4>

                    {/* Description */}
                    <p className={`text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed ${
                      index % 2 === 0 ? 'md:text-right' : ''
                    }`}>
                      {experience.description}
                    </p>

                    {/* Technologies */}
                    <div className={`${index % 2 === 0 ? 'md:flex md:justify-end' : ''}`}>
                      <div className={`flex flex-wrap gap-2 ${
                        index % 2 === 0 ? 'md:justify-end' : ''
                      }`}>
                        {experience.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-300 text-xs sm:text-sm rounded-full border border-blue-400/30 hover:border-blue-400/60 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Connecting Line to Timeline Dot - Hidden on mobile, visible on desktop */}
                  <div className={`hidden md:block absolute top-6 transform -translate-y-1/2 w-8 lg:w-12 h-0.5 bg-gradient-to-r ${
                    index % 2 === 0 
                      ? 'right-0 translate-x-8 lg:translate-x-12 from-blue-400 to-transparent' 
                      : 'left-0 -translate-x-8 lg:-translate-x-12 from-transparent to-blue-400'
                  } z-20`} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Career Stats - Enhanced responsive grid */}
        <motion.div
          className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {[
            { number: '5+', label: 'Years Experience', color: '#3B82F6' },
            { number: '50+', label: 'Projects Completed', color: '#10B981' },
            { number: '10+', label: 'Technologies Mastered', color: '#F59E0B' },
            { number: '100%', label: 'Client Satisfaction', color: '#8B5CF6' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300 group"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300"
                style={{ color: stat.color }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-300 text-xs sm:text-sm lg:text-base font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};