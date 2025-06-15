import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface SpaceBackgroundProps {
  count?: number;
}

export const SpaceBackground: React.FC<SpaceBackgroundProps> = React.memo(({ count = 1000 }) => {
  const ref = useRef<THREE.Points>(null);
  const lastFrameTime = useRef<number>(0);
  
  // Memoized particle data with reduced complexity
  const [positions, colors, sizes] = useMemo(() => {
    // Reduce particle count for better performance
    const actualCount = Math.min(count, 1000);
    const positions = new Float32Array(actualCount * 3);
    const colors = new Float32Array(actualCount * 3);
    const sizes = new Float32Array(actualCount);
    
    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3;
      
      // Optimized distribution calculation
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      const sinPhi = Math.sin(phi);
      positions[i3] = radius * sinPhi * Math.cos(theta);
      positions[i3 + 1] = radius * sinPhi * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Simplified color assignment
      const brightness = 0.5 + Math.random() * 0.5;
      const starType = Math.random();
      
      if (starType < 0.7) {
        // White stars (most common)
        colors[i3] = brightness;
        colors[i3 + 1] = brightness;
        colors[i3 + 2] = 1;
      } else {
        // Colored stars
        colors[i3] = starType < 0.85 ? 0 : brightness;
        colors[i3 + 1] = brightness;
        colors[i3 + 2] = starType < 0.85 ? 1 : brightness * 0.5;
      }
      
      sizes[i] = Math.random() * 1.5 + 0.5;
    }
    
    return [positions, colors, sizes];
  }, [count]);

  // Throttled animation with reduced frequency
  useFrame((state) => {
    if (!ref.current) return;
    
    const currentTime = state.clock.elapsedTime;
    if (currentTime - lastFrameTime.current < 1/15) return; // 15fps for background
    lastFrameTime.current = currentTime;
    
    // Simplified rotation
    ref.current.rotation.y = currentTime * 0.002;
    ref.current.rotation.x = Math.sin(currentTime * 0.001) * 0.02;
  });

  return (
    <Points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
});

SpaceBackground.displayName = 'SpaceBackground';