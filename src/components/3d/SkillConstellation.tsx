import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Skill } from '../../types';

interface SkillConstellationProps {
  skills: Skill[];
  selectedCategory: string | null;
  onSkillHover: (skill: Skill | null) => void;
}

export const SkillConstellation: React.FC<SkillConstellationProps> = React.memo(({
  skills,
  selectedCategory,
  onSkillHover
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const lastFrameTime = useRef<number>(0);

  // Astronomical constellation patterns with proper star positions
  const constellationData = useMemo(() => {
    const constellationPatterns = {
      // Cygnus (6 stars) - Northern Cross shape
      frontend: [
        [0, 3.2, 0],      // Deneb (tail/top)
        [0, 0, 0],        // Sadr (center/body)
        [0, -3.2, 0],     // Albireo (head/bottom)
        [-2.4, 0, 0],     // Gienah (left wing)
        [2.4, 0, 0],      // Fawaris (right wing)
        [1.2, 0.8, 0]     // Epsilon Cygni (wing detail)
      ],

      // Orion (7 stars) - The Hunter with belt
      backend: [
        [-1.8, 2.4, 0],   // Betelgeuse (left shoulder)
        [1.8, 2.4, 0],    // Bellatrix (right shoulder)
        [-0.6, 0, 0],     // Alnitak (belt left)
        [0, 0, 0],        // Alnilam (belt center)
        [0.6, 0, 0],      // Mintaka (belt right)
        [-1.8, -2.4, 0],  // Saiph (left foot)
        [1.8, -2.4, 0]    // Rigel (right foot)
      ],

      // Andromeda (4 stars) - Graceful curve
      database: [
        [-2.4, 1.2, -2],  // Alpheratz
        [-0.8, 0.4, -2],  // Mirach
        [0.8, -0.4, -2],  // Almach
        [2.4, -1.2, -2]   // Delta Andromedae
      ],

      // Sagittarius (8 stars) - The Teapot
      tools: [
        [-1.6, -1.6, 2],  // Kaus Australis (bottom left)
        [-0.8, -0.8, 2],  // Kaus Media (middle left)
        [0, 0, 2],        // Kaus Borealis (top middle)
        [1.2, -0.4, 2],   // Phi Sagittarii (right body)
        [2.0, -1.2, 2],   // Ascella (bottom right)
        [2.4, 0.4, 2],    // Nunki (handle top)
        [0.8, 0.8, 2],    // Alnasl (spout)
        [1.6, 1.2, 2]     // Spout tip
      ],

      // Lyra (5 stars) - Parallelogram with Vega
      blockchain: [
        [0, 1.6, -2.4],   // Vega (brightest, focal point)
        [-0.8, 0.4, -2.4], // Sulafat
        [0.8, 0.4, -2.4],  // Sheliak
        [-0.6, -0.8, -2.4], // Zeta Lyrae
        [0.6, -0.8, -2.4]   // Delta Lyrae
      ]
    };

    const categoryColors = {
      frontend: '#10B981',   // Emerald - Cygnus
      backend: '#3B82F6',    // Blue - Orion
      database: '#F59E0B',   // Amber - Andromeda
      tools: '#8B5CF6',      // Purple - Sagittarius
      blockchain: '#EF4444'   // Red - Lyra ()
    };

    // Group skills by category
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    const result: Array<Skill & {
      position: [number, number, number];
      color: string;
      size: number;
      brightness: number;
      id: string;
      visible: boolean;
      selected: boolean;
      starName: string;
    }> = [];

    Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
      const pattern = constellationPatterns[category as keyof typeof constellationPatterns];
      const color = categoryColors[category as keyof typeof categoryColors];

      if (!pattern || !color) {
        console.warn(`Missing pattern or color for category: ${category}`);
        return;
      }

      // Star names for each constellation
      const starNames = {
        frontend: ['Deneb', 'Sadr', 'Albireo', 'Gienah', 'Fawaris', 'Epsilon Cygni'],
        backend: ['Betelgeuse', 'Bellatrix', 'Alnitak', 'Alnilam', 'Mintaka', 'Saiph', 'Rigel'],
        database: ['Alpheratz', 'Mirach', 'Almach', 'Delta And'],
        tools: ['Kaus Australis', 'Kaus Media', 'Kaus Borealis', 'Phi Sgr', 'Ascella', 'Nunki', 'Alnasl', 'Spout'],
        blockchain: ['Vega', 'Sulafat', 'Sheliak', 'Zeta Lyr', 'Delta Lyr']
      };

      categorySkills.forEach((skill, index) => {
        if (index >= pattern.length) return; // Skip if more skills than stars

        const position = pattern[index] as [number, number, number];
        const starName = starNames[category as keyof typeof starNames]?.[index] || `Star ${index + 1}`;

        // Special sizing for prominent stars
        let size = 0.08 + (skill.level / 100) * 0.06;
        let brightness = 0.3 + (skill.level / 100) * 0.4;

        // Make certain stars more prominent based on astronomical brightness
        if (category === 'frontend' && index === 0) { // Deneb
          size *= 1.3;
          brightness *= 1.2;
        } else if (category === 'backend' && (index === 0 || index === 6)) { // Betelgeuse, Rigel
          size *= 1.2;
          brightness *= 1.1;
        } else if (category === 'blockchain' && index === 0) { // Vega
          size *= 1.4;
          brightness *= 1.3;
        }

        result.push({
          ...skill,
          id: `skill-${skill.name.replace(/\s+/g, '-').toLowerCase()}-${category}-${index}`,
          position,
          color,
          size: Math.max(0.06, size),
          brightness: Math.min(0.8, brightness),
          visible: true,
          selected: false,
          starName
        });
      });
    });

    console.log('Generated astronomical constellation data:', result.length, 'skills');
    return result;
  }, [skills]);

  // Enhanced filtering with proper constellation mapping
  const filteredSkills = useMemo(() => {
    if (!selectedCategory) {
      return constellationData.map(skill => ({ ...skill, visible: true }));
    }

    const categoryMap: Record<string, string[]> = {
      'blockchain': ['blockchain'],
      'web3': ['blockchain'],
      'frontend': ['frontend'],
      'backend': ['backend'],
      'database': ['database'],
      'tools': ['tools'],
      'devops': ['tools'],
    };

    const normalizedCategory = selectedCategory.toLowerCase().trim();
    const mappedCategories = categoryMap[normalizedCategory] || [normalizedCategory];

    const filtered = constellationData.filter(skill =>
      mappedCategories.includes(skill.category.toLowerCase())
    );

    console.log(`Filtering by category: ${selectedCategory} -> ${mappedCategories.join(', ')}`);
    console.log(`Filtered skills:`, filtered.length, 'out of', constellationData.length);

    return filtered.map(skill => ({ ...skill, visible: true }));
  }, [constellationData, selectedCategory]);

  // Astronomical constellation lines with proper connections
  const constellationLines = useMemo(() => {
    const lines: Array<{
      points: [number, number, number][];
      color: string;
      opacity: number;
      id: string;
      category: string;
      visible: boolean;
    }> = [];

    const connectionPatterns = {
      // Cygnus - Northern Cross pattern
      frontend: [
        [0, 1], // Deneb to Sadr (main axis)
        [1, 2], // Sadr to Albireo (main axis)
        [3, 1], // Gienah to Sadr (left wing)
        [1, 4], // Sadr to Fawaris (right wing)
        [4, 5]  // Fawaris to Epsilon Cygni (wing detail)
      ],

      // Orion - Hunter shape with belt
      backend: [
        [0, 1], // Betelgeuse to Bellatrix (shoulders)
        [0, 2], // Betelgeuse to Alnitak
        [1, 4], // Bellatrix to Mintaka
        [2, 3], // Alnitak to Alnilam (belt)
        [3, 4], // Alnilam to Mintaka (belt)
        [2, 5], // Alnitak to Saiph
        [4, 6]  // Mintaka to Rigel
      ],

      // Andromeda - Graceful curve
      database: [
        [0, 1], // Alpheratz to Mirach
        [1, 2], // Mirach to Almach
        [2, 3]  // Almach to Delta Andromedae
      ],

      // Sagittarius - Teapot shape
      tools: [
        [0, 1], // Kaus Australis to Kaus Media (body)
        [1, 2], // Kaus Media to Kaus Borealis (body)
        [2, 3], // Kaus Borealis to Phi Sagittarii (body)
        [3, 4], // Phi Sagittarii to Ascella (body)
        [4, 0], // Ascella to Kaus Australis (close body)
        [4, 5], // Ascella to Nunki (handle)
        [2, 6], // Kaus Borealis to Alnasl (spout)
        [6, 7]  // Alnasl to spout tip
      ],

      // Lyra - Parallelogram with Vega triangle
      blockchain: [
        [0, 1], // Vega to Sulafat (triangle)
        [0, 2], // Vega to Sheliak (triangle)
        [1, 2], // Sulafat to Sheliak (triangle base)
        [1, 3], // Sulafat to Zeta Lyrae (parallelogram)
        [2, 4], // Sheliak to Delta Lyrae (parallelogram)
        [3, 4]  // Zeta Lyrae to Delta Lyrae (parallelogram)
      ]
    };

    Object.entries(connectionPatterns).forEach(([category, connections]) => {
      const categorySkills = filteredSkills.filter(skill => skill.category === category && skill.visible);

      connections.forEach(([i, j], lineIndex) => {
        const skill1 = categorySkills[i];
        const skill2 = categorySkills[j];

        if (skill1?.position && skill2?.position) {
          const isHighlighted = hoveredSkill === skill1.name || hoveredSkill === skill2.name ||
            selectedSkill === skill1.name || selectedSkill === skill2.name;

          lines.push({
            id: `line-${category}-${lineIndex}`,
            points: [skill1.position, skill2.position],
            color: skill1.color,
            opacity: isHighlighted ? 0.9 : (selectedCategory ? 0.6 : 0.4),
            category,
            visible: true
          });
        }
      });
    });

    return lines;
  }, [filteredSkills, hoveredSkill, selectedSkill, selectedCategory]);

  // Optimized animation with error handling
  useFrame((state) => {
    if (!groupRef.current) return;

    const currentTime = state.clock.elapsedTime;
    if (currentTime - lastFrameTime.current < 1 / 30) return; // 30fps throttle
    lastFrameTime.current = currentTime;

    try {
      // Gentle constellation rotation
      groupRef.current.rotation.y = currentTime * 0.01;

      // Animate skill nodes with proper error checking
      const skillGroups = groupRef.current.children.filter(child =>
        child.userData?.isSkillGroup && child.userData?.skillIndex !== undefined
      );

      skillGroups.forEach((child) => {
        const skillIndex = child.userData.skillIndex;
        const skill = filteredSkills[skillIndex];

        if (skill?.position && skill.visible) {
          const timeOffset = currentTime * 0.4 + skillIndex * 0.3;
          const rotationOffset = currentTime * 0.8 + skillIndex * 0.2;

          // Subtle twinkling motion like real stars
          child.position.y = skill.position[1] + Math.sin(timeOffset) * 0.03;
          child.rotation.z = Math.sin(rotationOffset) * 0.02;

          // Ensure visibility
          child.visible = true;
        }
      });
    } catch (error) {
      console.warn('Constellation animation error:', error);
    }
  });

  // Enhanced event handlers
  const handleSkillHover = useCallback((skill: Skill) => {
    setHoveredSkill(skill.name);
    onSkillHover(skill);
  }, [onSkillHover]);

  const handleSkillLeave = useCallback(() => {
    setHoveredSkill(null);
    onSkillHover(null);
  }, [onSkillHover]);

  const handleSkillClick = useCallback((skill: Skill) => {
    setSelectedSkill(prev => prev === skill.name ? null : skill.name);
    console.log('Skill clicked:', skill.name, 'Selected:', selectedSkill !== skill.name);
  }, [selectedSkill]);

  // Enhanced tooltip component
  const SkillTooltip = React.memo<{ skill: Skill & { starName: string }; position: [number, number, number] }>(({ skill, position }) => (
    <Html
      distanceFactor={10}
      position={[position[0], position[1] + skill.size + 0.3, position[2]]}
      style={{
        pointerEvents: 'none',
        zIndex: 1000
      }}
      transform={false}
      occlude={false}
    >
      <div
        className="bg-gray-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap border border-emerald-400/50 font-mono shadow-xl"
        style={{
          transform: 'translate(-50%, -100%)',
          marginTop: '-8px'
        }}
      >
        <div className="font-semibold text-emerald-400">{skill.name}</div>
        <div className="text-xs text-blue-300">★ {skill.starName}</div>
        <div className="text-xs text-gray-300">{skill.level}% proficiency</div>
        <div className="text-xs text-gray-400 capitalize">
          {skill.category === 'blockchain' ? 'Blockchain' : skill.category}
        </div>
        {selectedSkill === skill.name && (
          <div className="text-xs text-blue-400 mt-1">● SELECTED</div>
        )}
      </div>
    </Html>
  ));

  SkillTooltip.displayName = 'SkillTooltip';

  return (
    <group ref={groupRef}>
      {/* Render constellation lines */}
      {constellationLines.map((line) => (
        <Line
          key={line.id}
          points={line.points}
          color={line.color}
          lineWidth={selectedCategory ? 2.5 : 1.5}
          transparent
          opacity={line.opacity}
          visible={line.visible}
        />
      ))}

      {/* Render skill stars */}
      {filteredSkills.map((skill, index) => {
        if (!skill?.position) {
          console.warn('Skill missing position:', skill.name);
          return null;
        }

        const isHovered = hoveredSkill === skill.name;
        const isSelected = selectedSkill === skill.name;
        const isFiltered = selectedCategory &&
          !selectedCategory.toLowerCase().includes('smart') &&
          skill.category !== selectedCategory.toLowerCase();

        const scale = isHovered ? 1.4 : isSelected ? 1.2 : 1;
        const opacity = isFiltered ? 0.4 : 0.9;

        return (
          <group
            key={skill.id}
            position={skill.position}
            userData={{
              isSkillGroup: true,
              skillIndex: index,
              skillName: skill.name
            }}
            visible={skill.visible}
          >
            {/* Main skill star */}
            <Sphere
              args={[skill.size, 16, 16]}
              onPointerEnter={() => handleSkillHover(skill)}
              onPointerLeave={handleSkillLeave}
              onClick={() => handleSkillClick(skill)}
              scale={scale}
            >
              <meshStandardMaterial
                color={skill.color}
                emissive={skill.color}
                emissiveIntensity={isHovered ? 0.7 : isSelected ? 0.5 : skill.brightness * 0.4}
                transparent
                opacity={opacity}
                roughness={0.2}
                metalness={0.8}
              />
            </Sphere>

            {/* Selection indicator ring */}
            {isSelected && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[skill.size + 0.08, skill.size + 0.12, 32]} />
                <meshBasicMaterial
                  color="#00FFFF"
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Tooltip on hover or selection */}
            {(isHovered || isSelected) && (
              <SkillTooltip skill={skill} position={skill.position} />
            )}

            {/* Expert level stellar corona */}
            {skill.level >= 85 && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[skill.size + 0.04, skill.size + 0.06, 24]} />
                <meshBasicMaterial
                  color={skill.color}
                  transparent
                  opacity={isHovered || isSelected ? 0.6 : 0.2}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Master level stellar halo */}
            {skill.level >= 90 && (
              <Sphere args={[skill.size * 2.5, 12, 12]}>
                <meshBasicMaterial
                  color={skill.color}
                  transparent
                  opacity={isHovered || isSelected ? 0.15 : 0.08}
                />
              </Sphere>
            )}

            {/* Star classification for prominent stars */}
            {(isHovered || isSelected) && skill.level >= 80 && (
              <Text
                position={[0, -skill.size - 0.2, 0]}
                fontSize={0.08}
                color={skill.color}
                anchorX="center"
                anchorY="middle"
              >
                {skill.level >= 90 ? 'SUPERGIANT' : 'GIANT'}
              </Text>
            )}
          </group>
        );
      })}

      {/* Constellation name labels for filtered view */}
      {selectedCategory && filteredSkills.length > 0 && (
        <group>
          <Text
            position={[0, -4, 0]}
            fontSize={0.15}
            color={filteredSkills[0]?.color || '#10B981'}
            anchorX="center"
            anchorY="middle"
          >
            {selectedCategory === 'frontend' && 'CYGNUS'}
            {selectedCategory === 'backend' && 'ORION'}
            {selectedCategory === 'database' && 'ANDROMEDA'}
            {selectedCategory === 'tools' && 'SAGITTARIUS'}
            {(selectedCategory === 'blockchain') && 'LYRA'}
          </Text>
          <Text
            position={[0, -4.5, 0]}
            fontSize={0.08}
            color="#888888"
            anchorX="center"
            anchorY="middle"
          >
            {selectedCategory === 'frontend' && 'The Northern Cross'}
            {selectedCategory === 'backend' && 'The Hunter'}
            {selectedCategory === 'database' && 'The Chained Maiden'}
            {selectedCategory === 'tools' && 'The Teapot'}
            {(selectedCategory === 'blockchain') && 'The Harp'}
          </Text>
        </group>
      )}
    </group>
  );
});

SkillConstellation.displayName = 'SkillConstellation';