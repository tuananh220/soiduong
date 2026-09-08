"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/**
 * A procedural "torch" — no external 3D asset needed.
 * A gold flame hovers above a dark base, both tilting gently
 * toward the user's cursor. This stands in for "Soi Đường"
 * (lighting the way) rather than a generic sphere/cube.
 */
function Compass() {
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
            <cylinderGeometry args={[0.92, 0.92, 0.18, 64]} />
            <meshStandardMaterial
              color="#1C1A17"
              roughness={0.32}
              metalness={0.72}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.11]}>
            <torusGeometry args={[0.78, 0.055, 16, 64]} />
            <meshStandardMaterial
              color="#D4AF37"
              roughness={0.2}
              metalness={0.85}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0.18]}>
            <coneGeometry args={[0.09, 1.1, 3]} />
            <meshStandardMaterial
              color="#D71920"
              emissive="#5E0000"
              emissiveIntensity={0.28}
              roughness={0.3}
              metalness={0.25}
            />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, 0, 0.19]}>
            <coneGeometry args={[0.09, 1.1, 3]} />
            <meshStandardMaterial
              color="#E7CD7A"
              roughness={0.28}
              metalness={0.35}
            />
          </mesh>
          <mesh position={[0, 0, 0.25]}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial
              color="#D4AF37"
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0, 0.34, 0.2]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#D71920" />
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
      aria-label="Mô hình la bàn 3D tượng trưng cho kim chỉ nam"
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
          <Compass />
        </Suspense>
      </Canvas>
    </div>
  );
}
