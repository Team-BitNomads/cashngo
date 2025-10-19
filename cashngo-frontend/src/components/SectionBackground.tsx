import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AmbientParticles = ({ count = 3000 }) => {
  const points = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 15; // Spread particles wider
    }
    return pos;
  }, [count]);

  useFrame((_state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta / 50; // Rotate much slower
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#a855f7" size={0.01} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </Points>
  );
};

const SectionBackground: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-20 opacity-40">
      <Canvas camera={{ position: [0, 0, 10] }}><AmbientParticles /></Canvas>
    </div>
  );
};
export default SectionBackground;