"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AbstractCity() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.5, 1]} />
          <MeshDistortMaterial
            color="#3B82F6"
            emissive="#10B981"
            emissiveIntensity={0.5}
            wireframe
            distort={0.4}
            speed={2}
          />
        </mesh>
      </Float>

      {/* Grid Floor */}
      <gridHelper args={[10, 20, "#262626", "#141414"]} position={[0, -2, 0]} />
      
      {/* Decorative Nodes */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 8
          ]}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#3B82F6" : "#10B981"} />
        </mesh>
      ))}
    </group>
  );
}

export function ThreeDVisualizer() {
  return (
    <div className="w-full h-full min-h-[300px] bg-[#141414] rounded-2xl border border-[#262626] overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-white font-bold text-sm bg-[#0a0a0a]/50 backdrop-blur-md px-3 py-1 rounded-full border border-[#262626]">
          Live Network Topology
        </h3>
      </div>
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#3B82F6" />
        <directionalLight position={[-5, 5, -5]} intensity={1} color="#10B981" />
        <AbstractCity />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
