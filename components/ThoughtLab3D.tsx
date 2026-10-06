"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useReduceEffects } from "@/lib/prefs";
import * as THREE from "three";
import type { Topic } from "@/lib/types";

/**
 * Vòng xoay 3D các chuyên đề tư tưởng.
 *
 * Ghi chú kỹ thuật: chữ tiếng Việt trên thẻ được vẽ bằng Canvas API rồi dùng
 * làm texture (CanvasTexture) thay vì nạp font 3D từ CDN. Cách này giữ được
 * đầy đủ dấu tiếng Việt, không phụ thuộc asset ngoài, và tái sử dụng đúng font
 * Playfair Display / Inter mà trang đã tải bằng next/font.
 */

const CARD_W = 1.86;
const CARD_H = 2.54;
const RING_RADIUS = 3.15;
const TEX_W = 600;
const TEX_H = 820;
const RAD_PER_PX = 0.0058;

function cssFont(variable: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return value ? `${value}, ${fallback}` : fallback;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function withAlpha(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createCardTexture(topic: Topic) {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const serif = cssFont("--font-display", "Georgia, serif");
  const sans = cssFont("--font-body", "system-ui, sans-serif");
  const accent = topic.accent;

  // Nền tối, có quầng sáng màu của chuyên đề ở góc trên.
  const base = ctx.createLinearGradient(0, 0, TEX_W * 0.4, TEX_H);
  base.addColorStop(0, "#26221E");
  base.addColorStop(0.55, "#191713");
  base.addColorStop(1, "#0F0E0C");
  ctx.fillStyle = base;
  roundRect(ctx, 0, 0, TEX_W, TEX_H, 28);
  ctx.fill();

  const glow = ctx.createRadialGradient(70, 60, 10, 90, 90, 420);
  glow.addColorStop(0, withAlpha(accent, 0.5));
  glow.addColorStop(1, withAlpha(accent, 0));
  ctx.fillStyle = glow;
  ctx.fill();

  // Khung kép: viền ngoài màu chuyên đề, viền trong mảnh màu vàng.
  ctx.lineWidth = 6;
  ctx.strokeStyle = withAlpha(accent, 0.75);
  roundRect(ctx, 12, 12, TEX_W - 24, TEX_H - 24, 22);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
  roundRect(ctx, 32, 32, TEX_W - 64, TEX_H - 64, 16);
  ctx.stroke();

  // Số thứ tự chuyên đề.
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.font = `700 96px ${serif}`;
  ctx.fillStyle = withAlpha(accent, 0.95);
  ctx.fillText(topic.order, 64, 176);

  ctx.font = `500 22px ${sans}`;
  ctx.fillStyle = "rgba(253, 251, 247, 0.55)";
  ctx.fillText("CHUYÊN ĐỀ TƯ TƯỞNG HỒ CHÍ MINH", 64, 214);

  ctx.strokeStyle = "rgba(212, 175, 55, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, 248);
  ctx.lineTo(TEX_W - 64, 248);
  ctx.stroke();

  // Tiêu đề chuyên đề.
  ctx.font = `600 52px ${serif}`;
  ctx.fillStyle = "#FDFBF7";
  const titleLines = wrapLines(ctx, topic.title, TEX_W - 140, 5);
  let y = 330;
  titleLines.forEach((line) => {
    ctx.fillText(line, 64, y);
    y += 66;
  });

  // Nhãn ngắn + lời gợi ý.
  ctx.font = `600 30px ${sans}`;
  ctx.fillStyle = withAlpha("#D4AF37", 0.92);
  ctx.fillText(topic.short, 64, TEX_H - 128);

  ctx.font = `400 24px ${sans}`;
  ctx.fillStyle = "rgba(253, 251, 247, 0.45)";
  ctx.fillText("Chạm để mở toàn bộ nội dung", 64, TEX_H - 82);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

type CardTextureEntry = { id: string; texture: THREE.Texture };

/**
 * Tạo texture cho từng chuyên đề, vẽ lại một lần sau khi font web đã sẵn sàng.
 * Bộ texture của lần vẽ trước được giải phóng sau khi React đã commit bộ mới,
 * để không tốn thêm bộ nhớ GPU trên thiết bị di động.
 */
function useCardTextures(topics: Topic[]): CardTextureEntry[] {
  const [entries, setEntries] = useState<CardTextureEntry[]>([]);
  const currentRef = useRef<CardTextureEntry[]>([]);
  const pendingDispose = useRef<THREE.Texture[]>([]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let cancelled = false;

    const build = () => {
      const next = topics.map<CardTextureEntry>((topic) => ({
        id: topic.id,
        texture: createCardTexture(topic),
      }));
      if (cancelled) {
        next.forEach((entry) => entry.texture.dispose());
        return;
      }
      pendingDispose.current.push(...currentRef.current.map((entry) => entry.texture));
      currentRef.current = next;
      setEntries(next);
    };

    build();
    if (document.fonts?.ready) {
      document.fonts.ready
        .then(() => build())
        .catch(() => undefined);
    }

    return () => {
      cancelled = true;
    };
    // Chỉ vẽ lại khi danh sách chuyên đề đổi; fontReady được xử lý bằng
    // document.fonts.ready ngay bên trong effect.
  }, [topics]);

  useEffect(() => {
    // entries vừa được commit → bộ texture của lần vẽ trước không còn dùng nữa.
    pendingDispose.current.forEach((texture) => texture.dispose());
    pendingDispose.current = [];
  }, [entries]);

  useEffect(
    () => () => {
      currentRef.current.forEach((entry) => entry.texture.dispose());
      pendingDispose.current.forEach((texture) => texture.dispose());
    },
    [],
  );

  return entries;
}

type RingProps = {
  topics: Topic[];
  textures: { id: string; texture: THREE.Texture }[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  dragRef: React.MutableRefObject<{ offset: number }>;
  reduceMotion: boolean;
};

function TopicCard({
  topic,
  texture,
  index,
  count,
  activeIndex,
  onSelectIndex,
}: {
  topic: Topic;
  texture: THREE.Texture;
  index: number;
  count: number;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}) {
  const angle = (index / count) * Math.PI * 2;
  const isActive = index === activeIndex;
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const scaleTarget = useRef(new THREE.Vector3(1, 1, 1));

  // Nếu thẻ bị gỡ khỏi DOM khi đang hover, trả con trỏ về mặc định.
  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = isActive ? 1.07 : hovered ? 1.035 : 1;
    scaleTarget.current.set(target, target, 1);
    group.current.scale.lerp(
      scaleTarget.current,
      Math.min(1, delta * (isActive ? 7 : 5)),
    );
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.85 + index * 1.1) * 0.055 +
      (isActive ? 0.08 : 0);
    if (halo.current) {
      const material = halo.current.material as THREE.MeshBasicMaterial;
      const goal = isActive || hovered ? 0.5 : 0.12;
      material.opacity += (goal - material.opacity) * Math.min(1, delta * 5);
    }
  });

  return (
    <group
      position={[Math.sin(angle) * RING_RADIUS, 0, Math.cos(angle) * RING_RADIUS]}
      rotation={[0, angle, 0]}
    >
      <group
        ref={group}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelectIndex(index);
        }}
      >
        <RoundedBox args={[CARD_W, CARD_H, 0.07]} radius={0.06} smoothness={4}>
          <meshStandardMaterial
            color="#141210"
            roughness={0.55}
            metalness={0.25}
            emissive={topic.accent}
            emissiveIntensity={isActive ? 0.28 : 0.1}
          />
        </RoundedBox>

        <mesh position={[0, 0, 0.041]}>
          <planeGeometry args={[CARD_W - 0.02, CARD_H - 0.02]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>

        {/* Quầng sáng phía sau thẻ đang chọn — Bloom sẽ nhấc nó lên. */}
        <mesh ref={halo} position={[0, 0, -0.06]}>
          <planeGeometry args={[CARD_W + 0.5, CARD_H + 0.5]} />
          <meshBasicMaterial
            color={topic.accent}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function ThoughtRing({
  topics,
  textures,
  activeIndex,
  onSelectIndex,
  dragRef,
  reduceMotion,
}: RingProps) {
  const group = useRef<THREE.Group>(null);
  const step = (Math.PI * 2) / topics.length;
  const target = -(activeIndex * step);

  useFrame((state, delta) => {
    if (!group.current) return;
    const goal = target + dragRef.current.offset;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      goal,
      reduceMotion ? 12 : 6.5,
      delta,
    );
    if (!reduceMotion) {
      // Trôi rất nhẹ để vòng xoay không chết cứng khi người dùng không tương tác.
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.035;
    }
  });

  return (
    <group ref={group}>
      {topics.map((topic, index) => {
        const texture = textures[index]?.texture;
        if (!texture) return null;
        return (
          <TopicCard
            key={topic.id}
            topic={topic}
            texture={texture}
            index={index}
            count={topics.length}
            activeIndex={activeIndex}
            onSelectIndex={onSelectIndex}
          />
        );
      })}
    </group>
  );
}

