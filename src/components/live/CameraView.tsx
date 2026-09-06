import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMission } from "../../state/MissionStore";
import type { OverlayToggles } from "../../state/MissionStore";
import { Eye, EyeOff, Camera, Box, ZoomIn, ZoomOut } from "lucide-react";
import { Glovebox3DTwin } from "./Glovebox3DTwin";

export type SpectralMode = "RGB" | "THERMAL" | "DEPTH" | "CANNY" | "ATTN";
export type CameraViewMode = "2D_CAM" | "3D_TWIN";

// Precise Bounding Boxes anchored to ISS Columbus Glovebox imagery
const ASTRONAUT_FRAME = { x: 34, y: 12, w: 22, h: 80, id: "CREW-01" };
const CONTAINER_BOX   = { x: 54, y: 28, w: 28, h: 50, id: "GLOVEBOX-01" };
const CENTRIFUGE_BOX  = { x: 65, y: 44, w: 15, h: 27, id: "CENTRIFUGE-02" };
const RED_TUBE_HOME   = { x: 65.5, y: 50, w: 4.0, h: 9.0, id: "SMP-RED" };
const YELLOW_TRAY_HOME= { x: 59.0, y: 56, w: 5.5, h: 9.0, id: "SMP-YEL" };

function boxForStep(stepIndex: number, tag: "RED BOX" | "YELLOW BOX") {
  const home = tag === "RED BOX" ? RED_TUBE_HOME : YELLOW_TRAY_HOME;
  const movedAtStep = tag === "RED BOX" ? 3 : 5;
  if (stepIndex > movedAtStep) {
    return { x: tag === "RED BOX" ? 73 : 75, y: 52, w: home.w, h: home.h, id: home.id };
  }
  return home;
}

function handPosition(stepIndex: number) {
  const positions: Record<number, { x: number; y: number }> = {
    0: { x: 61, y: 54 }, // reaching into glovebox
    1: { x: 66, y: 51 }, // grasping red reagent tube
    2: { x: 66, y: 49 }, // agitating tube
    3: { x: 74, y: 53 }, // depositing into centrifuge rotor
    4: { x: 60, y: 57 }, // grasping yellow specimen
    5: { x: 75, y: 54 }, // depositing into centrifuge
    6: { x: 63, y: 54 }, // cycle complete
  };
  return positions[stepIndex] ?? positions[0];
}

