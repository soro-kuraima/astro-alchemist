import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Meteor {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
  tailLength: number;
  active: boolean;
}

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const meteorsRef = useRef<Meteor[]>([]);
  const lastTimeRef = useRef<number>(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Meteor colors for variety
  const meteorColors = [
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16'  // Lime
  ];

  const createMeteor = useCallback((canvas: HTMLCanvasElement): Meteor => {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y, angle;

    switch (side) {
      case 0: // Top
        x = Math.random() * canvas.width;
        y = -50;
        angle = Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 3; // 15° to 75°
        break;
      case 1: // Right
        x = canvas.width + 50;
        y = Math.random() * canvas.height;
        angle = Math.PI / 2 + Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 3;
        break;
      case 2: // Bottom
        x = Math.random() * canvas.width;
        y = canvas.height + 50;
        angle = Math.PI + Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 3;
        break;
      default: // Left
        x = -50;
        y = Math.random() * canvas.height;
        angle = 3 * Math.PI / 2 + Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 3;
        break;
    }

    return {
      id: Date.now() + Math.random(),
      x,
      y,
      angle,
      speed: 2 + Math.random() * 4, // 2-6 pixels per frame
      size: 1 + Math.random() * 3, // 1-4 pixel radius
      opacity: 0.7 + Math.random() * 0.3, // 0.7-1.0 opacity
      color: meteorColors[Math.floor(Math.random() * meteorColors.length)],
      tailLength: 20 + Math.random() * 40, // 20-60 pixel tail
      active: true
    };
  }, [meteorColors]);

  const initializeMeteors = useCallback((canvas: HTMLCanvasElement) => {
    meteorsRef.current = Array.from({ length: 15 }, () => createMeteor(canvas));
  }, [createMeteor]);

  const updateMeteors = useCallback((canvas: HTMLCanvasElement, deltaTime: number) => {
    meteorsRef.current.forEach(meteor => {
      if (!meteor.active) return;

      // Move meteor
      meteor.x += Math.cos(meteor.angle) * meteor.speed * deltaTime * 0.1;
      meteor.y += Math.sin(meteor.angle) * meteor.speed * deltaTime * 0.1;

      // Check if meteor is off screen
      if (
        meteor.x < -100 || meteor.x > canvas.width + 100 ||
        meteor.y < -100 || meteor.y > canvas.height + 100
      ) {
        // Reset meteor to new position
        const newMeteor = createMeteor(canvas);
        Object.assign(meteor, newMeteor);
      }
    });

    // Occasionally add new meteors for dynamic effect
    if (Math.random() < 0.02 && meteorsRef.current.length < 25) {
      meteorsRef.current.push(createMeteor(canvas));
    }
  }, [createMeteor]);

  const drawMeteor = useCallback((ctx: CanvasRenderingContext2D, meteor: Meteor) => {
    if (!meteor.active) return;

    ctx.save();

    // Create gradient for meteor tail
    const tailEndX = meteor.x - Math.cos(meteor.angle) * meteor.tailLength;
    const tailEndY = meteor.y - Math.sin(meteor.angle) * meteor.tailLength;

    const gradient = ctx.createLinearGradient(
      meteor.x, meteor.y,
      tailEndX, tailEndY
    );

    gradient.addColorStop(0, `${meteor.color}${Math.round(meteor.opacity * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(0.7, `${meteor.color}40`);
    gradient.addColorStop(1, `${meteor.color}00`);

    // Draw meteor tail
    ctx.strokeStyle = gradient;
    ctx.lineWidth = meteor.size * 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(meteor.x, meteor.y);
    ctx.lineTo(tailEndX, tailEndY);
    ctx.stroke();

    // Draw meteor head with glow effect
    const glowGradient = ctx.createRadialGradient(
      meteor.x, meteor.y, 0,
      meteor.x, meteor.y, meteor.size * 3
    );
    glowGradient.addColorStop(0, meteor.color);
    glowGradient.addColorStop(0.5, `${meteor.color}80`);
    glowGradient.addColorStop(1, `${meteor.color}00`);

    // Outer glow
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, meteor.size * 3, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = meteor.color;
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2);
    ctx.fill();

    // Sparkle effect
    if (Math.random() < 0.3) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(
        meteor.x + (Math.random() - 0.5) * meteor.size * 2,
        meteor.y + (Math.random() - 0.5) * meteor.size * 2,
        0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }, []);

  const animate = useCallback((currentTime: number) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Clear canvas with fade effect for trailing
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw meteors
    updateMeteors(canvas, deltaTime);
    meteorsRef.current.forEach(meteor => drawMeteor(ctx, meteor));

    animationRef.current = requestAnimationFrame(animate);
  }, [updateMeteors, drawMeteor]);

  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    initializeMeteors(canvas);
  }, [initializeMeteors]);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const increment = Math.random() * 15 + 5; // 5-20% increments
        const newProgress = Math.min(prev + increment, 100);

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onLoadingComplete, 1000); // Delay for fade out
          }, 500);
        }

        return newProgress;
      });
    }, 200 + Math.random() * 300); // 200-500ms intervals

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, handleResize]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Meteor shower canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 100%)' }}
          />

          {/* Loading content overlay */}
          <div className="relative z-10 text-center text-white max-w-md mx-auto px-6">
            {/* Logo/Title */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold font-mono bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                ASTRO_ALCHEMY
              </h1>
              <p className="text-gray-300 font-mono text-sm">
                Initializing cosmic portfolio...
              </p>
            </motion.div>

            {/* Loading progress */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4 overflow-hidden border border-emerald-400/30">
                <motion.div
                  className="h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>

              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-emerald-400">LOADING_SYSTEMS</span>
                <span className="text-blue-400">{Math.round(loadingProgress)}%</span>
              </div>
            </motion.div>

            {/* Loading status messages */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <div className="text-xs font-mono text-gray-400">
                {loadingProgress < 25 && "Scanning cosmic coordinates..."}
                {loadingProgress >= 25 && loadingProgress < 50 && "Calibrating navigation systems..."}
                {loadingProgress >= 50 && loadingProgress < 75 && "Loading project constellations..."}
                {loadingProgress >= 75 && loadingProgress < 95 && "Establishing communication links..."}
                {loadingProgress >= 95 && "Launch sequence initiated..."}
              </div>

              {/* Animated dots */}
              <motion.div
                className="flex justify-center space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-emerald-400 rounded-full"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* System status */}
            <motion.div
              className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-emerald-400/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 font-mono text-xs">METEOR_SHOWER_ACTIVE</span>
              </div>
              <div className="text-xs font-mono text-gray-400">
                Cosmic particles detected: {meteorsRef.current.length}
              </div>
            </motion.div>
          </div>

          {/* Ambient glow effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-blue-500/10 pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};