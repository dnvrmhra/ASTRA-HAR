import React from "react";

/* ─── Glassmorphism Panel (Cockpit Frame) ─── */
export const Panel: React.FC<{
  title?: string;
  eyebrow?: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  bodyClassName?: string;
}> = ({ title, eyebrow, right, className = "", children, bodyClassName = "" }) => (
  <div
    className={`glass-panel flex flex-col min-h-0 overflow-hidden relative transition-all duration-300 ${className}`}
  >
    {(title || right || eyebrow) && (
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
        <div>
          {eyebrow && (
            <div className="font-mono text-[9px] tracking-[0.14em] text-accent/80 mb-0.5 uppercase font-medium">
              {eyebrow}
            </div>
          )}
          {title && (
            <div className="font-display text-[13.5px] font-semibold text-slate-100 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60 inline-block" />
              {title}
            </div>
          )}
        </div>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    )}
    <div className={`flex-1 min-h-0 ${bodyClassName}`}>{children}</div>
  </div>
);

/* ─── StatusDot ─── */
export const StatusDot: React.FC<{
  on: boolean;
  color?: "cyan" | "ok" | "warn" | "crit";
  pulse?: boolean;
}> = ({ on, color = "ok", pulse = true }) => {
  const c: Record<string, string> = {
    cyan: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]",
    ok:   "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    warn: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    crit: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${
        on ? c[color] : "bg-slate-600"
      } ${on && pulse ? "pulse-dot" : ""}`}
    />
  );
};

/* ─── Modern Glass Badge ─── */
export const Badge: React.FC<{
  tone?: "cyan" | "ok" | "warn" | "crit" | "neutral" | "system";
  children: React.ReactNode;
  className?: string;
}> = ({ tone = "neutral", children, className = "" }) => {
  const t: Record<string, string> = {
    cyan:    "bg-sky-500/10 text-sky-400 border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]",
    ok:      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.15)]",
    warn:    "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(251,191,36,0.15)]",
    crit:    "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
    neutral: "bg-slate-800/50 text-slate-300 border-white/10",
    system:  "bg-slate-800/50 text-slate-400 border-white/10",
  };
  return (
    <span
      className={`font-mono text-[10px] font-semibold tracking-[0.08em] px-2.5 py-0.5 border rounded-full uppercase backdrop-blur-md transition-colors ${t[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

/* ─── SectionLabel ─── */
export const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`font-mono text-[9px] tracking-[0.14em] text-slate-400 uppercase font-medium ${className}`}>
    {children}
  </div>
);

/* ─── Cyber Pill Button ─── */
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    tone?: "default" | "cyan" | "ok" | "warn" | "crit";
    size?: "sm" | "md";
  }
> = ({ tone = "default", size = "md", className = "", children, ...rest }) => {
  const t: Record<string, string> = {
    default: "glass-pill text-slate-200 hover:text-white",
    cyan:    "bg-sky-500/15 border border-sky-400/40 text-sky-300 hover:bg-sky-500/25 hover:border-sky-400/60 shadow-[0_0_16px_rgba(56,189,248,0.2)]",
    ok:      "bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-400/60 shadow-[0_0_16px_rgba(52,211,153,0.2)]",
    warn:    "bg-amber-500/15 border border-amber-400/40 text-amber-300 hover:bg-amber-500/25 hover:border-amber-400/60 shadow-[0_0_16px_rgba(251,191,36,0.2)]",
    crit:    "bg-rose-500/15 border border-rose-400/40 text-rose-300 hover:bg-rose-500/25 hover:border-rose-400/60 shadow-[0_0_16px_rgba(244,63,94,0.2)]",
  };
  const s: Record<string, string> = {
    sm: "px-3 py-1.5 text-[11px] rounded-lg",
    md: "px-4 py-2 text-[12.5px] rounded-xl",
  };
  return (
    <button
      className={`font-sans font-medium tracking-tight backdrop-blur-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97] focus:outline-none flex items-center justify-center gap-2 ${t[tone]} ${s[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

/* ─── MetricBar ─── */
export const MetricBar: React.FC<{
  label: string;
  value: number;
  suffix?: string;
  tone?: "cyan" | "ok" | "warn";
}> = ({ label, value, suffix = "%", tone = "cyan" }) => {
  const bar: Record<string, string>  = {
    cyan: "bg-gradient-to-r from-sky-500 to-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.6)]",
    ok:   "bg-gradient-to-r from-emerald-500 to-teal-300 shadow-[0_0_10px_rgba(52,211,153,0.6)]",
    warn: "bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]",
  };
  const text: Record<string, string> = { cyan: "text-sky-400", ok: "text-emerald-400", warn: "text-amber-400" };
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11.5px] text-slate-300 font-medium">{label}</span>
        <span className={`font-mono text-[11.5px] font-semibold ${text[tone]}`}>
          {value.toFixed(value % 1 === 0 ? 0 : 1)}{suffix}
        </span>
      </div>
      <div className="h-1.5 bg-slate-900/80 rounded-full overflow-hidden p-[1px] border border-white/[0.06]">
        <div
          className={`h-full ${bar[tone]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
};
