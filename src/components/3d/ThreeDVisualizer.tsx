"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

interface HeatmapData {
  label: string;
  x: number;
  z: number;
  value: number;
  roi: number;
  count: number;
}

function DataHeatmap({ data }: { data: HeatmapData[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  // Normalize data for visualization
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minROI = Math.min(...data.map(d => d.roi), 0);
  const maxROI = Math.max(...data.map(d => d.roi), 20);

  useEffect(() => {
    if (meshRef.current) {
      data.forEach((d, i) => {
        // Height based on value relative to max (min height 0.2, max 4)
        const height = 0.2 + (d.value / maxValue) * 3.8;
        
        dummy.position.set(d.x, height / 2 - 2, d.z); // -2 to rest on grid
        dummy.scale.set(0.8, height, 0.8);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);

        // Color based on ROI (Blue -> Green)
        const roiRatio = (d.roi - minROI) / (maxROI - minROI || 1);
        color.lerpColors(new THREE.Color("#3B82F6"), new THREE.Color("#10B981"), roiRatio);
        
        // Highlight if hovered
        if (hovered === i) {
          color.set("#F59E0B"); // Amber when hovered
        }
        
        meshRef.current!.setColorAt(i, color);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [data, dummy, color, maxValue, minROI, maxROI, hovered]);

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, data.length]}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined) setHovered(e.instanceId);
        }}
        onPointerOut={() => setHovered(null)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.2} metalness={0.8} />
      </instancedMesh>

      {/* Grid Floor */}
      <gridHelper args={[20, 40, "#262626", "#141414"]} position={[0, -2, 0]} />

      {/* Tooltip */}
      {hovered !== null && data[hovered] && (
        <Html
          position={[
            data[hovered].x,
            (0.2 + (data[hovered].value / maxValue) * 3.8) - 1.5,
            data[hovered].z
          ]}
          center
          zIndexRange={[100, 0]}
        >
          <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-[#262626] rounded-xl p-3 text-white shadow-2xl pointer-events-none w-48 transition-all">
            <p className="font-bold text-sm mb-1 text-[#3B82F6]">{data[hovered].label}</p>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#a3a3a3]">Avg Price:</span>
              <span className="font-semibold text-white">
                Rs {(data[hovered].value / 100000).toFixed(1)} L
              </span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#a3a3a3]">Proj. ROI:</span>
              <span className="font-semibold text-[#10B981]">{data[hovered].roi}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#a3a3a3]">Listings:</span>
              <span className="font-semibold text-white">{data[hovered].count}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function ThreeDVisualizer() {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/heatmap")
      .then(res => res.json())
      .then(d => {
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch heatmap data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] bg-[#141414] rounded-2xl border border-[#262626] overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-white font-bold text-sm bg-[#0a0a0a]/50 backdrop-blur-md px-3 py-1 rounded-full border border-[#262626]">
          Live Market Heatmap
        </h3>
      </div>
      
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center text-[#a3a3a3] text-sm">
          <div className="animate-pulse">Loading spatial data...</div>
        </div>
      ) : data.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-[#a3a3a3] text-sm">
          No market data available.
        </div>
      ) : (
        <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#10B981" />
          <DataHeatmap data={data} />
          <OrbitControls 
            enableZoom={true} 
            autoRotate 
            autoRotateSpeed={0.5} 
            maxPolarAngle={Math.PI / 2 - 0.1} 
          />
        </Canvas>
      )}
    </div>
  );
}
