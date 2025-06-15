import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Html, Line } from '@react-three/drei';
import { SpaceBackground } from '../3d/SpaceBackground';
import { SatelliteArray } from '../3d/SatelliteArray';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, Satellite, Radio, Terminal, Zap } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactChannels = [
    {
      icon: Mail,
      label: 'EMAIL_PROTOCOL',
      value: 'contact@spacedev.galaxy',
      href: 'mailto:contact@spacedev.galaxy',
      status: 'ACTIVE'
    },
    {
      icon: Radio,
      label: 'COMM_FREQUENCY',
      value: '+1 (555) SPACE-DEV',
      href: 'tel:+15557722333',
      status: 'STANDBY'
    },
    {
      icon: Satellite,
      label: 'COORDINATES',
      value: 'Earth Orbit • Sector 7G',
      href: null,
      status: 'LOCKED'
    }
  ];

  const socialNetworks = [
    {
      icon: Github,
      label: 'GITHUB_NODE',
      href: 'https://github.com/yourusername',
      color: '#10B981',
      status: 'ONLINE'
    },
    {
      icon: Linkedin,
      label: 'LINKEDIN_HUB',
      href: 'https://linkedin.com/in/yourusername',
      color: '#3B82F6',
      status: 'ACTIVE'
    },
    {
      icon: Twitter,
      label: 'TWITTER_FEED',
      href: 'https://twitter.com/yourusername',
      color: '#8B5CF6',
      status: 'LIVE'
    }
  ];

  return (
    <section className="min-h-screen bg-gray-950 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent font-mono">
            ESTABLISH_CONNECTION()
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto font-mono">
            Ready to launch your project into the digital cosmos?
            <br />
            <span className="text-emerald-400">Initialize communication protocols below.</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Mission Control Interface */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-emerald-400/50">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">MISSION_CONTROL</h3>
                <div className="flex items-center space-x-2 ml-auto">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-xs font-mono">ONLINE</span>
                </div>
              </div>
              
              {submitted && (
                <motion.div
                  className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-500/20 border-2 border-emerald-400/50 rounded-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-2 text-emerald-300">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-mono text-xs sm:text-sm">TRANSMISSION_SUCCESSFUL</span>
                  </div>
                  <div className="text-emerald-400 text-xs font-mono mt-1">
                    Message received at Mission Control. Response ETA: 24 hours.
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-emerald-400 mb-2 font-mono">
                      OPERATOR_ID
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/80 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300 font-mono text-sm sm:text-base"
                      placeholder="Enter your callsign"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-emerald-400 mb-2 font-mono">
                      COMM_CHANNEL
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/80 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300 font-mono text-sm sm:text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-emerald-400 mb-2 font-mono">
                    MISSION_TYPE
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/80 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300 font-mono text-sm sm:text-base"
                    placeholder="Project collaboration"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-emerald-400 mb-2 font-mono">
                    MESSAGE_PAYLOAD
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/80 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300 resize-none font-mono text-sm sm:text-base"
                    placeholder="Describe your mission objectives and requirements..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-emerald-400/50 text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="font-mono">TRANSMITTING_DATA...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} className="sm:w-5 sm:h-5" />
                      <span className="font-mono">SEND_TRANSMISSION()</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Communication Hub */}
          <div className="space-y-6 sm:space-y-8">
            {/* 3D Satellite Array */}
            <motion.div
              className="h-48 sm:h-64 bg-gray-900/30 rounded-2xl overflow-hidden border-2 border-emerald-400/50 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Canvas>
                <ambientLight intensity={0.2} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#10B981" />
                <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3B82F6" />
                
                <SpaceBackground count={300} />
                <SatelliteArray />
                
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false} 
                  autoRotate 
                  autoRotateSpeed={0.3} 
                />
              </Canvas>
              
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-2 border border-emerald-400/50">
                <div className="text-emerald-400 text-xs font-mono">SATELLITE_ARRAY</div>
                <div className="text-emerald-400 text-xs font-mono">STATUS: ACTIVE</div>
              </div>
            </motion.div>

            {/* Communication Channels */}
            <motion.div
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-emerald-400/50"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3 font-mono">
                <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                <span>COMMUNICATION_CHANNELS</span>
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                {contactChannels.map((channel) => {
                  const Icon = channel.icon;
                  const content = (
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg hover:bg-gray-700/50 transition-colors duration-300 border-2 border-gray-600/50 hover:border-emerald-400/50">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/50">
                          <Icon size={16} className="text-emerald-400 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm text-emerald-400 font-mono">{channel.label}</div>
                          <div className="text-white font-medium text-sm sm:text-base">{channel.value}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-mono px-2 py-1 rounded-full border ${
                          channel.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/50' :
                          channel.status === 'STANDBY' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/50' :
                          'bg-blue-500/20 text-blue-400 border-blue-400/50'
                        }`}>
                          {channel.status}
                        </div>
                      </div>
                    </div>
                  );

                  return channel.href ? (
                    <motion.a
                      key={channel.label}
                      href={channel.href}
                      className="block"
                      whileHover={{ x: 5 }}
                    >
                      {content}
                    </motion.a>
                  ) : (
                    <div key={channel.label}>{content}</div>
                  );
                })}
              </div>

              {/* Social Networks */}
              <div className="mt-6 sm:mt-8">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 font-mono">SOCIAL_NETWORKS</h4>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {socialNetworks.map((network) => {
                    const Icon = network.icon;
                    
                    return (
                      <motion.a
                        key={network.label}
                        href={network.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 sm:p-4 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors duration-300 border-2 border-gray-600/50 hover:border-emerald-400/50 text-center"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon size={20} style={{ color: network.color }} className="mx-auto mb-2 sm:w-6 sm:h-6" />
                        <div className="text-xs text-gray-400 font-mono mb-1">{network.label}</div>
                        <div className={`text-xs font-mono px-2 py-1 rounded-full border ${
                          network.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/50' :
                          network.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400 border-blue-400/50' :
                          'bg-purple-500/20 text-purple-400 border-purple-400/50'
                        }`}>
                          {network.status}
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};