import { useState } from "react";
import { MissionProvider, useMission } from "./state/MissionStore";
import { CyberTopBar } from "./components/layout/CyberTopBar";
import { SpaceBackground } from "./components/layout/SpaceBackground";
import { MissionOverview } from "./pages/MissionOverview";
import { LiveExperiment } from "./pages/LiveExperiment";
import { Protocol } from "./pages/Protocol";
import { AIVision } from "./pages/AIVision";
import { EventLog } from "./pages/EventLog";
import { VideoStream } from "./pages/VideoStream";
import { SystemHealth } from "./pages/SystemHealth";
import { Settings } from "./pages/Settings";

export type PageKey =
  | "overview"
  | "live"
  | "protocol"
  | "vision"
  | "events"
  | "video"
  | "health"
  | "settings";

function AppShell() {
  const [page, setPage] = useState<PageKey>("overview");
  const { state } = useMission();
  const isLight = state.theme === "light";

  return (
    <div
      className={`relative flex flex-col h-screen w-screen font-sans overflow-hidden select-none transition-colors duration-300 ${
        isLight ? "theme-light text-slate-900" : "bg-[#06090e] text-[#c9d1d9]"
      }`}
    >
      {/* Background with illuminated 3D Earth Horizon */}
      <SpaceBackground />

      {/* Top Header with ASTRA-HAR Logo, Pill Capsule Menu, and Action Buttons */}
      <CyberTopBar page={page} onNavigate={setPage} />

      {/* Main Command Console Cockpit Viewport */}
      <main className="flex-1 min-w-0 min-h-0 relative z-10 px-6 pb-4 flex flex-col overflow-hidden">
        {page === "overview" && <MissionOverview onNavigate={setPage} />}
        {page === "live" && <LiveExperiment />}
        {page === "vision" && <AIVision />}
        {page === "protocol" && <Protocol />}
        {page === "health" && <SystemHealth />}
        {page === "events" && <EventLog />}
        {page === "video" && <VideoStream />}
        {page === "settings" && <Settings />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <MissionProvider>
      <AppShell />
    </MissionProvider>
  );
}