function Pedestal({ reduceMotion, accent }: { reduceMotion: boolean; accent: string }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ring.current || reduceMotion) return;
    ring.current.rotation.z += delta * 0.25;
  });
  return (
    <group position={[0, -1.52, 0]}>
      <mesh>
        <cylinderGeometry args={[RING_RADIUS * 0.78, RING_RADIUS * 0.92, 0.16, 64]} />
        <meshStandardMaterial color="#100E0C" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.09, 0]}>
        <ringGeometry args={[RING_RADIUS * 0.72, RING_RADIUS * 0.75, 96]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

type ThoughtLab3DProps = {
  topics: Topic[];
  /** Toàn bộ topics được truyền vào để vòng xoay luôn giữ nguyên bố cục 6 thẻ. */
  ringTopics?: Topic[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  className?: string;
  /** Khu vực có đang trong khung nhìn — dùng để tạm dừng vòng lặp render. */
  active?: boolean;
};

export default function ThoughtLab3D({
  topics,
  ringTopics,
  activeIndex,
  onSelectIndex,
  className,
  active = true,
}: ThoughtLab3DProps) {
  const reduceEffects = useReduceEffects();
  const shouldReduceMotion = reduceEffects;
  const dragRef = useRef<{ offset: number }>({ offset: 0 });
  const dragState = useRef({ startX: 0, startIndex: 0, moved: 0, active: false });
  const [dragging, setDragging] = useState(false);
  const ring = ringTopics ?? topics;
  const textures = useCardTextures(ring);
  const step = (Math.PI * 2) / ring.length;
  const activeIndexRef = useRef(activeIndex);
  const selectRef = useRef(onSelectIndex);
  const ringLengthRef = useRef(ring.length);
  const stepRef = useRef(step);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  useEffect(() => {
    selectRef.current = onSelectIndex;
  }, [onSelectIndex]);
  useEffect(() => {
    ringLengthRef.current = ring.length;
    stepRef.current = step;
  }, [ring.length, step]);

  /**
   * Kéo bằng listener trên window thay vì pointer capture: capture sẽ chặn R3F
   * nhận sự kiện click trên thẻ, còn cách này giữ nguyên click và vẫn cho phép
   * kéo ra ngoài khung.
   */
  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    dragState.current = {
      startX: event.clientX,
      startIndex: activeIndexRef.current,
      moved: 0,
      active: true,
    };
    setDragging(true);

    function onMove(moveEvent: PointerEvent) {
      const state = dragState.current;
      if (!state.active) return;
      const dx = moveEvent.clientX - state.startX;
      state.moved = Math.max(state.moved, Math.abs(dx));
      dragRef.current.offset = -dx * RAD_PER_PX;
    }

    function onUp(upEvent: PointerEvent) {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      const state = dragState.current;
      if (!state.active) return;
      state.active = false;
      setDragging(false);
      dragRef.current.offset = 0;
      if (state.moved < 24) return; // cú chạm ngắn: để R3F xử lý chọn thẻ
      const delta = upEvent.clientX - state.startX;
      const shift = Math.round((delta * RAD_PER_PX) / stepRef.current);
      const total = ringLengthRef.current;
      const next = (((state.startIndex + shift) % total) + total) % total;
      if (next !== state.startIndex) selectRef.current(next);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  return (
    <div
      className={`relative ${className ?? ""}`}
      onPointerDown={handlePointerDown}
      style={{ touchAction: "pan-y", cursor: dragging ? "grabbing" : "grab" }}
    >
      <Canvas
        camera={{ position: [0, 0.35, 7.1], fov: 42 }}
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        performance={{ min: 0.5 }}
        gl={{ alpha: true, antialias: true }}
        fallback={
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-cream/60">
            Thiết bị này không hỗ trợ không gian 3D. Danh sách chuyên đề bên dưới
            vẫn đầy đủ nội dung.
          </div>
        }
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 5]} intensity={1.35} color="#FDFBF7" />
        <pointLight position={[0, 1.4, 3.2]} intensity={14} distance={12} color={topics[activeIndex]?.accent ?? "#D4AF37"} />
        <pointLight position={[-4, -2, -3]} intensity={6} distance={12} color="#5b9bd5" />
        <Suspense fallback={null}>
          <ThoughtRing
            topics={ring}
            textures={textures}
            activeIndex={activeIndex}
            onSelectIndex={onSelectIndex}
            dragRef={dragRef}
            reduceMotion={shouldReduceMotion}
          />
          <Pedestal
            reduceMotion={shouldReduceMotion}
            accent={ring[activeIndex]?.accent ?? "#D4AF37"}
          />
          <Sparkles
            count={36}
            scale={[7, 4, 7]}
            size={2.4}
            speed={shouldReduceMotion ? 0 : 0.25}
            opacity={0.5}
            color="#E7CD7A"
          />
          <ContactShadows
            position={[0, -1.44, 0]}
            opacity={0.5}
            scale={13}
            blur={2.8}
            far={4.5}
            resolution={256}
          />
        </Suspense>
        {!reduceEffects && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.62}
              luminanceThreshold={0.32}
              luminanceSmoothing={0.22}
              mipmapBlur
            />
            <Vignette offset={0.24} darkness={0.62} eskil={false} />
          </EffectComposer>
        )}
      </Canvas>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-cream/10 bg-charcoal/70 px-3 py-1 text-[11px] text-cream/55 backdrop-blur-sm">
        {dragging ? "Thả để chọn chuyên đề" : "Kéo ngang để xoay · chạm vào thẻ để mở"}
      </div>
    </div>
  );
}
