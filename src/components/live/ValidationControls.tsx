import React from "react";
import { HelpCircle, RotateCcw, Pause, Play, ShieldX } from "lucide-react";
import { useMission } from "../../state/MissionStore";

export const ValidationControls: React.FC = () => {
  const { state, dispatch } = useMission();
  const locked = !!state.deviation || !!state.uncertain || state.phase === "COMPLETE";

  return (
    <div className="glass-panel p-4 rounded-2xl h-full flex flex-col justify-between border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="font-display text-[12.5px] font-bold text-slate-100 uppercase tracking-wider">
            Operator Simulation Triggers
          </span>
        </div>
        <span className="font-mono text-[9.5px] text-slate-400">INSPECTION</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          disabled={locked}
          onClick={() => dispatch({ type: "CORRECT_ACTION" })}
          className="p-2 text-[12px] font-semibold btn-liquid-success disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Simulate Correct
        </button>
        <button
          disabled={locked}
          onClick={() => dispatch({ type: "SKIP_STEP" })}
          className="p-2 text-[12px] font-semibold btn-liquid-glass text-amber-300 border-amber-400/40 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Skip Next Step
        </button>
        <button
          disabled={locked}
          onClick={() => dispatch({ type: "WRONG_SEQUENCE" })}
          className="p-2 text-[12px] font-semibold btn-liquid-danger disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Trigger Deviation
        </button>
        <button
          disabled={locked}
          onClick={() => dispatch({ type: "UNCERTAIN_ACTION" })}
          className="p-2 text-[12px] font-semibold btn-liquid-glass text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Ambiguous State
        </button>
      </div>

      {state.deviation && (
        <div className="p-3 rounded-xl border border-rose-500/50 bg-rose-500/15 text-rose-200 mt-2 space-y-1.5 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-rose-400 uppercase">
            <ShieldX size={14} /> Deviation Alert Active
          </div>
          <div className="text-[11.5px] space-y-0.5">
            <div>Expected: <strong className="text-white font-mono">{state.deviation.expected}</strong></div>
            <div>Detected: <strong className="text-rose-400 font-mono">{state.deviation.detected}</strong></div>
          </div>
          <button
            onClick={() => dispatch({ type: "DISMISS_DEVIATION" })}
            className="w-full mt-2 py-1.5 btn-liquid-danger font-semibold text-[11.5px]"
          >
            Acknowledge & Resume
          </button>
        </div>
      )}

      {state.uncertain && (
        <div className="p-3 rounded-xl border border-amber-500/50 bg-amber-500/15 text-amber-200 mt-2 space-y-1.5">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-400 uppercase">
            <HelpCircle size={14} /> Low Classification Margin
          </div>
          <div className="text-[11.5px]">Confidence: {state.uncertain.confidence}%</div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => dispatch({ type: "REVIEW_FRAME" })}
              className="flex-1 py-1 rounded-lg glass-pill text-[11px] font-medium"
            >
              Examine
            </button>
            <button
              onClick={() => dispatch({ type: "WAIT_FOR_CONFIRMATION" })}
              className="flex-1 py-1 rounded-lg bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[11px] font-medium"
            >
              Wait
            </button>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
        <button
          onClick={() => dispatch({ type: "TOGGLE_PAUSE" })}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white"
        >
          {state.running ? <Pause size={12} /> : <Play size={12} />}
          <span>{state.running ? "Hold Simulation" : "Resume"}</span>
        </button>
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white"
        >
          <RotateCcw size={12} />
          <span>Reset Run</span>
        </button>
      </div>
    </div>
  );
};
