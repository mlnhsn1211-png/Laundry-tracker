import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Rotate3d,
  Play,
  Pause,
  Sparkles,
  Droplets,
  Wind,
  Flame,
  Gauge,
  Layers,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useLaundry } from '../context/LaundryContext';
import { OrderStatus } from '../types';

type CycleMode = 'WASH' | 'SPIN' | 'STEAM' | 'IDLE';

interface CycleConfig {
  name: string;
  rpm: number;
  temp: string;
  color: string;
  accentHex: number;
  waterLevel: number;
  bubbleCount: number;
  icon: typeof Droplets;
  description: string;
}

const CYCLE_CONFIGS: Record<CycleMode, CycleConfig> = {
  WASH: {
    name: 'Eco Active Wash',
    rpm: 450,
    temp: '40°C',
    color: 'text-cyan-400',
    accentHex: 0x06b6d4,
    waterLevel: 0.8,
    bubbleCount: 160,
    icon: Droplets,
    description: 'Sloshing micro-bubbles with deep fiber enzyme penetration',
  },
  SPIN: {
    name: 'Turbo Spin Extraction',
    rpm: 1200,
    temp: '32°C',
    color: 'text-blue-400',
    accentHex: 0x3b82f6,
    waterLevel: 0.1,
    bubbleCount: 40,
    icon: Wind,
    description: 'Centrifugal high-speed moisture extraction for rapid dry',
  },
  STEAM: {
    name: 'Thermal Steam Sanitizer',
    rpm: 180,
    temp: '65°C',
    color: 'text-amber-400',
    accentHex: 0xf59e0b,
    waterLevel: 0.25,
    bubbleCount: 80,
    icon: Flame,
    description: 'Hot vapor thermal smoothing eliminating 99.9% bacteria',
  },
  IDLE: {
    name: 'Ready / Standby',
    rpm: 0,
    temp: '24°C',
    color: 'text-emerald-400',
    accentHex: 0x10b981,
    waterLevel: 0.0,
    bubbleCount: 0,
    icon: CheckCircle2,
    description: 'Cycle completed. Garments aerated, folded, and bagged',
  },
};

