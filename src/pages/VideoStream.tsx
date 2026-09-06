import React, { useEffect, useState } from "react";
import { PlayCircle, StopCircle, FolderOpen, Video, Radio, HardDrive, Activity, Clock } from "lucide-react";
import { useMission } from "../state/MissionStore";
import { formatClock } from "../state/sim";
import { CameraView } from "../components/live/CameraView";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const bitrateTelemetry = [
  { t: "00s", vbr: 4.2, h265: 3.8 },
  { t: "05s", vbr: 4.8, h265: 4.0 },
  { t: "10s", vbr: 5.4, h265: 4.2 },
  { t: "15s", vbr: 6.1, h265: 4.5 },
  { t: "20s", vbr: 4.9, h265: 4.1 },
  { t: "25s", vbr: 5.2, h265: 4.3 },
  { t: "30s", vbr: 4.6, h265: 3.9 },
  { t: "35s", vbr: 5.8, h265: 4.4 },
  { t: "40s", vbr: 5.1, h265: 4.0 },
  { t: "45s", vbr: 4.7, h265: 3.8 },
];

export const VideoStream: React.FC = () => {
  const { state, dispatch } = useMission();
  const [recDuration, setRecDuration] = useState(0);
  const [openedMsg, setOpenedMsg] = useState(false);
  const [activeClip, setActiveClip] = useState<string>("T+00:15");

  useEffect(() => {
    if (!state.recording) return;
    const id = window.setInterval(() => setRecDuration((d) => d + 1), 1000);
    return () => window.clearInterval(id);
  }, [state.recording]);

  const filename = `${state.experiment.id}_${new Date().toISOString().slice(0, 10)}_CAM01.mp4`;
  const storageUsedMb = Math.round(state.storedMb + recDuration * 0.6);

  const relayEndpoints = [
    { name: "ISS Columbus Module LAN", ip: "192.168.4.21:8554", ping: "0.8 ms", status: "NOMINAL", color: "text-emerald-400" },
    { name: "Space-to-Ground Ka-Band Uplink", ip: "10.240.12.8:9000", ping: "14.2 ms", status: "UPLINKING", color: "text-sky-400" },
    { name: "ISRO Telemetry Node (Bangalore)", ip: "172.16.80.4:554", ping: "38.5 ms", status: "STANDBY", color: "text-amber-400" },
  ];

  const recordedMilestones = [
    { id: "T+00:15", title: "Red Reagent Tube Bounded", conf: "96.8%", time: "00:15", duration: "12s" },
    { id: "T+00:45", title: "Astronaut Fluid Agitation", conf: "98.2%", time: "00:45", duration: "18s" },
    { id: "T+01:10", title: "Centrifuge Target Area Ingest", conf: "94.5%", time: "01:10", duration: "24s" },
    { id: "T+01:35", title: "Sequence DAG Milestone Verified", conf: "99.1%", time: "01:35", duration: "16s" },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 select-none max-w-[1580px] mx-auto w-full space-y-3.5">
      {/* Top Header Bar: Optics & Video Telemetry Header */}
      <div className="cd-panel px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,1)]" />
          <div>
            <h1 className="text-[16px] font-bold text-white tracking-tight uppercase font-display">
              Payload Optics & Multi-Spectral Video Ground Station
            </h1>
            <span className="text-[9.5px] font-mono text-slate-400">
              ISRO PS-26174 • 1080P@30FPS H.265 HARDWARE ENCODER • 4.8 MBPS VBR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="btn-liquid-glass px-3 py-1 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPTICAL STABLE • JITTER: 1.2ms</span>
          </div>
          <div className="btn-liquid-glass px-3 py-1 text-[10px] font-mono text-sky-400">
            <span>BITRATE: 4.8 Mbps VBR</span>
          </div>
        </div>
      </div>

      {/* Master 12-Column Grid */}
      <div className="grid grid-cols-12 gap-3.5 min-h-[580px]">
        {/* LEFT COLUMN (7 cols): Full-Height Multi-Spectral Camera View */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-3.5">
          <div className="cd-panel p-2 h-[480px] relative">
            <CameraView />
          </div>

          {/* Under-Camera Optical Sensor Parameters Strip */}
          <div className="cd-panel p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
            <div className="cd-card p-2">
              <span className="text-slate-500 uppercase text-[8.5px] block">Sensor Lens</span>
              <span className="text-white font-bold">24mm Aero f/1.8</span>
            </div>
            <div className="cd-card p-2">
              <span className="text-slate-500 uppercase text-[8.5px] block">Shutter / ISO</span>
              <span className="text-sky-400 font-bold">1/500s • ISO 400</span>
            </div>
            <div className="cd-card p-2">
              <span className="text-slate-500 uppercase text-[8.5px] block">Encoder Pipeline</span>
              <span className="text-emerald-400 font-bold">H.265 Intra-Frame</span>
            </div>
            <div className="cd-card p-2">
              <span className="text-slate-500 uppercase text-[8.5px] block">Sensor Core Temp</span>
              <span className="text-slate-200 font-bold">38.4°C Nominal</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): 3 Elevated Telemetry Modules */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-3.5">
          {/* Module 1: Live Bitrate Telemetry Waveform */}
          <div className="cd-panel p-4 h-[210px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-sky-400" />
                <span className="text-[10.5px] font-mono font-bold text-slate-300 uppercase">
                  Live Encoding Bitrate (VBR)
                </span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">0 PACKETS DROPPED</span>
            </div>

            {/* Recharts AreaChart Waveform */}
            <div style={{ width: "100%", height: 110 }} className="relative mt-1">
              <ResponsiveContainer>
                <AreaChart data={bitrateTelemetry} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vbrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="h265Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <YAxis hide domain={[2, 8]} />
                  <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 9, fontFamily: "monospace" }} />
                  <Tooltip
                    contentStyle={{ background: "#0c1524", borderColor: "rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 10 }}
                  />
                  <Area type="monotone" dataKey="vbr" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#vbrGradient)" />
                  <Area type="monotone" dataKey="h265" stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#h265Gradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[8.5px] font-mono text-slate-400 pt-1 border-t border-white/[0.04]">
              <span>PEAK: 6.1 Mbps</span>
              <span>AVERAGE: 4.8 Mbps</span>
              <span className="text-emerald-400">BUFFER: 98% STABLE</span>
            </div>
          </div>

          {/* Module 2: On-Board NVMe Flash Ring Buffer */}
          <div className="cd-panel p-4 flex flex-col justify-between h-[210px]">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <HardDrive size={13} className="text-sky-400" />
                <span className="text-[10.5px] font-mono font-bold text-slate-300 uppercase">
                  NVMe Flash Ring Buffer (18 MB/hr)
                </span>
              </div>
              <span className={`font-mono text-[9px] font-bold ${state.recording ? "text-rose-400 animate-pulse" : "text-slate-500"}`}>
                {state.recording ? "● REC IN PROGRESS" : "STANDBY"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-1">
              <div className="cd-card p-2.5">
                <span className="text-[8.5px] font-mono text-slate-400 uppercase">Sector Allocation</span>
                <div className="font-mono text-[15px] font-bold text-white mt-0.5">{storageUsedMb} MB</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, (storageUsedMb / 500) * 100)}%` }} />
                </div>
              </div>

              <div className="cd-card p-2.5">
                <span className="text-[8.5px] font-mono text-slate-400 uppercase">Elapsed Flight Tape</span>
                <div className="font-mono text-[15px] font-bold text-sky-400 mt-0.5">{formatClock(recDuration * 1000)}</div>
                <span className="text-[8px] font-mono text-slate-500">WEAR LEVEL: 99.8%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: "SET_RECORDING", value: !state.recording })}
                className={`flex-1 py-1.5 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                  state.recording ? "btn-liquid-danger" : "btn-liquid-success"
                }`}
              >
                {state.recording ? <StopCircle size={13} /> : <PlayCircle size={13} />}
                <span>{state.recording ? "Halt Recording" : "Record Session"}</span>
              </button>
              <button
                onClick={() => {
                  setOpenedMsg(true);
                  window.setTimeout(() => setOpenedMsg(false), 2000);
                }}
                className="px-3 py-1.5 btn-liquid-glass text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <FolderOpen size={13} /> Explorer
              </button>
            </div>
            {openedMsg && (
              <div className="text-[9px] font-mono text-sky-400 p-1.5 rounded-lg bg-sky-500/10 border border-sky-400/20 text-center">
                VIRTUAL MOUNT: {filename}
              </div>
            )}
          </div>

          {/* Module 3: RTSP Relay Dispatch Matrix */}
          <div className="cd-panel p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-2">
              <div className="flex items-center gap-2">
                <Radio size={13} className="text-sky-400" />
                <span className="text-[10.5px] font-mono font-bold text-slate-300 uppercase">
                  RTSP Local Relay Matrix
                </span>
              </div>
              <span className={`font-mono text-[9px] font-bold ${state.streaming ? "text-emerald-400" : "text-slate-500"}`}>
                {state.streaming ? "BROADCASTING" : "IDLE"}
              </span>
            </div>

            {/* Endpoints List */}
            <div className="space-y-1.5 mb-2">
              {relayEndpoints.map((ep) => (
                <div key={ep.name} className="cd-pill p-2 flex items-center justify-between text-[9.5px] font-mono">
                  <div className="min-w-0">
                    <span className="text-slate-200 font-semibold truncate block">{ep.name}</span>
                    <span className="text-slate-500 text-[8px]">{ep.ip}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-bold block ${ep.color}`}>{ep.status}</span>
                    <span className="text-slate-500 text-[8px]">{ep.ping}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => dispatch({ type: "SET_STREAMING", value: !state.streaming })}
              className={`w-full py-2 text-[11px] font-bold flex items-center justify-center gap-2 transition-all ${
                state.streaming ? "btn-liquid-danger" : "btn-liquid-primary"
              }`}
            >
              <Video size={13} /> {state.streaming ? "Halt RTSP Stream" : "Start Local Relay Broadcast"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Flight Tape Milestone Scrubber */}
      <div className="cd-panel p-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-sky-400" />
            <span className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-wider">
              Flight Reel Milestone Archive
            </span>
          </div>
          <span className="text-[9.5px] font-mono text-slate-400">JUMP TO PROTOCOL KEYFRAME</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recordedMilestones.map((clip) => (
            <div
              key={clip.id}
              onClick={() => setActiveClip(clip.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between h-[85px] ${
                activeClip === clip.id
                  ? "border-sky-400/80 bg-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                  : "cd-card hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-sky-400 font-bold">{clip.id}</span>
                <span className="text-emerald-400">{clip.conf} CONF</span>
              </div>
              <div className="text-[11px] font-semibold text-white truncate leading-snug">
                {clip.title}
              </div>
              <div className="flex items-center justify-between text-[8.5px] font-mono text-slate-400">
                <span>TIME: {clip.time}</span>
                <span>DUR: {clip.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
