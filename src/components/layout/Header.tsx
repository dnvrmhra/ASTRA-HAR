import React, { useEffect, useState } from "react";
import { Bell, Search, Shield } from "lucide-react";
import { useMission } from "../../state/MissionStore";
import { StatusDot } from "../ui/Primitives";
import { formatClock } from "../../state/sim";
import type { PageKey } from "../../App";

interface HeaderProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
}

const NAV_TABS: { key: PageKey; label: string }[] = [
  { key: "live", label: "Overview" },
  { key: "overview", label: "Mission Spec" },
  { key: "vision", label: "Vision AI" },
  { key: "protocol", label: "Protocols" },
  { key: "events", label: "Alerts & Log" },
  { key: "health", label: "Telemetry" },
  { key: "video", label: "Optics" },
  { key: "settings", label: "Config" },
];

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { state } = useMission();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => setUptime(Date.now() - start), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="h-[68px] shrink-0 flex items-center justify-between px-6 z-20 relative select-none">
      {/* Left: Brand Identity like CYBERDEFEND */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl glass-pill flex items-center justify-center text-sky-400 shrink-0 border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
          <Shield size={18} strokeWidth={2.2} className="text-sky-400" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-display text-[16px] font-extrabold tracking-wider text-white uppercase flex items-center gap-1.5">
              ASTRA<span className="text-sky-400">HAR</span>
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 tracking-wider">
            {state.experiment.id} · {state.experiment.name}
          </span>
        </div>
      </div>

      {/* Center: Segmented Floating Pill Navigation bar (as in the screenshot) */}
      <nav className="glass-pill p-1 rounded-full flex items-center gap-1 border border-white/10 shadow-2xl">
        {NAV_TABS.map((tab) => {
          const active = currentPage === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onNavigate(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 tracking-tight ${
                active
                  ? "glass-pill-active font-semibold shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right: Cockpit Action Icons & Elapsed Clock */}
      <div className="flex items-center gap-3">
        {/* Connection Pulse */}
        <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-2 text-[11px] font-mono text-slate-300">
          <StatusDot on={!state.system.networkOnline} color={state.system.networkOnline ? "ok" : "warn"} pulse />
          <span>{state.system.networkOnline ? "LINK 100%" : "OFFLINE FIRST"}</span>
        </div>

        {/* Mission Elapsed Time Pill */}
        <div className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2">
          <span className="text-[9px] font-mono text-slate-400 tracking-wider">MET</span>
          <span className="font-mono text-[13px] font-bold text-sky-400 tabular-nums">
            {formatClock(uptime)}
          </span>
        </div>

        {/* Quick Utility Icon Group (Search, Bell, Stream) */}
        <div className="flex items-center gap-1.5">
          <button
            title="Search Telemetry"
            className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-slate-300 hover:text-sky-400 transition-colors"
          >
            <Search size={14} />
          </button>
          <button
            title="Active Notifications"
            className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-slate-300 hover:text-sky-400 transition-colors relative"
          >
            <Bell size={14} />
            {state.warningsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 pulse-dot" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
