import React from "react";
import { useMission } from "../../state/MissionStore";
import { CheckCircle2, ShieldAlert, Zap, Database, Activity } from "lucide-react";

export const MissionKpiStrip: React.FC = () => {
  const { state } = useMission();
  const { ai } = state;

  const total = state.experiment.steps.length;
  const completed = state.stepStatuses.filter((s) => s === "complete").length;
  const protocolPct = total ? Math.round((completed / total) * 100) : 0;
  const avgConf = (
    ai.objectDetection + ai.poseEstimation + ai.handTracking +
    ai.activityRecognition + ai.sequenceValidation
  ) / 5;

  const cards = [
    {
      title: "Protocol Adherence",
      val: `${protocolPct}%`,
      sub: `${completed}/${total} Steps Validated`,
      icon: CheckCircle2,
      color: protocolPct === 100 ? "text-emerald-400" : "text-sky-400",
      pill: protocolPct === 100 ? "NOMINAL" : "ACTIVE",
      pillColor: "border-sky-400/30 text-sky-400 bg-sky-400/10",
    },
    {
      title: "Confidence Mean",
      val: `${avgConf.toFixed(1)}%`,
      sub: "Across 5 Edge Classifiers",
      icon: Activity,
      color: "text-sky-400",
      pill: "SYNCHRONIZED",
      pillColor: "border-emerald-400/30 text-emerald-400 bg-emerald-400/10",
    },
    {
      title: "Inference Latency",
      val: `${ai.inferenceLatencyMs} ms`,
      sub: `Running at ${ai.aiFps} FPS On-Device`,
      icon: Zap,
      color: "text-slate-100",
      pill: "HARD REAL-TIME",
      pillColor: "border-white/15 text-slate-300 bg-white/5",
    },
    {
      title: "Active Anomaly Flags",
      val: `${state.warningsCount}`,
      sub: state.warningsCount === 0 ? "Zero Sequence Errors" : "Deviation Under Review",
      icon: ShieldAlert,
      color: state.warningsCount > 0 ? "text-amber-400" : "text-emerald-400",
      pill: state.warningsCount > 0 ? "FLAGGED" : "CLEAN",
      pillColor: state.warningsCount > 0 ? "border-amber-400/30 text-amber-400 bg-amber-400/10" : "border-emerald-400/30 text-emerald-400 bg-emerald-400/10",
    },
    {
      title: "Uplink Reduction",
      val: "99.2%",
      sub: "2.4 GB/hr → 18 MB/hr",
      icon: Database,
      color: "text-emerald-400",
      pill: "COMPRESSED",
      pillColor: "border-emerald-400/30 text-emerald-400 bg-emerald-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-3 shrink-0">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between border border-white/[0.08] hover:border-white/[0.16] transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-medium">
                {c.title}
              </span>
              <span className={`font-mono text-[8.5px] px-2 py-0.5 rounded-full border ${c.pillColor}`}>
                {c.pill}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className={`font-mono text-[22px] font-bold leading-none tracking-tight ${c.color}`}>
                {c.val}
              </span>
              <Icon size={16} className="text-slate-500 opacity-60" />
            </div>

            <span className="text-[10px] text-slate-400 font-mono mt-1.5 truncate">
              {c.sub}
            </span>
          </div>
        );
      })}
    </div>
  );
};
