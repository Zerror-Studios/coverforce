"use client";

import React, { useRef, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const hitState = { lastHitTime: 0 };
function triggerCenterHit(time: number) {
    hitState.lastHitTime = time;
}

function LogoMaterial({ texture, tintColor = '#ffffff' }: { texture: THREE.Texture, tintColor?: string }) {
    const uniforms = React.useMemo(() => ({
        uMap: { value: texture },
        uColor: { value: new THREE.Color(tintColor) }
    }), [texture, tintColor]);

    return (
        <shaderMaterial
            transparent
            depthTest={true}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
            uniforms={uniforms}
            vertexShader={`
                varying vec2 vUv;
                varying vec3 vWorldPosition;
                void main() {
                    vUv = uv;
                    vec4 worldPos = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPos.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                }
            `}
            fragmentShader={`
                uniform sampler2D uMap;
                uniform vec3 uColor;
                varying vec2 vUv;
                varying vec3 vWorldPosition;
                
                void main() {
                    vec4 texColor = texture2D(uMap, vUv);
                    float frontFactor = smoothstep(-0.5, 0.5, vWorldPosition.z);
                    float targetOpacity = mix(0.2, 1.0, frontFactor);
                    gl_FragColor = vec4(uColor, texColor.a * targetOpacity);
                }
            `}
        />
    );
}

// ─── Logo ⇄ hub connection lines ─────────────────────────────────────────────
// Previously each of the 42 lines was its own component: an InstancedMesh of
// 40 dots repositioned in JS every frame (~1,700 Bézier evaluations + matrix
// uploads per frame) plus its own TubeGeometry mesh (~84 draw calls total).
//
// Now every line of one hemisphere shares:
//   - ONE instanced dot mesh, positioned entirely in the vertex shader from a
//     time uniform (no per-frame JS, no buffer uploads), and
//   - ONE merged track mesh.
// The motion, trail, fade and front/back opacity match the old version.

const DOTS_PER_LINE = 40;
const DOT_SPEED = 0.4;
const DOT_TRAIL = 0.25;
const DOT_RADIUS = 0.015;
const HUB_HIT_T = 0.8;

type LineSpec = {
    start: THREE.Vector3;
    ctrl: THREE.Vector3;
    end: THREE.Vector3;
    timeOffset: number;
};

/** Deterministic 0..1 hash - keeps render pure (no Math.random). */
function hash01(n: number) {
    const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
}

function makeLineSpec(start: THREE.Vector3, end: THREE.Vector3, curveOffset: number, timeOffset: number): LineSpec {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.6);
    const nonOrigin = start.lengthSq() > 0.1 ? start : end;
    let up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(nonOrigin.clone().normalize().y) > 0.99) {
        up = new THREE.Vector3(1, 0, 0);
    }
    const axis = new THREE.Vector3().crossVectors(nonOrigin, up).normalize();
    mid.add(axis.multiplyScalar(curveOffset));
    return { start, ctrl: mid, end, timeOffset };
}

const FRONT_FADE_GLSL = /* glsl */ `
    float frontFactor = smoothstep(-0.5, 0.5, vWorldZ);
    alpha *= mix(0.2, 1.0, frontFactor);
`;

const dotVertexShader = /* glsl */ `
    attribute vec3 aStart;
    attribute vec3 aCtrl;
    attribute vec3 aEnd;
    attribute float aTimeOffset;
    attribute float aDot;        // i / DOTS_PER_LINE
    uniform float uTime;
    varying float vWorldZ;

    void main() {
        float t = mod(uTime * ${DOT_SPEED.toFixed(2)} + aTimeOffset, 2.0);
        float progress = t - aDot * ${DOT_TRAIL.toFixed(2)};
        float scale = 0.0;
        if (progress >= 0.0 && progress <= 1.0) {
            scale = pow(1.0 - aDot, 1.5);
            if (progress < 0.05) scale *= progress / 0.05;
            if (progress > 0.95) scale *= (1.0 - progress) / 0.05;
        } else {
            progress = 0.0;
        }
        float u = 1.0 - progress;
        vec3 p = u * u * aStart + 2.0 * u * progress * aCtrl + progress * progress * aEnd;
        vec4 world = modelMatrix * vec4(position * scale + p, 1.0);
        vWorldZ = world.z;
        gl_Position = projectionMatrix * viewMatrix * world;
    }
`;

