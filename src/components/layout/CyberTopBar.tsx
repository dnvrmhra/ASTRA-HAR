import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import type { PageKey } from "../../App";
import { useMission } from "../../state/MissionStore";
import { formatClock } from "../../state/sim";

interface CyberTopBarProps {
  page: PageKey;
  onNavigate: (page: PageKey) => void;
}

export const CyberTopBar: React.FC<CyberTopBarProps> = ({ page, onNavigate }) => {
  const { state } = useMission();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => setUptime(Date.now() - start), 1000);
    return () => window.clearInterval(id);
  }, []);

  const navTabs: { key: PageKey; label: string; dotColor?: string }[] = [
    { key: "overview", label: "Overview", dotColor: "bg-emerald-400" },
    { key: "live", label: "Live Console", dotColor: "bg-sky-400" },
    { key: "vision", label: "AI Vision" },
    { key: "protocol", label: "Protocol" },
    { key: "health", label: "Diagnostics" },
    { key: "events", label: "Audit Log" },
    { key: "video", label: "Optics" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <header className="h-[56px] shrink-0 flex items-center justify-between px-6 z-30 relative select-none">
      {/* Left: ASTRA-HAR Logo (Minimal, Perfectly Balanced) */}
      <div 
        onClick={() => onNavigate("overview")}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center bg-slate-900/80 border border-white/10 shadow-md group-hover:border-sky-400/50 transition-colors shrink-0">
          <svg className="w-4 h-4 text-slate-200 group-hover:text-sky-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="8" strokeOpacity="0.4" />
            <path d="M12 4v4m0 8v4M4 12h4m8 0h4" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.8" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-[15px] tracking-[0.14em] text-white uppercase leading-none">
            ASTRA<span className="font-light text-sky-400">-HAR</span>
          </span>
          <span className="text-[7.5px] font-mono tracking-widest text-slate-400 uppercase mt-1 leading-none">
            AUTONOMOUS ASTRONAUT ACTIVITY RECOGNITION • TEAM UNOFLYP
          </span>
        </div>
      </div>

      {/* Center: Sleek Capsule Pill Navigation */}
      <div className="cd-nav-capsule px-1.5 py-1 flex items-center gap-0.5 overflow-x-auto">
        {navTabs.map((tab) => {
          const active = page === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onNavigate(tab.key)}
              className={`cd-nav-item flex items-center gap-1.5 whitespace-nowrap text-[11.5px] px-3.5 py-1.5 ${
                active ? "cd-nav-item-active" : ""
              }`}
            >
              {tab.dotColor && active && (
                <span className={`w-1.5 h-1.5 rounded-full ${tab.dotColor} shadow-[0_0_8px_rgba(52,211,153,0.9)]`} />
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Unified Single-Pill Flight Telemetry & Live Alert Indicator */}
      <div className="flex items-center">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full cd-nav-capsule text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                state.system.networkOnline
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                  : "bg-amber-400"
              }`}
            />
            <span className="font-semibold tracking-wider text-[10px] text-slate-200">
              {state.system.networkOnline ? "UPLINK NOMINAL" : "OFFLINE BUFFER"}
            </span>
          </div>

          <span className="w-px h-3 bg-white/10" />

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[8.5px] tracking-wider text-slate-500 font-bold">MET</span>
            <span className="text-sky-400 font-bold tabular-nums text-[11px]">
              {formatClock(uptime)}
            </span>
          </div>

          {state.warningsCount > 0 && (
            <>
              <span className="w-px h-3 bg-white/10" />
              <button
                onClick={() => onNavigate("events")}
                className="flex items-center gap-1 text-rose-400 font-bold hover:text-rose-300 transition-colors cursor-pointer"
                title={`${state.warningsCount} Deviation Alert(s) Active`}
              >
                <Bell size={11} className="animate-pulse" />
                <span className="text-[9.5px]">{state.warningsCount} ALERT</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
