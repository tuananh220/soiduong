"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function HammerAndSickle() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const shouldReduceMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetX = pointer.y * 0.18;
    const targetY = pointer.x * 0.28;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      3,
      delta,
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      3,
      delta,
    );
    if (!shouldReduceMotion) group.current.rotation.z += delta * 0.12;
  });

  return (
    <group ref={group}>
      <Float
        speed={shouldReduceMotion ? 0 : 1.2}
        rotationIntensity={shouldReduceMotion ? 0 : 0.08}
        floatIntensity={shouldReduceMotion ? 0 : 0.28}
      >
        <group rotation={[0.35, -0.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.94, 0.94, 0.16, 64]} />
            <meshStandardMaterial
              color="#8B0000"
              roughness={0.28}
              metalness={0.45}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.11]}>
            <torusGeometry args={[0.8, 0.045, 16, 64]} />
            <meshStandardMaterial
              color="#D4AF37"
              roughness={0.2}
              metalness={0.85}
            />
          </mesh>
          {/* Hammer handle and head. */}
          <mesh rotation={[0, 0, -Math.PI / 4]} position={[-0.08, 0.02, 0.2]}>
            <cylinderGeometry args={[0.065, 0.065, 1.22, 20]} />
            <meshStandardMaterial
              color="#E7CD7A"
              emissive="#8A6A18"
              emissiveIntensity={0.22}
              roughness={0.3}
              metalness={0.55}
            />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]} position={[0.34, 0.42, 0.2]}>
            <boxGeometry args={[0.28, 0.42, 0.14]} />
            <meshStandardMaterial
              color="#D4AF37"
              emissive="#8A6A18"
              emissiveIntensity={0.24}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Sickle: a curved gold blade with a short handle. */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.12, -0.02, 0.22]}>
            <torusGeometry args={[0.53, 0.065, 16, 48, Math.PI * 1.35]} />
            <meshStandardMaterial
              color="#D4AF37"
              emissive="#8A6A18"
              emissiveIntensity={0.2}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]} position={[-0.26, -0.31, 0.22]}>
            <cylinderGeometry args={[0.055, 0.055, 0.52, 20]} />
            <meshStandardMaterial
              color="#E7CD7A"
              emissive="#8A6A18"
              emissiveIntensity={0.18}
              roughness={0.3}
              metalness={0.55}
            />
          </mesh>
        </group>
      </Float>
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.28, 0.38, 0.28, 32]} />
        <meshStandardMaterial color="#2B2723" roughness={0.4} metalness={0.6} />
      </mesh>
      <pointLight
        position={[0, 0.2, 0.5]}
        intensity={4}
        color="#E7CD7A"
        distance={4}
      />
    </group>
  );
}

export default function Hero3D() {
  return (
    <div
      className="h-[260px] w-full sm:h-[350px] md:h-[420px]"
      role="img"
      aria-label="Biểu tượng búa và liềm 3D tượng trưng cho chủ nghĩa xã hội"
    >
      <Canvas
        camera={{ position: [0, 0.4, 4.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[3, 4, 2]}
          intensity={0.6}
          color="#FDFBF7"
        />
        <Suspense fallback={null}>
          <HammerAndSickle />
        </Suspense>
      </Canvas>
    </div>
  );
}
