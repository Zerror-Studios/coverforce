"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Scene, PerspectiveCamera, Vector3, Group } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElements["mesh"] & {
      new (): ThreeGlobe;
    };
  }
}

extend({ ThreeGlobe: ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 380;
// Precomputed once instead of Math.random() on every arc render call
const ARC_STROKE_OPTIONS = [0.32, 0.28, 0.3];

import { featureCentroidLngLat, positionToBlueColor, positionToSpectrumColor } from "@/lib/globe-colors";

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  cameraDistance?: number;
  lite?: boolean;
  hexPolygonResolution?: number;
  maxDpr?: number;
  tone?: "spectrum" | "blue";
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
  visible?: boolean;
}

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<Group | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Stable defaults object - only rebuilt when globeConfig actually changes
  const defaultProps = useMemo(
    () => ({
      pointSize: 0.7,
      atmosphereColor: "#ffffff",
      showAtmosphere: false,
      atmosphereAltitude: 0,
      polygonColor: "rgba(255,255,255,0.7)",
      globeColor: "#000000",
      emissive: "#000000",
      emissiveIntensity: 0,
      shininess: 0.9,
      arcTime: 2000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      ...globeConfig,
    }),
    [globeConfig],
  );

  // Initialize globe only once
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      (groupRef.current as any).add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  // Build material when globe is initialized or when relevant props change
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
      transparent: boolean;
      opacity: number;
      colorWrite: boolean;
      depthWrite: boolean;
    };
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0;
    globeMaterial.shininess = globeConfig.shininess || 0.9;

    // Keep the sphere invisible, but let it occlude back-facing geometry
    globeMaterial.transparent = false;
    globeMaterial.opacity = 1;
    globeMaterial.colorWrite = false;
    globeMaterial.depthWrite = true;
  }, [
    isInitialized,
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ]);

  // Memoize derived point data so it's only recalculated when `data` or pointSize change,
  // not on every render of the parent.
  const filteredPoints = useMemo(() => {
    if (!data) return [];
    const points: { size: number; order: number; color: string; lat: number; lng: number }[] = [];
    for (let i = 0; i < data.length; i++) {
      const arc = data[i];
      points.push({ size: defaultProps.pointSize, order: arc.order, color: arc.color, lat: arc.startLat, lng: arc.startLng });
      points.push({ size: defaultProps.pointSize, order: arc.order, color: arc.color, lat: arc.endLat, lng: arc.endLng });
    }
    // remove duplicates for same lat and lng
    const seen = new Set<string>();
    return points.filter((p) => {
      const key = `${p.lat}:${p.lng}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data, defaultProps.pointSize]);

  const hexResolution = useMemo(
    () => globeConfig.hexPolygonResolution ?? (globeConfig.lite ? 2 : 3),
    [globeConfig.hexPolygonResolution, globeConfig.lite],
  );

  // Build data when globe is initialized or when data changes
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(hexResolution)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor((d) => {
        const { lat, lng } = featureCentroidLngLat(
          d as { geometry: { type: string; coordinates: unknown } },
        );
        return globeConfig.tone === "blue"
          ? positionToBlueColor(lng, lat)
          : positionToSpectrumColor(lng, lat);
      });

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => (d as { startLat: number }).startLat)
      .arcStartLng((d) => (d as { startLng: number }).startLng)
      .arcEndLat((d) => (d as { endLat: number }).endLat)
      .arcEndLng((d) => (d as { endLng: number }).endLng)
      .arcColor((e: unknown) => {
        const arc = e as Position;
        return positionToSpectrumColor(
          (arc.startLng + arc.endLng) / 2,
          (arc.startLat + arc.endLat) / 2,
        );
      })
      .arcAltitude((e) => (e as { arcAlt: number }).arcAlt)
      .arcStroke(() => ARC_STROKE_OPTIONS[Math.floor(Math.random() * ARC_STROKE_OPTIONS.length)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e) => (e as { order: number }).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor((e) => {
        const point = e as { lng: number; lat: number };
        return positionToSpectrumColor(point.lng, point.lat);
      })
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(0.22); // smaller dots

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings,
      );
  }, [
    isInitialized,
    data,
    filteredPoints,
    hexResolution,
    defaultProps.showAtmosphere,
    defaultProps.atmosphereColor,
    defaultProps.atmosphereAltitude,
    defaultProps.polygonColor,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.rings,
    defaultProps.maxRings,
    globeConfig.tone,
  ]);

  // Handle rings animation with cleanup - lighter cadence and lighter payload
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data || defaultProps.maxRings <= 0) return;

    const ringCount = Math.min(data.length, Math.ceil((data.length * 2) / 5)); // fewer rings per tick
    let cancelled = false;

    const interval = setInterval(() => {
      if (cancelled || !globeRef.current) return;

      const indices = genRandomNumbers(0, data.length, ringCount);
      const ringsData = indices.map((i) => {
        const d = data[i];
        return { lat: d.startLat, lng: d.startLng, color: d.color };
      });

      globeRef.current.ringsData(ringsData);
    }, 3000); // slower cadence = fewer GPU buffer rebuilds

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isInitialized, data, defaultProps.maxRings]);

  return <group ref={groupRef} />;
}

export function WebGLRendererConfig({ maxDpr }: { maxDpr?: number }) {
  const { gl, size } = useThree();

  useEffect(() => {
    const dpr = maxDpr
      ? Math.min(window.devicePixelRatio, maxDpr)
      : Math.min(window.devicePixelRatio, 1.5);
    gl.setPixelRatio(dpr);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, maxDpr, size.height, size.width]);

  return null;
}

export function World({ ...props }: WorldProps) {
  const { globeConfig } = props;
  const distance = globeConfig.cameraDistance ?? cameraZ;
  const scene = useMemo(() => new Scene(), []);
  const camera = useMemo(() => new PerspectiveCamera(50, aspect, 180, 1800), []);

  useEffect(() => {
    camera.position.set(0, 0, distance);
  }, [camera, distance]);

  // Lite mode automatically caps DPR lower to save GPU work on weaker devices
  const maxDpr = globeConfig.maxDpr ?? (globeConfig.lite ? 1.25 : 1.5);

  return (
    <Canvas
      scene={scene}
      camera={camera}
      frameloop="always"
      dpr={[1, maxDpr]}
      gl={{
        antialias: !globeConfig.lite,
        alpha: true,
        powerPreference: globeConfig.lite ? "low-power" : "high-performance",
      }}
    >
      <WebGLRendererConfig maxDpr={maxDpr} />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
        minDistance={distance}
        maxDistance={distance}
        autoRotate={globeConfig.autoRotate ?? true}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? 0.5}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = [];
  const span = max - min;
  const target = Math.min(count, span);
  while (arr.length < target) {
    const r = Math.floor(Math.random() * span) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}