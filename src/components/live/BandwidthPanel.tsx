import React from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const waveData = [
  { t: "00s", raw: 60, har: 1.2 },
  { t: "10s", raw: 85, har: 1.5 },
  { t: "20s", raw: 95, har: 1.8 },
  { t: "30s", raw: 70, har: 1.3 },
  { t: "40s", raw: 90, har: 1.6 },
  { t: "50s", raw: 100, har: 1.9 },
  { t: "60s", raw: 80, har: 1.4 },
];

export const BandwidthPanel: React.FC = () => {
  return (
    <div className="glass-panel p-4 rounded-2xl h-full flex flex-col justify-between border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="font-display text-[12.5px] font-bold text-slate-100 uppercase tracking-wider">
            Telemetry Waveform & Bandwidth
          </span>
        </div>
        <span className="font-mono text-[9.5px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          -99.2% BANDWIDTH SAVED
        </span>
      </div>

      {/* CyberDefend glowing waveform chart (as shown in the bottom-left of the screenshot) */}
      <div style={{ width: "100%", height: 110 }} className="relative">
        <ResponsiveContainer>
          <AreaChart data={waveData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="neonCyanGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 110]} />
            <XAxis dataKey="t" hide />
            <Tooltip
              contentStyle={{ background: "#0c1524", borderColor: "rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
            />
            <Area
              type="monotone"
              dataKey="raw"
              stroke="#38bdf8"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#neonCyanGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
        <div className="bg-slate-900/40 p-2 rounded-xl border border-white/[0.04]">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Raw Stream Load</span>
          <div className="font-mono text-[14px] font-bold text-slate-200 mt-0.5">2.4 GB / hr</div>
        </div>
        <div className="bg-sky-500/10 p-2 rounded-xl border border-sky-400/30">
          <span className="text-[9px] font-mono text-sky-400 uppercase">Compressed HAR Events</span>
          <div className="font-mono text-[14px] font-bold text-sky-400 mt-0.5">18 MB / hr</div>
        </div>
      </div>
    </div>
  );
};
