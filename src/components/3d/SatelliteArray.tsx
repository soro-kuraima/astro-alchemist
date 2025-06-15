import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Line, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export const SatelliteArray: React.FC = () => {
  const arrayRef = useRef<THREE.Group>(null);
  const satelliteRefs = useRef<THREE.Group[]>([]);

  const satellites = useMemo(() => [
    { 
      position: [0, 0, 0], 
      color: '#10B981', 
      size: 0.4,
      orbitRadius: 0,
      orbitSpeed: 0,
      type: 'main'
    },
    { 
      position: [3, 1, -1], 
      color: '#3B82F6', 
      size: 0.25,
      orbitRadius: 3.2,
      orbitSpeed: 0.5,
      type: 'communication'
    },
    { 
      position: [-3, -1, 2], 
      color: '#F59E0B', 
      size: 0.2,
      orbitRadius: 3.6,
      orbitSpeed: -0.3,
      type: 'relay'
    },
    { 
      position: [2, -2, 3], 
      color: '#8B5CF6', 
      size: 0.18,
      orbitRadius: 4.1,
      orbitSpeed: 0.7,
      type: 'data'
    },
    { 
      position: [-2, 2, -2], 
      color: '#EF4444', 
      size: 0.15,
      orbitRadius: 2.8,
      orbitSpeed: -0.8,
      type: 'monitoring'
    }
  ], []);

  useFrame((state) => {
    if (arrayRef.current) {
      arrayRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      // Animate satellites in realistic orbital patterns
      satelliteRefs.current.forEach((satRef, i) => {
        if (satRef && satellites[i]) {
          const satellite = satellites[i];
          const time = state.clock.elapsedTime;
          
          if (satellite.type === 'main') {
            // Main satellite gentle rotation
            satRef.rotation.y = time * 0.2;
            satRef.rotation.x = Math.sin(time * 0.1) * 0.1;
          } else {
            // Orbiting satellites
            const angle = time * satellite.orbitSpeed;
            const x = Math.cos(angle) * satellite.orbitRadius;
            const z = Math.sin(angle) * satellite.orbitRadius;
            const y = satellite.position[1] + Math.sin(time * 0.5 + i) * 0.3;
            
            satRef.position.set(x, y, z);
            
            // Satellite orientation - always face the center
            satRef.lookAt(0, 0, 0);
            
            // Add realistic satellite rotation
            satRef.rotation.z = time * 0.3 + i;
          }
        }
      });
    }
  });

  const SatelliteModel = ({ satellite, index }: { satellite: any, index: number }) => (
    <group 
      ref={(ref) => {
        if (ref) satelliteRefs.current[index] = ref;
      }}
      position={satellite.position}
    >
      {/* Main satellite body */}
      <Box args={[satellite.size, satellite.size * 0.6, satellite.size * 0.8]}>
        <meshStandardMaterial
          color={satellite.color}
          emissive={satellite.color}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      
      {/* Solar panels */}
      <Box 
        args={[satellite.size * 2.5, satellite.size * 0.05, satellite.size * 0.8]} 
        position={[-satellite.size * 1.5, 0, 0]}
      >
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#0f3460"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      <Box 
        args={[satellite.size * 2.5, satellite.size * 0.05, satellite.size * 0.8]} 
        position={[satellite.size * 1.5, 0, 0]}
      >
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#0f3460"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Communication dish */}
      <Cylinder 
        args={[satellite.size * 0.3, satellite.size * 0.1, satellite.size * 0.1, 16]} 
        position={[0, satellite.size * 0.4, 0]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial
          color={satellite.color}
          emissive={satellite.color}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>
      
      {/* Antenna */}
      <Cylinder 
        args={[satellite.size * 0.02, satellite.size * 0.02, satellite.size * 0.8, 8]} 
        position={[0, satellite.size * 0.8, 0]}
      >
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.2}
          metalness={1}
          roughness={0}
        />
      </Cylinder>
      
      {/* Blinking lights */}
      <Sphere args={[satellite.size * 0.05]} position={[0, 0, satellite.size * 0.5]}>
        <meshBasicMaterial
          color={satellite.color}
          transparent
          opacity={Math.sin(Date.now() * 0.01 + index) * 0.5 + 0.5}
        />
      </Sphere>
    </group>
  );

  return (
    <group ref={arrayRef}>
      {/* Render satellites */}
      {satellites.map((satellite, i) => (
        <SatelliteModel key={i} satellite={satellite} index={i} />
      ))}
      
      {/* Communication beams between satellites */}
      {satellites.slice(1).map((satellite, i) => (
        <Line
          key={`beam-${i}`}
          points={[[0, 0, 0], satellite.position]}
          color={satellite.color}
          lineWidth={1}
          transparent
          opacity={0.4}
          dashed
          dashSize={0.1}
          gapSize={0.05}
        />
      ))}
      
      {/* Orbital paths */}
      {satellites.slice(1).map((satellite, i) => {
        const points = [];
        for (let j = 0; j <= 64; j++) {
          const angle = (j / 64) * Math.PI * 2;
          points.push([
            Math.cos(angle) * satellite.orbitRadius,
            satellite.position[1],
            Math.sin(angle) * satellite.orbitRadius
          ]);
        }
        
        return (
          <Line
            key={`orbit-${i}`}
            points={points}
            color={satellite.color}
            lineWidth={0.5}
            transparent
            opacity={0.2}
          />
        );
      })}
    </group>
  );
};