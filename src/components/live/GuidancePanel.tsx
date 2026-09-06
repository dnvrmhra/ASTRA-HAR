import React from "react";
import { CheckCircle2, Radio } from "lucide-react";
import { useMission } from "../../state/MissionStore";

export const GuidancePanel: React.FC = () => {
  const { state } = useMission();
  const { experiment, currentStep, phase } = state;
  const current      = experiment.steps[currentStep];
  const next         = experiment.steps[currentStep + 1];
  const lastVerified = [...state.events].find((e) => e.kind === "STEP_VERIFIED");

  const nextLine =
    phase === "COMPLETE"
      ? "All steps verified. Experiment complete."
      : next
      ? next.voiceInstruction
      : current?.voiceInstruction ?? "";

  return (
    <div className="glass-panel p-4 rounded-2xl h-full flex flex-col justify-between border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="font-display text-[12.5px] font-bold text-slate-100 uppercase tracking-wider">
            Astronaut Visual Directives
          </span>
        </div>
        <span className="font-mono text-[9.5px] text-slate-400">HEADS-UP HUD</span>
      </div>

      <div className="space-y-2.5">
        <div className="p-3 rounded-xl bg-slate-900/40 border border-white/[0.06] flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-mono text-[9px] text-emerald-400 uppercase font-semibold tracking-wider">
              Last Certified Action
            </div>
            <div className="text-[12px] text-slate-300 mt-0.5 leading-snug font-medium">
              {lastVerified ? lastVerified.message : "Awaiting initial sequence interaction."}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-400/25 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
          <div className="font-mono text-[9px] text-sky-400 uppercase font-bold tracking-wider mb-1">
            Active Directive for Astronaut
          </div>
          <div className="text-[13.5px] text-white font-semibold leading-snug font-display">
            "{nextLine}"
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-300 text-[11px] font-mono font-medium">
          <Radio size={13} className="text-sky-400 animate-pulse" />
          <span>BROADCASTING TO VISOR HUD</span>
        </div>

        <span className="font-mono text-[9px] text-slate-400">SILENT PROTOCOL</span>
      </div>
    </div>
  );
};
