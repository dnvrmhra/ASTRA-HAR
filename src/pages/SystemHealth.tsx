import React from "react";

import { useMission } from "../state/MissionStore";

export const SystemHealth: React.FC = () => {
  const { state } = useMission();
  const { ai, health } = state;

  const currentCpu = health[health.length - 1]?.cpu || 34;
  const currentGpu = health[health.length - 1]?.gpu || 68;
  const currentMem = health[health.length - 1]?.memory || 42;
  const currentTemp = health[health.length - 1]?.temp || 38.5;

  const remediationAlerts = [
    { title: "NPU Kernel Ingestion Optimized", tag: "AUTO-TUNED", time: "1m ago", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
    { title: "Payload Camera Exposure Drift", tag: "STABILIZED", time: "3m ago", color: "border-sky-500/40 bg-sky-500/10 text-sky-300" },
    { title: state.warningsCount > 0 ? "Astronaut Protocol Deviation Active" : "DAG State Machine Aligned", tag: state.warningsCount > 0 ? "ALERT" : "NOMINAL", time: "Just now", color: state.warningsCount > 0 ? "border-rose-500/60 bg-rose-500/15 text-rose-300" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
    { title: "NVMe Flash Ring Buffer 18MB/hr", tag: "HEALTHY", time: "5m ago", color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 select-none max-w-[1580px] mx-auto w-full space-y-3.5">
      {/* Top Banner Row matching SecureDeep */}
      <div className="cd-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">DIAGNOSTICS & TELEMETRY</span>
            <span className="text-slate-600">·</span>
            <span className="text-[10px] font-mono text-emerald-400">ISRO PS-26174</span>
          </div>
          <h1 className="text-[18px] font-bold text-white tracking-tight font-display">
            Edge Compute & Hardware Drift Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full cd-card text-[11px] font-mono text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]" />
            <span>OPERATIONAL TEMP: {currentTemp.toFixed(1)}°C</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Grid inspired directly by Image 4 (SecureDeep) */}
      <div className="grid grid-cols-12 gap-3.5 min-h-[560px]">
        {/* LEFT COLUMN: Gauges, Effort Distribution, Environment Matrix */}
        <div className="col-span-12 lg:col-span-3 space-y-3.5">
          {/* Circular Rings Gauges (as in Image 4) */}
          <div className="cd-panel p-4 flex items-center justify-around h-[160px]">
            {/* Orange Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 rounded-full border-4 border-amber-500/80 border-t-transparent flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                <span className="text-[16px] font-mono font-bold text-white">{currentTemp.toFixed(0)}°</span>
              </div>
              <span className="text-[8.5px] font-mono text-slate-400 uppercase mt-2">DIE TEMP</span>
            </div>

            {/* Cyan Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 rounded-full border-4 border-sky-400/90 border-r-transparent flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                <span className="text-[16px] font-mono font-bold text-white">{ai.aiFps}</span>
              </div>
              <span className="text-[8.5px] font-mono text-slate-400 uppercase mt-2">INFERENCE FPS</span>
            </div>
          </div>

          {/* Compute Effort Distribution (as in Image 4) */}
          <div className="cd-panel p-4 space-y-2.5">
            <span className="text-[9.5px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
              COMPUTE ENVELOPE DISTRIBUTION
            </span>

            {[
              { label: "NPU Acceleration", val: currentGpu, color: "bg-sky-400" },
              { label: "Host CPU Workload", val: currentCpu, color: "bg-emerald-400" },
              { label: "RAM Allocation", val: currentMem, color: "bg-amber-400" },
              { label: "Camera Frame Ingest", val: 96, color: "bg-teal-400" },
            ].map((e) => (
              <div key={e.label} className="space-y-1">
                <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-300">
                  <span>{e.label}</span>
                  <span className="font-bold">{e.val.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${e.color} rounded-full`} style={{ width: `${e.val}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Subsystem Matrix Dots (as in Image 4 bottom-left) */}
          <div className="cd-panel p-4 space-y-2">
            <span className="text-[9.5px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
              SUB-NODE STATUS MATRIX
            </span>
            {[
              { env: "CAM-01 Optical", dots: ["bg-emerald-400", "bg-emerald-400", "bg-emerald-400", "bg-emerald-400"] },
              { env: "NPU YOLOv8 Core", dots: ["bg-emerald-400", "bg-emerald-400", "bg-sky-400", "bg-emerald-400"] },
              { env: "DAG State Queue", dots: ["bg-emerald-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-400"] },
              { env: "Telemetry Relay", dots: ["bg-emerald-400", "bg-emerald-400", "bg-emerald-400", "bg-sky-400"] },
            ].map((r) => (
              <div key={r.env} className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                <span>{r.env}</span>
                <div className="flex gap-1.5">
                  {r.dots.map((d, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${d}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: Top KPIs + 3D Glowing Wireframe Terrain Topology + Waveform Overviews */}
        <div className="col-span-12 lg:col-span-6 space-y-3.5">
          {/* Top 3 Stat Cards (as in Image 4) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="cd-panel p-3">
              <span className="text-[8.5px] font-mono text-slate-400 uppercase">ANOMALIES PREVENTED</span>
              <div className="text-[18px] font-mono font-bold text-emerald-400 mt-0.5">14 Actions</div>
              <span className="text-[8.5px] font-mono text-slate-500">+23% vs manual</span>
            </div>
            <div className="cd-panel p-3">
              <span className="text-[8.5px] font-mono text-slate-400 uppercase">DOWNLINK COMPRESSION</span>
              <div className="text-[18px] font-mono font-bold text-sky-400 mt-0.5">99.2% Saved</div>
              <span className="text-[8.5px] font-mono text-slate-500">18 MB/hr target</span>
            </div>
            <div className="cd-panel p-3">
              <span className="text-[8.5px] font-mono text-slate-400 uppercase">PROTOCOL ADHERENCE</span>
              <div className="text-[18px] font-mono font-bold text-white mt-0.5">100% Score</div>
              <span className="text-[8.5px] font-mono text-emerald-400">Nominal index</span>
            </div>
          </div>

          {/* Centerpiece: Glowing 3D Terrain Wireframe Topology (Exact replica of Image 4 center) */}
          <div className="cd-panel p-4 h-[260px] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between z-10 border-b border-white/[0.06] pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                EDGE HARDWARE TOPOLOGY MESH
              </span>
              <span className="text-[9px] font-mono text-emerald-400">REAL-TIME TELEMETRY MATRIX</span>
            </div>

            {/* Continuous Wireframe Mountain Waveform SVG with Labeled Nodes (as in Image 4) */}
            <div className="flex-1 relative flex items-center justify-center">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 160">
                <defs>
                  <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#065f46" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Mesh dots grid in background */}
                {[20, 40, 60, 80, 100, 120, 140].map((y) => (
                  <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#10b981" strokeWidth="0.4" strokeOpacity="0.15" strokeDasharray="3 3" />
                ))}

                {/* Glowing Green 3D Terrain Mountain Ridges */}
                <path
                  d="M 0,110 Q 70,50 140,85 T 280,30 T 400,60 T 500,100 L 500,160 L 0,160 Z"
                  fill="url(#terrainGrad)"
                />
                <path
                  d="M 0,110 Q 70,50 140,85 T 280,30 T 400,60 T 500,100"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                  filter="drop-shadow(0 0 8px #10b981)"
                />
                <path
                  d="M 0,130 Q 80,80 160,110 T 300,60 T 420,90 T 500,120"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="1.2"
                  strokeOpacity="0.6"
                />

                {/* Labeled Nodes on Peaks */}
                {[
                  { x: 95, y: 80, label: "CAM INGEST", sub: "30 FPS" },
                  { x: 210, y: 35, label: "YOLO NPU", sub: "4.2 ms" },
                  { x: 320, y: 65, label: "SKELETAL", sub: "3.4 ms" },
                  { x: 420, y: 45, label: "DAG VALIDATOR", sub: "1.6 ms" },
                ].map((node) => (
                  <g key={node.label}>
                    <circle cx={node.x} cy={node.y} r="5.5" fill="#047857" stroke="#34d399" strokeWidth="2" filter="drop-shadow(0 0 8px #34d399)" />
                    <text x={node.x} y={node.y - 12} textAnchor="middle" fill="#d1fae5" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                      {node.label}
                    </text>
                    <text x={node.x} y={node.y - 4} textAnchor="middle" fill="#6ee7b7" fontSize="6" fontFamily="monospace">
                      {node.sub}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 z-10 pt-1 border-t border-white/[0.04]">
              <span>NODE: PAYLOAD OPTICAL</span>
              <span>SYNCHRONIZED: 100%</span>
              <span>BUFFER: 18 MB ALLOCATED</span>
            </div>
          </div>

          {/* Bottom Operations Overview with Colored Waves (as in Image 4) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { val: "788k", title: "FRAMES PARSED", col: "text-emerald-400", wave: "#10b981" },
              { val: "847", title: "DAG STATE CHECKS", col: "text-sky-400", wave: "#38bdf8" },
              { val: `${state.warningsCount}`, title: "DRIFT EVENTS", col: "text-amber-400", wave: "#f59e0b" },
              { val: "0", title: "PACKET DROPS", col: "text-slate-300", wave: "#64748b" },
            ].map((o) => (
              <div key={o.title} className="cd-panel p-2.5 flex flex-col justify-between h-[85px]">
                <span className="text-[8px] font-mono text-slate-400 uppercase">{o.title}</span>
                <div className={`text-[16px] font-mono font-bold ${o.col}`}>{o.val}</div>
                <svg className="w-full h-4" viewBox="0 0 100 20">
                  <path d="M 0,10 Q 25,2 50,10 T 100,10" fill="none" stroke={o.wave} strokeWidth="1.5" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: AI-Powered Remediation & Alerts Stack (as in Image 4) */}
        <div className="col-span-12 lg:col-span-3 space-y-3.5">
          <div className="cd-panel p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
                <span className="text-[10px] font-mono text-slate-300 uppercase font-bold tracking-wider">
                  AI Edge Remediation
                </span>
                <span className="text-[9px] font-mono text-emerald-400">AUTO-FIX ON</span>
              </div>

              {/* Stacked Priority Alert Cards (as in Image 4 right) */}
              <div className="space-y-2">
                {remediationAlerts.map((a, i) => (
                  <div key={i} className={`p-2.5 rounded-xl border ${a.color} transition-all`}>
                    <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                      <span className="font-bold">{a.tag}</span>
                      <span className="opacity-70">{a.time}</span>
                    </div>
                    <div className="text-[11.5px] font-semibold tracking-tight text-white leading-tight">
                      {a.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] mt-4">
              <span className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
                DAEMON STATUS
              </span>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Autonomous Supervisor</span>
                <span className="text-emerald-400 font-mono font-bold">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
