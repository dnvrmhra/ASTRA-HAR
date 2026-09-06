import React from "react";
import { Radio } from "lucide-react";
import { useMission } from "../../state/MissionStore";

export const DataCentersPanel: React.FC = () => {
  const { state, dispatch } = useMission();
  const { experiment, currentStep, stepStatuses, ai } = state;

  const completed = stepStatuses.filter((s) => s === "complete").length;
  const progressPct = Math.round((completed / experiment.steps.length) * 100);

  const towerPills = [
    { name: "ISTRAC Bangalore", tag: "Primary Downlink Lock", num: 98, dot: "bg-emerald-400" },
    { name: "Sriharikota (SDSC)", tag: "S-Band Optical Telemetry", num: 95, dot: "bg-emerald-400" },
    { name: "Kiruna Ground St.", tag: "Polar Orbit Ingest", num: 91, dot: "bg-emerald-400" },
    { name: "White Sands Cplx", tag: "TDRS-12 Relay Station", num: 88, dot: "bg-emerald-400" },
    { name: "Goldstone DSN", tag: "Deep Space Station 14", num: 82, dot: "bg-emerald-400" },
    { name: "Redu ESA Station", tag: "Payload Data Handling", num: 76, dot: "bg-emerald-400" },
    { name: "Canberra DSN St.", tag: "Hemispheric Backup", num: 69, dot: "bg-emerald-400" },
    { name: "Svalbard Satellite", tag: "Near-Earth Orbit Pass", num: 64, dot: "bg-amber-400" },
    { name: "Gaganyaan MCC", tag: "18 MB/hr Telemetry Stream", num: 58, dot: "bg-emerald-400" },
  ];

  return (
    <div className="cd-panel p-4 h-[390px] flex flex-col justify-between select-none">
      {/* Header Row: EDGE PROCESSING NODES on left, GROUND & RELAY STATIONS on right */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-slate-400 uppercase">
            EDGE INFERENCE NODES
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-slate-400 uppercase">
            DOWNLINK TRACKING NODES
          </span>
        </div>
      </div>

      {/* Center Layout: Left 3 Cards + SVG Bezier Streams + Right Tower List */}
      <div className="flex-1 flex items-stretch gap-2 min-h-0 relative">
        {/* Left Sub-Column (3 stacked cards matching the aerospace theme) */}
        <div className="w-[195px] flex flex-col justify-between py-0.5 z-10 shrink-0">
          {/* Card 1: Columbus Optical Ingest */}
          <div className="cd-card p-2.5 flex flex-col justify-between h-[104px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">EDGE-01</span>
                  <span className="font-semibold text-[11px] text-white tracking-tight">Columbus Ingest</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)]" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-0.5">
                <span>14.2 MB/S • S-BAND</span>
                <span className="text-emerald-400">|||||</span>
              </div>
            </div>

            <div className="my-1 flex items-center justify-between">
              <span className="text-[9px] text-slate-400 font-mono">11 verified vectors</span>
              <div className="w-14 h-1.5 rounded-sm hash-bar" />
            </div>

            <div className="space-y-1 text-[9px] font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">58% Verified</span>
                <div className="w-16 h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full shadow-[0_0_6px_rgba(56,189,248,0.8)]" style={{ width: "58%" }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">22% Buffer</span>
                <div className="w-16 h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: "22%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Edge Neural Pipeline */}
          <div className="cd-card p-2.5 flex flex-col justify-between h-[104px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">NPU-02</span>
                  <span className="font-semibold text-[11px] text-white tracking-tight">Neural Pipeline</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,1)]" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-0.5">
                <span>1080P • CAM-01</span>
                <span className="text-sky-400 font-bold">{ai.aiFps} FPS</span>
              </div>
            </div>

            <div className="my-1 flex items-center justify-between">
              <span className="text-[9px] text-slate-400 font-mono">28 detections</span>
              <div className="w-14 h-1.5 rounded-sm hash-bar-cyan" />
            </div>

            <div className="space-y-1 text-[9px] font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">{ai.objectDetection.toFixed(0)}% Object</span>
                <div className="w-16 h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full shadow-[0_0_6px_rgba(56,189,248,0.8)]" style={{ width: `${ai.objectDetection}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">{ai.poseEstimation.toFixed(0)}% Pose</span>
                <div className="w-16 h-1 rounded-full bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.8)]" style={{ width: `${ai.poseEstimation}%` }} />
              </div>
            </div>
          </div>

          {/* Card 3: ISRO Flight Ops Control */}
          <div className="cd-card p-2.5 flex flex-col justify-between h-[104px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">MCC-03</span>
                  <span className="font-semibold text-[11px] text-white tracking-tight">ISRO Flight Ops</span>
                </div>
                <button
                  onClick={() => dispatch({ type: state.running ? "TOGGLE_PAUSE" : "START_DEMO" })}
                  className="btn-liquid-primary px-2.5 py-0.5 text-[9px] font-mono font-bold"
                >
                  {state.running ? "PAUSE" : "START"}
                </button>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-0.5">
                <span>STAGE: STEP {currentStep + 1}/7</span>
                <span className="text-emerald-400 font-bold">{progressPct}%</span>
              </div>
            </div>

            {/* iOS Liquid Glass Simulation trigger buttons */}
            <div className="grid grid-cols-2 gap-1.5 my-0.5">
              <button
                onClick={() => dispatch({ type: "CORRECT_ACTION" })}
                className="btn-liquid-success py-1 text-[9px] font-mono font-semibold flex items-center justify-center gap-1"
              >
                + Correct Step
              </button>
              <button
                onClick={() => dispatch({ type: "WRONG_SEQUENCE" })}
                className="btn-liquid-danger py-1 text-[9px] font-mono font-semibold flex items-center justify-center gap-1"
              >
                ! Deviation
              </button>
            </div>

            <div className="flex items-center justify-between text-[8.5px] font-mono text-slate-400">
              <span>LATENCY: {ai.inferenceLatencyMs}ms</span>
              <button
                onClick={() => dispatch({ type: "RESET_DEMO" })}
                className="text-slate-400 hover:text-sky-400 underline transition-colors cursor-pointer"
              >
                reset
              </button>
            </div>
          </div>
        </div>

        {/* Center: Curved SVG Bezier Streams connecting left cards to right pills */}
        <div className="flex-1 relative pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 160 340">
            <defs>
              <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="streamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="streamGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Bezier connection paths from Card 1 */}
            <path d="M 0,45 C 70,45 80,18 160,18" fill="none" stroke="url(#streamGrad1)" strokeWidth="1.2" />
            <path d="M 0,55 C 70,55 80,55 160,55" fill="none" stroke="url(#streamGrad1)" strokeWidth="1.5" />
            <path d="M 0,65 C 70,65 80,92 160,92" fill="none" stroke="url(#streamGrad1)" strokeWidth="1" />

            {/* Bezier connection paths from Card 2 */}
            <path d="M 0,150 C 70,150 80,128 160,128" fill="none" stroke="url(#streamGrad2)" strokeWidth="1.4" />
            <path d="M 0,165 C 70,165 80,165 160,165" fill="none" stroke="url(#streamGrad2)" strokeWidth="1.8" />
            <path d="M 0,180 C 70,180 80,202 160,202" fill="none" stroke="url(#streamGrad2)" strokeWidth="1.2" />

            {/* Bezier connection paths from Card 3 */}
            <path d="M 0,270 C 70,270 80,240 160,240" fill="none" stroke="url(#streamGrad3)" strokeWidth="1.2" />
            <path d="M 0,285 C 70,285 80,278 160,278" fill="none" stroke="url(#streamGrad3)" strokeWidth="1.5" />
            <path d="M 0,300 C 70,300 80,315 160,315" fill="none" stroke="url(#streamGrad3)" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Right Sub-Column (9 stacked tower/node pills matching the screenshot) */}
        <div className="w-[170px] flex flex-col justify-between py-0.5 z-10 shrink-0">
          {towerPills.map((t) => (
            <div
              key={t.name}
              className="cd-pill px-2 py-1.5 flex items-center justify-between h-[34px]"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Radio size={11} className="text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-slate-200 truncate leading-none">
                    {t.name}
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 truncate mt-0.5">
                    {t.tag}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                <span className="font-mono text-[9px] font-bold text-slate-300">{t.num}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
