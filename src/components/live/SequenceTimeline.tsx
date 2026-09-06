import React from "react";
import { Check } from "lucide-react";
import { useMission } from "../../state/MissionStore";

export const SequenceTimeline: React.FC = () => {
  const { state } = useMission();
  const { experiment, stepStatuses, currentStep } = state;
  const next = experiment.steps[currentStep + 1];

  return (
    <div className="glass-panel p-4 rounded-2xl h-full flex flex-col justify-between border border-white/[0.08] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="font-display text-[13px] font-bold text-slate-100 uppercase tracking-wider">
            Protocol Sequence Execution
          </span>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-400">
          STEP {currentStep + 1} OF {experiment.steps.length}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {experiment.steps.map((step, i) => {
          const status = stepStatuses[i];
          const active = status === "current";
          return (
            <div
              key={step.id}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                active
                  ? "bg-sky-500/15 border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                  : status === "complete"
                  ? "bg-slate-900/40 border-white/[0.04] opacity-75"
                  : status === "flagged"
                  ? "bg-rose-500/15 border-rose-500/50"
                  : "bg-slate-900/30 border-white/[0.04] opacity-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold ${
                    status === "complete"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : active
                      ? "bg-sky-500/20 text-sky-400 border border-sky-400/50"
                      : status === "flagged"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                      : "bg-white/5 text-slate-400 border border-white/10"
                  }`}
                >
                  {status === "complete" ? <Check size={12} strokeWidth={3} /> : i + 1}
                </div>

                <div>
                  <div className={`text-[12.5px] font-semibold leading-none ${active ? "text-white" : "text-slate-300"}`}>
                    {step.action}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1">
                    {step.requiredObject} • {step.interaction}
                  </div>
                </div>
              </div>

              <div className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-md border tracking-wider">
                {status === "complete" && <span className="text-emerald-400 border-emerald-400/30">VERIFIED</span>}
                {active && <span className="text-sky-400 border-sky-400/40 animate-pulse">IN PROGRESS</span>}
                {status === "pending" && <span className="text-slate-400 border-white/10">QUEUED</span>}
                {status === "flagged" && <span className="text-rose-400 border-rose-400/40">DEVIATION</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-slate-900/50 p-2 rounded-lg border border-white/[0.04]">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Target Action</span>
          <div className="text-sky-400 font-semibold truncate mt-0.5">
            {state.phase === "COMPLETE" ? "All Steps Done" : experiment.steps[currentStep]?.action}
          </div>
        </div>
        <div className="bg-slate-900/50 p-2 rounded-lg border border-white/[0.04]">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Next Queued</span>
          <div className="text-slate-300 font-medium truncate mt-0.5">
            {next ? next.action : "Sequence Termination"}
          </div>
        </div>
      </div>
    </div>
  );
};
