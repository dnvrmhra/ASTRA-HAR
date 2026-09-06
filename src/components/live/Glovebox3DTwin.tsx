import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useMission } from "../../state/MissionStore";
import { RotateCcw, Crosshair, Box } from "lucide-react";

export const Glovebox3DTwin: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { state } = useMission();
  const { currentStep, orientation, deviation } = state;
  const isDeviated = Boolean(deviation);
  const currentStepRef = useRef(currentStep);
  const resetCamRef = useRef<() => void>(() => {});

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    const defaultPos = new THREE.Vector3(2.4, 1.8, 2.6);
    const defaultTarget = new THREE.Vector3(0.05, 0.35, 0);
    camera.position.copy(defaultPos);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.copy(defaultTarget);
    controls.minDistance = 1.2;
    controls.maxDistance = 5.0;
    controls.maxPolarAngle = Math.PI / 2.05;

    resetCamRef.current = () => {
      camera.position.copy(defaultPos);
      controls.target.copy(defaultTarget);
      controls.update();
    };

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    // Main Overhead Laboratory Light
    const topLight = new THREE.DirectionalLight(0xe0f2fe, 2.4);
    topLight.position.set(1.5, 3.5, 2.0);
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 1024;
    topLight.shadow.mapSize.height = 1024;
    scene.add(topLight);

    // Interior Glovebox Cyan Glow
    const gloveboxInteriorLight = new THREE.PointLight(0x38bdf8, 2.0, 3.5);
    gloveboxInteriorLight.position.set(0, 0.6, 0);
    scene.add(gloveboxInteriorLight);

    // Centrifuge Emerald Status Light
    const centrifugeLight = new THREE.PointLight(0x10b981, 1.5, 2.0);
    centrifugeLight.position.set(0.65, 0.45, 0);
    scene.add(centrifugeLight);

    // 3. Materials
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.4,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.45,
    });

    const accentCyanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    const accentGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.5,
      roughness: 0.3,
    });

    const redSampleMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0x9f1239,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    const yellowSampleMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xb45309,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    // 4. Geometry Construction: ISS Columbus MSG Glovebox
    const gloveboxGroup = new THREE.Group();
    scene.add(gloveboxGroup);

    // A. Base Chassis Table
    const tableGeo = new THREE.BoxGeometry(2.1, 0.12, 1.3);
    const tableMesh = new THREE.Mesh(tableGeo, metalMat);
    tableMesh.position.set(0, 0, 0);
    tableMesh.receiveShadow = true;
    gloveboxGroup.add(tableMesh);

    // Table Rim Accents
    const tableRimGeo = new THREE.BoxGeometry(2.12, 0.02, 1.32);
    const tableRimMesh = new THREE.Mesh(tableRimGeo, accentCyanMat);
    tableRimMesh.position.set(0, 0.06, 0);
    gloveboxGroup.add(tableRimMesh);

    // B. Glovebox Acrylic Chamber (Chamber Cover)
    const chamberGeo = new THREE.BoxGeometry(1.8, 0.9, 1.0);
    const chamberMesh = new THREE.Mesh(chamberGeo, glassMat);
    chamberMesh.position.set(0, 0.51, 0);
    gloveboxGroup.add(chamberMesh);

    // Chamber Corner Frame Brackets (Aluminum Extrusion Edges)
    const chamberEdges = new THREE.EdgesGeometry(chamberGeo);
    const chamberWireframe = new THREE.LineSegments(
      chamberEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2, transparent: true, opacity: 0.65 })
    );
    chamberWireframe.position.copy(chamberMesh.position);
    gloveboxGroup.add(chamberWireframe);

    // C. Dual Glove Ports (Front Wall Rings)
    const portGeo = new THREE.TorusGeometry(0.12, 0.02, 16, 32);
    const portL = new THREE.Mesh(portGeo, darkTrimMat);
    portL.position.set(-0.35, 0.45, 0.51);
    gloveboxGroup.add(portL);

    const portR = new THREE.Mesh(portGeo, darkTrimMat);
    portR.position.set(0.35, 0.45, 0.51);
    gloveboxGroup.add(portR);

    // D. Centrifuge Unit (Right Side of Chamber)
    const centrifugeGroup = new THREE.Group();
    centrifugeGroup.position.set(0.55, 0.12, 0.05);

    // Base Cylinder
    const cfBaseGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.18, 32);
    const cfBaseMesh = new THREE.Mesh(cfBaseGeo, metalMat);
    cfBaseMesh.position.y = 0.09;
    centrifugeGroup.add(cfBaseMesh);

    // Centrifuge Interior Rotor Cavity
    const cfRotorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24);
    const cfRotorMesh = new THREE.Mesh(cfRotorGeo, accentGoldMat);
    cfRotorMesh.position.y = 0.18;
    centrifugeGroup.add(cfRotorMesh);

    // Rotor Tube Slots (4 slots)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const slotGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.05, 16);
      const slotMesh = new THREE.Mesh(slotGeo, darkTrimMat);
      slotMesh.position.set(Math.cos(angle) * 0.12, 0.185, Math.sin(angle) * 0.12);
      cfRotorMesh.add(slotMesh);
    }
    gloveboxGroup.add(centrifugeGroup);

    // E. Reagent Vial Rack (Left Side of Chamber)
    const rackGeo = new THREE.BoxGeometry(0.32, 0.06, 0.22);
    const rackMesh = new THREE.Mesh(rackGeo, darkTrimMat);
    rackMesh.position.set(-0.52, 0.09, 0.1);
    gloveboxGroup.add(rackMesh);

    // Red Reagent Tube
    const redTubeGroup = new THREE.Group();
    redTubeGroup.position.set(-0.56, 0.17, 0.1);
    const tubeGlassGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.12, 16);
    const redTubeMesh = new THREE.Mesh(tubeGlassGeo, redSampleMat);
    redTubeGroup.add(redTubeMesh);
    gloveboxGroup.add(redTubeGroup);

    // Yellow Specimen Box
    const yellowBoxGeo = new THREE.BoxGeometry(0.12, 0.08, 0.1);
    const yellowBoxMesh = new THREE.Mesh(yellowBoxGeo, yellowSampleMat);
    yellowBoxMesh.position.set(-0.44, 0.13, 0.1);
    gloveboxGroup.add(yellowBoxMesh);

    // F. Kinematic 3D Manipulator (Robotic/Gloved Hand End-Effector)
    const manipulatorGroup = new THREE.Group();
    manipulatorGroup.position.set(-0.35, 0.45, 0.2);

    // Wrist Hub
    const wristGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.08, 16);
    const wristMesh = new THREE.Mesh(wristGeo, metalMat);
    wristMesh.rotation.x = Math.PI / 2;
    manipulatorGroup.add(wristMesh);

    // Palm Block
    const palmGeo = new THREE.BoxGeometry(0.08, 0.03, 0.09);
    const palmMesh = new THREE.Mesh(palmGeo, darkTrimMat);
    palmMesh.position.set(0, 0, -0.06);
    manipulatorGroup.add(palmMesh);

    // Finger Pincers (Gripper Claws)
    const pincerGeo = new THREE.BoxGeometry(0.015, 0.02, 0.06);
    const pincerL = new THREE.Mesh(pincerGeo, accentCyanMat);
    pincerL.position.set(-0.025, 0, -0.11);
    const pincerR = new THREE.Mesh(pincerGeo, accentCyanMat);
    pincerR.position.set(0.025, 0, -0.11);
    manipulatorGroup.add(pincerL);
    manipulatorGroup.add(pincerR);

    // Held Item Mesh inside Gripper (conditionally visible)
    const heldTubeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.11, 16);
    const heldTubeMesh = new THREE.Mesh(heldTubeGeo, redSampleMat);
    heldTubeMesh.position.set(0, 0, -0.11);
    heldTubeMesh.visible = false;
    manipulatorGroup.add(heldTubeMesh);

    gloveboxGroup.add(manipulatorGroup);

    // G. 3D Laser Interaction Vector (Dynamic Line)
    const interactionLineMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.04,
      gapSize: 0.02,
      linewidth: 2,
    });
    const interactionLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const interactionLine = new THREE.Line(interactionLineGeo, interactionLineMat);
    interactionLine.computeLineDistances();
    gloveboxGroup.add(interactionLine);

    // H. Floor Holographic Space Coordinate Grid
    const gridHelper = new THREE.GridHelper(3.2, 16, 0x0284c7, 0x0f2942);
    gridHelper.position.y = -0.06;
    scene.add(gridHelper);

    // I. 3D Spatial Bounding Helper Boxes
    const targetBoxMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const targetCentrifugeBox = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.45), targetBoxMat);
    targetCentrifugeBox.position.set(0.55, 0.25, 0.05);
    gloveboxGroup.add(targetCentrifugeBox);

    // Target positions per step
    const targetPositions: Record<number, { pos: THREE.Vector3; hold: boolean; pincerWidth: number }> = {
      0: { pos: new THREE.Vector3(-0.35, 0.42, 0.15), hold: false, pincerWidth: 0.035 }, // reaching into chamber
      1: { pos: new THREE.Vector3(-0.56, 0.25, 0.1), hold: true, pincerWidth: 0.02 },    // grasping red tube
      2: { pos: new THREE.Vector3(-0.4, 0.45, 0.0), hold: true, pincerWidth: 0.02 },     // agitating tube
      3: { pos: new THREE.Vector3(0.55, 0.38, 0.05), hold: true, pincerWidth: 0.02 },    // centrifuge deposit
      4: { pos: new THREE.Vector3(-0.44, 0.22, 0.1), hold: true, pincerWidth: 0.025 },   // grasping yellow
      5: { pos: new THREE.Vector3(0.62, 0.38, 0.05), hold: true, pincerWidth: 0.025 },   // centrifuge deposit yellow
      6: { pos: new THREE.Vector3(0.1, 0.45, 0.2), hold: false, pincerWidth: 0.035 },    // resting/complete
    };

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const stepIdx = currentStepRef.current;
      const targetState = targetPositions[stepIdx] ?? targetPositions[0];

      // Smooth Lerp Manipulator Position
      manipulatorGroup.position.lerp(targetState.pos, 0.05);

      // Microgravity Agitation Sine Wave on Step 2
      if (stepIdx === 2) {
        manipulatorGroup.position.y += Math.sin(elapsedTime * 14) * 0.015;
        manipulatorGroup.rotation.z = Math.sin(elapsedTime * 10) * 0.18;
      } else {
        manipulatorGroup.rotation.z = THREE.MathUtils.lerp(manipulatorGroup.rotation.z, 0, 0.1);
      }

      // Smooth Pincer Aperture
      pincerL.position.x = THREE.MathUtils.lerp(pincerL.position.x, -targetState.pincerWidth, 0.1);
      pincerR.position.x = THREE.MathUtils.lerp(pincerR.position.x, targetState.pincerWidth, 0.1);

      // Held item visibility
      heldTubeMesh.visible = targetState.hold;
      if (stepIdx > 1 && stepIdx < 4) {
        redTubeGroup.visible = false;
      } else {
        redTubeGroup.visible = true;
      }

      // Spin Centrifuge Rotor during Step 3 and later
      if (stepIdx >= 3) {
        cfRotorMesh.rotation.y += 0.08;
      } else {
        cfRotorMesh.rotation.y += 0.005;
      }

      // Dynamic Laser Interaction Vector Update
      const linePositions = interactionLineGeo.attributes.position as THREE.BufferAttribute;
      linePositions.setXYZ(0, manipulatorGroup.position.x, manipulatorGroup.position.y, manipulatorGroup.position.z);
      const targetAnchor = stepIdx >= 3 ? centrifugeGroup.position : redTubeGroup.position;
      linePositions.setXYZ(1, targetAnchor.x, targetAnchor.y + 0.15, targetAnchor.z);
      linePositions.needsUpdate = true;
      interactionLine.computeLineDistances();

      // Subtle Microgravity Floating Oscillation of the Glovebox Table
      gloveboxGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.012;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (cr.width > 0 && cr.height > 0) {
          camera.aspect = cr.width / cr.height;
          camera.updateProjectionMatrix();
          renderer.setSize(cr.width, cr.height);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose Geometries & Materials
      [tableGeo, tableRimGeo, chamberGeo, portGeo, cfBaseGeo, cfRotorGeo, rackGeo, tubeGlassGeo, yellowBoxGeo, wristGeo, palmGeo, pincerGeo, heldTubeGeo].forEach((g) => g.dispose());
      [metalMat, darkTrimMat, glassMat, accentCyanMat, accentGoldMat, redSampleMat, yellowSampleMat, targetBoxMat].forEach((m) => m.dispose());
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950/90 border border-white/[0.12] shadow-2xl flex flex-col justify-between">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Telemetry & View Controls */}
      <div className="relative z-10 flex items-center justify-between p-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="btn-liquid-glass px-3 py-1 text-[9.5px] font-mono flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,1)] animate-pulse" />
            <span className="font-bold text-white tracking-wide">3D KINEMATIC DIGITAL TWIN</span>
            <span className="text-white/30">|</span>
            <span className="text-sky-400">COLUMBUS MSG BAY</span>
            <span className="text-white/30">|</span>
            <span className="text-emerald-400">INTERACTIVE 6-DOF</span>
          </div>

          {isDeviated && (
            <div className="btn-liquid-danger px-2.5 py-1 text-[9px] font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <span>⚠ KINEMATIC DEVIATION</span>
            </div>
          )}
        </div>

        {/* Top-Right Spatial View Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => resetCamRef.current()}
            className="btn-liquid-glass px-2.5 py-1 text-[9px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            title="Reset Camera Orientation"
          >
            <RotateCcw size={11} />
            <span>RESET VIEW</span>
          </button>
        </div>
      </div>

      {/* Center Microgravity Attitude HUD Compass */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-10 flex flex-col gap-1.5">
        <div className="btn-liquid-glass p-2 text-[8px] font-mono flex flex-col gap-1 w-28 bg-black/60 backdrop-blur-md border border-white/10">
          <div className="text-sky-400 font-bold tracking-wider border-b border-white/10 pb-0.5">
            SPATIAL VECTORS
          </div>
          <div className="flex justify-between text-slate-300">
            <span>PITCH (X):</span>
            <span className="font-bold font-mono text-white">{orientation.x.toFixed(1)}°</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>YAW (Y):</span>
            <span className="font-bold font-mono text-white">{orientation.y.toFixed(1)}°</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>ROLL (Z):</span>
            <span className="font-bold font-mono text-white">{orientation.z.toFixed(1)}°</span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry & Navigation Tip */}
      <div className="relative z-10 flex items-center justify-between p-3 pointer-events-none mt-auto">
        <div className="btn-liquid-glass px-2.5 py-1 text-[8px] font-mono text-slate-400 flex items-center gap-2 bg-black/70 backdrop-blur-md">
          <Crosshair size={10} className="text-sky-400" />
          <span>DRAG TO ORBIT • SCROLL TO ZOOM • RIGHT-CLICK TO PAN</span>
        </div>

        <div className="btn-liquid-glass px-2.5 py-1 text-[8px] font-mono text-sky-400 flex items-center gap-2 bg-black/70 backdrop-blur-md">
          <Box size={10} />
          <span>KINEMATIC RIG: STEP {currentStep + 1}/7 ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
