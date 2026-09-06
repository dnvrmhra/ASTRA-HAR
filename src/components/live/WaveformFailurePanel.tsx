import React from "react";
import { SlidersHorizontal, Filter, Activity } from "lucide-react";

export const WaveformFailurePanel: React.FC = () => {
  const [isTuned, setIsTuned] = React.useState(false);
  const [filterActive, setFilterActive] = React.useState(false);

  const yLabels = ["200", "100", "0", "-100", "-200"];
  const dates = [
    "11/01", "11/02", "11/03", "11/04", "11/05", "11/06", "11/07", "11/08",
    "11/09", "11/10", "11/11", "11/12", "11/13", "11/14", "11/15",
  ];

  const markers = [
    { label: "ST-389", x: "18%", y: "45%" },
    { label: "ST-983", x: "32%", y: "42%" },
    { label: "YY-01", x: "54%", y: "44%" },
    { label: "ST-418", x: "72%", y: "52%" },
  ];

  return (
    <div className="cd-panel p-3.5 h-[230px] flex flex-col justify-between select-none">
      {/* Header: CHANCE OF FAILURE + Icons (Exact replica of screenshot) */}
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold tracking-[0.16em] text-slate-400 uppercase">
            CHANCE OF FAILURE
          </span>
          <span className="text-[9px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-bold shadow-[0_0_8px_rgba(52,211,153,0.3)]">
            {filterActive ? "FILTERED 0.4%" : "NOMINAL 0.8%"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 text-[9.5px] font-mono font-medium">
            <Activity size={11} className="text-sky-400 animate-pulse" />
            <span>{isTuned ? "TUNED RESONANCE" : "SPECTRAL HARMONICS"}</span>
          </div>

          <button
            onClick={() => setIsTuned(!isTuned)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isTuned
                ? "bg-sky-500/30 text-sky-300 border border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                : "btn-liquid-glass text-slate-400 hover:text-white"
            }`}
            title={isTuned ? "Oscilloscope Tuning: High-Pass Resonance Active" : "Oscilloscope Tuning"}
          >
            <SlidersHorizontal size={12} />
          </button>
          <button
            onClick={() => setFilterActive(!filterActive)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              filterActive
                ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                : "btn-liquid-glass text-slate-400 hover:text-white"
            }`}
            title={filterActive ? "Telemetry Filters: 3-Sigma Anomaly Gate Active" : "Telemetry Filters"}
          >
            <Filter size={12} />
          </button>
        </div>
      </div>

      {/* Main Waveform Body with Y-Axis and Glowing Multi-layer Cyan Ribbon */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Y-Axis */}
        <div className="w-7 flex flex-col justify-between text-[8px] font-mono text-slate-500 py-1">
          {yLabels.map((lbl) => (
            <span key={lbl}>{lbl}</span>
          ))}
        </div>

        {/* Chart Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="w-full border-b border-dashed border-white/20" />
            <div className="w-full border-b border-dashed border-white/20" />
            <div className="w-full border-b border-white/40" />
            <div className="w-full border-b border-dashed border-white/20" />
            <div className="w-full border-b border-dashed border-white/20" />
          </div>

          {/* Glowing Markers (ST-389, ST-983, etc.) */}
          {markers.map((m) => (
            <div
              key={m.label}
              className="absolute flex items-center gap-1 pointer-events-none z-10"
              style={{ left: m.x, top: m.y }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(56,189,248,1)]" />
              <span className="text-[8px] font-mono text-slate-300 font-semibold">{m.label}</span>
            </div>
          ))}

          {/* Multilayer glowing 3D Cyan Sine Waveform SVG */}
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 120">
            <defs>
              <linearGradient id="waveCyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="40%" stopColor="#0ea5e9" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="85%" stopColor="#67e8f9" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
              </linearGradient>

              <filter id="neonBloom" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background wireframe resonance lines */}
            {[
              "M 0,60 Q 60,35 120,70 T 240,65 T 340,60 T 420,80 T 500,60",
              "M 0,60 Q 60,40 120,65 T 240,60 T 340,55 T 420,75 T 500,60",
              "M 0,60 Q 60,45 120,60 T 240,70 T 340,65 T 420,85 T 500,60",
              "M 0,60 Q 60,50 120,75 T 240,55 T 340,70 T 420,70 T 500,60",
              "M 0,60 Q 60,55 120,80 T 240,50 T 340,75 T 420,65 T 500,60",
              "M 0,60 Q 60,65 120,55 T 240,75 T 340,50 T 420,90 T 500,60",
              "M 0,60 Q 60,70 120,50 T 240,80 T 340,45 T 420,95 T 500,60",
            ].map((d, idx) => (
              <path
                key={idx}
                d={d}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="0.6"
                strokeOpacity={0.25 + idx * 0.05}
              />
            ))}

            {/* Dense 3D harmonic mesh ribbon */}
            <path
              d="M 0,60 C 50,40 90,85 140,65 C 190,45 230,80 280,68 C 330,55 360,95 410,75 C 440,60 470,85 500,60"
              fill="none"
              stroke="url(#waveCyanGlow)"
              strokeWidth="2.4"
              filter="url(#neonBloom)"
            />

            {/* Electric crest ribbon on right side */}
            <path
              d="M 320,68 C 350,55 370,105 405,82 C 430,65 460,95 495,65"
              fill="none"
              stroke="#67e8f9"
              strokeWidth="3.2"
              filter="url(#neonBloom)"
              strokeDasharray="2 1"
            />
          </svg>
        </div>
      </div>

      {/* X-Axis Dates */}
      <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 px-7 pt-1 border-t border-white/[0.04]">
        {dates.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
};
