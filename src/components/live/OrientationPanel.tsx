import React from "react";
import { useMission } from "../../state/MissionStore";

export const OrientationPanel: React.FC = () => {
  const { state, dispatch } = useMission();
  const { orientation } = state;
  const isRack = orientation.reference === "RACK";

  return (
    <div className="glass-panel p-4 rounded-2xl h-full flex flex-col justify-between border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="font-display text-[12.5px] font-bold text-slate-100 uppercase tracking-wider">
            Attitude & Vectors
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch({ type: "SET_ORIENTATION_REF", ref: "RACK" })}
            className={`px-2 py-0.5 rounded-md font-mono text-[9.5px] font-semibold transition-all ${
              isRack ? "bg-sky-500/20 text-sky-400 border border-sky-400/40" : "text-slate-400 hover:text-white"
            }`}
          >
            RACK
          </button>
          <button
            onClick={() => dispatch({ type: "SET_ORIENTATION_REF", ref: "FLOOR" })}
            className={`px-2 py-0.5 rounded-md font-mono text-[9.5px] font-semibold transition-all ${
              !isRack ? "bg-sky-500/20 text-sky-400 border border-sky-400/40" : "text-slate-400 hover:text-white"
            }`}
          >
            FLOOR
          </button>
        </div>
      </div>

      <div
        className="relative h-[95px] rounded-xl border border-white/[0.06] bg-slate-950/70 flex items-center justify-center overflow-hidden my-1"
        style={{ perspective: "350px" }}
      >
        <div
          className="relative w-[90px] h-[55px] rounded-lg border-2 border-sky-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.25)]"
          style={{
            transformStyle: "preserve-3d",
            transform: isRack
              ? `rotateX(${orientation.y}deg) rotateY(${orientation.x}deg)`
              : `rotateX(${8 + orientation.y * 0.3}deg) rotateY(${orientation.x * 0.3}deg)`,
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            background: "linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(14,165,233,0.04) 100%)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-sky-400 neon-glow-cyan" />
          <span className="absolute -bottom-3.5 font-mono text-[8px] text-slate-400 tracking-wider">
            {isRack ? "RACK VECTOR" : "CABIN PLANE"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "ROLL (X)", val: `${orientation.x.toFixed(1)}°` },
          { label: "PITCH (Y)", val: `${orientation.y.toFixed(1)}°` },
          { label: "YAW (Z)", val: `${orientation.z.toFixed(1)}°` },
        ].map((axis) => (
          <div key={axis.label} className="bg-slate-900/50 p-1.5 rounded-xl border border-white/[0.04]">
            <span className="text-[8.5px] font-mono text-slate-400">{axis.label}</span>
            <div className="font-mono text-[12px] font-bold text-slate-100">{axis.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
