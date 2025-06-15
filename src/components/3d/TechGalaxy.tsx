import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Skill } from '../../types';

interface TechGalaxyProps {
  skills: Skill[];
  selectedCategory: string | null;
  onSkillHover: (skill: Skill | null) => void;
}

export const TechGalaxy: React.FC<TechGalaxyProps> = ({
  skills,
  selectedCategory,
  onSkillHover
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const galaxyData = useMemo(() => {
    const categories = {
      frontend: { center: [4, 2, 0], color: '#00FFFF' },
      backend: { center: [-4, 2, 0], color: '#00FF88' },
      database: { center: [0, -3, 2], color: '#FFD700' },
      tools: { center: [2, -2, -3], color: '#FF00FF' },
      blockchain: { center: [-2, -2, -3], color: '#FF4444' }
    };

    return skills.map((skill, index) => {
      const categoryData = categories[skill.category as keyof typeof categories];
      const angle = (index % 5) * (Math.PI * 2 / 5);
      const radius = 1 + (skill.level / 100) * 0.5;

      return {
        ...skill,
        position: [
          categoryData.center[0] + Math.cos(angle) * radius,
          categoryData.center[1] + Math.sin(angle) * radius * 0.5,
          categoryData.center[2] + Math.sin(angle * 2) * 0.5
        ] as [number, number, number],
        color: categoryData.color,
        size: 0.1 + (skill.level / 100) * 0.2
      };
    });
  }, [skills]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;

      // Animate individual skill spheres
      groupRef.current.children.forEach((child, i) => {
        if (child.type === 'Group') {
          const skillData = galaxyData[i];
          if (skillData) {
            child.position.y = skillData.position[1] + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.1;
          }
        }
      });
    }
  });

  const filteredSkills = selectedCategory
    ? galaxyData.filter(skill => skill.category === selectedCategory)
    : galaxyData;

  return (
    <group ref={groupRef}>
      {/* Render connection lines between related skills */}
      {filteredSkills.map((skill, i) =>
        filteredSkills.slice(i + 1).map((otherSkill, j) => {
          const distance = Math.sqrt(
            Math.pow(skill.position[0] - otherSkill.position[0], 2) +
            Math.pow(skill.position[1] - otherSkill.position[1], 2) +
            Math.pow(skill.position[2] - otherSkill.position[2], 2)
          );

          if (distance < 3 && skill.category === otherSkill.category) {
            return (
              <Line
                key={`${i}-${j}`}
                points={[skill.position, otherSkill.position]}
                color={skill.color}
                lineWidth={1}
                transparent
                opacity={0.2}
              />
            );
          }
          return null;
        })
      )}

      {/* Render skill spheres */}
      {filteredSkills.map((skill, i) => (
        <group key={skill.name} position={skill.position}>
          <Sphere
            args={[skill.size, 16, 16]}
            onPointerEnter={() => onSkillHover(skill)}
            onPointerLeave={() => onSkillHover(null)}
          >
            <meshStandardMaterial
              color={skill.color}
              emissive={skill.color}
              emissiveIntensity={0.3}
              transparent
              opacity={selectedCategory && skill.category !== selectedCategory ? 0.3 : 0.9}
            />
          </Sphere>

          {/* Orbital rings for high-level skills */}
          {skill.level >= 85 && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[skill.size + 0.1, skill.size + 0.15, 32]} />
              <meshBasicMaterial
                color={skill.color}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};