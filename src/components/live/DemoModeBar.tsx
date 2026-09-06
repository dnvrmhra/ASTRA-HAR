import React from "react";
import { PlayCircle, PauseCircle, RotateCcw, AlertTriangle } from "lucide-react";
import { useMission } from "../../state/MissionStore";
import { Badge, StatusDot } from "../ui/Primitives";

export const DemoModeBar: React.FC = () => {
  const { state, dispatch } = useMission();

  const phaseTone = {
    IDLE:      "neutral",
    RUNNING:   "cyan",
    DEVIATION: "crit",
    UNCERTAIN: "warn",
    COMPLETE:  "ok",
  } as const;

  return (
    <div className="flex items-center justify-between glass-panel px-4 py-2 mb-3 rounded-xl shrink-0 border border-white/[0.08] shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <StatusDot on={state.demoMode && state.running} color="cyan" pulse />
          <span className="font-mono text-[10.5px] tracking-wider text-slate-300 font-semibold uppercase">
            SIMULATION ENGINE
          </span>
        </div>

        <div className="h-3.5 w-px bg-white/10" />

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => dispatch({ type: state.demoMode && state.running ? "PAUSE_DEMO" : "START_DEMO" })}
            className={`px-3 py-1 rounded-lg text-[11.5px] font-semibold transition-all flex items-center gap-1.5 ${
              state.demoMode && state.running
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                : "bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-[0_0_10px_rgba(56,189,248,0.2)] hover:bg-sky-500/30"
            }`}
          >
            {state.demoMode && state.running ? <PauseCircle size={13} /> : <PlayCircle size={13} />}
            <span>{state.demoMode && state.running ? "Pause Demo" : "Start Demo"}</span>
          </button>

          <button
            onClick={() => dispatch({ type: "RESET_DEMO" })}
            className="px-2.5 py-1 rounded-lg text-[11.5px] font-medium text-slate-300 hover:text-white glass-pill flex items-center gap-1.5"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {state.deviation && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-[11px] font-mono animate-pulse">
            <AlertTriangle size={12} />
            <span>DEVIATION DETECTED</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
            MISSION STATE
          </span>
          <Badge tone={phaseTone[state.phase]}>{state.phase}</Badge>
        </div>
      </div>
    </div>
  );
};
