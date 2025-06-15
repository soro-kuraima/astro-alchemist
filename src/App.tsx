import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LoadingScreen } from './components/LoadingScreen';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AchievementsSection } from './components/sections/AchievementsSection';
import { ContactSection } from './components/sections/ContactSection';
import { Section } from './types';

const sections: { id: Section; component: React.ComponentType<any> }[] = [
  { id: 'hero', component: HeroSection },
  { id: 'about', component: AboutSection },
  { id: 'skills', component: SkillsSection },
  { id: 'experience', component: ExperienceSection },
  { id: 'projects', component: ProjectsSection },
  { id: 'achievements', component: AchievementsSection },
  { id: 'contact', component: ContactSection },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<Section>('hero');
  const [progress, setProgress] = useState(0);

  // Fixed: Always call the same number of useInView hooks
  const heroRef = useInView({ threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });
  const aboutRef = useInView({ threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });
  const skillsRef = useInView({ threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });
  const experienceRef = useInView({ threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });
  const projectsRef = useInView({ threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });
  const achievementsRef = useInView({ threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });
  const contactRef = useInView({ threshold: 0.3, rootMargin: '-10% 0px -10% 0px' });

  const sectionRefs = [heroRef, aboutRef, skillsRef, experienceRef, projectsRef, achievementsRef, contactRef];

  // Enhanced scroll spy functionality
  useEffect(() => {
    if (isLoading) return; // Don't track scroll during loading

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate overall progress
      const totalProgress = scrollPosition / (documentHeight - windowHeight);
      setProgress(Math.min(totalProgress, 1));

      // Find current section based on scroll position
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      );

      let currentSectionIndex = 0;
      
      sectionElements.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          const elementHeight = rect.height;
          
          // Consider section active if it's in the middle third of viewport
          if (elementTop <= windowHeight * 0.5 && elementTop + elementHeight >= windowHeight * 0.5) {
            currentSectionIndex = index;
          }
        }
      });

      setCurrentSection(sections[currentSectionIndex].id);
    };

    // Add scroll event listener with throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial call
    handleScroll();

    // Fixed: Proper cleanup function
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [isLoading]); // Added isLoading dependency

  const handleSectionChange = (section: Section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const handleScrollNext = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
    handleSectionChange(sections[nextIndex].id);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative overflow-x-hidden bg-gray-950">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* Main Content - Only render when loading is complete */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {/* Navigation with improved z-index */}
            <Navigation 
              currentSection={currentSection}
              onSectionChange={handleSectionChange}
              progress={progress}
            />

            {/* Main Content Container with proper spacing for navigation */}
            <main className="lg:ml-20 xl:ml-24">
              <div className="max-w-7xl mx-auto">
                {sections.map((section, index) => {
                  const Component = section.component;
                  const [ref, inView] = sectionRefs[index];

                  return (
                    <motion.div
                      key={section.id}
                      id={section.id}
                      ref={ref}
                      className="min-h-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: inView ? 1 : 0.8 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <Component 
                        onScrollNext={section.id === 'hero' ? handleScrollNext : undefined}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;