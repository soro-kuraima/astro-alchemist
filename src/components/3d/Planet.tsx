import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  size?: number;
  color?: string;
  distort?: number;
  speed?: number;
}

export const Planet: React.FC<PlanetProps> = ({
  position,
  size = 1,
  color = '#4F46E5',
  distort = 0.3,
  speed = 1
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.1) * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};