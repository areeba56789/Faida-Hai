"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

// A simple procedural car
function Car({ position, color, rotation = [0, 0, 0] }: { position: [number, number, number], color: string, rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation as any}>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.8, 0.4, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 0.3, 0.7]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Wheels */}
      {[-0.6, 0.6].map((x, i) =>
        [-0.4, 0.4].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.1, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))
      )}
    </group>
  );
}

// A simple procedural tree
function Tree({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#10B981" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Building 19 Component
function Building() {
  const buildingRef = useRef<THREE.Group>(null);
  
  // Create windows array
  const windows = useMemo(() => {
    const w = [];
    for (let floor = 0; floor < 6; floor++) {
      for (let side = 0; side < 4; side++) {
        w.push({
          pos: [
            side === 0 ? -1 : side === 1 ? 1 : side === 2 ? -2.01 : 2.01,
            floor * 1.2 + 1,
            side === 0 ? 2.01 : side === 1 ? -2.01 : side === 2 ? 1 : -1
          ],
          rot: [0, (side < 2 ? 0 : Math.PI / 2), 0],
          isLit: Math.random() > 0.3
        });
      }
    }
    return w;
  }, []);

  return (
    <group ref={buildingRef}>
      {/* Main Structure */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 7, 4]} />
        <meshStandardMaterial color="#262626" roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Rooftop Base */}
      <mesh position={[0, 7.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.2, 4.2]} />
        <meshStandardMaterial color="#1f1f1f" />
      </mesh>
      
      {/* Rooftop AC unit */}
      <mesh position={[1, 7.4, -1]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Windows */}
      {windows.map((w, i) => (
        <mesh key={i} position={w.pos as any} rotation={w.rot as any}>
          <planeGeometry args={[0.8, 0.6]} />
          <meshStandardMaterial 
            color={w.isLit ? "#10B981" : "#111"} 
            emissive={w.isLit ? "#10B981" : "#000"}
            emissiveIntensity={w.isLit ? 1.5 : 0}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Entrance */}
      <mesh position={[0, 0.8, 2.01]} castShadow>
        <planeGeometry args={[1.5, 1.6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.6, 2.05]}>
        <boxGeometry args={[1.8, 0.2, 0.4]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>

      {/* Building Marker */}
      <Html position={[0, 7.8, 0]} center transform sprite>
        <div className="bg-[#141414]/90 backdrop-blur border border-[#10B981] px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <h2 className="text-[#10B981] font-bold tracking-widest text-lg m-0 leading-none">BUILDING 19</h2>
          <p className="text-[#a3a3a3] text-xs m-0 mt-1 uppercase text-center font-mono">Premium Residential</p>
        </div>
      </Html>
    </group>
  );
}

export function ApartmentModel3D() {
  return (
    <div className="w-full h-full bg-[#0a0a0a] border border-[#262626] rounded-2xl overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-lg font-bold text-white flex items-center">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse mr-2"></span>
          Live Heatmap Model
        </h3>
        <p className="text-xs text-[#a3a3a3]">Interactive 360&deg; view of Top Performer</p>
      </div>

      <Canvas shadows camera={{ position: [10, 8, 12], fov: 40 }}>
        <color attach="background" args={["#0a0a0a"]} />
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={1024}
        />
        
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[0, -3.5, 0]}>
            {/* Ground Plate */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <circleGeometry args={[8, 64]} />
              <meshStandardMaterial color="#141414" roughness={0.8} />
            </mesh>
            
            {/* Grid Helper embedded in ground */}
            <gridHelper args={[16, 16, "#262626", "#1a1a1a"]} position={[0, 0.01, 0]} />

            <Building />

            {/* Environment Details */}
            <Tree position={[3, 0, 3]} scale={1.2} />
            <Tree position={[-4, 0, 2]} scale={0.8} />
            <Tree position={[2, 0, -4]} scale={1.5} />
            <Tree position={[-3, 0, -3]} scale={1.1} />

            <Car position={[-2, 0, 4]} color="#3B82F6" rotation={[0, Math.PI / 6, 0]} />
            <Car position={[4, 0, 0]} color="#ef4444" rotation={[0, -Math.PI / 2, 0]} />
            <Car position={[-3, 0, -1]} color="#f59e0b" rotation={[0, Math.PI / 3, 0]} />

            <ContactShadows position={[0, 0.02, 0]} opacity={0.8} scale={20} blur={2} far={10} color="#000" />
          </group>
        </Float>

        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.5} 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.1}
          minDistance={8}
          maxDistance={20}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
