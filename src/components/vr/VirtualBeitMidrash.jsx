/* eslint-disable react/no-unknown-property */
import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float } from '@react-three/drei';
import { tokens, cx } from '@/components/theme/tokens';
import { Button } from '@/components/ui/button';
import { Loader2, MonitorPlay, Mic, Users, BookOpen } from 'lucide-react';

function Book({ position }) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.2;
    if (hovered) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh
      position={position}
      ref={mesh}
      scale={active ? 1.2 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[0.6, 0.8, 0.1]} />
      <meshStandardMaterial color={hovered ? '#fbbf24' : '#8b5cf6'} />
    </mesh>
  );
}

function Avatar({ position, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function StudyTable({ position }) {
  return (
    <group position={position}>
      {/* Table Top */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Legs */}
      <mesh position={[-1.4, 0.25, 0.9]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[1.4, 0.25, 0.9]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[-1.4, 0.25, -0.9]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[1.4, 0.25, -0.9]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      
      {/* Books */}
      <Book position={[0, 0.8, 0]} />
      <Book position={[-0.8, 0.8, 0.5]} />
      <Book position={[0.8, 0.8, -0.5]} />
    </group>
  );
}

function VideoScreen({ position }) {
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      <mesh>
        <planeGeometry args={[6, 3.5]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <Text 
        position={[0, 0, 0.1]} 
        fontSize={0.2} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
      >
        Live Shiur
      </Text>
    </group>
  );
}

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Grid Helper */}
      <gridHelper args={[50, 50, '#334155', '#334155']} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Furniture */}
      <StudyTable position={[0, 0, 0]} />
      <StudyTable position={[-5, 0, 0]} />
      <StudyTable position={[5, 0, 0]} />
      
      {/* Screen */}
      <VideoScreen position={[0, 3, 8]} />

      {/* Avatars */}
      <Avatar position={[0, 1, 2]} color="#ef4444" />
      <Avatar position={[-5, 1, 2]} color="#3b82f6" />
      <Avatar position={[5, 1, 2]} color="#10b981" />
      
      {/* Floating Text */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text 
          position={[0, 5, -5]} 
          fontSize={1} 
          color="#fcd34d"
          anchorX="center" 
          anchorY="middle"
        >
          Virtual Beit Midrash
        </Text>
      </Float>
    </group>
  );
}

export default function VirtualBeitMidrash() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full relative bg-slate-950">
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className={cx(tokens.glass.card, "p-4 bg-slate-900/80 text-white w-64")}>
          <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Study Hall
          </h2>
          <p className="text-xs text-slate-400 mb-3">
            Join others in real-time study. Click books to open them.
          </p>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            3 Active Students
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-4">
        <Button className="rounded-full h-12 w-12 p-0 bg-slate-800 hover:bg-slate-700">
          <Mic className="w-5 h-5" />
        </Button>
        <Button className="rounded-full h-12 w-12 p-0 bg-slate-800 hover:bg-slate-700">
          <MonitorPlay className="w-5 h-5" />
        </Button>
        <Button className="rounded-full h-12 w-12 p-0 bg-slate-800 hover:bg-slate-700">
          <Users className="w-5 h-5" />
        </Button>
      </div>

      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Room />
          <OrbitControls 
            enablePan={false} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.1}
            maxDistance={20}
            minDistance={5}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Suspense fallback={
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
            <p className="text-white text-sm font-medium">Loading 3D Environment...</p>
          </div>
        }>
          {/* Canvas loads here */}
        </Suspense>
      </div>
    </div>
  );
}