const solidFragmentShader = /* glsl */ `
    uniform vec3 uColor;
    uniform float uOpacity;
    varying float vWorldZ;
    void main() {
        float alpha = uOpacity;
        ${FRONT_FADE_GLSL}
        gl_FragColor = vec4(uColor, alpha);
    }
`;

const trackVertexShader = /* glsl */ `
    varying float vWorldZ;
    void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldZ = world.z;
        gl_Position = projectionMatrix * viewMatrix * world;
    }
`;

function ConnectionLines({ lines, color, hubHitLines }: { lines: LineSpec[]; color: string; hubHitLines: LineSpec[] }) {
    const groupRef = useRef<THREE.Group>(null!);
    const dotMeshRef = useRef<THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>>(null!);

    const dotGeometry = React.useMemo(() => {
        const base = new THREE.SphereGeometry(DOT_RADIUS, 8, 6);
        const geo = new THREE.InstancedBufferGeometry();
        geo.index = base.index;
        geo.setAttribute("position", base.getAttribute("position"));

        const count = lines.length * DOTS_PER_LINE;
        const aStart = new Float32Array(count * 3);
        const aCtrl = new Float32Array(count * 3);
        const aEnd = new Float32Array(count * 3);
        const aTimeOffset = new Float32Array(count);
        const aDot = new Float32Array(count);
        let k = 0;
        for (const line of lines) {
            for (let i = 0; i < DOTS_PER_LINE; i++, k++) {
                line.start.toArray(aStart, k * 3);
                line.ctrl.toArray(aCtrl, k * 3);
                line.end.toArray(aEnd, k * 3);
                aTimeOffset[k] = line.timeOffset;
                aDot[k] = i / DOTS_PER_LINE;
            }
        }
        geo.setAttribute("aStart", new THREE.InstancedBufferAttribute(aStart, 3));
        geo.setAttribute("aCtrl", new THREE.InstancedBufferAttribute(aCtrl, 3));
        geo.setAttribute("aEnd", new THREE.InstancedBufferAttribute(aEnd, 3));
        geo.setAttribute("aTimeOffset", new THREE.InstancedBufferAttribute(aTimeOffset, 1));
        geo.setAttribute("aDot", new THREE.InstancedBufferAttribute(aDot, 1));
        geo.instanceCount = count;
        return geo;
    }, [lines]);

    const dotMaterial = React.useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(color) },
            uOpacity: { value: 1 },
        },
        vertexShader: dotVertexShader,
        fragmentShader: solidFragmentShader,
        transparent: true,
        depthTest: false,
    }), [color]);

    const trackGeometry = React.useMemo(() => {
        const tubes = lines.map((l) =>
            new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(l.start, l.ctrl, l.end), 50, 0.004, 8, false),
        );
        const merged = mergeGeometries(tubes);
        tubes.forEach((t) => t.dispose());
        return merged;
    }, [lines]);

    const trackMaterial = React.useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(color) },
            uOpacity: { value: 0.35 },
        },
        vertexShader: trackVertexShader,
        fragmentShader: solidFragmentShader,
        transparent: true,
        depthTest: false,
    }), [color]);

    useEffect(() => () => {
        dotGeometry.dispose();
        dotMaterial.dispose();
        trackGeometry?.dispose();
        trackMaterial.dispose();
    }, [dotGeometry, dotMaterial, trackGeometry, trackMaterial]);

    // Hub "hit": when a logo→hub dot stream reaches t = 0.8 on a front-facing
    // logo, pulse the centre ripple. Only a handful of scalars per frame.
    const prevT = useRef<number[]>([]);
    const tmp = React.useMemo(() => new THREE.Vector3(), []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        const dots = dotMeshRef.current;
        if (dots) dots.material.uniforms.uTime.value = time;

        if (!hubHitLines.length || !groupRef.current) return;
        const world = groupRef.current.matrixWorld;
        hubHitLines.forEach((line, idx) => {
            const t = (time * DOT_SPEED + line.timeOffset) % 2.0;
            const prev = prevT.current[idx] ?? t;
            if (prev < HUB_HIT_T && t >= HUB_HIT_T) {
                tmp.copy(line.start).applyMatrix4(world);
                if (tmp.z > 0) triggerCenterHit(time);
            }
            prevT.current[idx] = t;
        });
    });

    return (
        <group ref={groupRef}>
            {trackGeometry ? <mesh geometry={trackGeometry} material={trackMaterial} /> : null}
            <mesh ref={dotMeshRef} geometry={dotGeometry} material={dotMaterial} frustumCulled={false} />
        </group>
    );
}

