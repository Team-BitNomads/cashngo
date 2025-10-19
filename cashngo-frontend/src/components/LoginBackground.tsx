/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

const AuroraBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let animationFrameId: number;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 2;
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0); 
    
    const noise = new SimplexNoise();
    const clock = new THREE.Clock();

    const pointsGeometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const color1 = new THREE.Color("#00ff88"); // CashnGo Green
    const color2 = new THREE.Color("#6f00ff"); // Purple
    const color3 = new THREE.Color("#00c3ff"); // Blue

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
        
        const mix1 = Math.random();
        const mix2 = Math.random();
        const finalColor = color1.clone().lerp(color2, mix1).lerp(color3, mix2);
        
        colors[i * 3] = finalColor.r;
        colors[i * 3 + 1] = finalColor.g;
        colors[i * 3 + 2] = finalColor.b;
        
        sizes[i] = 0.05 + Math.random() * 0.1;
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    pointsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    (pointsGeometry as any).initialPositions = positions.slice();

    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size * ( 300.0 / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5, 0.5));
        if(d > 0.5) discard;
        gl_FragColor = vec4( vColor, (1.0 - d * 2.0) * 0.5 );
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
            
            positions[i3] = x + noise.noise(x * 0.1 + elapsedTime * 0.2, y * 0.1) * 0.5;
            positions[i3+1] = y + noise.noise(x * 0.1, y * 0.1 + elapsedTime * 0.2) * 0.5;
        }
        
        pointsGeometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
        const { clientWidth, clientHeight } = renderer.domElement;
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(clientWidth, clientHeight, false);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(renderer.domElement);
    
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
};

export default AuroraBackground;