import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface MatrixChar {
  id: number;
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
  active: boolean;
}

export const MatrixBlobVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const charactersRef = useRef<MatrixChar[]>([]);
  const lastTimeRef = useRef<number>(0);
  const [fps, setFps] = useState<number>(60);
  const [isDebug] = useState<boolean>(false); // Set to true for FPS counter

  // Matrix characters (Japanese katakana and some symbols)
  const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

  const initializeCharacters = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const columns = Math.floor(canvas.width / 20);
    const maxChars = Math.min(50, Math.floor(columns * 0.25)); // 25% density, max 50 chars
    
    charactersRef.current = Array.from({ length: maxChars }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      speed: 1 + Math.random() * 2, // 50% of normal speed
      opacity: 0.3,
      active: Math.random() > 0.7 // Only 30% active at start
    }));
  }, [matrixChars]);

  const isInCenterZone = useCallback((x: number, y: number, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const centerRadius = Math.min(canvas.width, canvas.height) * 0.2; // 20% center radius
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    return distance < centerRadius;
  }, []);

  const updateCharacters = useCallback((deltaTime: number, canvas: HTMLCanvasElement) => {
    charactersRef.current.forEach(char => {
      if (!char.active) {
        // Randomly activate inactive characters
        if (Math.random() < 0.001) {
          char.active = true;
          char.y = -20;
          char.x = Math.random() * canvas.width;
          char.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }
        return;
      }

      // Move character down
      char.y += char.speed * deltaTime * 0.1;

      // Check if in center zone and redirect
      if (isInCenterZone(char.x, char.y, canvas)) {
        char.x += (Math.random() - 0.5) * 40; // Push away from center
      }

      // Fade out near bottom
      if (char.y > canvas.height - 100) {
        char.opacity = Math.max(0, char.opacity - deltaTime * 0.002);
      }

      // Reset when off screen or fully faded
      if (char.y > canvas.height + 20 || char.opacity <= 0) {
        char.active = false;
        char.opacity = 0.3;
      }

      // Occasionally change character
      if (Math.random() < 0.01) {
        char.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }
    });
  }, [matrixChars, isInCenterZone]);

  const drawBlob = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.15; // 200-300px equivalent
    
    // Pulsing animation (1 pulse per second)
    const pulseScale = 1 + Math.sin(time * 0.001) * 0.1;
    const radius = baseRadius * pulseScale;

    // Create glow effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius + 20);
    gradient.addColorStop(0, 'rgba(0, 255, 65, 0.85)');
    gradient.addColorStop(0.7, 'rgba(0, 255, 65, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');

    // Draw glow
    ctx.save();
    ctx.filter = 'blur(10px)';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw main blob
    ctx.fillStyle = 'rgba(0, 255, 65, 0.85)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Add subtle inner glow
    const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    innerGradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
    ctx.fillStyle = innerGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const drawCharacters = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';

    charactersRef.current.forEach(char => {
      if (!char.active || char.opacity <= 0) return;

      ctx.fillStyle = `rgba(0, 255, 65, ${char.opacity})`;
      ctx.fillText(char.char, char.x, char.y);
    });
  }, []);

  const drawVignette = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const animate = useCallback((currentTime: number) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Calculate FPS
    if (deltaTime > 0) {
      const currentFps = 1000 / deltaTime;
      setFps(Math.round(currentFps));
    }

    // Clear canvas with background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw characters
    updateCharacters(deltaTime, canvas);
    drawCharacters(ctx);

    // Draw central blob
    drawBlob(ctx, canvas, currentTime);

    // Draw vignette effect
    drawVignette(ctx, canvas);

    animationRef.current = requestAnimationFrame(animate);
  }, [updateCharacters, drawCharacters, drawBlob, drawVignette]);

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

    initializeCharacters();
  }, [initializeCharacters]);

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
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'rgba(0, 0, 0, 0.95)' }}
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Title */}
        <motion.div
          className="absolute top-8 left-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold font-mono text-[#00FF41]">
            MATRIX_CORE.EXE
          </h2>
          <p className="text-gray-400 text-sm font-mono mt-2">
            Neural Network Interface
          </p>
        </motion.div>

        {/* Back Button */}
        <motion.button
          onClick={() => window.history.back()}
          className="absolute top-8 right-8 flex items-center space-x-2 px-4 py-2 bg-gray-900/90 backdrop-blur-sm rounded-lg border border-[#00FF41]/50 text-[#00FF41] hover:bg-gray-800/90 transition-all duration-300 pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="font-mono text-sm">EXIT_MATRIX()</span>
        </motion.button>

        {/* System Status */}
        <motion.div
          className="absolute bottom-8 left-8 bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-[#00FF41]/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="text-[#00FF41] text-sm font-mono mb-2">SYSTEM_STATUS</div>
          <div className="space-y-1 text-xs font-mono text-gray-300">
            <div className="flex justify-between">
              <span>CORE_ACTIVE:</span>
              <span className="text-[#00FF41]">TRUE</span>
            </div>
            <div className="flex justify-between">
              <span>RAIN_DENSITY:</span>
              <span className="text-[#00FF41]">25%</span>
            </div>
            <div className="flex justify-between">
              <span>PULSE_RATE:</span>
              <span className="text-[#00FF41]">1.0Hz</span>
            </div>
            {isDebug && (
              <div className="flex justify-between">
                <span>FPS:</span>
                <span className="text-[#00FF41]">{fps}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="absolute bottom-8 right-8 text-right"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-[#00FF41]/30">
            <div className="text-[#00FF41] text-sm font-mono mb-2">NEURAL_INTERFACE</div>
            <div className="text-xs font-mono space-y-1 text-gray-300">
              <div>🧠 Core processing active</div>
              <div>💚 Matrix rain peripheral</div>
              <div>⚡ 60fps optimization</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};