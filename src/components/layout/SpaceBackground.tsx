import React from "react";
import { SpinningGlobe } from "./SpinningGlobe";
import { useMission } from "../../state/MissionStore";

export const SpaceBackground: React.FC = () => {
  const { state } = useMission();
  const isLight = state.theme === "light";

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background layer with smooth transition between Deep Space & Daylight Exosphere */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isLight
            ? "bg-gradient-to-b from-[#a8c7e8] via-[#cadcf0] to-[#e8f1fb]"
            : "bg-[#06090e]"
        }`}
      />

      {/* 3D Realistic Spinning Globe with atmospheric scattering */}
      <SpinningGlobe />

      {/* Radiant atmospheric diffuse halo centered behind the globe */}
      <div
        className="absolute pointer-events-none transition-all duration-500"
        style={{
          top: "14%",
          left: "32%",
          width: "38%",
          height: "55%",
          borderRadius: "50%",
          background: isLight
            ? "radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.45) 0%, rgba(125, 211, 252, 0.25) 45%, rgba(186, 230, 253, 0.1) 70%, transparent 85%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(2, 132, 199, 0.32) 0%, rgba(3, 105, 161, 0.16) 45%, rgba(6, 32, 70, 0.04) 70%, transparent 85%)",
          filter: "blur(65px)",
        }}
      />

      {/* Starry dust points (visible in dark mode) */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
          isLight ? "opacity-5" : "opacity-25"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 80px 120px, #ffffff, transparent), radial-gradient(1px 1px at 240px 310px, rgba(255,255,255,0.7), transparent), radial-gradient(1.5px 1.5px at 580px 140px, #38bdf8, transparent), radial-gradient(1px 1px at 980px 220px, #ffffff, transparent), radial-gradient(1px 1px at 1240px 480px, #ffffff, transparent), radial-gradient(1px 1px at 1380px 180px, #93c5fd, transparent)",
          backgroundRepeat: "repeat",
          backgroundSize: "600px 600px",
        }}
      />
    </div>
  );
};
