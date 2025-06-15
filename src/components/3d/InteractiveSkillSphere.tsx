import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Skill } from '../../types';

interface InteractiveSkillSphereProps {
  skills: Skill[];
  onSkillHover: (skill: Skill | null) => void;
}

export const InteractiveSkillSphere: React.FC<InteractiveSkillSphereProps> = ({
  skills,
  onSkillHover
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const getSkillPosition = (index: number, total: number): [number, number, number] => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    const radius = 4;

    return [
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    ];
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      frontend: '#06B6D4',
      backend: '#10B981',
      database: '#F59E0B',
      tools: '#8B5CF6',
      blockchain: '#EF4444'
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => {
        const position = getSkillPosition(index, skills.length);
        const color = getCategoryColor(skill.category);
        const isHovered = hoveredSkill === skill.name;
        const size = (skill.level / 100) * 0.4 + 0.2;

        return (
          <group key={skill.name} position={position}>
            <Sphere
              args={[size, 16, 16]}
              onPointerEnter={() => {
                setHoveredSkill(skill.name);
                onSkillHover(skill);
              }}
              onPointerLeave={() => {
                setHoveredSkill(null);
                onSkillHover(null);
              }}
              scale={isHovered ? 1.3 : 1}
            >
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isHovered ? 0.4 : 0.2}
                transparent
                opacity={0.9}
              />
            </Sphere>

            <Text
              position={[0, size + 0.3, 0]}
              fontSize={0.2}
              color={color}
              anchorX="center"
              anchorY="middle"
              visible={isHovered}
            >
              {skill.name}
            </Text>

            {isHovered && (
              <Html distanceFactor={15}>
                <div className="bg-gray-900/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none border border-cyan-500/30">
                  <div className="font-semibold text-cyan-400">{skill.name}</div>
                  <div className="text-xs text-gray-300">{skill.level}% proficiency</div>
                  <div className="text-xs text-gray-400 capitalize">{skill.category}</div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};