"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, RoundedBox } from "@react-three/drei";

// Procedural Siemens S7-1200-style PLC. License-free, looks the part, and the
// status/output LEDs react to the live simulation. Drop a real GLB into
// /public/models and swap in <Gltf/> if you prefer an extracted CAD model.
function PlcModel({ qbits = [], run = true }) {
  const grp = useRef();
  useFrame((state) => {
    if (grp.current) {
      // gentle idle turn so the unit reads as 3D even without interaction
      grp.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.25) * 0.35;
    }
  });

  const gray = "#d4d4d4";
  const darkGray = "#3a3a3a";
  const black = "#141414";

  return (
    <group ref={grp} position={[0, 0, 0]}>
      {/* main housing */}
      <RoundedBox args={[3.2, 2.1, 1.25]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={gray} roughness={0.55} metalness={0.05} />
      </RoundedBox>

      {/* anthracite top band */}
      <mesh position={[0, 0.78, 0.02]}>
        <boxGeometry args={[3.22, 0.5, 1.28]} />
        <meshStandardMaterial color={darkGray} roughness={0.5} />
      </mesh>

      {/* SIEMENS plate */}
      <mesh position={[-0.7, 0.78, 0.65]}>
        <boxGeometry args={[1.2, 0.22, 0.02]} />
        <meshStandardMaterial color={black} />
      </mesh>
      {/* white index notch on the nameplate (model name shown on the 2D panel) */}
      <mesh position={[-0.7, 0.78, 0.67]}>
        <boxGeometry args={[0.9, 0.04, 0.01]} />
        <meshStandardMaterial color="#fafafa" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>

      {/* recessed front door (centre) */}
      <mesh position={[0.55, -0.05, 0.6]}>
        <boxGeometry args={[1.5, 1.2, 0.06]} />
        <meshStandardMaterial color="#e6e6e6" roughness={0.4} />
      </mesh>

      {/* status LED column (RUN/STOP/ERROR/MAINT) */}
      {[
        ["RUN", run, "#27c93f"],
        ["STOP", !run, "#bdbdbd"],
        ["ERROR", false, "#ff5f56"],
        ["MAINT", false, "#ffbd2e"],
      ].map(([label, on, col], i) => (
        <group key={label} position={[-1.25, 0.35 - i * 0.28, 0.64]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
            <meshStandardMaterial
              color={on ? col : "#9a9a9a"}
              emissive={on ? col : "#000000"}
              emissiveIntensity={on ? 1.4 : 0}
            />
          </mesh>
        </group>
      ))}

      {/* terminal blocks top & bottom */}
      {[0.98, -0.98].map((y) =>
        [...Array(12)].map((_, i) => (
          <mesh key={`${y}-${i}`} position={[-1.43 + i * 0.26, y, 0.66]}>
            <boxGeometry args={[0.18, 0.16, 0.06]} />
            <meshStandardMaterial color="#bcbcbc" roughness={0.6} />
          </mesh>
        ))
      )}

      {/* Q-output LED strip (reacts to live sim) */}
      <group position={[0, -0.62, 0.66]}>
        {[...Array(8)].map((_, i) => {
          const on = !!qbits[i];
          return (
            <mesh key={i} position={[-0.9 + i * 0.26, 0, 0]}>
              <boxGeometry args={[0.12, 0.12, 0.05]} />
              <meshStandardMaterial
                color={on ? "#fafafa" : "#7a7a7a"}
                emissive={on ? "#ffffff" : "#000000"}
                emissiveIntensity={on ? 1.6 : 0}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default function PLC3D({ qbits = [], run = true }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [3.4, 1.8, 4.2], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} />
      <Suspense fallback={null}>
        <PlcModel qbits={qbits} run={run} />
        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={0.5}
          scale={9}
          blur={2.4}
          far={4}
          color="#000000"
        />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}
