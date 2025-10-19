import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = ({ count = 3000 }) => {
  const points = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorChoices = [new THREE.Color('#10b981'), new THREE.Color('#06b6d4'), new THREE.Color('#3b82f6')]; // Green, Cyan, Blue

    for (let i = 0; i < count; i++) {
      pos[i * 3] = THREE.MathUtils.randFloatSpread(10); // x
      pos[i * 3 + 1] = THREE.MathUtils.randFloatSpread(15); // y
      pos[i * 3 + 2] = THREE.MathUtils.randFloatSpread(10); // z
      
      const randomColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      col[i * 3] = randomColor.r;
      col[i * 3 + 1] = randomColor.g;
      col[i * 3 + 2] = randomColor.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      // Subtle parallax effect based on mouse position
      points.current.position.x = THREE.MathUtils.lerp(points.current.position.x, state.mouse.x * 0.5, 0.05);
      points.current.position.y = THREE.MathUtils.lerp(points.current.position.y, state.mouse.y * 0.5, 0.05);
    }
  });

  return (
    <Points ref={points} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial transparent size={0.015} sizeAttenuation depthWrite={false} vertexColors blending={THREE.AdditiveBlending} />
    </Points>
  );
};

const SignupBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default SignupBackground;