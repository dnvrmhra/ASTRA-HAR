import React from "react";
import { Cpu, Trash2, ShieldCheck } from "lucide-react";
import { useMission } from "../state/MissionStore";

export const Settings: React.FC = () => {
  const { state, dispatch } = useMission();

  return (
    <div className="h-full overflow-y-auto p-4 select-none">
      <div className="max-w-[1000px] mx-auto space-y-3.5">
        <div className="cd-panel p-4 flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-bold text-white tracking-tight">System Configuration</h1>
            <p className="text-[11.5px] text-slate-400 mt-0.5">Manage on-device neural validation thresholds, telemetry buffer, and local persistence cache.</p>
          </div>
          <span className="text-[10px] font-mono text-sky-400 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20">
            LOCAL FIRST • OFFLINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Edge Neural Engine & Heuristics */}
          <div className="cd-panel p-5 flex flex-col justify-between">
            <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-white/[0.06] mb-3 flex items-center justify-between">
              <span>Edge Neural Engine & Protocol Engine</span>
              <span className="text-[9px] text-emerald-400 font-mono">INT8 QUANTIZED</span>
            </div>

            <div className="space-y-3 py-1">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-white/[0.03]">
                <div>
                  <div className="text-[12.5px] text-white font-medium">Acoustic Status</div>
                  <div className="text-[11px] text-slate-400">Silent protocol per ISS Flight Rule Cat-4.</div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 px-2.5 py-1 rounded bg-slate-800 border border-white/5 font-semibold">
                  MUTED
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-white/[0.03]">
                <div>
                  <div className="text-[12.5px] text-white font-medium">Model Inference Target</div>
                  <div className="text-[11px] text-slate-400">YOLOv8s + MediaPipe Hand Mesh & Ergonomics</div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold">
                  NPU ACCEL
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-white/[0.03]">
                <div>
                  <div className="text-[12.5px] text-white font-medium">Telemetry Compression</div>
                  <div className="text-[11px] text-slate-400">2.4 GB/h raw video → 18 MB/h telemetry</div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 font-bold">
                  99.25% SAVED
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={13} /> Zero-Cloud Isolated
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <Cpu size={13} /> On-Device NPU
              </span>
            </div>
          </div>

          {/* Local Storage & Cache */}
          <div className="cd-panel p-5 flex flex-col justify-between">
            <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-white/[0.06] mb-3">
              On-Board Flash Storage
            </div>

            <div className="space-y-2 py-2 text-[12px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-white/[0.03]">
                <span className="text-slate-300">Saved Protocol Templates</span>
                <span className="font-mono font-bold text-sky-400">{state.savedProtocols.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-white/[0.03]">
                <span className="text-slate-300">Logged Session Events</span>
                <span className="font-mono font-bold text-white">{state.events.length}</span>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("astra-har:protocols");
                localStorage.removeItem("astra-har:settings");
                dispatch({ type: "RESET" });
              }}
              className="mt-3 py-2 btn-liquid-danger text-[11.5px] font-semibold flex items-center justify-center gap-2"
            >
              <Trash2 size={14} /> Purge Flash Cache & Reset
            </button>
          </div>
        </div>

        {/* SIH 2026 Team UnoFlyp Credits Panel */}
        <div className="cd-panel p-5">
          <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-white/[0.06] mb-2">
            Mission Attribution • Smart India Hackathon 2026
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            ASTRA-HAR is developed by <strong>Team UnoFlyp</strong> (Daanveer, Krrishika, Aditya, Waseem, Tanishka, Lakshit) for <strong>ISRO Problem Statement PS-26174</strong>. Built with a hard real-time on-device edge architecture providing zero-cloud activity recognition in microgravity environments.
          </p>
        </div>
      </div>
    </div>
  );
};
