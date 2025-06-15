import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingRocksProps {
  count?: number;
}

export const FloatingRocks: React.FC<FloatingRocksProps> = ({ count = 50 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const { positions, rotations, scales } = useMemo(() => {
    const positions: [number, number, number][] = [];
    const rotations: [number, number, number][] = [];
    const scales: number[] = [];
    
    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 100
      ]);
      rotations.push([
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ]);
      scales.push(Math.random() * 0.5 + 0.2);
    }
    
    return { positions, rotations, scales };
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3(...positions[i]);
        const rotation = new THREE.Euler(
          rotations[i][0] + state.clock.elapsedTime * 0.01,
          rotations[i][1] + state.clock.elapsedTime * 0.02,
          rotations[i][2] + state.clock.elapsedTime * 0.015
        );
        const scale = new THREE.Vector3(scales[i], scales[i], scales[i]);
        
        matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
        meshRef.current.setMatrixAt(i, matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <Instances ref={meshRef} limit={count}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#6B7280"
        roughness={0.8}
        metalness={0.2}
        transparent
        opacity={0.6}
      />
    </Instances>
  );
};