import React from "react";
import { EventTimeline } from "../components/live/EventTimeline";
import { ExperimentLogPanel } from "../components/live/ExperimentLogPanel";
import { useMission } from "../state/MissionStore";

export const EventLog: React.FC = () => {
  const { state } = useMission();

  return (
    <div className="h-full overflow-y-auto p-4 select-none max-w-[1580px] mx-auto w-full space-y-3.5">
      {/* Top Header Row with Event Frequency Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="cd-panel p-4 flex flex-col justify-between">
          <span className="text-[9px] font-mono text-slate-400 uppercase">TOTAL LOGGED EVENTS</span>
          <div className="text-[26px] font-mono font-bold text-white mt-1">{state.events.length}</div>
          <span className="text-[10px] font-mono text-emerald-400">IndexedDB Synced</span>
        </div>

        <div className="cd-panel p-4 flex flex-col justify-between">
          <span className="text-[9px] font-mono text-slate-400 uppercase">DEVIATION WARNINGS</span>
          <div className={`text-[26px] font-mono font-bold mt-1 ${state.warningsCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {state.warningsCount}
          </div>
          <span className="text-[10px] font-mono text-slate-400">Action Mismatches</span>
        </div>

        <div className="cd-panel p-4 flex flex-col justify-between">
          <span className="text-[9px] font-mono text-slate-400 uppercase">VERIFIED MILESTONES</span>
          <div className="text-[26px] font-mono font-bold text-sky-400 mt-1">
            {state.stepStatuses.filter((s) => s === "complete").length} / 7
          </div>
          <span className="text-[10px] font-mono text-slate-400">Step DAG Adherence</span>
        </div>

        <div className="cd-panel p-4 flex flex-col justify-between">
          <span className="text-[9px] font-mono text-slate-400 uppercase">TELEMETRY UPLINK RATE</span>
          <div className="text-[26px] font-mono font-bold text-emerald-400 mt-1">18 MB / hr</div>
          <span className="text-[10px] font-mono text-emerald-400">-99.2% Bandwidth Saved</span>
        </div>
      </div>

      {/* Main Split: Detailed Stream + Telemetry Ledger Export */}
      <div className="grid grid-cols-12 gap-3.5 min-h-[480px]">
        <div className="col-span-12 lg:col-span-8 cd-panel p-2 h-[480px]">
          <EventTimeline />
        </div>
        <div className="col-span-12 lg:col-span-4 h-[480px]">
          <ExperimentLogPanel />
        </div>
      </div>
    </div>
  );
};
