import React from "react";
import { Camera, ScanEye, PersonStanding, Hand, Activity, ListChecks, ShieldCheck } from "lucide-react";
import { useMission } from "../../state/MissionStore";

interface Stage {
  key: string;
  label: string;
  icon: React.ReactNode;
  confidence?: number;
}

export const DecisionPipeline: React.FC = () => {
  const { state } = useMission();
  const { ai, phase, running, deviation, uncertain } = state;

  const stages: Stage[] = [
    { key: "camera",   label: "Optical Sensor",       icon: <Camera size={15} /> },
    { key: "object",   label: "Spatial Bounding",     icon: <ScanEye size={15} />,       confidence: ai.objectDetection },
    { key: "pose",     label: "Skeletal Pose",        icon: <PersonStanding size={15} />, confidence: ai.poseEstimation },
    { key: "hand",     label: "Hand Articulation",    icon: <Hand size={15} />,           confidence: ai.handTracking },
    { key: "activity", label: "Activity Classifier",  icon: <Activity size={15} />,       confidence: ai.activityRecognition },
    { key: "sequence", label: "Sequence Validator",   icon: <ListChecks size={15} />,     confidence: ai.sequenceValidation },
    { key: "verified", label: "Protocol Certified",   icon: <ShieldCheck size={15} /> },
  ];

  const activeIndex =
    !running || phase === "IDLE"
      ? -1
      : phase === "COMPLETE"
      ? stages.length - 1
      : state.clockTick % stages.length;

  const flagged = !!deviation || !!uncertain;

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="font-display text-[13px] font-bold text-slate-100 uppercase tracking-wider">
            Inference Pipeline Architecture
          </span>
        </div>
        <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">
          ON-DEVICE DAG • ZERO CLOUD
        </span>
      </div>

      <div className="flex items-center justify-between overflow-x-auto py-1 gap-2">
        {stages.map((s, i) => {
          const isLit     = activeIndex >= 0 && i <= activeIndex;
          const isCurrent = i === activeIndex;

          const cardStyle = flagged && isCurrent
            ? "border-amber-400/60 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
            : isCurrent
            ? "border-sky-400/80 bg-sky-500/20 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-[1.03]"
            : isLit
            ? "border-sky-400/30 bg-sky-500/10 text-sky-300"
            : "border-white/[0.06] bg-slate-900/40 text-slate-400";

          return (
            <React.Fragment key={s.key}>
              <div
                className={`flex-1 min-w-[115px] p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${cardStyle}`}
              >
                <div className="p-1.5 rounded-lg bg-black/20 mb-1.5">
                  {s.icon}
                </div>
                <div className="font-mono text-[9.5px] uppercase font-semibold text-center tracking-tight truncate w-full">
                  {s.label}
                </div>
                <div className="font-mono text-[10.5px] font-bold mt-0.5 h-4">
                  {s.confidence !== undefined ? `${s.confidence.toFixed(1)}%` : "READY"}
                </div>
              </div>

              {i < stages.length - 1 && (
                <div className="w-4 shrink-0 flex items-center justify-center">
                  <div
                    className={`h-[2px] w-full rounded-full transition-colors duration-300 ${
                      isLit && i < activeIndex ? "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" : "bg-white/10"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
