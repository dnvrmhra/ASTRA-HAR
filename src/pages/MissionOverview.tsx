import React from "react";
import { DataCentersPanel } from "../components/live/DataCentersPanel";
import { WaveformFailurePanel } from "../components/live/WaveformFailurePanel";
import { ConstellationRightPanel } from "../components/live/ConstellationRightPanel";
import { CompletionReport } from "../components/live/CompletionReport";
import type { PageKey } from "../App";

interface MissionOverviewProps {
  onNavigate?: (page: PageKey) => void;
}

export const MissionOverview: React.FC<MissionOverviewProps> = () => {
  return (
    <div className="flex-1 flex flex-col min-h-0 w-full select-none justify-center">
      {/* The Master CyberDefend Cockpit Grid: Two Main Halves matching the uploaded reference screenshot */}
      <div className="grid grid-cols-12 gap-3.5 h-full max-w-[1580px] mx-auto w-full items-stretch">
        {/* LEFT COLUMN: Data Centers + Towers (Top) & Chance of Failure Waveform (Bottom) */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-3.5 justify-between h-full min-h-0">
          <DataCentersPanel />
          <WaveformFailurePanel />
        </div>

        {/* RIGHT COLUMN: Sensor Constellation / Downlink Telemetry & Anomaly Detection */}
        <div className="col-span-12 xl:col-span-6 h-full min-h-0">
          <ConstellationRightPanel />
        </div>
      </div>

      {/* Completion Modal when all 7 steps verify */}
      <CompletionReport />
    </div>
  );
};
