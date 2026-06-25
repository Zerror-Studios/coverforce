"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

#define LAYERS 90.

float terrain(float x, float z) {
    float h = 0.0;

    h += sin(x * 2.0 + z * 4.0 + u_time * 0.15) * 0.22;
    h += sin(x * 4.0 - z * 3.0 + u_time * 0.12) * 0.08;
    h += sin(x * 8.0 + z * 8.0) * 0.03;

    return h;
}

vec3 palette(float t) {
    vec3 orange = vec3(1.0, 0.66, 0.35);
    vec3 pink   = vec3(0.95, 0.45, 0.75);
    vec3 purple = vec3(0.55, 0.25, 1.0);

    if (t < 0.4)
        return mix(orange, pink, t / 0.4);

    return mix(
        pink,
        purple,
        (t - 0.4) / 0.6
    );
}

void main() {

    vec2 uv = gl_FragCoord.xy / u_resolution;

    uv.x *= u_resolution.x / u_resolution.y;

    vec3 color = vec3(0.01, 0.02, 0.08);

    for(float i = 0.0; i < LAYERS; i++) {

        float z = i / LAYERS;

        float depth = 1.0 - z;

        float scale = mix(
            0.45,
            2.4,
            depth
        );

        float x = (uv.x - 0.9) * scale;

        float height =
            0.12 +
            z * 0.75 +
            terrain(x, z) * depth;

        float dist = abs(uv.y - height);

        float thickness = mix(
            0.002,
            0.006,
            depth
        );

        float line =
            smoothstep(
                thickness,
                0.0,
                dist
            );

        float h1 = terrain(x, z);
        float h2 = terrain(x + 0.03, z);

        float slope = h2 - h1;

        float light =
            0.9 +
            slope * 4.0;

        vec3 c = palette(z);

        c *= light;

        c *= mix(
            0.3,
            1.5,
            depth
        );

        color += c * line;
    }

    float glow =
        exp(
            -pow(
                abs(uv.y - 0.45),
                2.0
            ) * 40.0
        );

    color += vec3(
        0.25,
        0.12,
        0.4
    ) * glow * 0.2;

    float vignette =
        1.0 -
        length(uv - vec2(0.6, 0.45)) * 0.4;

    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
  return s;
}

export default function WaveShader({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: true,
      });
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const vert = compileShader(gl, gl.VERTEX_SHADER,   VERT);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(prog) ?? "link error");

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc  = gl.getUniformLocation(prog, "u_resolution");
    const timeLoc = gl.getUniformLocation(prog, "u_time");

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width  = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}