"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { TextureLoader } from "three";
import timeline from "@/data/timeline.json";
import ErrorBoundary from "@/lib/ErrorBoundary";
import { useInViewState } from "@/lib/useInViewState";
import { useReduceEffects } from "@/lib/prefs";

type Milestone = (typeof timeline)[number];

const RADIUS = 1.6;
const EARTH_TEXTURE =
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";
const EARTH_NORMAL_TEXTURE =
  "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg";
const EARTH_SPECULAR_TEXTURE =
  "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg";
const CLOUD_TEXTURE =
  "https://threejs.org/examples/textures/planets/earth_clouds_1024.png";

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function getClusterPosition(
  milestone: Milestone,
  clusterIndex: number,
  clusterSize: number,
) {
  const position = latLngToVector3(milestone.lat, milestone.lng, RADIUS + 0.02);
  if (clusterSize < 2) return position;

  const offset = (clusterIndex - (clusterSize - 1) / 2) * 0.09;
  return position
    .add(new THREE.Vector3(offset, 0, 0))
    .normalize()
    .multiplyScalar(RADIUS + 0.02);
}

function createStarShape() {
  const shape = new THREE.Shape();
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = Math.PI / 2 + (index * Math.PI) / 5;
    const radius = index % 2 === 0 ? 0.032 : 0.014;
    return new THREE.Vector2(
      0.072 + Math.cos(angle) * radius,
      0.162 + Math.sin(angle) * radius,
    );
  });

  shape.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => shape.lineTo(point.x, point.y));
  shape.closePath();
  return shape;
}

function Marker({
  milestone,
  isActive,
  onSelect,
  clusterIndex,
  clusterSize,
}: {
  milestone: Milestone;
  isActive: boolean;
  onSelect: (m: Milestone) => void;
  clusterIndex: number;
  clusterSize: number;
}) {
  const [hovered, setHovered] = useState(false);
  const position = useMemo(
    () => getClusterPosition(milestone, clusterIndex, clusterSize),
    [milestone, clusterIndex, clusterSize],
  );
  const flagRef = useRef<THREE.Group>(null);
  const orientation = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        position.clone().normalize(),
      ),
    [position],
  );
  const starShape = useMemo(() => createStarShape(), []);

  useFrame(({ clock }) => {
    if (!flagRef.current) return;
    const t = clock.getElapsedTime() * 2 + milestone.year;
    const s = 1 + Math.sin(t) * 0.15;
    flagRef.current.scale.setScalar(isActive ? s * 1.18 : s);
  });

  return (
    <group position={position} quaternion={orientation}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(milestone);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={flagRef}>
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.008, 0.01, 0.22, 10]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.55}
            roughness={0.35}
          />
        </mesh>
        <mesh position={[0.07, 0.16, 0.006]}>
          <planeGeometry args={[0.14, 0.09]} />
          <meshStandardMaterial
            color="#D71920"
            emissive="#4A0000"
            emissiveIntensity={isActive ? 0.35 : 0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <shapeGeometry args={[starShape]} />
          <meshBasicMaterial color="#FFDD00" side={THREE.DoubleSide} />
        </mesh>
      </group>
      {(hovered || isActive) && (
        <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-md bg-charcoal/90 px-2 py-1 text-xs font-medium text-cream shadow-lg">
            {milestone.year} — {milestone.place}
          </div>
        </Html>
      )}
    </group>
  );
}

type EarthTextures = {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  specularMap: THREE.Texture;
  cloud: THREE.Texture;
};

/**
 * Nạp 4 texture vệ tinh bằng TextureLoader + async/await thay vì `useLoader`.
 * `useLoader` chạy qua suspend-react, khi tải lỗi sẽ ném lỗi ngay trong render
 * phase và có thể làm hỏng cả trang; cách này chỉ đặt cờ `failed` để chuyển sang
 * quả cầu dựng thủ tục, các mốc lịch sử vẫn hoạt động bình thường.
 */
