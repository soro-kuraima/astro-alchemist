import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Html, Text, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { skills } from '../../data/portfolio';

// Perlin noise implementation for smooth surface deformation
class PerlinNoise {
  private permutation: number[];

  constructor() {
    this.permutation = [];
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = Math.floor(Math.random() * 256);
    }
    for (let i = 0; i < 256; i++) {
      this.permutation[256 + i] = this.permutation[i];
    }
  }

  fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.permutation[X] + Y;
    const AA = this.permutation[A] + Z;
    const AB = this.permutation[A + 1] + Z;
    const B = this.permutation[X + 1] + Y;
    const BA = this.permutation[B] + Z;
    const BB = this.permutation[B + 1] + Z;

    return this.lerp(w,
      this.lerp(v,
        this.lerp(u, this.grad(this.permutation[AA], x, y, z),
          this.grad(this.permutation[BA], x - 1, y, z)),
        this.lerp(u, this.grad(this.permutation[AB], x, y - 1, z),
          this.grad(this.permutation[BB], x - 1, y - 1, z))),
      this.lerp(v,
        this.lerp(u, this.grad(this.permutation[AA + 1], x, y, z - 1),
          this.grad(this.permutation[BA + 1], x - 1, y, z - 1)),
        this.lerp(u, this.grad(this.permutation[AB + 1], x, y - 1, z - 1),
          this.grad(this.permutation[BB + 1], x - 1, y - 1, z - 1))));
  }
}

// Central glass sphere with Perlin noise deformation
const CentralGlassSphere: React.FC<{ mousePosition: THREE.Vector2 }> = ({ mousePosition }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.SphereGeometry>(null);
  const noise = useMemo(() => new PerlinNoise(), []);

  useFrame((state) => {
    if (!meshRef.current || !geometryRef.current) return;

    const time = state.clock.elapsedTime;
    const geometry = geometryRef.current;
    const positions = geometry.attributes.position;

    // Gentle rotation at 0.1 rad/sec
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.05;

    // Apply Perlin noise deformation based on mouse position
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positions, i);

      const originalLength = vertex.length();
      vertex.normalize();

      // Mouse influence (subtle)
      const mouseInfluence = 0.1 * (mousePosition.x * vertex.x + mousePosition.y * vertex.y);

      // Perlin noise for organic surface movement
      const noiseValue = noise.noise(
        vertex.x * 1.5 + time * 0.2,
        vertex.y * 1.5 + time * 0.15,
        vertex.z * 1.5 + time * 0.1
      );

      // Max displacement 0.2 units
      const displacement = Math.min(0.2, Math.max(-0.2, 0.1 * noiseValue + mouseInfluence));
      const newLength = 2 + displacement;

      vertex.multiplyScalar(newLength);
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <Sphere ref={meshRef} args={[2, 128, 128]}>
      <sphereGeometry ref={geometryRef} args={[2, 128, 128]} />
      <meshPhysicalMaterial
        transparent
        opacity={0.3}
        roughness={0}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0}
        transmission={0.9}
        thickness={0.5}
        ior={1.4}
        iridescence={0.3}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 400]}
      />
    </Sphere>
  );
};

// Orbital skill sphere component
interface OrbitalSkillSphereProps {
  skill: any;
  index: number;
  mousePosition: THREE.Vector2;
  onHover: (skill: any | null) => void;
  onClick: (skill: any) => void;
  focused: boolean;
}

