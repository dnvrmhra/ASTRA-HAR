import React from "react";
import { useMission } from "../../state/MissionStore";
import { MetricBar } from "../ui/Primitives";

export const AIStatusPanel: React.FC = () => {
  const { state } = useMission();
  const { ai } = state;

  return (
    <div className="glass-panel p-4 rounded-2xl h-full flex flex-col justify-between border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="font-display text-[12.5px] font-bold text-slate-100 uppercase tracking-wider">
            Model Confidence Breakdown
          </span>
        </div>
        <span className="font-mono text-[9.5px] text-sky-400 font-bold">EDGE NN</span>
      </div>

      <div className="space-y-2">
        <MetricBar label="Spatial Object Bounding" value={ai.objectDetection} tone="cyan" />
        <MetricBar label="Pose Keypoint Estimation" value={ai.poseEstimation} tone="cyan" />
        <MetricBar label="Hand Articulation Tracking" value={ai.handTracking} tone="cyan" />
        <MetricBar label="Activity Temporal Model" value={ai.activityRecognition} tone="cyan" />
        <MetricBar label="Sequence DAG Validator" value={ai.sequenceValidation} tone="cyan" />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/[0.06] text-center">
        <div className="bg-slate-900/50 p-1.5 rounded-xl border border-white/[0.04]">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Latency</span>
          <div className="font-mono text-[13px] font-bold text-sky-400">{ai.inferenceLatencyMs}ms</div>
        </div>
        <div className="bg-slate-900/50 p-1.5 rounded-xl border border-white/[0.04]">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Camera</span>
          <div className="font-mono text-[13px] font-bold text-white">{ai.cameraFps} FPS</div>
        </div>
        <div className="bg-slate-900/50 p-1.5 rounded-xl border border-white/[0.04]">
          <span className="text-[9px] font-mono text-slate-400 uppercase">Edge NPU</span>
          <div className="font-mono text-[13px] font-bold text-emerald-400">{ai.aiFps} FPS</div>
        </div>
      </div>
    </div>
  );
};
