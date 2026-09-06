import React, { useState } from "react";
import { ArrowUpRight, Camera, Activity } from "lucide-react";
import { useMission } from "../../state/MissionStore";
import { CameraView } from "./CameraView";

export const ConstellationRightPanel: React.FC = () => {
  const { state, dispatch } = useMission();
  const [viewMode, setViewMode] = useState<"constellation" | "camera">("constellation");
  const [activeMonth, setActiveMonth] = useState<string>("Oct");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const verticalRuler = [19, 18, 17, 16, 15, 14, 13, 12];

  return (
    <div className="cd-panel p-4 h-[630px] flex flex-col justify-between select-none relative overflow-hidden">
      {/* Top Header: Months Timeline + Camera/Constellation Toggle with iOS Liquid Glass */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 z-20">
        {/* Months Bar */}
        <div className="flex items-center gap-3 text-[9px] font-mono">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`transition-colors cursor-pointer px-1.5 py-0.5 rounded ${
                activeMonth === m
                  ? "text-sky-400 bg-sky-500/15 border border-sky-400/30 font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* iOS Liquid Glass View Mode Switcher */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode("constellation")}
            className={`px-3 py-1 text-[10px] font-mono flex items-center gap-1.5 ${
              viewMode === "constellation" ? "btn-liquid-primary font-bold" : "btn-liquid-glass text-slate-400"
            }`}
          >
            <Activity size={11} />
            <span>CONSTELLATION TELEMETRY</span>
          </button>
          <button
            onClick={() => setViewMode("camera")}
            className={`px-3 py-1 text-[10px] font-mono flex items-center gap-1.5 ${
              viewMode === "camera" ? "btn-liquid-primary font-bold" : "btn-liquid-glass text-slate-400"
            }`}
          >
            <Camera size={11} />
            <span>CAM-01 OPTICAL FEED</span>
          </button>
        </div>
      </div>

      {viewMode === "camera" ? (
        /* Camera Feed Overlay Mode */
        <div className="flex-1 min-h-0 pt-2 z-10">
          <CameraView />
        </div>
      ) : (
        /* Constellation Telemetry Light Stream Mode (Exact Replica of Screenshot) */
        <div className="flex-1 flex min-h-0 relative z-10 pt-2">
          {/* Left Vertical Coordinate / Time Ruler (19, 18, 17, ...) */}
          <div className="w-10 flex flex-col justify-between py-6 text-[9.5px] font-mono text-slate-600 border-r border-white/[0.04]">
            {verticalRuler.map((num) => (
              <div key={num} className="flex items-center gap-1.5">
                <span className="w-2 border-b border-slate-700" />
                <span>{num}</span>
              </div>
            ))}
          </div>

          {/* Central Visualization Canvas with Fiber-Optic Light Rays */}
          <div className="flex-1 relative overflow-hidden">
            {/* Top Sparkline Mini Box (as in screenshot) */}
            <div className="absolute top-2 left-6 cd-card p-2 w-[220px] h-[55px] border border-white/[0.07] flex flex-col justify-between z-10">
              <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
                <span>ST-983</span>
                <span>YY-01</span>
                <span>ST-156</span>
                <span>ST-985</span>
              </div>
              <svg className="w-full h-5" viewBox="0 0 200 20">
                <path
                  d="M 0,10 Q 30,2 60,12 T 120,6 T 170,14 T 200,10"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  opacity="0.8"
                />
                <circle cx="55" cy="11" r="2" fill="#ef4444" />
                <circle cx="95" cy="5" r="2" fill="#ef4444" />
                <circle cx="150" cy="13" r="2" fill="#ef4444" />
              </svg>
            </div>

            {/* Floating PROTOCOL COMPLIANCE & STATE AUDIT Tooltip Card */}
            <div
              className={`absolute top-12 left-44 w-[225px] cd-panel p-3 border rounded-xl z-30 transition-all ${
                state.deviation
                  ? "border-rose-500/80 shadow-[0_0_35px_rgba(244,63,94,0.5)] bg-[#12080d]/95"
                  : "border-white/15 shadow-2xl bg-[#0c1322]/90"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-200 uppercase">
                  {state.deviation ? "DEVIATION DETECTED" : "PROTOCOL COMPLIANCE AUDIT"}
                </span>
                <ArrowUpRight size={13} className="text-slate-400" />
              </div>

              <div className="space-y-1 text-[9.5px] font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>DAG Sequence Adherence</span>
                  <span className="text-emerald-400 font-bold">100.0%</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>NPU Latency P95</span>
                  <span className="text-slate-200 font-bold">{state.ai.inferenceLatencyMs} ms</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Downlink Cycle Buffer</span>
                  <span className="text-slate-200">18 MB / hr</span>
                </div>
              </div>

              {state.deviation ? (
                <div className="mt-2 pt-2 border-t border-rose-500/30">
                  <div className="text-[9px] font-mono text-rose-300">
                    <div>Exp: <strong className="text-white">{state.deviation.expected}</strong></div>
                    <div>Det: <strong className="text-rose-400">{state.deviation.detected}</strong></div>
                  </div>
                  <button
                    onClick={() => dispatch({ type: "DISMISS_DEVIATION" })}
                    className="btn-liquid-danger w-full mt-2 py-1.5 font-mono text-[9.5px] font-bold"
                  >
                    Acknowledge & Resume
                  </button>
                </div>
              ) : (
                <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400">Sequence State</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    NOMINAL (STEP {state.currentStep + 1}/7)
                  </span>
                </div>
              )}

              {/* Glowing pointer string pointing down to active node */}
              <div className="absolute -bottom-6 right-8 w-px h-6 bg-gradient-to-b from-sky-400 to-transparent" />
            </div>

            {/* Fiber-Optic Radiant Light Ray Beams SVG */}
            <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 450 500">
              <defs>
                <linearGradient id="cyanBeam" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="whiteBeam" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="orangeBeam" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#f97316" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Fan of light rays shooting up to target coordinate nodes */}
              {[
                { x: 90, y: 230, grad: "url(#cyanBeam)" },
                { x: 120, y: 310, grad: "url(#whiteBeam)" },
                { x: 145, y: 380, grad: "url(#orangeBeam)" },
                { x: 175, y: 440, grad: "url(#whiteBeam)" },
                { x: 230, y: 330, grad: "url(#cyanBeam)" },
                { x: 270, y: 400, grad: "url(#whiteBeam)" },
                { x: 320, y: 450, grad: "url(#cyanBeam)" },
              ].map((beam, i) => (
                <g key={i}>
                  {/* Array of fine bundle lines converging at the node */}
                  {[-15, -10, -5, 0, 5, 10, 15].map((offset, j) => (
                    <line
                      key={j}
                      x1={beam.x + offset * 3.5}
                      y1="40"
                      x2={beam.x}
                      y2={beam.y}
                      stroke={beam.grad}
                      strokeWidth="0.8"
                      strokeOpacity="0.6"
                    />
                  ))}
                  {/* Glowing tip circle */}
                  <circle cx={beam.x} cy={beam.y} r="2.5" fill="#ffffff" filter="drop-shadow(0 0 5px #38bdf8)" />
                </g>
              ))}
            </svg>

            {/* Ground Downlink Station Location Labels */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-6 top-[38%] text-[9px] font-mono">
                <div className="text-slate-200 font-semibold">Sriharikota (SDSC), IN</div>
                <div className="text-[8px] text-slate-500">DOWNLINK CARRIER LOCK • S-BAND 2.2 GHz</div>
              </div>

              <div className="absolute left-6 top-[54%] text-[9px] font-mono">
                <div className="text-slate-200 font-semibold">ISTRAC Bangalore, IN</div>
                <div className="text-[8px] text-slate-500">TELEMETRY INGEST STREAM • NOMINAL</div>
              </div>

              <div className="absolute left-6 top-[68%] text-[9px] font-mono">
                <div className="text-slate-200 font-semibold">Kiruna Earth Station, SE</div>
                <div className="text-[8px] text-slate-500">POLAR ORBIT ACQUISITION • X-BAND</div>
              </div>

              <div className="absolute left-6 top-[84%] text-[9px] font-mono">
                <div className="text-slate-200 font-semibold">Goldstone (DSN), US</div>
                <div className="text-[8px] text-slate-500">DEEP SPACE BACKUP RELAY • S-BAND</div>
              </div>

              {/* Right mission payload track labels */}
              <div className="absolute right-4 top-[50%] text-right font-mono text-[9px]">
                <div className="text-slate-300 font-bold">ASTRA-EXP-01</div>
                <div className="text-[8px] text-slate-500">ISS COLUMBUS MODULE</div>
              </div>
              <div className="absolute right-4 top-[64%] text-right font-mono text-[9px]">
                <div className="text-slate-300 font-bold">Gaganyaan-T1</div>
                <div className="text-[8px] text-slate-500">PAYLOAD FLIGHT TEST</div>
              </div>
              <div className="absolute right-4 top-[78%] text-right font-mono text-[9px]">
                <div className="text-slate-300 font-bold">TDRS-12 Relay</div>
                <div className="text-[8px] text-slate-500">GEOSTATIONARY LINK</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
