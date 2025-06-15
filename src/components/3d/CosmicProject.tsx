import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Text, Ring, Torus, Box, Icosahedron } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Project } from '../../types';

interface CosmicProjectProps {
  project: Project;
  index: number;
  onHover: (project: Project | null) => void;
  onClick: (project: Project) => void;
  isSelected: boolean;
  mousePosition: THREE.Vector2;
}

// Perlin noise for organic surface movement
class SimplexNoise {
  private grad3: number[][];
  private p: number[];
  private perm: number[];
  private permMod12: number[];

  constructor() {
    this.grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];

    this.p = [];
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(Math.random() * 256);
    }

    this.perm = [];
    this.permMod12 = [];
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  dot(g: number[], x: number, y: number, z: number): number {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  noise(xin: number, yin: number, zin: number): number {
    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;

    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);

    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    let i1, j1, k1;
    let i2, j2, k2;

    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3;
    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3;
    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const gi0 = this.permMod12[ii + this.perm[jj + this.perm[kk]]];
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]];
    const gi2 = this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]];
    const gi3 = this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]];

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    let n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * this.dot(this.grad3[gi0], x0, y0, z0);

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    let n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * this.dot(this.grad3[gi1], x1, y1, z1);

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    let n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * this.dot(this.grad3[gi2], x2, y2, z2);

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    let n3 = t3 < 0 ? 0.0 : Math.pow(t3, 4) * this.dot(this.grad3[gi3], x3, y3, z3);

    return 32.0 * (n0 + n1 + n2 + n3);
  }
}

