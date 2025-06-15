import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

interface FloatingTextProps {
  text: string;
  position: [number, number, number];
  size?: number;
  color?: string;
  animate?: boolean;
}

export const FloatingText: React.FC<FloatingTextProps> = ({
  text,
  position,
  size = 1,
  color = '#ffffff',
  animate = true
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !animate) return;
    
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
  });

  return (
    <Center position={position}>
      <Text3D
        ref={meshRef}
        font="/fonts/Inter_Bold.json"
        size={size}
        height={0.1}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Text3D>
    </Center>
  );
};