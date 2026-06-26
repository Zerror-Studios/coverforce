"use client";

/**
 * WavePlane3D – React Three Fiber wave plane with:
 *  - simplex-noise vertex displacement (self-contained, no glslify)
 *  - cosine-gradient colouring (navy → periwinkle → lavender → violet)
 *  - animated grid overlay
 *  - pointer-tracking camera parallax
 *  - scroll-driven wave travel
 *
 * Drop-in usage:
 *   import { WavePlaneCanvas } from "@/components/product/WavePlane3D";
 *   <WavePlaneCanvas className="!fixed inset-0" />
 *
 * Dependencies (add to package.json if not already present):
 *   @react-three/fiber  @react-three/drei  three
 */

import {
  shaderMaterial,
  PerspectiveCamera,
} from "@react-three/drei";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
} from "@react-three/fiber";
import React, {
  type FC,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { ShaderMaterial, Vector3 } from "three";

// ─── Inline shaders ─────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScrollProgress;
varying vec2  vUv;
varying float vTerrainHeight;

// Self-contained simplex 3-D noise (no glslify)
vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i =floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g =step(x0.yzx,x0.xyz);
  vec3 l =1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289v3(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.,i1.z,i2.z,1.))
   +i.y+vec4(0.,i1.y,i2.y,1.))
   +i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  vec3 noiseInput=vec3(position.x/4.,(position.y/4.)+uScrollProgress,uTime*0.2);
  float n=snoise(noiseInput);
  n=n*0.5+0.5;
  vec3 newPosition=position;
  newPosition.z+=n*1.5;
  vec4 modelPosition   =modelMatrix   *vec4(newPosition,1.);
  vec4 viewPosition    =viewMatrix    *modelPosition;
  vec4 projectedPosition=projectionMatrix*viewPosition;
  vTerrainHeight=n;
  vUv=uv;
  gl_Position=projectedPosition;
}
`;

const fragmentShader = /* glsl */ `
uniform float uScrollProgress;
uniform vec3  uColourPalette[4];
uniform bool  uShowGrid;
uniform float uGridSize;
varying vec2  vUv;
varying float vTerrainHeight;

const vec4 BG_COLOUR=vec4(0.,0.,0.,0.);

// Smoothly interpolate across the 4 colour stops by terrain height.
vec3 paletteColour(float t){
  t=clamp(t,0.,1.);
  float seg=t*3.0;
  if(seg<1.0) return mix(uColourPalette[0],uColourPalette[1],seg);
  if(seg<2.0) return mix(uColourPalette[1],uColourPalette[2],seg-1.0);
  return mix(uColourPalette[2],uColourPalette[3],seg-2.0);
}
float brighten(float c){return clamp(c+0.3,0.,1.);}

void main(){
  vec3 colour=paletteColour(vTerrainHeight);
  vec4 finalColour=vec4(colour,1.);

  if(uShowGrid){
    float thick=0.012;
    float linePosY=fract(vUv.y*uGridSize+uScrollProgress*6.);
    float alphaY=1.-step(thick,linePosY);
    float linePosX=fract(vUv.x*uGridSize);
    float alphaX=1.-step(thick,linePosX);
    float lineAlpha=max(alphaY,alphaX);
    vec4 lineCol=vec4(brighten(colour.r),brighten(colour.g),brighten(colour.b),1.);
    finalColour=mix(finalColour,lineCol,lineAlpha);
  }

  float dist=distance(vUv,vec2(0.5));
  float fog=smoothstep(0.35,0.5,dist);
  finalColour=mix(finalColour,BG_COLOUR,fog);

  gl_FragColor=finalColour;
}
`;

// ─── Colour palette – 4 hex stops (navy → periwinkle → lavender → violet) ─────

const DEFAULT_COLOURS = ["#1b2550", "#5566c4", "#b9a7e6", "#8a63e8"];

function hexToVec3(hex: string): Vector3 {
  const h = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return new Vector3(0, 0, 0);
  return new Vector3(
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  );
}

const DEFAULT_PALETTE = DEFAULT_COLOURS.map(hexToVec3);

// ─── Shader material ─────────────────────────────────────────────────────────

type Uniforms = {
  uTime: number;
  uScrollProgress: number;
  uColourPalette: Vector3[];
  uShowGrid: boolean;
  uGridSize: number;
};

const WavePlaneMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollProgress: 0,
    uColourPalette: DEFAULT_PALETTE,
    uShowGrid: false,
    uGridSize: 24,
  } as Uniforms,
  vertexShader,
  fragmentShader
);

extend({ WavePlaneMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    wavePlaneMaterial: {
      ref?: React.Ref<ShaderMaterial & Uniforms>;
      uTime: number;
      uScrollProgress: number;
      uColourPalette: Vector3[];
      uShowGrid: boolean;
      uGridSize: number;
      transparent?: boolean;
      key?: string;
    };
  }
}

// ─── WavePlane mesh ──────────────────────────────────────────────────────────

const WavePlane: FC<{ showGrid: boolean; palette: Vector3[] }> = ({
  showGrid,
  palette,
}) => {
  const viewport = useThree((s) => s.viewport);
  const matRef   = useRef<ShaderMaterial & Uniforms>(null);
  const scroll   = useRef(0);

  // Keep scroll progress updated
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const size     = useMemo(() => Math.max(Math.round(viewport.width + 2), Math.round(viewport.height * 2)), [viewport]);
  const segments = useMemo(() => size * 8, [size]);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uTime = clock.elapsedTime;
    matRef.current.uScrollProgress = scroll.current * 12;
    matRef.current.uColourPalette = palette;
    matRef.current.uShowGrid = showGrid;
  });

  return (
    <mesh
      position={[0, -viewport.height / 2.5, -1]}
      rotation={[-0.5 * Math.PI, 0, 0]}
    >
      <planeGeometry args={[size, size, segments, segments]} />
      <wavePlaneMaterial
        ref={matRef}
        key={WavePlaneMaterial.key}
        uTime={0}
        uScrollProgress={0}
        uColourPalette={palette}
        uShowGrid={showGrid}
        uGridSize={24}
        transparent
      />
    </mesh>
  );
};

// ─── Static camera – locked at the "mouse to top-center" incline ─────────────

const StaticCamera: FC = () => {
  useFrame(({ camera, scene }) => {
    camera.lookAt(scene.position);
  });

  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 0.5, 5]}
      fov={60}
      far={20}
      near={0.001}
    />
  );
};

// ─── Public canvas export ────────────────────────────────────────────────────

type CanvasProps = {
  className?: string;
  colors?: string[];
  showGrid?: boolean;
};

export const WavePlaneCanvas: FC<CanvasProps> = ({
  className,
  colors = DEFAULT_COLOURS,
  showGrid = true,
}) => {
  const palette = useMemo(() => colors.map(hexToVec3), [colors]);
  const canvasKey = colors.join("-");

  return (
    <Canvas
      key={canvasKey}
      className={className}
      camera={{ position: [0, 0, 5], fov: 60, far: 20, near: 0.001 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <WavePlane showGrid={showGrid} palette={palette} />
      <StaticCamera />
    </Canvas>
  );
};

// ─── Full-page demo (optional) ───────────────────────────────────────────────

export const WavePlanePage: FC = () => (
  <main className="h-[1000vh] w-full">
    <WavePlaneCanvas className="!fixed inset-0" />
  </main>
);