function useEarthTextures() {
  const [textures, setTextures] = useState<EarthTextures | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");

    Promise.all([
      loader.loadAsync(EARTH_TEXTURE),
      loader.loadAsync(EARTH_NORMAL_TEXTURE),
      loader.loadAsync(EARTH_SPECULAR_TEXTURE),
      loader.loadAsync(CLOUD_TEXTURE),
    ])
      .then(([map, normalMap, specularMap, cloud]) => {
        if (cancelled) {
          [map, normalMap, specularMap, cloud].forEach((texture) => texture.dispose());
          return;
        }
        setTextures({ map, normalMap, specularMap, cloud });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { textures, failed };
}

function GlobeMesh({
  activeMilestone,
  onSelect,
  textures,
}: {
  activeMilestone: Milestone;
  onSelect: (m: Milestone) => void;
  textures: EarthTextures | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const routePoints = useMemo(
    () =>
      timeline.map((milestone) =>
        latLngToVector3(milestone.lat, milestone.lng, RADIUS + 0.025),
      ),
    [],
  );
  const clusterMap = useMemo(() => {
    const groups = new Map<string, Milestone[]>();
    timeline.forEach((milestone) => {
      const key = `${milestone.lat}:${milestone.lng}`;
      groups.set(key, [...(groups.get(key) ?? []), milestone]);
    });
    return groups;
  }, []);

  const targetQuaternion = useMemo(() => {
    const point = latLngToVector3(activeMilestone.lat, activeMilestone.lng, 1);
    const target = new THREE.Vector3(0, 0, 1);
    return new THREE.Quaternion().setFromUnitVectors(point.normalize(), target);
  }, [activeMilestone]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.quaternion.slerp(
      targetQuaternion,
      Math.min(1, delta * 2.2),
    );
  });

  return (
    <group ref={groupRef}>
      {/* Trái đất: dùng ảnh vệ tinh khi tải được, nếu không thì dựng thủ tục. */}
      <mesh>
        <sphereGeometry args={[RADIUS, textures ? 48 : 32, textures ? 48 : 32]} />
        {textures ? (
          <meshPhongMaterial
            map={textures.map}
            normalMap={textures.normalMap}
            specularMap={textures.specularMap}
            specular="#8da9c7"
            shininess={10}
          />
        ) : (
          <meshStandardMaterial
            color="#24405f"
            emissive="#0c1725"
            emissiveIntensity={0.75}
            roughness={0.85}
            metalness={0.15}
          />
        )}
      </mesh>
      {textures ? (
        <mesh scale={1.012}>
          <sphereGeometry args={[RADIUS, 64, 64]} />
          <meshPhongMaterial
            map={textures.cloud}
            transparent
            opacity={0.38}
            depthWrite={false}
          />
        </mesh>
      ) : null}
      <mesh scale={1.045}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#5b9bd5"
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* A restrained grid keeps the globe legible without flattening the texture. */}
      <mesh>
        <sphereGeometry args={[RADIUS + 0.002, 24, 16]} />
        <meshBasicMaterial
          color="#D4AF37"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
      <Line
        points={routePoints}
        color="#D4AF37"
        lineWidth={1}
        transparent
        opacity={0.35}
      />
      {timeline.map((m) => {
        const cluster = clusterMap.get(`${m.lat}:${m.lng}`) ?? [m];
        return (
          <Marker
            key={m.id}
            milestone={m}
            isActive={m.id === activeMilestone.id}
            onSelect={onSelect}
            clusterIndex={cluster.findIndex((item) => item.id === m.id)}
            clusterSize={cluster.length}
          />
        );
      })}
    </group>
  );
}

export default function GlobeSection() {
  const [active, setActive] = useState<Milestone>(timeline[0]);
  const [selectedPeriod, setSelectedPeriod] = useState("Tất cả");
  const [isPaused, setIsPaused] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const controlsRef = useRef<any>(null);
  const globeWrapRef = useRef<HTMLDivElement | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceEffects = useReduceEffects();
  const { textures, failed: texturesFailed } = useEarthTextures();
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const { ref: globeObserverRef, inView: globeInView } = useInViewState<HTMLDivElement>({
    rootMargin: "150px 0px",
  });
  const periods = useMemo(
    () => ["Tất cả", ...Array.from(new Set(timeline.map((m) => m.period)))],
    [],
  );
  const visibleTimeline = useMemo(
    () =>
      timeline.filter(
        (milestone) =>
          selectedPeriod === "Tất cả" || milestone.period === selectedPeriod,
      ),
    [selectedPeriod],
  );
  // Ref so the autoplay interval never captures a stale visibleTimeline.
  const visibleTimelineRef = useRef(visibleTimeline);
  useEffect(() => {
    visibleTimelineRef.current = visibleTimeline;
  }, [visibleTimeline]);
  const activeIndex = Math.max(
    0,
    visibleTimeline.findIndex((milestone) => milestone.id === active.id),
  );

  function pauseGlobe() {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsPaused(false), 3500);
  }

  function selectMilestone(milestone: Milestone) {
    setActive(milestone);
    pauseGlobe();
  }

  function moveTo(offset: number) {
    const nextIndex = activeIndex + offset;
    if (nextIndex < 0 || nextIndex >= visibleTimeline.length) return;
    selectMilestone(visibleTimeline[nextIndex]);
  }

  function zoomIn() {
    controlsRef.current?.dollyIn(1.35);
    controlsRef.current?.update();
    pauseGlobe();
  }

  function zoomOut() {
    controlsRef.current?.dollyOut(1.35);
    controlsRef.current?.update();
    pauseGlobe();
  }

  function focusSelected() {
    controlsRef.current?.dollyIn(1.7);
    controlsRef.current?.update();
    pauseGlobe();
  }

  function resetView() {
    controlsRef.current?.reset();
    pauseGlobe();
  }

  useEffect(() => {
    if (!visibleTimeline.some((milestone) => milestone.id === active.id)) {
      setActive(visibleTimeline[0]);
    }
  }, [active.id, visibleTimeline]);

  useEffect(() => {
    setImageFailed(false);
  }, [active.id]);

  useEffect(
    () => () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    },
    [],
  );

  /**
   * three-stdlib/OrbitControls đặt `domElement.style.touchAction = "none"`
   * (disable touch scroll) ngay khi được tạo, khiến người dùng không cuộn được
   * trang khi đặt ngón tay vào khung địa cầu. Đổi lại thành "pan-y": vuốt dọc
   * để cuộn trang, kéo ngang vẫn xoay quả cầu, chụm hai ngón vẫn thu phóng.
   * Chờ một nhịp để OrbitControls kịp gắn DOM element.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const element: HTMLElement | undefined =
        controlsRef.current?.domElement ??
        globeWrapRef.current?.querySelector("canvas") ??
        undefined;
      if (element) element.style.touchAction = "pan-y";
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Autoplay: advance one milestone every 4 s while not paused.
  // Giảm hiệu ứng: tắt tự động chuyển mốc và tự xoay.
  useEffect(() => {
    if (reduceEffects) setAutoplayEnabled(false);
  }, [reduceEffects]);

  // Tạm dừng autoplay khi tab bị ẩn.
  useEffect(() => {
    function onVisibility() {
      if (document.hidden) pauseGlobe();
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!autoplayEnabled || isPaused) return;
    const id = setInterval(() => {
      setActive((prev) => {
        const vt = visibleTimelineRef.current;
        const idx = vt.findIndex((m) => m.id === prev.id);
        return vt[(idx + 1) % vt.length];
      });
    }, 4000);
    return () => clearInterval(id);
  }, [autoplayEnabled, isPaused]);

  return (
    <section
      id="hanh-trinh"
      className="relative bg-charcoal px-6 py-16 text-cream sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          className="font-sans text-sm uppercase tracking-wideish text-gold/80"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          1890 — 1990
        </motion.p>
        <motion.h2
          className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Hành trình tư duy qua từng vĩ độ
        </motion.h2>
        <motion.p
          className="mt-4 max-w-xl text-cream/70"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Chọn một giai đoạn hoặc mốc thời gian để phân biệt sự kiện lịch sử với
          cách diễn giải dành cho đời sống hôm nay.
        </motion.p>

        <div className="mt-6 max-w-xl" aria-label="Tiến trình hành trình">
          <div className="flex items-center justify-between text-xs text-cream/50">
            <span>
              Mốc {activeIndex + 1}/{visibleTimeline.length}
            </span>
            <span>{active.year}</span>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={visibleTimeline.length}
            aria-valuenow={activeIndex + 1}
            aria-label={`Đang xem mốc ${activeIndex + 1} trên ${visibleTimeline.length}`}
          >
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-500"
              style={{
                width: `${((activeIndex + 1) / visibleTimeline.length) * 100}%`,
              }}
            />
          </div>
          {/* Autoplay countdown bar — resets animation on every milestone change */}
          <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-cream/5">
            {autoplayEnabled && !isPaused && (
              <div
                key={`timer-${active.id}`}
                className="h-full w-full origin-left rounded-full bg-gold/50"
                style={{ animation: "autoplayTimer 4s linear forwards" }}
              />
            )}
          </div>
          <p className="sr-only" aria-live="polite">
            Đang xem mốc {active.year} tại {active.place}: {active.lesson}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div
            ref={(node) => {
              globeWrapRef.current = node;
              globeObserverRef.current = node;
            }}
            className="globe-canvas relative h-[360px] rounded-2xl bg-black/20 sm:h-[440px] lg:col-span-3 lg:h-[480px]"
            aria-label="Quả cầu 3D hiển thị các địa điểm trong hành trình"
            role="img"
          >
            <Canvas
              camera={{ position: [0, 0, 4.6], fov: 45 }}
              dpr={[1, 1.5]}
              frameloop={globeInView ? "always" : "never"}
              performance={{ min: 0.5 }}
              fallback={
                <div className="flex h-full items-center justify-center p-6 text-center text-sm text-cream/60">
                  Thiết bị này không hỗ trợ bản đồ 3D. Hãy dùng danh sách mốc
                  thời gian bên dưới.
                </div>
              }
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[-4, 3, 4]} intensity={2.2} />
              <pointLight
                position={[3, -2, 4]}
                intensity={0.35}
                color="#9cc9ff"
              />
              <Stars
                radius={20}
                depth={30}
                count={reduceEffects ? 260 : 900}
                factor={1.8}
                saturation={0}
                fade
                speed={reduceEffects ? 0 : 0.25}
              />
              <ErrorBoundary
                fallback={
                  <Html center>
                    <div className="max-w-[240px] rounded-xl border border-gold/30 bg-charcoal/90 px-4 py-3 text-center text-xs leading-relaxed text-cream/80 shadow-lg">
                      Không gian 3D gặp lỗi. Danh sách mốc thời gian bên dưới vẫn
                      đầy đủ nội dung.
                    </div>
                  </Html>
                }
              >
                <Suspense fallback={null}>
                  <GlobeMesh
                    activeMilestone={active}
                    onSelect={selectMilestone}
                    textures={textures}
                  />
                </Suspense>
              </ErrorBoundary>
              <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableZoom
                minDistance={3.4}
                maxDistance={6.2}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={(2 * Math.PI) / 3}
                autoRotate={!reduceEffects && !isPaused && globeInView}
                autoRotateSpeed={0.5}
                onStart={pauseGlobe}
                onEnd={pauseGlobe}
              />
            </Canvas>
            {texturesFailed ? (
              <p className="pointer-events-none absolute left-3 top-3 max-w-[240px] rounded-lg border border-gold/25 bg-charcoal/85 px-3 py-2 text-[11px] leading-relaxed text-cream/70 backdrop-blur-sm">
                Ảnh vệ tinh không tải được — đang dùng quả cầu dựng thủ tục. Các mốc
                lịch sử vẫn hoạt động bình thường.
              </p>
            ) : null}
            <div
              className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2"
              aria-label="Điều khiển quả địa cầu"
            >
              <div className="flex overflow-hidden rounded-lg border border-cream/15 bg-charcoal/80 backdrop-blur-sm">
                <button
                  onClick={zoomOut}
                  className="focus-ring h-9 w-9 text-lg text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
                  aria-label="Thu nhỏ quả địa cầu"
                  title="Thu nhỏ"
                >
                  −
                </button>
                <button
                  onClick={zoomIn}
                  className="focus-ring h-9 w-9 border-l border-cream/15 text-lg text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
                  aria-label="Phóng to quả địa cầu"
                  title="Phóng to"
                >
                  +
                </button>
              </div>
              <div className="flex overflow-hidden rounded-lg border border-cream/15 bg-charcoal/80 text-xs backdrop-blur-sm">
                <button
                  onClick={focusSelected}
                  className="focus-ring px-3 py-2 text-gold transition-colors hover:bg-gold/10"
                  title="Phóng to khu vực của mốc đang chọn"
                >
                  Tập trung mốc {active.year}
                </button>
                <button
                  onClick={resetView}
                  className="focus-ring border-l border-cream/15 px-3 py-2 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
                  title="Đưa quả địa cầu về toàn cảnh"
                >
                  Toàn cảnh
                </button>
              </div>
              {/* Autoplay toggle */}
              <button
                onClick={() => setAutoplayEnabled((v) => !v)}
                className={`focus-ring rounded-lg border px-3 py-2 text-xs backdrop-blur-sm transition-colors ${
                  autoplayEnabled
                    ? "border-gold/50 bg-charcoal/80 text-gold"
                    : "border-cream/15 bg-charcoal/80 text-cream/50 hover:text-cream"
                }`}
                aria-pressed={autoplayEnabled}
                title={autoplayEnabled ? "Tạm dừng tự động chuyển mốc" : "Bật tự động chuyển mốc"}
              >
                {autoplayEnabled ? "⏸\u00a0Tự động" : "▶\u00a0Tự động"}
              </button>
            </div>
          </div>

          <div className="lg:hidden">
            <p className="text-xs uppercase tracking-wideish text-gold/80">
              Danh sách địa điểm
            </p>
            <ol className="mt-3 grid gap-2">
              {visibleTimeline.map((milestone, index) => (
                <li key={milestone.id}>
                  <button
                    onClick={() => selectMilestone(milestone)}
                    aria-current={
                      active.id === milestone.id ? "step" : undefined
                    }
                    className={`focus-ring flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                      active.id === milestone.id
                        ? "border-gold bg-gold/10"
                        : "border-cream/10 hover:border-cream/30"
                    }`}
                  >
                    <span className="text-sm font-semibold text-gold">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-cream">
                        {milestone.year} · {milestone.place}
                      </span>
                      <span className="mt-0.5 block text-xs text-cream/55">
                        {milestone.period}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col justify-between lg:col-span-2">
            <div>
              <div
                className="flex flex-wrap gap-2"
                aria-label="Lọc theo giai đoạn"
                role="group"
              >
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    aria-pressed={selectedPeriod === period}
                    className={`focus-ring rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      selectedPeriod === period
                        ? "border-gold bg-gold/15 text-gold"
                        : "border-cream/20 text-cream/60 hover:border-cream/40 hover:text-cream"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-b border-cream/10 pb-4">
                <p className="text-xs text-cream/50">
                  {visibleTimeline.length} mốc trong{" "}
                  {selectedPeriod.toLowerCase()}
                </p>
                <div className="flex flex-wrap justify-end gap-2">
                  {visibleTimeline.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => selectMilestone(m)}
                      aria-label={`Xem mốc ${m.year}`}
                      aria-pressed={active.id === m.id}
                      className={`focus-ring rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        active.id === m.id
                          ? "border-gold bg-gold/15 text-gold"
                          : "border-cream/20 text-cream/60 hover:border-cream/40 hover:text-cream"
                      }`}
                    >
                      {m.year}
                    </button>
                  ))}
                </div>
              </div>

              <div key={active.id} className="mt-6 animate-[fadeIn_0.4s_ease]">
                <p className="text-xs uppercase tracking-wideish text-gold/80">
                  {active.period}
                </p>
                <p className="mt-2 text-sm text-gold">{active.place}</p>
                <h3 className="mt-2 font-serif text-2xl font-semibold">
                  {active.lesson}
                </h3>
                <figure className="mt-5 overflow-hidden rounded-xl border border-cream/15 bg-black/20">
                  {imageFailed ? (
                    <div className="flex h-44 items-center justify-center px-6 text-center text-sm text-cream/55">
                      Ảnh tư liệu tạm thời không khả dụng. Bạn vẫn có thể đọc
                      đầy đủ thông tin về mốc này bên dưới.
                    </div>
                  ) : (
                    <img
                      src={active.imageUrl}
                      alt={active.imageAlt}
                      loading="lazy"
                      onError={() => setImageFailed(true)}
                      className="h-44 w-full object-cover sm:h-52"
                    />
                  )}
                  <figcaption className="border-t border-cream/10 px-3 py-2 text-xs leading-relaxed text-cream/55">
                    {active.imageCaption}
                  </figcaption>
                </figure>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-cream/75">
                  <p>
                    <strong className="font-medium text-cream">Sự kiện:</strong>{" "}
                    {active.historicalContext}
                  </p>
                  <p>
                    <strong className="font-medium text-cream">
                      Vì sao quan trọng:
                    </strong>{" "}
                    {active.whyItMatters}
                  </p>
                  <p>
                    <strong className="font-medium text-cream">
                      Gợi ý hôm nay:
                    </strong>{" "}
                    {active.modernApplication}
                  </p>
                </div>
                <p className="mt-4 border-l-2 border-gold/50 pl-3 text-xs leading-relaxed text-cream/50">
                  <strong className="font-medium text-cream/70">
                    Ghi chú tư liệu:
                  </strong>{" "}
                  {active.sourceNote}
                </p>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-cream/10 pt-4">
                  <button
                    onClick={() => moveTo(-1)}
                    disabled={activeIndex === 0}
                    className="focus-ring rounded-full border border-cream/20 px-4 py-2 text-sm text-cream/70 transition-colors hover:border-cream/50 hover:text-cream disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    ← Mốc trước
                  </button>
                  <button
                    onClick={() => moveTo(1)}
                    disabled={activeIndex === visibleTimeline.length - 1}
                    className="focus-ring rounded-full border border-gold/60 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Mốc tiếp →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes autoplayTimer {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </section>
  );
}
