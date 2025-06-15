import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';

export const CosmicEnvironment: React.FC = () => {
  const nebulaRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  // Nebula clouds
  const nebulaClouds = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 80
      ] as [number, number, number],
      scale: 5 + Math.random() * 15,
      color: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
      ][i % 8],
      speed: 0.1 + Math.random() * 0.2
    }));
  }, []);

  // Cosmic rings
  const cosmicRings = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      radius: 20 + i * 8,
      thickness: 0.5 + Math.random() * 1,
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ] as [number, number, number],
      color: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'][i],
      speed: 0.05 + Math.random() * 0.1
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate nebula clouds
    if (nebulaRef.current) {
      nebulaRef.current.children.forEach((cloud, i) => {
        const config = nebulaClouds[i];
        cloud.rotation.y = time * config.speed;
        cloud.rotation.x = Math.sin(time * config.speed * 0.5) * 0.2;
        
        // Gentle floating motion
        cloud.position.y = config.position[1] + Math.sin(time * 0.3 + i) * 2;
      });
    }
    
    // Animate cosmic rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        const config = cosmicRings[i];
        ring.rotation.y = time * config.speed;
        ring.rotation.x = time * config.speed * 0.5;
        ring.rotation.z = Math.sin(time * 0.2 + i) * 0.1;
      });
    }
  });

  return (
    <group>
      {/* Nebula clouds */}
      <group ref={nebulaRef}>
        {nebulaClouds.map((cloud, i) => (
          <Sphere
            key={`nebula-${i}`}
            args={[cloud.scale, 16, 16]}
            position={cloud.position}
          >
            <meshBasicMaterial
              color={cloud.color}
              transparent
              opacity={0.05}
              side={THREE.DoubleSide}
            />
          </Sphere>
        ))}
      </group>
      
      {/* Cosmic rings */}
      <group ref={ringsRef}>
        {cosmicRings.map((ring, i) => (
          <Ring
            key={`ring-${i}`}
            args={[ring.radius, ring.radius + ring.thickness, 64]}
            rotation={ring.rotation}
          >
            <meshBasicMaterial
              color={ring.color}
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </Ring>
        ))}
      </group>
      
      {/* Distant galaxy backdrop */}
      <Sphere args={[200, 32, 32]}>
        <meshBasicMaterial
          color="#0a0a0a"
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </group>
  );
};