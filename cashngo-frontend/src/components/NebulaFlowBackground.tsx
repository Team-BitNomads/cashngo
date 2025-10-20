/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

const NebulaFlowBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let animationFrameId: number;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 1.5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    const noise = new SimplexNoise(); 
    const clock = new THREE.Clock();

    const pointsGeometry = new THREE.BufferGeometry();
    const count = 4000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    (pointsGeometry as any).initialPositions = positions.slice();

    const vertexShader = `
      varying vec3 vUv; 
      void main() {
        vUv = position; 
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = 0.05 * ( 300.0 / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vUv;
      uniform float uTime;
      void main() {
        vec3 color1 = vec3(0.0, 1.0, 0.5); // Green
        vec3 color2 = vec3(0.5, 0.0, 1.0); // Purple
        
        float noise = sin(vUv.x * 2.0 + uTime * 0.2) * 0.5 + 0.5;
        vec3 finalColor = mix(color1, color2, noise);

        float d = length(gl_PointCoord - vec2(0.5, 0.5));
        if(d > 0.5) discard;
        
        gl_FragColor = vec4( finalColor, (1.0 - d * 2.0) * 0.15 );
      }
    `;
    
    const pointsMaterial = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0.0 } },
        vertexShader,
        fragmentShader,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
    });
    
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        pointsMaterial.uniforms.uTime.value = elapsedTime;
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
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10 h-full w-full" />;
};

export default NebulaFlowBackground;