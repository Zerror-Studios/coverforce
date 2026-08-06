"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture, Decal, Line } from "@react-three/drei";

const hitState = { lastHitTime: 0 };
function triggerCenterHit(time: number) {
    hitState.lastHitTime = time;
}

function LogoMaterial({ texture }: { texture: THREE.Texture }) {
    const uniforms = React.useMemo(() => ({
        uMap: { value: texture },
        uColor: { value: new THREE.Color('#ffffff') }
    }), [texture]);

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

function AnimatedLine({ start, end, color, isNorthern }: { start: THREE.Vector3, end: THREE.Vector3, color: string, isNorthern: boolean }) {
    const numDots = 40;
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const colorObj = React.useMemo(() => new THREE.Color(color), [color]);

    const direction = React.useMemo(() => new THREE.Vector3().subVectors(end, start), [start, end]);
    const dummy = React.useMemo(() => new THREE.Object3D(), []);

    const timeOffset = React.useMemo(() => Math.random() * 2, []);
    const prevT = useRef(0);
    const tempVec = React.useMemo(() => new THREE.Vector3(), []);

    useFrame((state) => {
        if (!meshRef.current) return;

        const speed = 0.4;
        const t = ((state.clock.elapsedTime * speed) + timeOffset) % 2.0;

        if (isNorthern) {
            if (prevT.current < 0.8 && t >= 0.8) {
                tempVec.copy(start).applyMatrix4(meshRef.current.matrixWorld);
                if (tempVec.z > 0) {
                    triggerCenterHit(state.clock.elapsedTime);
                }
            }
        }
        prevT.current = t;

        for (let i = 0; i < numDots; i++) {
            const trailLength = 0.25;
            const offset = (i / numDots) * trailLength;
            let progress = t - offset;

            let scale = 0;
            if (progress >= 0 && progress <= 1) {
                scale = Math.pow(1 - (i / numDots), 1.5);
                if (progress < 0.05) scale *= progress / 0.05;
                if (progress > 0.95) scale *= (1 - progress) / 0.05;
            } else {
                progress = 0;
            }

            dummy.position.copy(start).add(direction.clone().multiplyScalar(progress));
            dummy.scale.setScalar(scale);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    const customMaterial = React.useMemo(() => {
        const mat = new THREE.MeshBasicMaterial({
            color: colorObj,
            transparent: true,
            opacity: 1,
            depthTest: false
        });
        mat.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `#include <common>\nvarying vec3 vWorldPosition;`
            ).replace(
                '#include <project_vertex>',
                `#include <project_vertex>\n#ifdef USE_INSTANCING\nvWorldPosition = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;\n#else\nvWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#endif`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>\nvarying vec3 vWorldPosition;`
            ).replace(
                '#include <dithering_fragment>',
                `#include <dithering_fragment>\nfloat frontFactor = smoothstep(-0.5, 0.5, vWorldPosition.z);\ngl_FragColor.a *= mix(0.2, 1.0, frontFactor);`
            );
        };
        return mat;
    }, [colorObj]);

    const trackMaterial = React.useMemo(() => {
        const mat = new THREE.LineBasicMaterial({
            color: colorObj,
            transparent: true,
            opacity: 0.15,
            depthTest: false
        });
        mat.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `#include <common>\nvarying vec3 vWorldPosition;`
            ).replace(
                '#include <project_vertex>',
                `#include <project_vertex>\n#ifdef USE_INSTANCING\nvWorldPosition = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;\n#else\nvWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#endif`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>\nvarying vec3 vWorldPosition;`
            ).replace(
                '#include <dithering_fragment>',
                `#include <dithering_fragment>\nfloat frontFactor = smoothstep(-0.5, 0.5, vWorldPosition.z);\ngl_FragColor.a *= mix(0.2, 1.0, frontFactor);`
            );
        };
        return mat;
    }, [colorObj]);

    const lineGeo = React.useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints([start, end]);
    }, [start, end]);

    const trackLine = React.useMemo(() => {
        return new THREE.Line(lineGeo, trackMaterial);
    }, [lineGeo, trackMaterial]);

    return (
        <group>
            <primitive object={trackLine} />
            <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, numDots]}>
                <sphereGeometry args={[0.012, 12, 12]} />
                <primitive object={customMaterial} attach="material" />
            </instancedMesh>
        </group>
    );
}

