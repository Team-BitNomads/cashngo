import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Particles = ({ count = 5000 }) => {
  const points = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const radius = 4.5;
    const colorChoices = ['#22d3ee', '#a855f7', '#ec4899']; // Cyan, Purple, Pink

    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 

      pos[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = distance * Math.cos(theta);

      const color = new THREE.Color(colorChoices[Math.floor(Math.random() * colorChoices.length)]);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta / 20;
      const targetX = state.mouse.x / 2;
      points.current.rotation.y = THREE.MathUtils.lerp(points.current.rotation.y, targetX, 0.1);
    }
  });

  return (
    <Points ref={points} positions={positions} colors={colors} stride={3} frustumCulled>
      <PointMaterial
        transparent
        size={0.015}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors // This is crucial to use the colors we defined
      />
    </Points>
  );
};

const PremiumHeroBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-10 bg-indigo-950">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Particles />
      </Canvas>
    </div>
  );
};

export default PremiumHeroBackground;