const CARRIER_LOGO_POOL = [
    "/images/home/globe-logos/berkshire-hathaway.png",
    "/images/home/globe-logos/chubb.png",
    "/images/home/globe-logos/coalition.png",
    "/images/home/globe-logos/cowbell.png",
    "/images/home/globe-logos/employers.png",
    "/images/home/globe-logos/markel.png",
    "/images/home/globe-logos/travelers.png",
    "/images/home/globe-logos/liberty-mutual.png",
    "/images/home/globe-logos/nationwide.png",
];

const BROKER_LOGO_POOL = [
    "/images/home/globe-logos/broker-diligence-brokerage.png",
    "/images/home/globe-logos/network-isu-steadfast.png",
    "/images/home/globe-logos/wholesaler-amwins.png",
    "/images/home/globe-logos/startup-broker-buddha-buddhai.png",
    "/images/home/globe-logos/startup-coverwatch.png",
    "/images/home/globe-logos/startup-harper.png",
    "/images/home/globe-logos/startup-latent-insurance.png",
    "/images/home/globe-logos/startup-rosella.png",
    "/images/home/globe-logos/wholesaler-jencap.png",
    "/images/home/globe-logos/wholesaler-one80.png",
    "/images/home/globe-logos/wholesaler-international-underwriting-agency.png",
    "/images/home/globe-logos/brown-brown-white.png",
];

