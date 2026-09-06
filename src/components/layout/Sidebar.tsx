import React from "react";
import {
  LayoutDashboard,
  Activity,
  ListChecks,
  ScanEye,
  ScrollText,
  Video,
  HeartPulse,
  Settings as SettingsIcon,
} from "lucide-react";
import type { PageKey } from "../../App";

const NAV: { key: PageKey; label: string; icon: React.ElementType }[] = [
  { key: "live",      label: "Overview",         icon: Activity },
  { key: "overview",  label: "Mission Spec",     icon: LayoutDashboard },
  { key: "vision",    label: "AI Vision",        icon: ScanEye },
  { key: "protocol",  label: "Protocol",         icon: ListChecks },
  { key: "events",    label: "Event Log",        icon: ScrollText },
  { key: "video",     label: "Video / Optics",   icon: Video },
  { key: "health",    label: "System Health",    icon: HeartPulse },
  { key: "settings",  label: "Settings",         icon: SettingsIcon },
];

export const Sidebar: React.FC<{
  page: PageKey;
  onNavigate: (p: PageKey) => void;
}> = ({ page, onNavigate }) => {
  return (
    <aside className="w-[72px] shrink-0 flex flex-col items-center py-4 z-20 select-none">
      <div className="glass-panel p-2 flex flex-col items-center gap-2 rounded-2xl border border-white/[0.08] shadow-2xl">
        {NAV.map((item) => {
          const active = item.key === page;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              title={item.label}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 relative group ${
                active
                  ? "bg-sky-500/20 text-sky-400 border border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />

              {/* Tooltip on hover */}
              <div className="absolute left-[54px] px-2.5 py-1 rounded-lg glass-panel text-[11px] font-medium text-slate-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/10">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
