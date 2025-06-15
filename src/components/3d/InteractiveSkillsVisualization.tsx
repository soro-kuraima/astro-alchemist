import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Html, Text, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { skills } from '../../data/portfolio';

// Perlin noise implementation for organic deformation
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

// Central morphing sphere component
const CentralSphere: React.FC<{ mousePosition: THREE.Vector2 }> = ({ mousePosition }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.SphereGeometry>(null);
  const noise = useMemo(() => new PerlinNoise(), []);

  useFrame((state) => {
    if (!meshRef.current || !geometryRef.current) return;

    const time = state.clock.elapsedTime;
    const geometry = geometryRef.current;
    const positions = geometry.attributes.position;

    // Apply Perlin noise deformation based on mouse position and time
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positions, i);

      const originalLength = vertex.length();
      vertex.normalize();

      // Mouse influence
      const mouseInfluence = 0.3 * (mousePosition.x * vertex.x + mousePosition.y * vertex.y);

      // Perlin noise for organic movement
      const noiseValue = noise.noise(
        vertex.x * 2 + time * 0.5,
        vertex.y * 2 + time * 0.3,
        vertex.z * 2 + time * 0.4
      );

      const displacement = 0.2 * noiseValue + mouseInfluence;
      const newLength = 2 + displacement;

      vertex.multiplyScalar(newLength);
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    // Gentle rotation
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <sphereGeometry ref={geometryRef} args={[2, 64, 64]} />
      <meshPhysicalMaterial
        color="#4F46E5"
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Sphere>
  );
};

// Orbital skill sphere component
interface OrbitalSphereProps {
  skill: any;
  index: number;
  mousePosition: THREE.Vector2;
  onHover: (skill: any | null) => void;
  focused: boolean;
  onClick: () => void;
}

const OrbitalSphere: React.FC<OrbitalSphereProps> = ({
  skill,
  index,
  mousePosition,
  onHover,
  focused,
  onClick
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const orbitRadius = 4 + index * 0.5;
  const orbitSpeed = 0.2 + index * 0.1;
  const orbitAngle = (index / 8) * Math.PI * 2;

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Orbital motion with slight wobble
    const angle = time * orbitSpeed + orbitAngle;
    const wobble = Math.sin(time * 0.5 + index) * 0.2;

    const x = Math.cos(angle) * orbitRadius + wobble;
    const y = Math.sin(time * 0.3 + index) * 0.5;
    const z = Math.sin(angle) * orbitRadius + wobble;

    // Mouse following with delay
    const mouseInfluence = 0.3;
    const targetX = x + mousePosition.x * mouseInfluence;
    const targetY = y + mousePosition.y * mouseInfluence;
    const targetZ = z;

    // Smooth interpolation
    meshRef.current.position.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      0.05
    );

    // Rotation
    meshRef.current.rotation.y = time * 0.5;
    meshRef.current.rotation.x = Math.sin(time * 0.3 + index) * 0.2;
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
      onClick={onClick}
      onPointerEnter={() => {
        setHovered(true);
        onHover(skill);
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <Sphere args={[0.3, 32, 32]} scale={hovered || focused ? 1.3 : 1}>
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || focused ? 0.4 : 0.2}
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      {/* Skill logo/text */}
      <Text
        position={[0, 0, 0.35]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {skill.name.charAt(0)}
      </Text>

      {/* Orbital ring for high-level skills */}
      {skill.level >= 85 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.6 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Hover tooltip */}
      {hovered && (
        <Html distanceFactor={15}>
          <div className="bg-gray-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap pointer-events-none border border-emerald-400/50 font-mono shadow-2xl">
            <div className="font-bold text-emerald-400">{skill.name}</div>
            <div className="text-xs text-gray-300">{skill.level}% proficiency</div>
            <div className="text-xs text-gray-400 capitalize">{skill.category}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Particle system for atmosphere
const ParticleSystem: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.05;
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
        size={0.05}
        color="#4F46E5"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Camera controller for smooth transitions
const CameraController: React.FC<{ focusedSkill: any | null }> = ({ focusedSkill }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (focusedSkill) {
      // Focus on specific skill
      camera.position.lerp(new THREE.Vector3(0, 0, 8), 0.05);
      camera.lookAt(0, 0, 0);
    } else {
      // Default position
      camera.position.lerp(new THREE.Vector3(0, 0, 12), 0.05);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

// Main 3D scene component
const Scene3D: React.FC<{
  mousePosition: THREE.Vector2;
  onSkillHover: (skill: any | null) => void;
  focusedSkill: any | null;
  onSkillClick: (skill: any | null) => void;
}> = ({ mousePosition, onSkillHover, focusedSkill, onSkillClick }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#10B981" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
      <pointLight position={[0, 10, -10]} intensity={0.3} color="#8B5CF6" />

      {/* Atmospheric particles */}
      <ParticleSystem />

      {/* Central morphing sphere */}
      <CentralSphere mousePosition={mousePosition} />

      {/* Orbital skill spheres */}
      {skills.slice(0, 8).map((skill, index) => (
        <OrbitalSphere
          key={skill.name}
          skill={skill}
          index={index}
          mousePosition={mousePosition}
          onHover={onSkillHover}
          focused={focusedSkill?.name === skill.name}
          onClick={() => onSkillClick(focusedSkill?.name === skill.name ? null : skill)}
        />
      ))}

      {/* Camera controller */}
      <CameraController focusedSkill={focusedSkill} />

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        autoRotate={!focusedSkill}
        autoRotateSpeed={0.5}
        minDistance={6}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
};

// Main component
export const InteractiveSkillsVisualization: React.FC = () => {
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

      setMousePosition(new THREE.Vector2(x * 0.5, y * 0.5));
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

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
        >
          <Scene3D
            mousePosition={mousePosition}
            onSkillHover={setHoveredSkill}
            focusedSkill={focusedSkill}
            onSkillClick={setFocusedSkill}
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
          <h2 className="text-3xl font-bold font-mono bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            SKILL_MATRIX.EXE
          </h2>
          <p className="text-gray-400 text-sm font-mono mt-2">
            Interactive 3D Skills Visualization
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="absolute top-8 right-8 text-white text-right"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-emerald-400/30">
            <div className="text-emerald-400 text-sm font-mono mb-2">CONTROLS</div>
            <div className="text-xs font-mono space-y-1 text-gray-300">
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
            className="absolute bottom-8 left-8 bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 border border-emerald-400/50 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="text-white">
              <h3 className="text-xl font-bold font-mono text-emerald-400 mb-2">
                {(focusedSkill || hoveredSkill)?.name}
              </h3>
              <div className="text-sm text-gray-300 mb-3 capitalize">
                {(focusedSkill || hoveredSkill)?.category} Technology
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-gray-400">PROFICIENCY</span>
                  <span className="text-xs font-mono text-emerald-400">
                    {(focusedSkill || hoveredSkill)?.level}%
                  </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(focusedSkill || hoveredSkill)?.level}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>

                <div className="text-xs text-gray-400 font-mono">
                  {focusedSkill ? 'FOCUSED_MODE' : 'SCANNING...'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance indicator */}
        <div className="absolute bottom-8 right-8 bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-emerald-400/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-mono">SYSTEM_ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};