function getLogoPosition(index: number, total: number, isNorthern: boolean, radius: number) {
    const theta = (index / total) * Math.PI * 2;
    const phiVariation = (index % 2 === 0) ? Math.PI / 3.2 : Math.PI / 2.6;
    const phi = isNorthern ? phiVariation : Math.PI - phiVariation;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

function LogoPlacer({ urls, isNorthern, radius, color, tintColor = '#ffffff' }: { urls: string[], isNorthern: boolean, radius: number, color: string, tintColor?: string }) {
    const textures = useTexture(urls) as THREE.Texture[];

    // Static layout - computed once, not on every render.
    const layout = React.useMemo(() => {
        const origin = new THREE.Vector3(0, 0, 0);
        const logos = textures.map((texture, i) => {
            const image = texture.image as { width: number; height: number };
            const height = 0.175;
            const width = height * (image.width / image.height);
            const position = getLogoPosition(i, urls.length, isNorthern, radius);
            const dummy = new THREE.Object3D();
            dummy.position.copy(position);
            dummy.lookAt(position.clone().multiplyScalar(2));
            // Sit a hair above the surface (the Decal used to project onto it;
            // over a 0.175-unit logo on a 1.95 sphere the curvature is negligible).
            const lifted = position.clone().multiplyScalar(1.002);
            return { key: urls[i], texture, width, height, position: lifted, rotation: dummy.rotation.clone() };
        });

        const lines: LineSpec[] = [];
        const hubHitLines: LineSpec[] = [];
        textures.forEach((_, i) => {
            const position = getLogoPosition(i, urls.length, isNorthern, radius);
            // Stable pseudo-random stagger per line (0..2).
            const seed = (isNorthern ? 0 : 100) + i * 2;
            const toHub = makeLineSpec(position, origin, 0.2, hash01(seed) * 2);
            const fromHub = makeLineSpec(origin, position, -0.2, hash01(seed + 1) * 2);
            lines.push(toHub, fromHub);
            // Only logo→hub streams on the northern side can trigger the hub
            // ripple (hub→logo streams start at the origin, which is never z > 0).
            if (isNorthern) hubHitLines.push(toHub);
        });

        return { logos, lines, hubHitLines };
    }, [textures, urls, isNorthern, radius]);

    return (
        <>
            <ConnectionLines lines={layout.lines} color={color} hubHitLines={layout.hubHitLines} />
            {layout.logos.map((logo) => (
                <mesh key={logo.key} position={logo.position} rotation={logo.rotation}>
                    <planeGeometry args={[logo.width, logo.height]} />
                    <LogoMaterial texture={logo.texture} tintColor={tintColor} />
                </mesh>
            ))}
        </>
    );
}

function CenterLogo() {
    const texture = useTexture("/images/brand/coverforce-mark.svg") as THREE.Texture;
    const aspect = texture.image ? (texture.image as any).width / (texture.image as any).height : 1;
    const height = 0.25;
    const width = height * aspect;

    const innerRadius = Math.max(width, height) / 2 + 0.08;
    const outerRadius = innerRadius + 0.12;

    const groupRef = useRef<THREE.Group>(null!);
    const springRef = useRef({ velocity: 0, scale: 1, prevHit: 0 });
    const rippleRefs = useRef<THREE.Mesh[]>([]);
    const rippleStates = useRef([{ startTime: 0 }, { startTime: 0 }]);

    useFrame((state, delta) => {
        const s = springRef.current;
        if (hitState.lastHitTime !== s.prevHit) {
            s.prevHit = hitState.lastHitTime;

            // Trigger ripple
            let oldestIdx = 0;
            let oldestTime = state.clock.elapsedTime;
            rippleStates.current.forEach((rs, idx) => {
                if (rs.startTime < oldestTime) {
                    oldestTime = rs.startTime;
                    oldestIdx = idx;
                }
            });
            rippleStates.current[oldestIdx].startTime = state.clock.elapsedTime;
        }

        // Animate ripples
        rippleRefs.current.forEach((mesh, idx) => {
            if (!mesh) return;
            const age = state.clock.elapsedTime - rippleStates.current[idx].startTime;
            const duration = 1.5;
            if (age < duration) {
                const progress = age / duration;

                // Ease out cubic: fast initial expansion, smoothly slows down
                const scaleEase = 1 - Math.pow(1 - progress, 2);
                mesh.scale.setScalar(1 + scaleEase * 1);

                // Smooth fade out
                const opacityEase = Math.pow(1 - progress, 2);
                const mat = mesh.material as THREE.MeshBasicMaterial;
                mat.opacity = opacityEase * 0.5;
                mat.visible = true;
            } else {
                (mesh.material as THREE.MeshBasicMaterial).visible = false;
            }
        });
    });

    return (
        <group position={[0, 0, 0]} ref={groupRef}>
            {/* Expanding Ripples */}
            {[0, 1].map(i => (
                <mesh key={i} renderOrder={996} ref={el => { if (el) rippleRefs.current[i] = el }}>
                    <ringGeometry args={[outerRadius, outerRadius + 0.04, 64]} />
                    <meshBasicMaterial color="#ECE7FF" transparent={true} depthTest={false} toneMapped={false} />
                </mesh>
            ))}

            {/* Hub Base */}
            <mesh renderOrder={997}>
                <circleGeometry args={[outerRadius, 64]} />
                <meshBasicMaterial color="#ffffff" transparent={true} depthTest={false} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, 0.005]} renderOrder={998}>
                <circleGeometry args={[innerRadius, 64]} />
                <meshBasicMaterial color="#ECE7FF" transparent={true} depthTest={false} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, 0.01]} renderOrder={999}>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial map={texture} color="#ffffff" transparent={true} depthTest={false} toneMapped={false} />
            </mesh>
        </group>
    );
}

