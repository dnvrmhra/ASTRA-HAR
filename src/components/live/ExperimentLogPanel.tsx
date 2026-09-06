import React from "react";
import { FileJson, FileText } from "lucide-react";
import { useMission, computeCompliance } from "../../state/MissionStore";
import { formatClock } from "../../state/sim";

export const ExperimentLogPanel: React.FC = () => {
  const { state, downloadLog } = useMission();
  const completed = state.stepStatuses.filter((s) => s === "complete").length;
  const compliance = computeCompliance(state);

  return (
    <div className="glass-panel p-4 rounded-2xl h-full flex flex-col justify-between border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="font-display text-[12.5px] font-bold text-slate-100 uppercase tracking-wider">
            Flight Audit Ledger
          </span>
        </div>
        <span className="font-mono text-[9.5px] text-slate-400">INDEXED DB</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-white/[0.04]">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Mission ID</span>
          <div className="font-mono text-white font-bold text-[13px] mt-0.5">{state.experiment.id}</div>
        </div>
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-white/[0.04]">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Elapsed Flight Time</span>
          <div className="font-mono text-sky-400 font-bold text-[13px] mt-0.5">{formatClock(state.elapsedMs)}</div>
        </div>
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-white/[0.04]">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Validated Sequence</span>
          <div className="font-mono text-slate-200 font-bold text-[13px] mt-0.5">{completed} / {state.experiment.steps.length} Steps</div>
        </div>
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-white/[0.04]">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Compliance Index</span>
          <div className={`font-mono font-bold text-[13px] mt-0.5 ${compliance >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
            {compliance}%
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-white/[0.06] mt-2">
        <button
          onClick={() => downloadLog("txt")}
          className="flex-1 py-1.5 btn-liquid-glass text-[11px] font-semibold flex items-center justify-center gap-1.5 text-slate-200 hover:text-white"
        >
          <FileText size={13} /> Export .TXT
        </button>
        <button
          onClick={() => downloadLog("json")}
          className="flex-1 py-1.5 btn-liquid-primary text-[11px] font-semibold flex items-center justify-center gap-1.5"
        >
          <FileJson size={13} /> Export .JSON
        </button>
      </div>
    </div>
  );
};
