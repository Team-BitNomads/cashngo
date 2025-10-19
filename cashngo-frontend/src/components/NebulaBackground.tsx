/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

const NebulaBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let animationFrameId: number;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 2;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    const noise = new SimplexNoise();
    const clock = new THREE.Clock();

    const pointsGeometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const color1 = new THREE.Color("#059669"); // CashnGo Green
    const color2 = new THREE.Color("#8b5cf6"); // Purple
    const color3 = new THREE.Color("#06b6d4"); // Cyan

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
        
        const mix = Math.random();
        const finalColor = color1.clone().lerp(color2, mix).lerp(color3, 1.0 - mix);
        
        colors[i * 3] = finalColor.r;
        colors[i * 3 + 1] = finalColor.g;
        colors[i * 3 + 2] = finalColor.b;
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    (pointsGeometry as any).initialPositions = positions.slice();

    const vertexShader = `
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = 0.1 * ( 300.0 / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5, 0.5));
        if(d > 0.5) discard;
        gl_FragColor = vec4( vColor, (1.0 - d * 2.0) * 0.3 );
      }
    `;
    
    const pointsMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });
    
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        const positions = pointsGeometry.attributes.position.array as Float32Array;
        const initialPositions = (pointsGeometry as any).initialPositions;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = initialPositions[i3];
            const y = initialPositions[i3 + 1];
            
            positions[i3] = x + noise.noise(x * 0.1 + elapsedTime * 0.1, y * 0.1) * 0.3;
            positions[i3+1] = y + noise.noise(x * 0.1, y * 0.1 + elapsedTime * 0.1) * 0.3;
        }
        
        pointsGeometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        if (mountRef.current) {
            const { clientWidth, clientHeight } = mountRef.current;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
        }
    };
    
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10 h-full w-full" />;
};

export default NebulaBackground;