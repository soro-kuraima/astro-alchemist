import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Skill } from '../../types';

interface InteractiveSkillTreeProps {
  skills: Skill[];
  onSkillHover: (skill: Skill | null) => void;
}

export const InteractiveSkillTree: React.FC<InteractiveSkillTreeProps> = ({
  skills,
  onSkillHover
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const getSkillPosition = (index: number, category: string): [number, number, number] => {
    const categoryPositions = {
      frontend: { x: -3, y: 2, z: 0 },
      backend: { x: 3, y: 2, z: 0 },
      database: { x: 0, y: 0, z: -2 },
      tools: { x: -2, y: -2, z: 1 },
      blockchain: { x: 2, y: -2, z: 1 }
    };

    const basePos = categoryPositions[category as keyof typeof categoryPositions] || { x: 0, y: 0, z: 0 };
    const offset = (index % 3) * 0.8 - 0.8;

    return [basePos.x + offset, basePos.y, basePos.z];
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      frontend: '#3B82F6',
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
        const position = getSkillPosition(index, skill.category);
        const color = getCategoryColor(skill.category);
        const isHovered = hoveredSkill === skill.name;
        const size = (skill.level / 100) * 0.3 + 0.1;

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
              scale={isHovered ? 1.2 : 1}
            >
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isHovered ? 0.3 : 0.1}
                transparent
                opacity={0.8}
              />
            </Sphere>

            {isHovered && (
              <Html distanceFactor={10}>
                <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none">
                  <div className="font-semibold">{skill.name}</div>
                  <div className="text-xs opacity-80">{skill.level}% proficiency</div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Connection lines between related skills */}
      {skills.map((skill, index) => {
        const position = getSkillPosition(index, skill.category);
        const centerPosition: [number, number, number] = [0, 0, 0];

        return (
          <Line
            key={`line-${skill.name}`}
            points={[position, centerPosition]}
            color={getCategoryColor(skill.category)}
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        );
      })}
    </group>
  );
};