const CARRIER_LOGO_POOL = [
    "/images/home/carrier/carrier-berkshire-hathaway.png",
    "/images/home/carrier/carrier-chubb.png",
    "/images/home/carrier/carrier-coalition.png",
    "/images/home/carrier/carrier-compwest.png",
    "/images/home/carrier/carrier-cowbell.png",
    "/images/home/carrier/carrier-employers.png",
    "/images/home/carrier/carrier-markel.png",
    "/images/home/carrier/carrier-merchants-insurance-group.png",
    "/images/home/carrier/carrier-republic-indemnity.png",
];

const BROKER_LOGO_POOL = [
    "/images/home/distributors/broker-diligence-brokerage.png",
    "/images/home/distributors/network-isu-steadfast.png",
    "/images/home/distributors/startup-anzen.png",
    "/images/home/distributors/startup-broker-buddha-buddhAI.png",
    "/images/home/distributors/startup-coverwatch.png",
    "/images/home/distributors/startup-harper.png",
    "/images/home/distributors/startup-latent-insurance.png",
    "/images/home/distributors/startup-rosella.png",
    "/images/home/distributors/startup-snapBind.png",
    "/images/home/distributors/wholesaler-international-underwriting-agency.png",
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

function LogoPlacer({ urls, isNorthern, radius, color }: { urls: string[], isNorthern: boolean, radius: number, color: string }) {
    const textures = useTexture(urls) as THREE.Texture[];
    return (
        <>
            {textures.map((texture, i) => {
                const aspect = (texture.image as any).width / (texture.image as any).height;
                const height = 0.175;
                const width = height * aspect;
                const position = getLogoPosition(i, urls.length, isNorthern, radius);

                const dummy = new THREE.Object3D();
                dummy.position.copy(position);
                dummy.lookAt(position.clone().multiplyScalar(2));

                const origin = new THREE.Vector3(0, 0, 0);
                const start = isNorthern ? position : origin;
                const end = isNorthern ? origin : position;

                return (
                    <React.Fragment key={urls[i]}>
                        <AnimatedLine start={start} end={end} color={color} isNorthern={isNorthern} />
                        <Decal
                            position={position}
                            rotation={dummy.rotation}
                            scale={[width, height, 0.5]}
                        >
                            <LogoMaterial texture={texture} />
                        </Decal>
                    </React.Fragment>
                );
            })}
        </>
    );
}

function CenterLogo() {
    const texture = useTexture("/images/startups/center-logo.svg") as THREE.Texture;
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
            s.velocity += 0.15; // Bounce impulse
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

        // Critically damped spring for bubble effect
        const force = (1 - s.scale) * 40;
        const damping = s.velocity * 10;
        s.velocity += (force - damping) * delta;
        s.scale += s.velocity * delta;

        if (groupRef.current) {
            groupRef.current.scale.setScalar(s.scale);
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

function RotatingGlobe() {
    const meshRef = useRef<THREE.Mesh>(null!);

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
                vec3 southColor = vec3(0.29, 0.87, 0.607); // #4ADE9B
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
                vec3 southColor = vec3(0.29, 0.87, 0.607); // #4ADE9B
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
                <LogoPlacer urls={CARRIER_LOGO_POOL} isNorthern={true} radius={1.95} color="#FF6B35" />
                <LogoPlacer urls={BROKER_LOGO_POOL} isNorthern={false} radius={1.95} color="#4ADE9B" />
            </Suspense>
        </mesh>
    );
}

export default function RequestGlobe2() {
    return (
        <div className="w-full h-[40rem] flex items-center justify-center pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                <RotatingGlobe />
                <Suspense fallback={null}>
                    <CenterLogo />
                </Suspense>
            </Canvas>
        </div>
    );
}
