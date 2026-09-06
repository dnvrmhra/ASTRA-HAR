import React from "react";
import { CameraView } from "../components/live/CameraView";
import { SequenceTimeline } from "../components/live/SequenceTimeline";
import { DecisionPipeline } from "../components/live/DecisionPipeline";
import { ValidationControls } from "../components/live/ValidationControls";
import { GuidancePanel } from "../components/live/GuidancePanel";
import { OrientationPanel } from "../components/live/OrientationPanel";
import { BandwidthPanel } from "../components/live/BandwidthPanel";
import { MissionKpiStrip } from "../components/live/MissionKpiStrip";
import { DemoModeBar } from "../components/live/DemoModeBar";
import { CompletionReport } from "../components/live/CompletionReport";

export const LiveExperiment: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-h-0 w-full select-none space-y-3 max-w-[1580px] mx-auto overflow-y-auto pr-1">
      {/* Top Demo Simulation & Auto-Play Controller */}
      <DemoModeBar />

      {/* Top Real-Time Flight KPI Strip */}
      <MissionKpiStrip />

      {/* Main Dual-Column Flight Operations Deck */}
      <div className="grid grid-cols-12 gap-3.5 flex-1 min-h-0">
        {/* Left Column (7 cols): Camera View + Spatial Attitude & Bandwidth */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-3.5">
          {/* Multi-Spectral Optical HUD Camera */}
          <div className="h-[430px]">
            <CameraView />
          </div>

          {/* Dual sub-panels: Spatial Attitude & 99.2% Bandwidth Savings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <OrientationPanel />
            <BandwidthPanel />
          </div>
        </div>

        {/* Right Column (5 cols): Sequence Timeline + Decision Pipeline + Guidance & Controls */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-3.5">
          {/* 7-Step Protocol Sequence Execution Timeline */}
          <div className="h-[280px]">
            <SequenceTimeline />
          </div>

          {/* AI Decision Pipeline Flow */}
          <div className="h-[140px]">
            <DecisionPipeline />
          </div>

          {/* Visual Directives HUD Panel */}
          <div className="h-[135px]">
            <GuidancePanel />
          </div>

          {/* Simulation & Validation Controls */}
          <div>
            <ValidationControls />
          </div>
        </div>
      </div>

      {/* Completion Modal when all 7 steps verify */}
      <CompletionReport />
    </div>
  );
};