const OrbitalSkillSphere: React.FC<OrbitalSkillSphereProps> = ({
  skill,
  index,
  mousePosition,
  onHover,
  onClick,
  focused
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Orbital parameters
  const orbitRadius = 4 + (index % 3) * 1.5;
  const orbitSpeed = 0.2 + (index * 0.05); // 0.2-0.5 rad/sec range
  const orbitAngle = (index / 8) * Math.PI * 2;
  const orbitInclination = (15 + (index % 3) * 15) * (Math.PI / 180); // 15-45 degrees

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Elliptical orbital motion
    const angle = time * orbitSpeed + orbitAngle;
    const ellipseA = orbitRadius;
    const ellipseB = orbitRadius * 0.8; // Slight ellipse

    // Calculate orbital position with inclination
    const x = Math.cos(angle) * ellipseA;
    const y = Math.sin(angle) * ellipseB * Math.sin(orbitInclination);
    const z = Math.sin(angle) * ellipseB * Math.cos(orbitInclination);

    // Add subtle sine wave oscillation (amplitude 0.1)
    const oscillation = Math.sin(time * 2 + index) * 0.1;

    // Mouse tracking with 0.2s delay (smooth interpolation)
    const mouseInfluence = 0.3;
    const targetX = x + mousePosition.x * mouseInfluence;
    const targetY = y + mousePosition.y * mouseInfluence + oscillation;
    const targetZ = z;

    // Smooth interpolation for 0.2s delay effect
    meshRef.current.position.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      0.1
    );

    // Gentle rotation
    meshRef.current.rotation.y = time * 0.5;
    meshRef.current.rotation.x = Math.sin(time * 0.3 + index) * 0.1;
  });

  const skillColors = {
    frontend: '#10B981',
    backend: '#3B82F6',
    database: '#F59E0B',
    tools: '#8B5CF6',
    blockchain: '#EF4444'
  };

  const color = skillColors[skill.category as keyof typeof skillColors] || '#6B7280';

  return (
    <group
      ref={meshRef}
      onClick={() => onClick(skill)}
      onPointerEnter={() => {
        setHovered(true);
        onHover(skill);
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      {/* Main skill sphere */}
      <Sphere
        args={[0.5, 32, 32]}
        scale={hovered || focused ? 1.2 : 1}
      >
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || focused ? 0.3 : 0.1}
          roughness={0.2}
          metalness={0.8}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </Sphere>

      {/* Skill name text */}
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={hovered || focused}
      >
        {skill.name}
      </Text>

      {/* Hover tooltip */}
      {hovered && (
        <Html distanceFactor={15}>
          <div className="bg-gray-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap pointer-events-none border border-blue-400/50 shadow-2xl">
            <div className="font-bold text-blue-400">{skill.name}</div>
            <div className="text-xs text-gray-300">{skill.level}% proficiency</div>
            <div className="text-xs text-gray-400 capitalize">{skill.category}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Sparse starfield particle system
const StarField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute in sphere around scene
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.y = time * 0.01;
    pointsRef.current.rotation.x = Math.sin(time * 0.005) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Camera controller for smooth focus transitions
const CameraController: React.FC<{ focusedSkill: any | null }> = ({ focusedSkill }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (focusedSkill) {
      // Focus on specific skill (1s transition via lerp)
      camera.position.lerp(new THREE.Vector3(0, 2, 8), 0.02);
      camera.lookAt(0, 0, 0);
    } else {
      // Default position
      camera.position.lerp(new THREE.Vector3(0, 0, 12), 0.02);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

// Main 3D scene component
const Scene3D: React.FC<{
  mousePosition: THREE.Vector2;
  onSkillHover: (skill: any | null) => void;
  onSkillClick: (skill: any) => void;
  focusedSkill: any | null;
}> = ({ mousePosition, onSkillHover, onSkillClick, focusedSkill }) => {
  return (
    <>
      {/* Three-point lighting setup */}
      <ambientLight intensity={0.1} />
      {/* Key light - soft white */}
      <directionalLight position={[5, 5, 5]} intensity={0.7} color="#ffffff" />
      {/* Fill light - subtle blue */}
      <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#3B82F6" />
      {/* Rim light - purple accent */}
      <directionalLight position={[0, -3, -5]} intensity={0.2} color="#8B5CF6" />

      {/* Starfield background */}
      <StarField />

      {/* Central glass sphere */}
      <CentralGlassSphere mousePosition={mousePosition} />

      {/* Orbital skill spheres (6-8 skills) */}
      {skills.slice(0, 8).map((skill, index) => (
        <OrbitalSkillSphere
          key={skill.name}
          skill={skill}
          index={index}
          mousePosition={mousePosition}
          onHover={onSkillHover}
          onClick={onSkillClick}
          focused={focusedSkill?.name === skill.name}
        />
      ))}

      {/* Camera controller */}
      <CameraController focusedSkill={focusedSkill} />

      {/* Orbit controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        autoRotate={!focusedSkill}
        autoRotateSpeed={0.3}
        minDistance={8}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.9}
        />
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.05}
          bokehScale={2}
        />
      </EffectComposer>
    </>
  );
};

// Main component
export const Elegant3DSkillsVisualization: React.FC = () => {
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0, 0));
  const [hoveredSkill, setHoveredSkill] = useState<any | null>(null);
  const [focusedSkill, setFocusedSkill] = useState<any | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      setMousePosition(new THREE.Vector2(x * 0.3, y * 0.3));
    };

    // Touch events for mobile
    const handleTouchMove = (event: TouchEvent) => {
      if (!canvasRef.current || event.touches.length === 0) return;

      const touch = event.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      setMousePosition(new THREE.Vector2(x * 0.3, y * 0.3));
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('touchmove', handleTouchMove);
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, []);

  const handleSkillClick = (skill: any) => {
    setFocusedSkill(focusedSkill?.name === skill.name ? null : skill);
  };

  return (
    <div className="w-full h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* 3D Canvas */}
      <div ref={canvasRef} className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 60 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          performance={{ min: 0.8 }}
        >
          <Scene3D
            mousePosition={mousePosition}
            onSkillHover={setHoveredSkill}
            onSkillClick={handleSkillClick}
            focusedSkill={focusedSkill}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Title */}
        <motion.div
          className="absolute top-8 left-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Skills Constellation
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Interactive 3D Visualization
          </p>
        </motion.div>

        {/* Back button */}
        <motion.button
          onClick={() => window.history.back()}
          className="absolute top-8 right-8 flex items-center space-x-2 px-4 py-2 bg-gray-900/90 backdrop-blur-sm rounded-lg border border-blue-400/50 text-blue-400 hover:bg-gray-800/90 transition-all duration-300 pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm">← Back to Skills</span>
        </motion.button>

        {/* Instructions */}
        <motion.div
          className="absolute top-8 right-8 text-white text-right mr-32"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
            <div className="text-blue-400 text-sm mb-2">Controls</div>
            <div className="text-xs space-y-1 text-gray-300">
              <div>🖱️ Move: Influence central sphere</div>
              <div>🎯 Hover: View skill details</div>
              <div>👆 Click: Focus on skill</div>
              <div>🔄 Drag: Rotate view</div>
            </div>
          </div>
        </motion.div>

        {/* Skill Info Panel */}
        {(hoveredSkill || focusedSkill) && (
          <motion.div
            className="absolute bottom-8 left-8 bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 border border-blue-400/50 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="text-white">
              <h3 className="text-xl font-bold text-blue-400 mb-2">
                {(focusedSkill || hoveredSkill)?.name}
              </h3>
              <div className="text-sm text-gray-300 mb-3 capitalize">
                {(focusedSkill || hoveredSkill)?.category} Technology
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Proficiency</span>
                  <span className="text-xs text-blue-400">
                    {(focusedSkill || hoveredSkill)?.level}%
                  </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(focusedSkill || hoveredSkill)?.level}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>

                <div className="text-xs text-gray-400">
                  {focusedSkill ? 'Focused Mode' : 'Scanning...'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance indicator */}
        <div className="absolute bottom-8 right-8 bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-400 text-xs">60 FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};