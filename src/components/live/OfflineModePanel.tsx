import React from "react";
import { WifiOff, Wifi } from "lucide-react";
import { useMission } from "../../state/MissionStore";
import { StatusDot } from "../ui/Primitives";

export const OfflineModePanel: React.FC = () => {
  const { state, dispatch } = useMission();
  const offline = !state.system.networkOnline;

  const subsystems = [
    { label: "Ground Telemetry Link", on: !offline, color: "ok" as const, status: offline ? "DISCONNECTED" : "UPLINK NOMINAL", warn: offline },
    { label: "Edge Neural Classifier", on: true, color: "ok" as const, status: "AUTONOMOUS", warn: false },
    { label: "DAG Sequence Core", on: true, color: "ok" as const, status: "IN-MEMORY", warn: false },
    { label: "Speech Guidance Core", on: true, color: "ok" as const, status: "READY", warn: false },
    { label: "Flash Audit Storage", on: true, color: "ok" as const, status: "SYNCED", warn: false },
  ];

  return (
    <div className="glass-panel p-4 rounded-2xl h-full flex flex-col justify-between border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-display text-[12.5px] font-bold text-slate-100 uppercase tracking-wider">
            Autonomous Space Edge
          </span>
        </div>
        <span className="font-mono text-[9px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          ZERO CLOUD
        </span>
      </div>

      <div className="space-y-2">
        {subsystems.map((s) => (
          <div key={s.label} className="p-2 rounded-xl bg-slate-900/40 border border-white/[0.04] flex items-center justify-between text-[11.5px]">
            <span className="flex items-center gap-2 text-slate-300">
              <StatusDot on={s.on} color={s.color} pulse={s.warn} />
              {s.label}
            </span>
            <span className={`font-mono text-[10px] font-semibold ${s.warn ? "text-amber-400" : "text-emerald-400"}`}>
              {s.status}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => dispatch({ type: "TOGGLE_NETWORK" })}
        className={`w-full py-2 text-[11.5px] font-semibold flex items-center justify-center gap-2 transition-all mt-2 ${
          offline
            ? "btn-liquid-success"
            : "btn-liquid-glass text-amber-300 border-amber-400/40"
        }`}
      >
        {offline ? <Wifi size={14} /> : <WifiOff size={14} />}
        <span>{offline ? "Reconnect Telemetry Link" : "Simulate RF Blackout"}</span>
      </button>
    </div>
  );
};
