import React, { useState } from "react";
import { Plus, Trash2, Save, ArrowRight, CheckCircle2, Box, Layers } from "lucide-react";
import { useMission } from "../state/MissionStore";
import { OBJECT_TAGS, INTERACTION_TAGS } from "../data/defaultProtocol";
import type { Experiment, ExperimentStep, InteractionTag, ObjectTag } from "../types";

function blankStep(index: number): ExperimentStep {
  return {
    id: `step-${Date.now()}-${index}`,
    index,
    action: "New Sample Interaction",
    requiredObject: "RED BOX",
    interaction: "PICK UP",
    confidenceThreshold: 85,
    voiceInstruction: "Perform designated payload action.",
    verifiedLine: "Step executed per specification.",
  };
}

// Compute deterministic model metrics per object & interaction
function computeStepMetrics(step: ExperimentStep) {
  let baseLatency = 1.6;
  let sensitivity = 92.4;
  let specificity = 90.8;
  let boundingH = 35;
  let poseH = 45;
  let dagH = 20;

  if (step.requiredObject === "RED BOX") {
    baseLatency = 1.9;
    sensitivity = 94.6;
    specificity = 92.1;
    boundingH = 45;
    poseH = 35;
    dagH = 20;
  } else if (step.requiredObject === "YELLOW BOX") {
    baseLatency = 1.8;
    sensitivity = 93.8;
    specificity = 91.5;
    boundingH = 42;
    poseH = 38;
    dagH = 20;
  } else if (step.requiredObject === "EXPERIMENT CONTAINER") {
    baseLatency = 1.4;
    sensitivity = 97.2;
    specificity = 95.4;
    boundingH = 30;
    poseH = 30;
    dagH = 40;
  } else if (step.requiredObject === "TARGET AREA") {
    baseLatency = 1.5;
    sensitivity = 95.1;
    specificity = 93.2;
    boundingH = 40;
    poseH = 40;
    dagH = 20;
  }

  if (step.interaction === "PICK UP") {
    baseLatency += 0.2;
    poseH += 5;
  } else if (step.interaction === "PLACE") {
    baseLatency += 0.1;
    boundingH += 5;
  } else if (step.interaction === "CLOSE" || step.interaction === "OPEN") {
    dagH += 5;
  }

  return {
    latencyMs: baseLatency.toFixed(2),
    sensitivity: (sensitivity - (100 - step.confidenceThreshold) * 0.15).toFixed(1),
    specificity: (specificity - (100 - step.confidenceThreshold) * 0.1).toFixed(1),
    boundingH: `${boundingH}%`,
    poseH: `${poseH}%`,
    dagH: `${dagH}%`,
  };
}

