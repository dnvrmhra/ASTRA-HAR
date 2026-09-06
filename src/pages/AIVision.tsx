import React, { useState } from "react";
import { useMission } from "../state/MissionStore";
import { Camera, Scan, Cpu, GitBranch } from "lucide-react";
import { CameraView } from "../components/live/CameraView";

export const AIVision: React.FC = () => {
  const { state } = useMission();
  const { ai } = state;
  const [selectedBranch, setSelectedBranch] = useState<string>("objects");
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<string>("RED REAGENT TUBE");

  const jointSpecs = (() => {
    switch (selectedEntity) {
      case "RED REAGENT TUBE":
        return {
          elbow: "88.5°",
          wrist: "-14.2°",
          wristSub: "YAW +3.8°",
          pinch: "0.94",
          pinchSub: "GRASPING TUBE",
          torso: "0.98 G",
        };
      case "YELLOW SPECIMEN BOX":
        return {
          elbow: "82.0°",
          wrist: "-10.5°",
          wristSub: "YAW +1.2°",
          pinch: "0.88",
          pinchSub: "GRASPING BOX",
          torso: "0.99 G",
        };
      case "EXPERIMENT CONTAINER":
        return {
          elbow: "95.0°",
          wrist: "+4.5°",
          wristSub: "YAW -2.1°",
          pinch: "0.20",
          pinchSub: "OPEN PALM LATCH",
          torso: "0.97 G",
        };
      case "ASTRONAUT OPERATOR":
        return {
          elbow: "110.0°",
          wrist: "+2.1°",
          wristSub: "YAW 0.0°",
          pinch: "0.98",
          pinchSub: "UPRIGHT POSTURE",
          torso: "1.00 G",
        };
      case "CENTRIFUGE TARGET":
        return {
          elbow: "112.0°",
          wrist: "+18.0°",
          wristSub: "YAW +5.5°",
          pinch: "0.00",
          pinchSub: "DEPOSIT COMPLETE",
          torso: "0.98 G",
        };
      default:
        return {
          elbow: "88.5°",
          wrist: "-14.2°",
          wristSub: "YAW +3.8°",
          pinch: "0.94",
          pinchSub: "NOMINAL",
          torso: "0.98 G",
        };
    }
  })();

  const branches = [
    { id: "camera", label: "CAM-01 Optical Ingest", count: "1080p@30FPS", desc: "H.265 Frame Capture • Zero Jitter", active: selectedBranch === "camera" },
    { id: "objects", label: "Spatial Bounding Lattice", count: "5 Entities", desc: "YOLOv8 Nano Tensor Core • 4.2ms", active: selectedBranch === "objects" },
    { id: "pose", label: "Operator Posture & Ergonomics", count: "Spatial Rig", desc: "Ergonomic Trunk Tilt & Microgravity Stability", active: selectedBranch === "pose" },
    { id: "hands", label: "Hand Articulation", count: "21 Joints", desc: "Pinch & Grip Vector Velocity", active: selectedBranch === "hands" },
    { id: "activity", label: "Temporal HAR Classifier", count: "98.2% Conf", desc: "TCN Sequence Activity Predictor", active: selectedBranch === "activity" },
    { id: "dag", label: "DAG State Engine", count: "7 Steps", desc: "Deterministic Sequence Rule Validator", active: selectedBranch === "dag" },
  ];

  const subNodes = [
    { name: "Container Rack Alpha", val: "98.4%", status: "ok", type: "RACK BAY", coords: "[40, 48, 22, 18]" },
    { name: "Red Reagent Tube", val: "96.2%", status: "ok", type: "ACTIVE TUBE", coords: "[44, 52, 8, 6]" },
    { name: "Yellow Specimen Box", val: "94.8%", status: "ok", type: "SAMPLE TRAY", coords: "[54, 52, 8, 6]" },
    { name: "Target Centrifuge Bed", val: "92.1%", status: "ok", type: "CENTRIFUGE", coords: "[68, 54, 20, 16]" },
    { name: "Grip Pinch Velocity", val: "1.2 m/s", status: "ok", type: "HAND TENSOR", coords: "Aperture: 0.94" },
    { name: "Wrist Pitch Angle", val: "-14.2°", status: "ok", type: "JOINT VECTOR", coords: "Yaw: +3.8°" },
    { name: "Elbow Flexion Vector", val: "88.5°", status: "ok", type: "BONE ANGLE", coords: "Extension: Nominal" },
    { name: "Torso Upright Vector", val: "0.98 G", status: "ok", type: "ATTITUDE", coords: "Tilt: -2.1°" },
  ];

  const activeDetections = [
    { name: "ASTRONAUT OPERATOR", classId: "CLS-01", conf: ai.poseEstimation, box: "[2, 8, 31, 84]", dist: "0.94m", vel: "0.02 m/s" },
    { name: "EXPERIMENT CONTAINER", classId: "CLS-04", conf: ai.objectDetection, box: "[40, 48, 22, 18]", dist: "1.08m", vel: "0.00 m/s" },
    { name: "RED REAGENT TUBE", classId: "CLS-07", conf: ai.objectDetection + 0.8, box: "[44, 52, 8, 6]", dist: "1.02m", vel: "0.14 m/s" },
    { name: "YELLOW SPECIMEN BOX", classId: "CLS-08", conf: ai.objectDetection - 0.4, box: "[54, 52, 8, 6]", dist: "1.11m", vel: "0.00 m/s" },
    { name: "CENTRIFUGE TARGET", classId: "CLS-11", conf: ai.objectDetection - 1.2, box: "[68, 54, 20, 16]", dist: "1.45m", vel: "0.00 m/s" },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 select-none flex flex-col justify-between max-w-[1580px] mx-auto w-full space-y-3.5">
      {/* Top Header Bar */}
      <div className="cd-panel px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,1)]" />
          <div>
            <h1 className="text-[16px] font-bold text-white tracking-tight uppercase font-display">
              Neural Decision DAG & Feature Inspection Studio
            </h1>
            <span className="text-[9.5px] font-mono text-slate-400">
              YOLOV8 TENSOR CORE • MEDIAPIPE HAND LANDMARK MESH & ERGONOMIC POSTURE • ON-DEVICE VALIDATION
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowCamera(!showCamera)}
          className={`px-4 py-1.5 text-[11px] font-mono flex items-center gap-2 transition-all ${
            showCamera
              ? "btn-liquid-primary font-bold shadow-[0_0_15px_rgba(56,189,248,0.5)]"
              : "btn-liquid-glass text-slate-300 hover:text-white"
          }`}
        >
          <Camera size={13} />
          <span>{showCamera ? "VIEW KNOWLEDGE DAG GRAPH" : "INSPECT CAMERA OPTICAL STREAM"}</span>
        </button>
      </div>

      {showCamera ? (
        /* DUAL-PANE NEURAL OPTICAL INSPECTION STUDIO */
        <div className="grid grid-cols-12 gap-3.5 flex-1 min-h-[560px]">
          {/* Left Column: Full-Height Interactive Multi-Spectral Camera Feed */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-3">
            <div className="cd-panel p-2 flex-1 h-[480px]">
              <CameraView />
            </div>

            {/* Sensor Optical Specs Bar */}
            <div className="cd-panel p-3 grid grid-cols-4 gap-2 text-[9.5px] font-mono">
              <div className="cd-card p-2 text-center">
                <span className="text-slate-500 uppercase text-[8px] block">SHUTTER</span>
                <span className="text-sky-400 font-bold">1/500 sec</span>
              </div>
              <div className="cd-card p-2 text-center">
                <span className="text-slate-500 uppercase text-[8px] block">APERTURE</span>
                <span className="text-white font-bold">f/1.8 Aero</span>
              </div>
              <div className="cd-card p-2 text-center">
                <span className="text-slate-500 uppercase text-[8px] block">NPU LATENCY</span>
                <span className="text-emerald-400 font-bold">{ai.inferenceLatencyMs} ms</span>
              </div>
              <div className="cd-card p-2 text-center">
                <span className="text-slate-500 uppercase text-[8px] block">TENSOR FPS</span>
                <span className="text-white font-bold">{ai.aiFps} FPS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Feature Tensor Ledger */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-3.5">
            {/* Card 1: Active Detections Tensor Table */}
            <div className="cd-panel p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Scan size={13} className="text-sky-400" />
                  <span className="text-[11px] font-mono font-bold text-slate-200 uppercase">
                    YOLOv8 Active Tensor Entities
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">5 TRACKED</span>
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[160px] pr-1">
                {activeDetections.map((d) => {
                  const isSelected = selectedEntity === d.name;
                  return (
                    <div
                      key={d.name}
                      onClick={() => setSelectedEntity(d.name)}
                      className={`cd-pill p-2 flex items-center justify-between text-[9.5px] font-mono cursor-pointer transition-all ${
                        isSelected
                          ? "border-sky-400/80 bg-sky-500/25 shadow-[0_0_12px_rgba(56,189,248,0.4)] ring-1 ring-sky-400"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${isSelected ? "bg-sky-400 text-slate-950" : "bg-sky-500/20 text-sky-300"}`}>
                            {d.classId}
                          </span>
                          <span className={`font-semibold truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                            {d.name}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[8px] block mt-0.5">BBOX: {d.box} • VEL: {d.vel}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-emerald-400">{(d.conf).toFixed(1)}%</span>
                        <span className="text-slate-500 text-[8px] block">{d.dist}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: MediaPipe 33-point Skeletal Joint Matrix (Reactive to selected object) */}
            <div className="cd-panel p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <GitBranch size={13} className="text-amber-400" />
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-200 uppercase block leading-none">
                      Skeletal Joint Articulation Angles
                    </span>
                    <span className="text-[8.5px] font-mono text-sky-400">FOCUS: {selectedEntity}</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-sky-400">33 KEYPOINTS</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="cd-card p-2">
                  <span className="text-slate-500 text-[8px] block uppercase">Elbow Flexion</span>
                  <span className="text-white font-bold text-[12px]">{jointSpecs.elbow}</span>
                  <span className="text-emerald-400 text-[8px] block">NOMINAL</span>
                </div>
                <div className="cd-card p-2">
                  <span className="text-slate-500 text-[8px] block uppercase">Wrist Pitch Angle</span>
                  <span className="text-sky-400 font-bold text-[12px]">{jointSpecs.wrist}</span>
                  <span className="text-slate-400 text-[8px] block">{jointSpecs.wristSub}</span>
                </div>
                <div className="cd-card p-2">
                  <span className="text-slate-500 text-[8px] block uppercase">Grip Pinch Aperture</span>
                  <span className="text-amber-400 font-bold text-[12px]">{jointSpecs.pinch}</span>
                  <span className="text-amber-300 text-[8px] block">{jointSpecs.pinchSub}</span>
                </div>
                <div className="cd-card p-2">
                  <span className="text-slate-500 text-[8px] block uppercase">Torso Grav-Vector</span>
                  <span className="text-white font-bold text-[12px]">{jointSpecs.torso}</span>
                  <span className="text-emerald-400 text-[8px] block">HARNESS LOCKED</span>
                </div>
              </div>
            </div>

            {/* Card 3: NPU Latency Breakdown & Switcher */}
            <div className="cd-panel p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Cpu size={13} className="text-emerald-400" />
                  <span className="text-[11px] font-mono font-bold text-slate-200 uppercase">
                    NPU Inference Profiler
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">11.0 ms TOTAL</span>
              </div>

              <div className="space-y-1 text-[9px] font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Sensor Ingestion / BGR Norm</span>
                  <span className="text-sky-400 font-bold">1.8 ms</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400" style={{ width: "16%" }} />
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span>YOLOv8 Spatial Detection Core</span>
                  <span className="text-emerald-400 font-bold">4.2 ms</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: "38%" }} />
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span>MediaPipe Keypoint Joint Pipeline</span>
                  <span className="text-purple-400 font-bold">3.4 ms</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400" style={{ width: "31%" }} />
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span>DAG Deterministic State Check</span>
                  <span className="text-amber-400 font-bold">1.6 ms</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: "15%" }} />
                </div>
              </div>

              <button
                onClick={() => setShowCamera(false)}
                className="w-full mt-3 py-2 btn-liquid-primary font-bold text-[11px] font-mono flex items-center justify-center gap-1.5"
              >
                <span>Return to Knowledge DAG Architecture ↗</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* INTERACTIVE KNOWLEDGE DAG TREE MODE (Image 3 inspired with enriched information) */
        <div className="flex-1 cd-panel p-6 flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[540px] relative overflow-hidden">
          {/* Left: Root Node + Branching SVG Tree */}
          <div className="flex-1 flex items-center h-full relative w-full">
            {/* Root Central Node: Tactical Optical Sensor Reticle */}
            <div className="flex flex-col items-center gap-2 z-10 shrink-0">
              <div className="relative w-28 h-28 rounded-full flex items-center justify-center bg-[#070d18] border border-sky-400/40 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
                {/* Concentric tactical range rings */}
                <div className="absolute inset-2 rounded-full border border-dashed border-sky-400/30" />
                <div className="absolute inset-5 rounded-full border border-sky-400/20" />
                
                {/* Tactical crosshairs */}
                <div className="absolute w-full h-px bg-sky-400/20" />
                <div className="absolute h-full w-px bg-sky-400/20" />

                {/* Central Sensor Core */}
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.4)] flex items-center justify-center text-sky-300 z-10">
                  <Scan size={22} className="text-sky-400" />
                </div>
              </div>
              <div className="text-center">
                <span className="font-mono text-[11px] font-bold text-white block">ASTRA-HAR v0.1</span>
                <span className="text-[8.5px] font-mono text-emerald-400 font-semibold">EDGE ROOT INGEST</span>
              </div>
            </div>

            {/* Connecting SVG Branches from Root to Category Nodes */}
            <div className="w-20 lg:w-28 h-full relative pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 300">
                <path d="M 0,150 C 50,150 50,30 100,30" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5" />
                <path d="M 0,150 C 50,150 50,80 100,80" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="2" />
                <path d="M 0,150 C 50,150 50,135 100,135" fill="none" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="2.5" />
                <path d="M 0,150 C 50,150 50,190 100,190" fill="none" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1.5" />
                <path d="M 0,150 C 50,150 50,240 100,240" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.2" />
                <path d="M 0,150 C 50,150 50,285 100,285" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
              </svg>
            </div>

            {/* Middle Category Pills */}
            <div className="flex flex-col justify-between h-[360px] z-10 shrink-0 w-[190px]">
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranch(b.id)}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between ${
                    b.active
                      ? "bg-amber-500/15 border-2 border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.35)] scale-[1.02]"
                      : "cd-card hover:border-white/20"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[10.5px] font-bold text-white truncate block">{b.label}</span>
                    <span className="text-[8px] font-mono text-slate-400 truncate block">{b.desc}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full shrink-0 ml-1.5 ${b.active ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,1)]" : "bg-slate-600"}`} />
                </button>
              ))}
            </div>

            {/* Fan of Radiant Sub-branches (leaves) */}
            <div className="w-16 lg:w-24 h-full relative pointer-events-none hidden md:block">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 300">
                {[-100, -70, -45, -20, 0, 25, 50, 75, 100].map((yOffset, i) => (
                  <path
                    key={i}
                    d={`M 0,135 C 50,135 50,${135 + yOffset} 100,${135 + yOffset}`}
                    fill="none"
                    stroke="rgba(251, 191, 36, 0.35)"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>

            {/* Sub-node Leaves List */}
            <div className="hidden md:flex flex-col justify-between h-[360px] z-10 w-[200px] shrink-0">
              {subNodes.map((s) => (
                <div key={s.name} className="cd-pill px-2.5 py-1.5 flex items-center justify-between text-[9px] font-mono">
                  <div className="min-w-0">
                    <span className="text-slate-200 font-semibold truncate block">{s.name}</span>
                    <span className="text-slate-500 text-[8px]">{s.type}</span>
                  </div>
                  <span className="text-emerald-400 font-bold shrink-0 ml-1">{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Floating Detail Card */}
          <div className="w-full lg:w-[320px] cd-card p-5 border border-white/15 shadow-2xl flex flex-col justify-between shrink-0 h-[400px]">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-3">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  FEATURE CLUSTER
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>

              <h2 className="text-[16px] font-bold text-white tracking-tight leading-snug font-display">
                Spatial Feature Bounding & Coordinate Lattice
              </h2>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                YOLOv8 bounding boxes combined with MediaPipe 33-point body keypoints feed into the state validator DAG.
              </p>
            </div>

            {/* Sentiment / Confidence Rate Bar */}
            <div className="my-2 p-3 rounded-xl bg-slate-900/60 border border-white/[0.04]">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>CLASSIFICATION MARGIN</span>
                <span className="text-sky-400 font-bold">96.8%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden flex">
                <div className="h-full bg-emerald-400" style={{ width: "70%" }} />
                <div className="h-full bg-sky-400" style={{ width: "20%" }} />
                <div className="h-full bg-amber-400" style={{ width: "10%" }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-slate-900/40">
                <span className="text-[8.5px] text-slate-500 block">DETECTIONS</span>
                <span className="text-white font-bold text-[13px]">5 Targets</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/40">
                <span className="text-[8.5px] text-slate-500 block">LATENCY</span>
                <span className="text-sky-400 font-bold text-[13px]">{ai.inferenceLatencyMs} ms</span>
              </div>
            </div>

            <button
              onClick={() => setShowCamera(true)}
              className="w-full mt-2 py-2 btn-liquid-primary font-bold text-[11.5px] flex items-center justify-center gap-1.5"
            >
              <span>Inspect Camera Optical Stream ↗</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