export const Interactive3DLaundry: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentOrder } = useLaundry();

  const [activeCycle, setActiveCycle] = useState<CycleMode>('WASH');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [syncedWithOrder, setSyncedWithOrder] = useState<boolean>(true);
  const [drumRpm, setDrumRpm] = useState<number>(450);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const drumGroupRef = useRef<THREE.Group | null>(null);
  const bubblesMeshRef = useRef<THREE.Points | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const clothesGroupRef = useRef<THREE.Group | null>(null);
  const glowLightRef = useRef<THREE.PointLight | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Sync with current order status if user desires
  useEffect(() => {
    if (!syncedWithOrder || !currentOrder) return;
    const status = currentOrder.status;
    if (status === 'RECEIVED') {
      setActiveCycle('IDLE');
    } else if (status === 'WASHING') {
      setActiveCycle('WASH');
    } else if (status === 'DRYING') {
      setActiveCycle('SPIN');
    } else if (status === 'IRONING') {
      setActiveCycle('STEAM');
    } else if (status === 'READY' || status === 'PICKED_UP') {
      setActiveCycle('IDLE');
    }
  }, [currentOrder?.status, syncedWithOrder]);

  // Update RPM display smoothly
  useEffect(() => {
    const target = isPlaying ? CYCLE_CONFIGS[activeCycle].rpm : 0;
    setDrumRpm(target);
  }, [activeCycle, isPlaying]);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0b1120); // Deep rich navy

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 5.2);
    camera.lookAt(0, 0, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dirLight2.position.set(-4, -2, 3);
    scene.add(dirLight2);

    const drumGlow = new THREE.PointLight(0x06b6d4, 2.5, 6);
    drumGlow.position.set(0, 0, 0.5);
    glowLightRef.current = drumGlow;
    scene.add(drumGlow);

    // ROOT MACHINE GROUP
    const machineGroup = new THREE.Group();
    scene.add(machineGroup);

    // 1. WASHER HOUSING / CABINET
    const cabinetGeo = new THREE.BoxGeometry(3.0, 3.4, 2.4);
    const cabinetMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    cabinet.position.z = -0.5;
    machineGroup.add(cabinet);

    // Top control panel
    const panelGeo = new THREE.BoxGeometry(2.9, 0.55, 0.08);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2,
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 1.3, 0.72);
    machineGroup.add(panel);

    // Control Dial Knob
    const knobGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 32);
    knobGeo.rotateX(Math.PI / 2);
    const knobMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.95,
      roughness: 0.1,
    });
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.position.set(0.9, 1.3, 0.76);
    machineGroup.add(knob);

    // LED Bar on panel
    const ledGeo = new THREE.PlaneGeometry(1.2, 0.16);
    const ledMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-0.5, 1.3, 0.77);
    machineGroup.add(led);

    // 2. OUTER DOOR CHROME BEZEL
    const doorRingGeo = new THREE.TorusGeometry(1.22, 0.12, 24, 64);
    const doorRingMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.15,
    });
    const doorRing = new THREE.Mesh(doorRingGeo, doorRingMat);
    doorRing.position.set(0, -0.1, 0.72);
    machineGroup.add(doorRing);

    // Front Glass Door (Translucent concave effect)
    const glassGeo = new THREE.SphereGeometry(1.2, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      transmission: 0.88,
      opacity: 0.45,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1,
      ior: 1.5,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.rotation.x = Math.PI / 2;
    glass.position.set(0, -0.1, 0.65);
    glass.scale.set(1, 0.35, 1);
    machineGroup.add(glass);

    // 3. INNER DRUM (The spinning component)
    const drumGroup = new THREE.Group();
    drumGroup.position.set(0, -0.1, -0.1);
    machineGroup.add(drumGroup);
    drumGroupRef.current = drumGroup;

    // Drum cylinder with metallic perforated appearance
    const drumCylinderGeo = new THREE.CylinderGeometry(1.15, 1.15, 1.6, 48, 1, true);
    drumCylinderGeo.rotateX(Math.PI / 2);
    const drumMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });
    const drumCylinder = new THREE.Mesh(drumCylinderGeo, drumMat);
    drumGroup.add(drumCylinder);

    // Back plate of the drum
    const backPlateGeo = new THREE.CircleGeometry(1.15, 48);
    const backPlateMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.9,
      roughness: 0.3,
    });
    const backPlate = new THREE.Mesh(backPlateGeo, backPlateMat);
    backPlate.position.z = -0.8;
    drumGroup.add(backPlate);

    // Lifter paddles inside drum (3 paddles at 120 degrees)
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3;
      const paddleGeo = new THREE.BoxGeometry(0.12, 0.28, 1.4);
      const paddleMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.7,
        roughness: 0.3,
      });
      const paddle = new THREE.Mesh(paddleGeo, paddleMat);
      paddle.position.x = Math.sin(angle) * 1.0;
      paddle.position.y = Math.cos(angle) * 1.0;
      paddle.position.z = 0;
      paddle.rotation.z = -angle;
      drumGroup.add(paddle);
    }

    // 4. TUMBLING CLOTHES INSIDE DRUM
    const clothesGroup = new THREE.Group();
    drumGroup.add(clothesGroup);
    clothesGroupRef.current = clothesGroup;

    const clothColors = [0x38bdf8, 0xf43f5e, 0x10b981, 0xfbbf24, 0xffffff, 0x818cf8];
    const clothGeometries = [
      new THREE.DodecahedronGeometry(0.28, 1),
      new THREE.TorusGeometry(0.22, 0.1, 12, 24),
      new THREE.SphereGeometry(0.25, 12, 12),
      new THREE.CylinderGeometry(0.15, 0.2, 0.3, 16),
    ];

    for (let i = 0; i < 8; i++) {
      const clothMat = new THREE.MeshStandardMaterial({
        color: clothColors[i % clothColors.length],
        roughness: 0.8,
        metalness: 0.05,
      });
      const clothMesh = new THREE.Mesh(clothGeometries[i % clothGeometries.length], clothMat);
      clothMesh.position.set(
        (Math.random() - 0.5) * 1.1,
        (Math.random() - 0.5) * 1.1,
        (Math.random() - 0.5) * 0.9
      );
      clothMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      clothMesh.userData = {
        baseRadius: 0.45 + Math.random() * 0.4,
        speedOffset: 0.8 + Math.random() * 0.4,
        angleOffset: Math.random() * Math.PI * 2,
      };
      clothesGroup.add(clothMesh);
    }

    // 5. SLOSHING WATER / LIQUID
    const waterGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.6, 32);
    waterGeo.rotateX(Math.PI / 2);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(0, -0.4, 0);
    drumGroup.add(water);
    waterMeshRef.current = water;

    // 6. FOAM & BUBBLES PARTICLE SYSTEM
    const bubbleCount = 200;
    const bubblePositions = new Float32Array(bubbleCount * 3);
    const bubbleScales = new Float32Array(bubbleCount);

    for (let i = 0; i < bubbleCount; i++) {
      const i3 = i * 3;
      const r = Math.random() * 0.85;
      const theta = Math.random() * Math.PI * 2;
      bubblePositions[i3] = Math.cos(theta) * r;
      bubblePositions[i3 + 1] = Math.sin(theta) * r - 0.2;
      bubblePositions[i3 + 2] = (Math.random() - 0.5) * 1.2;
      bubbleScales[i] = Math.random() * 0.08 + 0.02;
    }

    const bubbleGeo = new THREE.BufferGeometry();
    bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));

    const bubbleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    drumGroup.add(bubbles);
    bubblesMeshRef.current = bubbles;

    // MOUSE INTERACTION & DRAG CONTROLS
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotY += deltaX * 0.008;
      targetRotX = Math.max(-0.4, Math.min(0.4, targetRotX + deltaY * 0.008));
    };

    const handlePointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // ANIMATION TICK LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth machine rotation interpolation
      if (machineGroup) {
        if (autoRotate && !isDragging) {
          targetRotY = Math.sin(elapsedTime * 0.4) * 0.25;
          targetRotX = Math.sin(elapsedTime * 0.3) * 0.08;
        }
        machineGroup.rotation.y += (targetRotY - machineGroup.rotation.y) * 0.06;
        machineGroup.rotation.x += (targetRotX - machineGroup.rotation.x) * 0.06;
      }

      // Drum Spin Mechanics
      if (drumGroupRef.current && isPlaying) {
        let speedMultiplier = 1.0;
        if (activeCycle === 'SPIN') speedMultiplier = 4.2;
        else if (activeCycle === 'WASH') speedMultiplier = 1.5;
        else if (activeCycle === 'STEAM') speedMultiplier = 0.8;
        else if (activeCycle === 'IDLE') speedMultiplier = 0.05;

        // Alternate wash tumbling direction periodically
        const dir = activeCycle === 'WASH' ? Math.sign(Math.sin(elapsedTime * 0.7)) : 1;
        drumGroupRef.current.rotation.z += delta * 3.5 * speedMultiplier * dir;

        // Animate clothes tumbling with gravity simulation
        if (clothesGroupRef.current) {
          clothesGroupRef.current.children.forEach((child, index) => {
            const data = child.userData;
            const t = elapsedTime * speedMultiplier * 1.8 + data.angleOffset;
            child.position.x = Math.sin(t) * data.baseRadius;
            child.position.y = Math.cos(t) * data.baseRadius - 0.2;
            child.rotation.x += 0.04 * speedMultiplier;
            child.rotation.y += 0.03 * speedMultiplier;
          });
        }

        // Sloshing water surface
        if (waterMeshRef.current) {
          const cfg = CYCLE_CONFIGS[activeCycle];
          waterMeshRef.current.visible = cfg.waterLevel > 0.05;
          waterMeshRef.current.scale.set(1, 0.4 + Math.sin(elapsedTime * 5) * 0.08, 1);
          waterMeshRef.current.position.y = -0.55 + cfg.waterLevel * 0.3;
        }

        // Bubbles movement
        if (bubblesMeshRef.current) {
          const cfg = CYCLE_CONFIGS[activeCycle];
          bubblesMeshRef.current.visible = cfg.bubbleCount > 0;
          const pos = bubblesMeshRef.current.geometry.attributes.position;
          const arr = pos.array as Float32Array;
          for (let i = 0; i < arr.length; i += 3) {
            arr[i + 1] += 0.005; // Float upwards
            if (arr[i + 1] > 0.7) arr[i + 1] = -0.7; // Wrap
          }
          pos.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
    };
  }, [activeCycle, isPlaying, autoRotate]);

  // Handle cycle change
  const handleCycleSelect = (cycle: CycleMode) => {
    setActiveCycle(cycle);
    setSyncedWithOrder(false);
    setIsPlaying(true);

    if (glowLightRef.current) {
      glowLightRef.current.color.setHex(CYCLE_CONFIGS[cycle].accentHex);
    }
  };

  const currentCfg = CYCLE_CONFIGS[activeCycle];
  const IconComponent = currentCfg.icon;

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="uppercase tracking-wider font-mono">3D Interactive Laundry Engine</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-normal">WebGL Real-Time Drum Simulator</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Interactive 3D Care Chamber
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Drag to rotate the 3D unit. Switch between wash cycles, spin extraction, and sanitizing steam to see fiber treatment in motion.
          </p>
        </div>

        {/* Live Status Telemetry Pill */}
        <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Live Drum Telemetry</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{currentCfg.name}</span>
              <span className="text-xs font-mono font-medium text-cyan-300">({drumRpm} RPM)</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Temp: <strong className="text-slate-200">{currentCfg.temp}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Sensors: <strong className="text-emerald-400">Optimal</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas Canvas & Overlay Controls */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
          title="Click and drag to rotate the 3D washing machine"
        />

        {/* 3D Interaction Badge */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-300 flex items-center gap-2 shadow-lg">
            <Rotate3d className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Drag to rotate 3D angle</span>
          </div>
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              autoRotate
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle camera auto-rotation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">Auto Orbit</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            title={isPlaying ? 'Pause Drum' : 'Resume Drum'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Run'}</span>
          </button>
        </div>

        {/* Bottom Stage Details Banner */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700 ${currentCfg.color}`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{currentCfg.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {currentCfg.temp}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{currentCfg.description}</div>
            </div>
          </div>

          {currentOrder && (
            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
              <button
                type="button"
                onClick={() => setSyncedWithOrder(!syncedWithOrder)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  syncedWithOrder
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {syncedWithOrder ? '✓ Synced with Order #' + currentOrder.orderNumber : 'Sync with My Order'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Cycle Selector Strip */}
      <div className="p-4 sm:p-5 bg-slate-950/70 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['WASH', 'SPIN', 'STEAM', 'IDLE'] as CycleMode[]).map((mode) => {
          const cfg = CYCLE_CONFIGS[mode];
          const Icon = cfg.icon;
          const isActive = activeCycle === mode;

          return (
            <button
              key={mode}
              type="button"
              onClick={() => handleCycleSelect(mode)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="text-[10px] font-mono text-slate-500">{cfg.rpm} RPM</span>
              </div>
              <div className="font-display font-semibold text-xs text-white">{cfg.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{cfg.temp} · Fiber Safe</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
