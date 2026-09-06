import React, { useState } from "react";
import { useMission } from "../../state/MissionStore";
import { Badge } from "../ui/Primitives";
import type { AIEventCategory } from "../../types";

type Filter = "ALL" | AIEventCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "All Telemetry" },
  { key: "ACTION", label: "Actions" },
  { key: "OBJECT", label: "Spatial" },
  { key: "WARNING", label: "Deviations" },
  { key: "SYSTEM", label: "Hardware" },
];

const toneFor: Record<AIEventCategory, "cyan" | "ok" | "warn" | "crit" | "neutral" | "system"> = {
  ACTION: "cyan",
  OBJECT: "neutral",
  WARNING: "warn",
  SYSTEM: "system",
};

export const EventTimeline: React.FC = () => {
  const { state } = useMission();
  const [filter, setFilter] = useState<Filter>("ALL");

  const events = state.events.filter((e) => filter === "ALL" || e.category === filter);

  return (
    <div className="glass-panel p-4 rounded-2xl h-full flex flex-col justify-between border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="font-display text-[13px] font-bold text-slate-100 uppercase tracking-wider">
            Real-Time Edge Event Log
          </span>
        </div>

        <div className="flex items-center gap-1 glass-pill p-0.5 rounded-full">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all ${
                filter === f.key
                  ? "bg-sky-500/20 text-sky-400 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-white/[0.03]">
        {events.length === 0 && (
          <div className="p-4 text-[12px] text-slate-400 text-center font-mono">
            No telemetry records matching active filter.
          </div>
        )}
        {events.map((e) => {
          const isLatest = e.id === state.events[0]?.id;
          return (
            <div
              key={e.id}
              className={`pt-1.5 flex items-start gap-2.5 px-2 py-1.5 rounded-lg transition-colors ${
                isLatest ? "bg-sky-500/[0.08] border border-sky-400/20" : "hover:bg-white/[0.02]"
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400 pt-0.5 shrink-0 w-[55px]">
                {e.timestamp}
              </span>
              <Badge tone={toneFor[e.category]} className="shrink-0 text-[8.5px] px-2">
                {e.category}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className={`text-[12px] truncate ${isLatest ? "text-white font-semibold" : "text-slate-300"}`}>
                  {e.message}
                </div>
                {e.detail && <div className="text-[10px] text-slate-400 truncate mt-0.5">{e.detail}</div>}
              </div>
              {e.confidence !== undefined && (
                <span className="font-mono text-[10.5px] text-sky-400 font-bold shrink-0">
                  {e.confidence.toFixed(1)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
