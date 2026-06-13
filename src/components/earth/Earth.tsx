"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import {
  createProceduralEarthTexture,
  createProceduralNightTexture,
  createProceduralSpecularTexture,
} from "./textures"

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D specularTexture;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 sunDir = normalize(sunDirection);

  float NdotL = dot(normal, sunDir);

  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  float specularMap = texture2D(specularTexture, vUv).r;

  float dayMix = clamp(NdotL * 1.2 + 0.1, 0.0, 1.0);

  float twilight = 1.0 - abs(NdotL);
  twilight = smoothstep(0.0, 0.6, twilight);
  vec3 twilightColor = vec3(0.9, 0.4, 0.1) * twilight * 0.5;

  vec3 warmNight = nightColor * vec3(1.55, 1.05, 0.55) * 0.20;
  vec3 color = mix(warmNight, dayColor, dayMix);
  color += twilightColor;

  vec3 viewDir = normalize(-vPosition);
  vec3 halfVec = normalize(sunDir + viewDir);
  float spec = pow(max(dot(normal, halfVec), 0.0), 64.0);
  float oceanSpec = spec * specularMap * 0.8;

  color += vec3(1.0, 0.95, 0.8) * oceanSpec;

  gl_FragColor = vec4(color, 1.0);
}
`

interface EarthProps {
  sunDirection: THREE.Vector3
}

function makeDefaultTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 2
  canvas.height = 2
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#4488cc"
  ctx.fillRect(0, 0, 2, 2)
  return new THREE.CanvasTexture(canvas)
}

export function Earth({ sunDirection }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniformsRef = useRef({
    dayTexture: { value: makeDefaultTexture() as THREE.Texture },
    nightTexture: { value: makeDefaultTexture() as THREE.Texture },
    specularTexture: { value: makeDefaultTexture() as THREE.Texture },
    sunDirection: { value: sunDirection.clone() },
  })

  useEffect(() => {
    const day = new THREE.CanvasTexture(createProceduralEarthTexture())
    const night = new THREE.CanvasTexture(createProceduralNightTexture())
    const spec = new THREE.CanvasTexture(createProceduralSpecularTexture())
    uniformsRef.current.dayTexture.value = day
    uniformsRef.current.nightTexture.value = night
    uniformsRef.current.specularTexture.value = spec
    // sunDirection is constant — set once
    uniformsRef.current.sunDirection.value.copy(sunDirection)
  }, [sunDirection])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <shaderMaterial
        uniforms={uniformsRef.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}