export const Protocol: React.FC = () => {
  const { state, dispatch } = useMission();
  const [draft, setDraft] = useState<Experiment>(structuredClone(state.experiment));
  const [savedMsg, setSavedMsg] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);

  const activeStep = draft.steps[selectedStepIndex] || draft.steps[0];
  const activeMetrics = computeStepMetrics(activeStep);

  const updateStep = (i: number, patch: Partial<ExperimentStep>) => {
    setDraft((d) => ({
      ...d,
      steps: d.steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  };

  const addStep = () => {
    setDraft((d) => ({ ...d, steps: [...d.steps, blankStep(d.steps.length)] }));
    setSelectedStepIndex(draft.steps.length);
  };

  const removeStep = (i: number) => {
    if (draft.steps.length <= 1) return;
    setDraft((d) => ({
      ...d,
      steps: d.steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, index: idx })),
    }));
    if (selectedStepIndex >= draft.steps.length - 1) {
      setSelectedStepIndex(Math.max(0, draft.steps.length - 2));
    }
  };

  const save = () => {
    dispatch({ type: "SAVE_PROTOCOL", experiment: draft });
    dispatch({ type: "SET_PROTOCOL", experiment: draft });
    setSavedMsg(true);
    window.setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-4 select-none max-w-[1580px] mx-auto w-full flex flex-col justify-between space-y-3.5">
      {/* Top Header Bar */}
      <div className="cd-panel px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,1)]" />
          <div>
            <h1 className="text-[15px] font-bold text-white tracking-tight uppercase font-display">
              Protocol Sequence Architect & Asset Dispatch
            </h1>
            <span className="text-[9.5px] font-mono text-slate-400">
              {draft.id} • {draft.steps.length} STEPS CONFIGURATION • ISRO PS-26174
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={addStep}
            className="btn-liquid-glass px-3.5 py-1.5 text-[11px] font-mono text-slate-200 hover:text-white flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>ADD STEP</span>
          </button>
          <button
            onClick={save}
            className="btn-liquid-primary px-4 py-1.5 text-[11.5px] font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
          >
            <Save size={13} />
            <span>{savedMsg ? "ACTIVATED!" : "SAVE & DEPLOY"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Protocol Flowchart Ribbon */}
      <div className="cd-panel p-3">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-2">
            <Layers size={13} className="text-sky-400" />
            <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider">
              PROTOCOL SEQUENCE FLOWCHART (CLICK NODE TO EDIT)
            </span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400">
            ACTIVE TARGET: {activeStep.requiredObject} ({activeStep.interaction})
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1">
          {draft.steps.map((s, idx) => {
            const isSelected = idx === selectedStepIndex;
            return (
              <React.Fragment key={s.id}>
                <div
                  onClick={() => setSelectedStepIndex(idx)}
                  className={`cd-pill p-2.5 min-w-[140px] max-w-[170px] cursor-pointer transition-all shrink-0 ${
                    isSelected
                      ? "border-sky-400/80 bg-sky-500/25 shadow-[0_0_20px_rgba(56,189,248,0.4)] ring-1 ring-sky-400"
                      : "opacity-80 hover:opacity-100 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                    <span className={`font-bold ${isSelected ? "text-sky-300" : "text-slate-400"}`}>
                      STEP 0{idx + 1}
                    </span>
                    <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-slate-800 text-sky-400">
                      {s.confidenceThreshold}%
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-white truncate">{s.action}</div>
                  <div className="flex items-center gap-1 text-[8.5px] font-mono text-slate-400 mt-1">
                    <Box size={10} className="text-sky-400 shrink-0" />
                    <span className="truncate">{s.requiredObject}</span>
                  </div>
                </div>
                {idx < draft.steps.length - 1 && (
                  <ArrowRight size={14} className="text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-12 gap-3.5 flex-1 min-h-[480px]">
        {/* LEFT COLUMN: Steps List */}
        <div className="col-span-12 lg:col-span-3 cd-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                ACTIVE STEP SEQUENCES
              </span>
              <span className="text-[9px] font-mono text-emerald-400">{draft.steps.length} STEPS</span>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {draft.steps.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedStepIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    idx === selectedStepIndex
                      ? "border-sky-400/60 bg-sky-500/20 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                      : "cd-card text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[9.5px] font-bold ${
                        idx === selectedStepIndex ? "bg-sky-400 text-slate-950" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11.5px] font-semibold truncate leading-none">{s.action}</div>
                      <div className="text-[8.5px] font-mono text-slate-400 mt-1">
                        {s.requiredObject} • {s.interaction}
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold text-sky-400">{s.confidenceThreshold}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06]">
            <span className="text-[8.5px] font-mono text-slate-500 uppercase block mb-1">DEPLOYED SPECIFICATION</span>
            <span className="text-[11px] font-bold text-slate-300 font-mono truncate block">{draft.name}</span>
          </div>
        </div>

        {/* CENTER COLUMN: Dynamic Graphs matching selected step & object */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-3.5 justify-between">
          {/* Top: Dual Wavy Line Comparison Graph with dynamic object sensitivity */}
          <div className="cd-panel p-4 h-[245px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  Confidence Sensitivity & Decision Boundary Curves
                </span>
                <span className="text-[8.5px] font-mono text-sky-400">
                  EVALUATING: STEP 0{selectedStepIndex + 1} • {activeStep.requiredObject} ({activeStep.interaction})
                </span>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-emerald-400" /> Sens: {activeMetrics.sensitivity}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-sky-400" /> Spec: {activeMetrics.specificity}%
                </span>
                <span className="text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                  THRESHOLD {activeStep.confidenceThreshold}%
                </span>
              </div>
            </div>

            {/* SVG Dual Wavy Lines with Dynamic Target Line & Node Highlight */}
            <div className="flex-1 flex min-h-0 relative items-center">
              <div className="w-7 flex flex-col justify-between h-full py-1 text-[8px] font-mono text-slate-500">
                <span>100%</span>
                <span>85%</span>
                <span>70%</span>
                <span>50%</span>
              </div>

              <div className="flex-1 h-full relative">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 130">
                  {/* Horizontal reference lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="0" y1="55" x2="500" y2="55" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />

                  {/* Dynamic Threshold line for activeStep */}
                  {(() => {
                    const lineY = 130 - (activeStep.confidenceThreshold / 100) * 110;
                    return (
                      <g>
                        <line
                          x1="0"
                          y1={lineY}
                          x2="500"
                          y2={lineY}
                          stroke="#38bdf8"
                          strokeWidth="1.4"
                          strokeDasharray="4 2"
                          opacity="0.8"
                        />
                        <text x="440" y={lineY - 4} fill="#38bdf8" fontSize="8" fontFamily="monospace">
                          {activeStep.confidenceThreshold}% CUTOFF
                        </text>
                      </g>
                    );
                  })()}

                  {/* Green wavy line (Sensitivity / TPR) */}
                  <path
                    d="M 0,65 C 50,25 90,85 140,40 C 190,75 230,20 280,65 C 330,30 380,85 430,45 C 470,25 500,60 500,60"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2.4"
                    filter="drop-shadow(0 0 6px rgba(52,211,153,0.6))"
                  />

                  {/* Blue wavy line (Specificity) */}
                  <path
                    d="M 0,75 C 50,110 90,55 140,100 C 190,65 230,115 280,75 C 330,110 380,55 430,95 C 470,115 500,80 500,80"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.4"
                    filter="drop-shadow(0 0 6px rgba(56,189,248,0.6))"
                  />

                  {/* Key Decision Points with active pulse on selected step */}
                  {[
                    { cx: 70, cy: 50 },
                    { cx: 140, cy: 40 },
                    { cx: 210, cy: 55 },
                    { cx: 280, cy: 65 },
                    { cx: 350, cy: 45 },
                    { cx: 430, cy: 45 },
                    { cx: 480, cy: 55 },
                  ].map((pt, i) => {
                    const isCurrent = i === selectedStepIndex % 7;
                    return (
                      <g key={i}>
                        <circle
                          cx={pt.cx}
                          cy={pt.cy}
                          r={isCurrent ? 5.5 : 3}
                          fill={isCurrent ? "#ffffff" : "#34d399"}
                          stroke={isCurrent ? "#38bdf8" : "none"}
                          strokeWidth={isCurrent ? 2 : 0}
                          filter={isCurrent ? "drop-shadow(0 0 8px #38bdf8)" : undefined}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between text-[8.5px] font-mono text-slate-500 px-2 pt-1 border-t border-white/[0.04]">
              <span>INGEST: 1080P</span>
              <span>OBJECT: {activeStep.requiredObject}</span>
              <span>VERIFY: INT8 NPU</span>
              <span>STATE: DETERMINISTIC DAG</span>
            </div>
          </div>

          {/* Bottom: Stacked Column Bar Chart dynamically reacting to selected step & objects */}
          <div className="cd-panel p-4 h-[245px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  ACTION FREQUENCY & STEP WEIGHT MATRIX
                </span>
                <span className="text-[15px] font-mono font-bold text-white">
                  Active Step Latency: {activeMetrics.latencyMs} ms
                </span>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-emerald-400" /> Bounding
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-sky-400" /> Pose
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-indigo-500" /> DAG
                </span>
              </div>
            </div>

            {/* Stacked Columns dynamically generated from draft steps */}
            <div className="flex-1 flex items-end justify-between px-2 pt-2 gap-2">
              {draft.steps.map((s, idx) => {
                const isSelected = idx === selectedStepIndex;
                const metrics = computeStepMetrics(s);
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStepIndex(idx)}
                    className="flex-1 flex flex-col items-center gap-1 cursor-pointer transition-all"
                  >
                    <span
                      className={`text-[8px] font-mono font-bold ${
                        isSelected ? "text-sky-300" : "text-slate-400"
                      }`}
                    >
                      {metrics.latencyMs}ms
                    </span>
                    <div
                      className={`w-full max-w-[32px] h-[95px] flex flex-col justify-end gap-0.5 p-0.5 rounded-sm transition-all ${
                        isSelected
                          ? "ring-2 ring-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)] bg-sky-500/10"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <div
                        className="w-full bg-emerald-400 rounded-t-sm shadow-[0_0_6px_rgba(52,211,153,0.5)]"
                        style={{ height: metrics.boundingH }}
                      />
                      <div
                        className="w-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]"
                        style={{ height: metrics.poseH }}
                      />
                      <div
                        className="w-full bg-indigo-500 rounded-b-sm"
                        style={{ height: metrics.dagH }}
                      />
                    </div>
                    <span
                      className={`text-[8.5px] font-mono ${
                        isSelected ? "text-white font-bold" : "text-slate-400"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Parameter Dispatch / Editor Card */}
        <div className="col-span-12 lg:col-span-3 cd-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-3">
              <span className="text-[10.5px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                Step Parameter Editor
              </span>
              <button
                onClick={() => removeStep(selectedStepIndex)}
                className="text-rose-400 hover:text-rose-300 transition-colors p-1"
                title="Remove Step"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase">Action Description</label>
                <input
                  value={activeStep.action}
                  onChange={(e) => updateStep(selectedStepIndex, { action: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900/60 border border-white/10 text-[12px] text-white font-medium focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase">Target Object</label>
                  <select
                    value={activeStep.requiredObject}
                    onChange={(e) => updateStep(selectedStepIndex, { requiredObject: e.target.value as ObjectTag })}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-900/60 border border-white/10 text-[11px] text-white focus:border-sky-400 focus:outline-none"
                  >
                    {OBJECT_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase">Interaction</label>
                  <select
                    value={activeStep.interaction}
                    onChange={(e) => updateStep(selectedStepIndex, { interaction: e.target.value as InteractionTag })}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-900/60 border border-white/10 text-[11px] text-white focus:border-sky-400 focus:outline-none"
                  >
                    {INTERACTION_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono text-slate-400 uppercase">
                  Crew Step Directive (HUD Display)
                </label>
                <input
                  value={activeStep.voiceInstruction}
                  onChange={(e) => updateStep(selectedStepIndex, { voiceInstruction: e.target.value })}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900/60 border border-white/10 text-[11.5px] text-white focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span>CONFIDENCE THRESHOLD</span>
                  <span className="text-sky-400 font-bold">{activeStep.confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={98}
                  value={activeStep.confidenceThreshold}
                  onChange={(e) => updateStep(selectedStepIndex, { confidenceThreshold: Number(e.target.value) })}
                  className="w-full mt-1.5 accent-sky-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-400/20 text-[10px] font-mono text-sky-300">
              Sensitivity: <strong className="text-white">{activeMetrics.sensitivity}%</strong> · Latency:{" "}
              <strong className="text-white">{activeMetrics.latencyMs}ms</strong>
            </div>
            <button
              onClick={save}
              className="w-full py-2 btn-liquid-primary text-[11.5px] font-semibold flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={13} /> Update Protocol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