function RotatingGlobe({ logoColor = 'light' }: { logoColor?: 'light' | 'dark' }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const tintColor = logoColor === 'dark' ? '#000000' : '#ffffff';

    useFrame((state, delta) => {
        meshRef.current.rotation.y -= delta * 0.1;
    });

    const globeFillMaterial = React.useMemo(() => {
        const mat = new THREE.MeshBasicMaterial({
            transparent: true,
            depthWrite: false,
            opacity: 0.5, // Subtle volumetric fill
            side: THREE.FrontSide
        });
        mat.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `#include <common>\nvarying vec3 vPos;\nvarying vec3 vNormalView;\nvarying vec3 vViewPos;`
            ).replace(
                '#include <begin_vertex>',
                `#include <begin_vertex>\nvPos = position;\nvNormalView = normalize(normalMatrix * normal);\nvec4 mvPos = modelViewMatrix * vec4(position, 1.0);\nvViewPos = -mvPos.xyz;`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>\nvarying vec3 vPos;\nvarying vec3 vNormalView;\nvarying vec3 vViewPos;`
            ).replace(
                '#include <color_fragment>',
                `#include <color_fragment>
                vec3 northColor = vec3(1.0, 0.419, 0.207); // #FF6B35
                vec3 southColor = vec3(0.29, 0.686, 1.0); // #4AAFFF
                float yNorm = clamp(vPos.y / 1.95, -1.0, 1.0);
                
                // Smooth transition between colors across the equator
                float blend = smoothstep(-0.1, 0.1, yNorm);
                vec3 targetColor = mix(southColor, northColor, blend);
                
                // Edge glow (Fresnel) only, center is completely transparent
                vec3 viewDir = normalize(vViewPos);
                float fresnel = 1.0 - max(0.0, dot(vNormalView, viewDir));
                fresnel = pow(fresnel, 3.0); // Sharpen the glow to the edges
                
                diffuseColor.rgb = targetColor;
                diffuseColor.a = fresnel * 2.0;
                `
            );
        };
        return mat;
    }, []);

    const pointsMaterial = React.useMemo(() => {
        const mat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.015,
            transparent: true,
            opacity: 0.25, // Boosted opacity for glowing colored dots
            sizeAttenuation: true
        });
        mat.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `#include <common>\nvarying vec3 vPos;`
            ).replace(
                '#include <begin_vertex>',
                `#include <begin_vertex>\nvPos = position;`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>\nvarying vec3 vPos;`
            ).replace(
                '#include <color_fragment>',
                `#include <color_fragment>
                vec3 northColor = vec3(1.0, 0.419, 0.207); // #FF6B35
                vec3 southColor = vec3(0.29, 0.686, 1.0); // #4AAFFF
                float yNorm = clamp(vPos.y / 1.95, -1.0, 1.0);
                
                float blend = smoothstep(-0.1, 0.1, yNorm);
                vec3 targetColor = mix(southColor, northColor, blend);
                
                float alpha = 1.0 - abs(yNorm);
                
                diffuseColor.rgb = targetColor;
                diffuseColor.a *= alpha;
                `
            );
        };
        return mat;
    }, []);

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1.95, 64, 64]} />
            <primitive object={globeFillMaterial} attach="material" />

            <points>
                <sphereGeometry args={[1.95, 64, 64]} />
                <primitive object={pointsMaterial} attach="material" />
            </points>

            <Suspense fallback={null}>
                <LogoPlacer urls={CARRIER_LOGO_POOL} isNorthern={true} radius={1.95} color="#FF6B35" tintColor={tintColor} />
                <LogoPlacer urls={BROKER_LOGO_POOL} isNorthern={false} radius={1.95} color="#4AAFFF" tintColor={tintColor} />
            </Suspense>
        </mesh>
    );
}

function ResponsiveScene({ children }: { children: React.ReactNode }) {
    const { viewport } = useThree();
    const scale = Math.min(1, viewport.width / 4.5);
    return <group scale={scale}>{children}</group>;
}

export default function RequestGlobe2({ logoColor = 'light' }: { logoColor?: 'light' | 'dark' }) {
    // Stop rendering while scrolled out of view; resumes just before it re-enters.
    const containerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { rootMargin: "200px 0px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-[25rem] sm:h-[30rem] lg:h-[40rem] flex items-center justify-center pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]} frameloop={visible ? "always" : "never"}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                <ResponsiveScene>
                    <RotatingGlobe logoColor={logoColor} />
                    <Suspense fallback={null}>
                        <CenterLogo />
                    </Suspense>
                </ResponsiveScene>
            </Canvas>
        </div>
    );
}