const OverlayToggle: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({
  label, active, onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-2.5 py-1 font-mono text-[9.5px] tracking-wide transition-all cursor-pointer ${
      active
        ? "btn-liquid-primary font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
        : "btn-liquid-glass text-slate-400 hover:text-slate-200"
    }`}
  >
    {active ? <Eye size={10} /> : <EyeOff size={10} />}
    <span>{label}</span>
  </button>
);

const CornerBracketBox: React.FC<{
  box: { x: number; y: number; w: number; h: number; id?: string };
  label: string;
  confidence?: number;
  color: string;
  showConfidence: boolean;
  dashed?: boolean;
}> = ({ box, label, confidence, color, showConfidence, dashed }) => (
  <motion.div
    className="absolute pointer-events-none"
    animate={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
    initial={false}
    transition={{ type: "spring", stiffness: 120, damping: 22 }}
  >
    <div className="relative w-full h-full">
      {/* 4 Precision Corner Ticks */}
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-1.5 border-l-1.5" style={{ borderColor: color, borderStyle: dashed ? "dashed" : "solid" }} />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-1.5 border-r-1.5" style={{ borderColor: color, borderStyle: dashed ? "dashed" : "solid" }} />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-1.5 border-l-1.5" style={{ borderColor: color, borderStyle: dashed ? "dashed" : "solid" }} />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-1.5 border-r-1.5" style={{ borderColor: color, borderStyle: dashed ? "dashed" : "solid" }} />

      {/* Minimalist Micro-Badge */}
      <div
        className="absolute -top-4.5 left-0 font-mono whitespace-nowrap text-[8px] font-semibold px-1 py-0.2 rounded bg-slate-950/90 backdrop-blur-md flex items-center gap-1 border border-white/10 shadow-md"
        style={{ color }}
      >
        <span>{label}</span>
        {showConfidence && confidence !== undefined && (
          <span className="text-white/70 font-normal">{(confidence).toFixed(1)}%</span>
        )}
      </div>
    </div>
  </motion.div>
);

interface CameraViewProps {
  className?: string;
  showControls?: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({ className = "", showControls = true }) => {
  const { state, dispatch } = useMission();
  const { overlays, currentStep, ai, deviation } = state;
  const isDeviated = Boolean(deviation);
  const [viewMode, setViewMode] = useState<CameraViewMode>("2D_CAM");
  const [spectralMode, setSpectralMode] = useState<SpectralMode>("RGB");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const step = state.experiment.steps[currentStep] ?? state.experiment.steps[state.experiment.steps.length - 1];
  const hand = handPosition(currentStep);
  const redBox = boxForStep(currentStep, "RED BOX");
  const yellowBox = boxForStep(currentStep, "YELLOW BOX");
  const toggle = (key: keyof OverlayToggles) => dispatch({ type: "TOGGLE_OVERLAY", key });

  // Spectral filter styles applied directly over the photographic payload image
  const filterStyles: Record<SpectralMode, { filter: string; accent: string }> = {
    RGB: {
      filter: "brightness(98%) contrast(108%) saturate(105%)",
      accent: "#38bdf8",
    },
    THERMAL: {
      filter: "contrast(150%) hue-rotate(180deg) saturate(280%) brightness(105%)",
      accent: "#f43f5e",
    },
    DEPTH: {
      filter: "hue-rotate(90deg) contrast(140%) brightness(85%) saturate(80%)",
      accent: "#10b981",
    },
    CANNY: {
      filter: "grayscale(100%) contrast(300%) brightness(95%) drop-shadow(0 0 2px #38bdf8)",
      accent: "#38bdf8",
    },
    ATTN: {
      filter: "brightness(90%) contrast(115%)",
      accent: "#f59e0b",
    },
  };

  const currentFilter = filterStyles[spectralMode];

  // MediaPipe Hand 21-Landmark Mesh relative offsets
  const handLandmarks = [
    { id: 0, dx: 0, dy: 0 },         // Wrist
    // Thumb
    { id: 1, dx: -0.8, dy: -0.6 },
    { id: 2, dx: -1.4, dy: -1.1 },
    { id: 3, dx: -1.9, dy: -1.7 },
    { id: 4, dx: -2.3, dy: -2.3 },   // Thumb Tip
    // Index
    { id: 5, dx: -0.4, dy: -1.8 },
    { id: 6, dx: -0.6, dy: -2.6 },
    { id: 7, dx: -0.7, dy: -3.3 },
    { id: 8, dx: -0.8, dy: -4.0 },   // Index Tip
    // Middle
    { id: 9, dx: 0.1, dy: -1.9 },
    { id: 10, dx: 0.1, dy: -2.8 },
    { id: 11, dx: 0.1, dy: -3.6 },
    { id: 12, dx: 0.1, dy: -4.3 },   // Middle Tip
    // Ring
    { id: 13, dx: 0.6, dy: -1.8 },
    { id: 14, dx: 0.7, dy: -2.6 },
    { id: 15, dx: 0.8, dy: -3.3 },
    { id: 16, dx: 0.9, dy: -3.9 },   // Ring Tip
    // Pinky
    { id: 17, dx: 1.1, dy: -1.5 },
    { id: 18, dx: 1.3, dy: -2.1 },
    { id: 19, dx: 1.4, dy: -2.7 },
    { id: 20, dx: 1.5, dy: -3.2 },   // Pinky Tip
  ];

  const handBones = [
    [0, 1], [1, 2], [2, 3], [3, 4],          // Thumb ray
    [0, 5], [5, 6], [6, 7], [7, 8],          // Index ray
    [0, 9], [9, 10], [10, 11], [11, 12],     // Middle ray
    [0, 13], [13, 14], [14, 15], [15, 16],   // Ring ray
    [0, 17], [17, 18], [18, 19], [19, 20],   // Pinky ray
    [5, 9], [9, 13], [13, 17],               // Palm knuckle arch
  ];

  // If 3D Digital Twin mode is active
  if (viewMode === "3D_TWIN") {
    return (
      <div className={`relative w-full h-full flex flex-col ${className}`}>
        {/* Mode Switch Bar */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 btn-liquid-glass p-1 shadow-2xl">
          <button
            onClick={() => setViewMode("2D_CAM")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Camera size={11} />
            <span>2D OPTICAL FEED</span>
          </button>
          <button
            onClick={() => setViewMode("3D_TWIN")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono bg-sky-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all cursor-pointer"
          >
            <Box size={11} />
            <span>3D DIGITAL TWIN</span>
          </button>
        </div>

        <Glovebox3DTwin />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none rounded-2xl flex flex-col justify-between p-3 border border-white/[0.12] shadow-2xl bg-black ${className}`}
    >
      {/* 1. Photorealistic ISS Payload Camera Feed Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500 overflow-hidden"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
        }}
      >
        {/* Real Photographic Astronaut Payload Feed */}
        <img
          src="/images/payload_feed.jpg"
          alt="ISS Columbus Module Payload Camera Feed"
          className="w-full h-full object-cover transition-all duration-500"
          style={{ filter: currentFilter.filter }}
        />

        {/* Subtle Optical Sensor Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.22)_50%)] bg-[length:100%_4px] opacity-30" />

        {/* Optical Lens Vignetting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.65)_100%)]" />

        {/* Grad-CAM Neural Attention Heatmap Overlay (when ATTN mode is active) */}
        {spectralMode === "ATTN" && (
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-80 transition-opacity duration-300">
            <div
              className="w-full h-full animate-pulse"
              style={{
                background: `radial-gradient(circle at ${hand.x}% ${hand.y}%, rgba(244,63,94,0.7) 0%, rgba(251,191,36,0.5) 18%, rgba(56,189,248,0.3) 36%, rgba(99,102,241,0.1) 55%, transparent 75%)`,
              }}
            />
          </div>
        )}

        {/* 2. MediaPipe 21-Point Hand Landmark Mesh (situated directly over glovebox manipulation) */}
        {overlays.hands && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          >
            {/* Hand Landmark Bones (Connecting Rays) */}
            {handBones.map(([startIdx, endIdx], i) => {
              const p1 = handLandmarks[startIdx];
              const p2 = handLandmarks[endIdx];
              return (
                <line
                  key={i}
                  x1={hand.x + p1.dx}
                  y1={hand.y + p1.dy}
                  x2={hand.x + p2.dx}
                  y2={hand.y + p2.dy}
                  stroke="#38bdf8"
                  strokeWidth="0.45"
                  strokeOpacity="0.85"
                  filter="drop-shadow(0 0 2px rgba(56,189,248,0.8))"
                />
              );
            })}

            {/* Hand Landmark Micro-Joints (21 Points) */}
            {handLandmarks.map((lm) => (
              <g key={lm.id}>
                <circle
                  cx={hand.x + lm.dx}
                  cy={hand.y + lm.dy}
                  r="0.45"
                  fill="#38bdf8"
                />
                <circle
                  cx={hand.x + lm.dx}
                  cy={hand.y + lm.dy}
                  r="0.9"
                  stroke="#34d399"
                  strokeWidth="0.2"
                  fill="none"
                  opacity="0.8"
                />
              </g>
            ))}

            {/* Hand-Object Interaction (HOI) Proximity Vector Ray */}
            <line
              x1={hand.x}
              y1={hand.y}
              x2={currentStep >= 3 ? CENTRIFUGE_BOX.x + 7 : redBox.x + 2}
              y2={currentStep >= 3 ? CENTRIFUGE_BOX.y + 10 : redBox.y + 4}
              stroke="#fbbf24"
              strokeWidth="0.5"
              strokeDasharray="1.2 1.2"
              filter="drop-shadow(0 0 3px rgba(251,191,36,0.9))"
            />
          </svg>
        )}

        {/* Operator Pose Spatial Frame (Clean Ergonomic Capsule - NO Stick Figure!) */}
        {overlays.pose && (
          <div
            className="absolute pointer-events-none border border-emerald-400/40 rounded-xl bg-emerald-500/[0.03]"
            style={{
              left: `${ASTRONAUT_FRAME.x}%`,
              top: `${ASTRONAUT_FRAME.y}%`,
              width: `${ASTRONAUT_FRAME.w}%`,
              height: `${ASTRONAUT_FRAME.h}%`,
            }}
          >
            {/* Corner brackets */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

            {/* Subtle Upper-Body Landmark Crosshair Micro-Dots */}
            <div className="absolute top-[28%] left-[30%] w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-60" />
            <div className="absolute top-[28%] left-[70%] w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-60" />

            {/* Operator Telemetry Card */}
            <div className="absolute -top-5 left-0 font-mono whitespace-nowrap text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/90 backdrop-blur-md flex items-center gap-1 text-emerald-400 border border-emerald-500/30 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>CREW-01: OPERATOR</span>
              <span className="text-white/40">|</span>
              <span className="text-slate-300 font-normal">ERGO: 96%</span>
            </div>
          </div>
        )}

        {/* 3. YOLOv8 Precision Spatial Bounding Boxes */}
        {overlays.objects && (
          <>
            <CornerBracketBox
              box={CONTAINER_BOX}
              label="GLOVEBOX-01"
              confidence={ai.objectDetection}
              color="#38bdf8"
              showConfidence={overlays.confidence}
            />
            <CornerBracketBox
              box={CENTRIFUGE_BOX}
              label="CENTRIFUGE-02"
              confidence={ai.objectDetection - 1.2}
              color="#10b981"
              showConfidence={overlays.confidence}
              dashed
            />
            <CornerBracketBox
              box={redBox}
              label="SMP-RED"
              confidence={ai.objectDetection + 0.8}
              color="#f87171"
              showConfidence={overlays.confidence}
            />
            <CornerBracketBox
              box={yellowBox}
              label="SMP-YEL"
              confidence={ai.objectDetection - 0.4}
              color="#fbbf24"
              showConfidence={overlays.confidence}
            />
          </>
        )}

        {/* Hand Interaction Status Callout */}
        {overlays.hands && (
          <motion.div
            className="absolute pointer-events-none z-20"
            animate={{ left: `${hand.x}%`, top: `${hand.y}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="absolute top-2 left-2 font-mono whitespace-nowrap text-[8px] px-2 py-0.5 rounded bg-black/90 backdrop-blur-md text-amber-300 font-bold border border-amber-400/40 shadow-xl flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>{step.interaction}</span>
              <span className="text-white/40">•</span>
              <span className="text-slate-300">{step.requiredObject}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 4. Optical Safe-Area Framing Ticks in 4 Corners */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/25 pointer-events-none" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/25 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/25 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/25 pointer-events-none" />

      {/* 5. Top Optical HUD Telemetry Status Bar */}
      <div className="relative z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Dual Mode Switcher: 2D Feed vs 3D Twin */}
          <div className="flex items-center gap-1 btn-liquid-glass p-0.5 rounded-full">
            <button
              onClick={() => setViewMode("2D_CAM")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono bg-sky-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all cursor-pointer"
            >
              <Camera size={10} />
              <span>OPTICAL FEED</span>
            </button>
            <button
              onClick={() => setViewMode("3D_TWIN")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <Box size={10} />
              <span>3D DIGITAL TWIN</span>
            </button>
          </div>

          {/* Camera Telemetry Specs */}
          <div className="hidden sm:flex items-center gap-2 btn-liquid-glass px-2.5 py-1 text-[9px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] animate-pulse" />
            <span className="font-bold text-white">CAM-01</span>
            <span className="text-white/30">|</span>
            <span className="text-sky-400">1080P/30FPS</span>
            <span className="text-white/30">|</span>
            <span className="text-emerald-400">NPU: {ai.inferenceLatencyMs}ms</span>
          </div>

          {/* Spectral Channel Mode Selector */}
          <div className="hidden md:flex items-center gap-1 btn-liquid-glass p-0.5 rounded-full">
            {(["RGB", "THERMAL", "DEPTH", "CANNY", "ATTN"] as SpectralMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSpectralMode(mode)}
                className={`px-2 py-0.5 rounded-full text-[8.5px] font-mono transition-all cursor-pointer ${
                  spectralMode === mode
                    ? "bg-sky-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {mode === "ATTN" ? "★ ATTN" : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Right Optical Specs & Live Recording Tag */}
        <div className="flex items-center gap-2">
          {/* Live Activity Recognition State Pill */}
          <div className="hidden lg:flex items-center gap-2 btn-liquid-glass px-2.5 py-1 text-[8.5px] font-mono">
            <span className="text-slate-400">HAR:</span>
            {isDeviated ? (
              <span className="text-rose-400 font-bold animate-pulse">DEVIATION DETECTED</span>
            ) : (
              <span className="text-emerald-400 font-bold">{step.action}</span>
            )}
            <span className="text-white/30">|</span>
            <span className="text-sky-400 font-mono">{ai.activityRecognition.toFixed(1)}%</span>
          </div>

          <div className="btn-liquid-danger px-2.5 py-1 text-[9px] font-mono font-bold flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>REC</span>
          </div>
        </div>
      </div>

      {/* 6. Bottom Floating Control Bar */}
      {showControls && (
        <div className="relative z-20 flex items-center justify-between mt-auto pt-2">
          {/* CV Layer Toggles */}
          <div className="flex items-center gap-1.5 btn-liquid-glass p-1">
            <OverlayToggle label="OPERATOR" active={overlays.pose} onClick={() => toggle("pose")} />
            <OverlayToggle label="OBJECTS" active={overlays.objects} onClick={() => toggle("objects")} />
            <OverlayToggle label="HAND MESH" active={overlays.hands} onClick={() => toggle("hands")} />
            <OverlayToggle label="CONF" active={overlays.confidence} onClick={() => toggle("confidence")} />
          </div>

          {/* Center Zoom Controls */}
          <div className="hidden lg:flex items-center gap-1 btn-liquid-glass p-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
              className="p-1 hover:text-sky-400 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={12} />
            </button>
            <span className="text-[9px] font-mono text-slate-300 w-8 text-center">{zoomLevel.toFixed(2)}x</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1 hover:text-sky-400 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={12} />
            </button>
          </div>

          {/* Focal Length & Optical Metadata */}
          <div className="btn-liquid-glass px-3 py-1 text-[8.5px] font-mono text-slate-300 flex items-center gap-2">
            <span>28mm f/2.0</span>
            <span className="text-white/20">|</span>
            <span className="text-sky-400">1/250s ISO 400</span>
          </div>
        </div>
      )}
    </div>
  );
};
