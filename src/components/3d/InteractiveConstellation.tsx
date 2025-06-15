import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

export const InteractiveConstellation: React.FC = React.memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const lastFrameTime = useRef<number>(0);

  // Memoized nodes with stable references
  const nodes = useMemo(() => {
    const nodeCount = 8; // Reduced from 12 for better performance
    const techNames = [
      'React', 'Node.js', 'Python', 'Rust', 'TypeScript', 'Docker', 'AWS', 'PostgreSQL'
    ];

    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 3 + (i % 2) * 1.5; // Simplified radius calculation
      const height = Math.sin(angle * 2) * 2; // Deterministic height

      const position: [number, number, number] = [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ];

      nodes.push({
        id: i,
        position,
        connections: [] as number[],
        tech: techNames[i],
        initialPosition: [...position] as [number, number, number]
      });
    }

    // Simplified connection logic
    nodes.forEach((node, i) => {
      const nextIndex = (i + 1) % nodeCount;
      const prevIndex = (i - 1 + nodeCount) % nodeCount;

      node.connections.push(nextIndex);
      if (i % 2 === 0) {
        node.connections.push(prevIndex);
      }
    });

    return nodes;
  }, []);

  // Throttled animation frame
  useFrame((state) => {
    if (!groupRef.current) return;

    const currentTime = state.clock.elapsedTime;
    if (currentTime - lastFrameTime.current < 1 / 30) return; // 30fps throttle
    lastFrameTime.current = currentTime;

    try {
      groupRef.current.rotation.y = currentTime * 0.05;

      // Batch update positions
      const children = groupRef.current.children;
      for (let i = 0; i < Math.min(children.length, nodes.length); i++) {
        const child = children[i];
        const node = nodes[i];

        if (child?.type === 'Group' && node?.initialPosition) {
          const oscillation = Math.sin(currentTime * 0.5 + i) * 0.15;
          child.position.y = node.initialPosition[1] + oscillation;
        }
      }
    } catch (error) {
      console.warn('Animation frame error:', error);
    }
  });

  // Optimized event handlers
  const handleNodeHover = useCallback((index: number) => {
    setHoveredNode(index);
  }, []);

  const handleNodeLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Render connections with reduced complexity */}
      {nodes.map((node, i) =>
        node.connections.slice(0, 2).map((connectionIndex) => { // Limit connections
          const targetNode = nodes[connectionIndex];
          if (!targetNode?.position) return null;

          const isHighlighted = hoveredNode === i || hoveredNode === connectionIndex;

          return (
            <Line
              key={`${i}-${connectionIndex}`}
              points={[node.position, targetNode.position]}
              color={isHighlighted ? "#00FFFF" : "#444444"}
              lineWidth={isHighlighted ? 2 : 1}
              transparent
              opacity={isHighlighted ? 0.8 : 0.3}
            />
          );
        })
      )}

      {/* Render nodes with optimized geometry */}
      {nodes.map((node, i) => (
        <group key={`node-${i}`} position={node.position}>
          <Sphere
            args={[0.08, 8, 8]} // Reduced geometry complexity
            onPointerEnter={() => handleNodeHover(i)}
            onPointerLeave={handleNodeLeave}
            scale={hoveredNode === i ? 1.3 : 1}
          >
            <meshStandardMaterial
              color={hoveredNode === i ? "#00FFFF" : "#FFFFFF"}
              emissive={hoveredNode === i ? "#00FFFF" : "#444444"}
              emissiveIntensity={hoveredNode === i ? 0.4 : 0.1}
            />
          </Sphere>

          {/* Conditional tooltip rendering */}
          {hoveredNode === i && (
            <Html distanceFactor={12}>
              <div className="bg-black/90 backdrop-blur-sm text-cyan-400 px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none border border-cyan-500/50 font-mono">
                {node.tech}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
});

InteractiveConstellation.displayName = 'InteractiveConstellation';