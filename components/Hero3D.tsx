"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useReduceEffects } from "@/lib/prefs";

const TAP_THRESHOLD_PX = 6;

function HammerAndSickle({ reduceEffects }: { reduceEffects: boolean }) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const { pointer, gl } = useThree();

  // Xoay do người dùng kéo (cộng thêm vào parallax theo con trỏ) + quán tính.
  const spin = useRef({ x: 0, y: 0, velocityY: 0, dragging: false });
  const pulse = useRef(0);

  useEffect(() => {
    const element = gl.domElement;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;
    let downAt = 0;

    function onPointerDown(event: PointerEvent) {
      spin.current.dragging = true;
      spin.current.velocityY = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      moved = 0;
      downAt = performance.now();
      // Bắt con trỏ để kéo ra ngoài khung vẫn xoay tiếp.
      element.setPointerCapture?.(event.pointerId);
    }

    function onPointerMove(event: PointerEvent) {
      if (!spin.current.dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
      spin.current.y += dx * 0.009;
      spin.current.x = THREE.MathUtils.clamp(spin.current.x + dy * 0.006, -0.5, 0.5);
      spin.current.velocityY = dx * 0.009;
    }

    function onPointerUp(event: PointerEvent) {
      if (!spin.current.dragging) return;
      spin.current.dragging = false;
      element.releasePointerCapture?.(event.pointerId);
      // Cú chạm ngắn (không kéo) làm biểu tượng sáng lên một nhịp.
      const isTap =
        moved < TAP_THRESHOLD_PX && performance.now() - downAt < 400;
      if (isTap) pulse.current = 1;
    }

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!group.current) return;

    // Quán tính sau khi thả tay.
    if (!spin.current.dragging && Math.abs(spin.current.velocityY) > 0.0001) {
      spin.current.y += spin.current.velocityY;
      spin.current.velocityY *= Math.pow(0.93, delta * 60);
      if (!reduceEffects) group.current.rotation.z += spin.current.velocityY * 0.4;
    }

    // Trên thiết bị cảm ứng, `pointer` không đổi -> parallax tự triệt tiêu,
    // phần xoay do kéo tay vẫn hoạt động bình thường.
    const targetX = pointer.y * 0.18 + spin.current.x;
    const targetY = pointer.x * 0.28 + spin.current.y;

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
    if (!reduceEffects && !spin.current.dragging) group.current.rotation.z += delta * 0.12;

    if (light.current) {
      pulse.current = Math.max(0, pulse.current - delta * 1.6);
      light.current.intensity = 4 + pulse.current * 9;
    }
  });

  return (
    <group ref={group}>
      <Float
        speed={reduceEffects ? 0 : 1.2}
        rotationIntensity={reduceEffects ? 0 : 0.08}
        floatIntensity={reduceEffects ? 0 : 0.28}
      >
        <group rotation={[0.35, -0.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.94, 0.94, 0.16, 64]} />
            <meshStandardMaterial color="#8B0000" roughness={0.28} metalness={0.45} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.11]}>
            <torusGeometry args={[0.8, 0.045, 16, 64]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.85} />
          </mesh>
          {/* Cán và đầu búa. */}
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
          {/* Liềm: lưỡi cong màu vàng với cán ngắn. */}
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
      <pointLight ref={light} position={[0, 0.2, 0.5]} intensity={4} color="#E7CD7A" distance={4} />
    </group>
  );
}

function StaticBadge() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="rounded-2xl border border-burgundy/25 bg-burgundy/5 px-6 py-5 text-center">
        <span aria-hidden="true" className="text-3xl text-gold">
          ★
        </span>
        <p className="mt-2 font-serif text-lg font-semibold text-charcoal">
          Kim chỉ nam cho thế hệ trẻ
        </p>
        <p className="mt-1 text-xs text-charcoal/60">
          Thiết bị này không hiển thị được không gian 3D.
        </p>
      </div>
    </div>
  );
}

export default function Hero3D() {
  const reduceEffects = useReduceEffects();
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { rootMargin: "120px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="h-[260px] w-full cursor-grab active:cursor-grabbing sm:h-[350px] md:h-[420px]"
      role="img"
      aria-label="Biểu tượng búa và liềm 3D — kéo ngang để xoay, chạm để làm sáng"
    >
      <Canvas
        camera={{ position: [0, 0.4, 4.2], fov: 42 }}
        dpr={[1, 1.5]}
        frameloop={inView ? "always" : "never"}
        performance={{ min: 0.5 }}
        gl={{ alpha: true, antialias: true }}
        fallback={<StaticBadge />}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 2]} intensity={0.6} color="#FDFBF7" />
        <Suspense fallback={null}>
          <HammerAndSickle reduceEffects={reduceEffects} />
        </Suspense>
      </Canvas>
    </div>
  );
}
