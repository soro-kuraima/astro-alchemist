import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface CosmicParticleFieldProps {
  count?: number;
  radius?: number;
  speed?: number;
  color?: string;
  size?: number;
}

export const CosmicParticleField: React.FC<CosmicParticleFieldProps> = ({
  count = 2000,
  radius = 50,
  speed = 0.5,
  color = '#ffffff',
  size = 0.02
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, velocities, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Distribute particles in a cosmic cloud formation
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * (0.5 + Math.random() * 0.5);
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      
      // Slow orbital velocities
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
      
      // Varied particle colors (cosmic dust effect)
      const brightness = 0.3 + Math.random() * 0.7;
      const starType = Math.random();
      
      if (starType < 0.6) {
        // White/blue stars
        colors[i3] = brightness * 0.8;
        colors[i3 + 1] = brightness * 0.9;
        colors[i3 + 2] = brightness;
      } else if (starType < 0.8) {
        // Golden stars
        colors[i3] = brightness;
        colors[i3 + 1] = brightness * 0.8;
        colors[i3 + 2] = brightness * 0.4;
      } else {
        // Reddish stars
        colors[i3] = brightness;
        colors[i3 + 1] = brightness * 0.5;
        colors[i3 + 2] = brightness * 0.3;
      }
      
      // Varied particle sizes
      sizes[i] = size * (0.5 + Math.random() * 1.5);
    }
    
    return { positions, velocities, colors, sizes };
  }, [count, radius, size]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Gentle orbital motion
      positions[i3] += velocities[i3] * speed;
      positions[i3 + 1] += velocities[i3 + 1] * speed;
      positions[i3 + 2] += velocities[i3 + 2] * speed;
      
      // Add subtle wave motion
      positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.01) * 0.002;
      
      // Boundary wrapping for infinite effect
      const distance = Math.sqrt(
        positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
      );
      
      if (distance > radius * 1.5) {
        // Reset particle to inner region
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = radius * 0.3;
        
        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Gentle rotation of entire particle field
    pointsRef.current.rotation.y = time * 0.01;
    pointsRef.current.rotation.x = Math.sin(time * 0.005) * 0.02;
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <PointMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};