export const CosmicProject: React.FC<CosmicProjectProps> = ({
  project,
  index,
  onHover,
  onClick,
  isSelected,
  mousePosition
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const clickableRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const noise = useMemo(() => new SimplexNoise(), []);

  // Project-specific configurations
  const projectConfig = useMemo(() => {
    const configs = {
      'fullstack-ecommerce': {
        shape: 'sphere',
        color: '#10B981',
        secondaryColor: '#059669',
        size: 1.2,
        orbitRadius: 8,
        orbitSpeed: 0.3,
        rotationSpeed: 0.5,
        glowIntensity: 0.4,
        particleCount: 150,
        features: 'commerce'
      },
      'fastapi-ml-service': {
        shape: 'icosahedron',
        color: '#3B82F6',
        secondaryColor: '#1D4ED8',
        size: 1.0,
        orbitRadius: 12,
        orbitSpeed: 0.4,
        rotationSpeed: 0.7,
        glowIntensity: 0.5,
        particleCount: 200,
        features: 'neural'
      },
      'rust-blockchain': {
        shape: 'cube',
        color: '#F59E0B',
        secondaryColor: '#D97706',
        size: 1.1,
        orbitRadius: 15,
        orbitSpeed: 0.2,
        rotationSpeed: 0.3,
        glowIntensity: 0.6,
        particleCount: 100,
        features: 'crystalline'
      },
      'nextjs-dashboard': {
        shape: 'torus',
        color: '#8B5CF6',
        secondaryColor: '#7C3AED',
        size: 1.0,
        orbitRadius: 10,
        orbitSpeed: 0.5,
        rotationSpeed: 0.6,
        glowIntensity: 0.3,
        particleCount: 120,
        features: 'data'
      }
    };

    return configs[project.id as keyof typeof configs] || configs['fullstack-ecommerce'];
  }, [project.id]);

  // Enhanced click handler with immediate feedback
  const handleClick = (event: THREE.Event) => {
    event.stopPropagation();
    setIsClicking(true);

    // Immediate visual feedback
    setTimeout(() => setIsClicking(false), 150);

    // Trigger parent click handler
    onClick(project);
  };

  const handlePointerEnter = (event: THREE.Event) => {
    event.stopPropagation();
    setHovered(true);
    onHover(project);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = (event: THREE.Event) => {
    event.stopPropagation();
    setHovered(false);
    onHover(null);
    document.body.style.cursor = 'default';
  };

  // Orbital motion and animation
  useFrame((state) => {
    if (!groupRef.current || !planetRef.current) return;

    const time = state.clock.elapsedTime;
    const config = projectConfig;

    // Orbital motion with elliptical path
    const angle = time * config.orbitSpeed + (index * Math.PI * 2) / 4;
    const ellipseA = config.orbitRadius;
    const ellipseB = config.orbitRadius * 0.7;

    const x = Math.cos(angle) * ellipseA;
    const y = Math.sin(time * 0.2 + index) * 2;
    const z = Math.sin(angle) * ellipseB;

    // Mouse influence for interactive movement
    const mouseInfluence = isSelected || hovered ? 0.5 : 0.2;
    const targetX = x + mousePosition.x * mouseInfluence;
    const targetY = y + mousePosition.y * mouseInfluence;
    const targetZ = z;

    // Smooth interpolation
    groupRef.current.position.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      0.02
    );

    // Planet rotation
    planetRef.current.rotation.y = time * config.rotationSpeed;
    planetRef.current.rotation.x = Math.sin(time * 0.3 + index) * 0.1;

    // Click animation effect
    if (isClicking) {
      const clickScale = 1 + Math.sin(time * 20) * 0.1;
      planetRef.current.scale.setScalar(clickScale);
    } else {
      const baseScale = hovered || isSelected ? 1.2 : 1;
      planetRef.current.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), 0.1);
    }

    // Atmospheric breathing effect
    if (atmosphereRef.current) {
      const breathe = 1 + Math.sin(time * 2 + index) * 0.05;
      atmosphereRef.current.scale.setScalar(breathe);
      atmosphereRef.current.rotation.y = time * 0.1;
    }

    // Surface deformation for organic feel
    if (planetRef.current.geometry && config.features === 'neural') {
      const geometry = planetRef.current.geometry as THREE.IcosahedronGeometry;
      const positions = geometry.attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positions, i);

        const originalLength = vertex.length();
        vertex.normalize();

        const noiseValue = noise.noise(
          vertex.x * 2 + time * 0.5,
          vertex.y * 2 + time * 0.3,
          vertex.z * 2 + time * 0.4
        );

        const displacement = 0.05 * noiseValue;
        const newLength = originalLength + displacement;

        vertex.multiplyScalar(newLength);
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      positions.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  // Render different shapes based on project type
  const renderPlanetShape = () => {
    const config = projectConfig;

    switch (config.shape) {
      case 'icosahedron':
        return (
          <Icosahedron ref={planetRef} args={[config.size, 2]}>
            <meshPhysicalMaterial
              color={config.color}
              emissive={config.color}
              emissiveIntensity={config.glowIntensity}
              roughness={0.3}
              metalness={0.7}
              clearcoat={0.8}
              clearcoatRoughness={0.2}
            />
          </Icosahedron>
        );

      case 'cube':
        return (
          <Box ref={planetRef} args={[config.size * 1.5, config.size * 1.5, config.size * 1.5]}>
            <meshPhysicalMaterial
              color={config.color}
              emissive={config.color}
              emissiveIntensity={config.glowIntensity}
              roughness={0.1}
              metalness={0.9}
              clearcoat={1}
              clearcoatRoughness={0}
            />
          </Box>
        );

      case 'torus':
        return (
          <Torus ref={planetRef} args={[config.size, config.size * 0.4, 16, 32]}>
            <meshPhysicalMaterial
              color={config.color}
              emissive={config.color}
              emissiveIntensity={config.glowIntensity}
              roughness={0.2}
              metalness={0.8}
              transmission={0.1}
              thickness={0.5}
            />
          </Torus>
        );

      default:
        return (
          <Sphere ref={planetRef} args={[config.size, 32, 32]}>
            <meshPhysicalMaterial
              color={config.color}
              emissive={config.color}
              emissiveIntensity={config.glowIntensity}
              roughness={0.4}
              metalness={0.6}
              clearcoat={0.5}
              clearcoatRoughness={0.3}
            />
          </Sphere>
        );
    }
  };

  return (
    <group ref={groupRef}>
      {/* Invisible clickable sphere for reliable interaction */}
      <Sphere
        ref={clickableRef}
        args={[projectConfig.size * 2, 8, 8]}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        visible={false}
      />

      {/* Main planet body */}
      {renderPlanetShape()}

      {/* Atmospheric glow */}
      <Sphere ref={atmosphereRef} args={[projectConfig.size * 1.3, 16, 16]}>
        <meshBasicMaterial
          color={projectConfig.secondaryColor}
          transparent
          opacity={hovered || isSelected ? 0.2 : 0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Click feedback ring */}
      {isClicking && (
        <Ring args={[projectConfig.size * 1.5, projectConfig.size * 1.6, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </Ring>
      )}

      {/* Orbital rings for selected/hovered state */}
      {(hovered || isSelected) && (
        <>
          <Ring args={[projectConfig.size * 1.8, projectConfig.size * 1.9, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial
              color={projectConfig.color}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </Ring>
          <Ring args={[projectConfig.size * 2.2, projectConfig.size * 2.3, 32]} rotation={[Math.PI / 3, 0, 0]}>
            <meshBasicMaterial
              color={projectConfig.secondaryColor}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </Ring>
        </>
      )}
    </group>
  );
};