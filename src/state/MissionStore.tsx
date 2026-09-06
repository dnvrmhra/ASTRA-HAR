import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import type {
  AIConfidenceMetrics,
  AIEvent,
  AIEventKind,
  Experiment,
  MissionPhase,
  OrientationState,
  StepStatus,
  SystemHealthSample,
  SystemStatus,
} from "../types";
import { defaultExperiment } from "../data/defaultProtocol";
import { clamp, formatTimeOfDay, jitter, nextId, seededWave } from "./sim";

const HEALTH_HISTORY_LEN = 60;

export interface OverlayToggles {
  pose: boolean;
  objects: boolean;
  hands: boolean;
  confidence: boolean;
}

export interface Deviation {
  kind: "SKIPPED" | "WRONG_SEQUENCE";
  expected: string;
  detected: string;
  atStep: number;
}

export interface UncertainState {
  confidence: number;
  atStep: number;
  reviewed: boolean;
}

interface State {
  experiment: Experiment;
  savedProtocols: Experiment[];
  stepStatuses: StepStatus[];
  currentStep: number;
  events: AIEvent[];
  system: SystemStatus;
  ai: AIConfidenceMetrics;
  health: SystemHealthSample[];
  phase: MissionPhase;
  deviation: Deviation | null;
  uncertain: UncertainState | null;
  overlays: OverlayToggles;
  orientation: OrientationState;
  demoMode: boolean;
  running: boolean;
  startedAt: number | null;
  elapsedMs: number;
  clockTick: number;
  warningsCount: number;
  uncertainCount: number;
  recording: boolean;
  streaming: boolean;
  storedMb: number;
  voiceEnabled: boolean;
  voiceRate: number;
  lastLogGeneratedAt: number | null;
  completionReportOpen: boolean;
  theme: "dark" | "light";
}

type Action =
  | { type: "TICK" }
  | { type: "CORRECT_ACTION" }
  | { type: "SKIP_STEP" }
  | { type: "WRONG_SEQUENCE" }
  | { type: "UNCERTAIN_ACTION" }
  | { type: "REVIEW_FRAME" }
  | { type: "WAIT_FOR_CONFIRMATION" }
  | { type: "RESET" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "TOGGLE_NETWORK" }
  | { type: "SET_ORIENTATION_REF"; ref: "FLOOR" | "RACK" }
  | { type: "TOGGLE_OVERLAY"; key: keyof OverlayToggles }
  | { type: "START_DEMO" }
  | { type: "PAUSE_DEMO" }
  | { type: "RESET_DEMO" }
  | { type: "SET_RECORDING"; value: boolean }
  | { type: "SET_STREAMING"; value: boolean }
  | { type: "SET_PROTOCOL"; experiment: Experiment }
  | { type: "SAVE_PROTOCOL"; experiment: Experiment }
  | { type: "SET_VOICE_ENABLED"; value: boolean }
  | { type: "SET_VOICE_RATE"; value: number }
  | { type: "LOG_GENERATED" }
  | { type: "OPEN_REPORT" }
  | { type: "CLOSE_REPORT" }
  | { type: "DISMISS_DEVIATION" }
  | { type: "TOGGLE_THEME" }
  | { type: "SET_THEME"; theme: "dark" | "light" };

function nowStamp() {
  return formatTimeOfDay(new Date());
}

function makeEvent(
  category: AIEvent["category"],
  kind: AIEventKind,
  message: string,
  extra?: Partial<AIEvent>
): AIEvent {
  return {
    id: nextId("evt"),
    t: Date.now(),
    timestamp: nowStamp(),
    category,
    kind,
    message,
    ...extra,
  };
}

function initStepStatuses(experiment: Experiment): StepStatus[] {
  return experiment.steps.map((_, i) => (i === 0 ? "current" : "pending"));
}

function initialState(): State {
  const experiment = defaultExperiment;
  return {
    experiment,
    savedProtocols: [experiment],
    stepStatuses: initStepStatuses(experiment),
    currentStep: 0,
    events: [
      makeEvent("SYSTEM", "EXPERIMENT_RESET", "Mission console initialised.", {
        detail: "ASTRA-HAR v0.1 loaded. Awaiting sequence start.",
      }),
    ],
    system: {
      edgeAiOnline: true,
      cameraOnline: true,
      voiceReady: true,
      networkOnline: true,
      sequenceEngineOnline: true,
      loggingOnline: true,
    },
    ai: {
      objectDetection: 98,
      poseEstimation: 96,
      handTracking: 94,
      activityRecognition: 93,
      sequenceValidation: 99,
      inferenceLatencyMs: 42,
      cameraFps: 30,
      aiFps: 24,
    },
    health: Array.from({ length: HEALTH_HISTORY_LEN }, (_, i) => ({
      t: i,
      cpu: 38,
      gpu: 52,
      memory: 61,
      temp: 41,
    })),
    phase: "IDLE",
    deviation: null,
    uncertain: null,
    overlays: { pose: true, objects: true, hands: true, confidence: true },
    orientation: { reference: "RACK", x: 12, y: -4, z: 87 },
    demoMode: false,
    running: false,
    startedAt: null,
    elapsedMs: 0,
    clockTick: 0,
    warningsCount: 0,
    uncertainCount: 0,
    recording: true,
    streaming: false,
    storedMb: 128,
    voiceEnabled: false,
    voiceRate: 1,
    lastLogGeneratedAt: null,
    completionReportOpen: false,
    theme: (typeof window !== "undefined" && (localStorage.getItem("astra_theme") as "dark" | "light")) || "dark",
  };
}

function advanceStep(state: State): State {
  const step = state.experiment.steps[state.currentStep];
  if (!step) return state;

  const events: AIEvent[] = [
    makeEvent("OBJECT", "OBJECT_DETECTED", `${step.requiredObject} detected`, {
      confidence: clamp(state.ai.objectDetection + jitter(0, 2, Date.now()), 90, 99.5),
      stepIndex: step.index,
    }),
    makeEvent(
      "ACTION",
      "HAND_OBJECT_INTERACTION",
      `Hand-object interaction: ${step.interaction} · ${step.requiredObject}`,
      { stepIndex: step.index }
    ),
    makeEvent("ACTION", "ACTION_RECOGNIZED", `Action recognised: ${step.action}`, {
      confidence: clamp(state.ai.activityRecognition + jitter(0, 3, Date.now() + 1), 85, 99),
      stepIndex: step.index,
    }),
    makeEvent("ACTION", "STEP_VERIFIED", step.verifiedLine, { stepIndex: step.index }),
  ];

  const nextIndex = state.currentStep + 1;
  const isComplete = nextIndex >= state.experiment.steps.length;

  const stepStatuses = state.stepStatuses.map((s, i) => {
    if (i === state.currentStep) return "complete" as StepStatus;
    if (i === nextIndex) return "current" as StepStatus;
    return s;
  });

  if (!isComplete) {
    events.push(
      makeEvent(
        "SYSTEM",
        "NEXT_STEP_SUGGESTED",
        `Next action suggested: ${state.experiment.steps[nextIndex].action}`,
        { stepIndex: nextIndex }
      )
    );
  } else {
    events.push(
      makeEvent("SYSTEM", "EXPERIMENT_COMPLETE", "Experiment sequence complete. 7/7 steps verified.", {})
    );
  }

  return {
    ...state,
    events: [...events.reverse(), ...state.events],
    currentStep: isComplete ? state.currentStep : nextIndex,
    stepStatuses,
    phase: isComplete ? "COMPLETE" : "RUNNING",
    deviation: null,
    uncertain: null,
    completionReportOpen: isComplete ? true : state.completionReportOpen,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TICK": {
      const t = state.clockTick + 1;
      const elapsedMs = state.startedAt !== null && state.running ? state.elapsedMs + 1000 : state.elapsedMs;
      const health = [...state.health.slice(1), {
        t,
        cpu: clamp(seededWave(t, 41, 9, 14, 0) + jitter(0, 2, t), 20, 78),
        gpu: clamp(seededWave(t, 56, 11, 10, 1.4) + jitter(0, 2, t + 5), 25, 88),
        memory: clamp(seededWave(t, 63, 4, 22, 0.6) + jitter(0, 1.4, t + 9), 40, 82),
        temp: clamp(seededWave(t, 42, 3, 30, 2.1) + jitter(0, 0.8, t + 3), 34, 58),
      }];
      const ai: AIConfidenceMetrics = {
        objectDetection: clamp(98 + jitter(0, 1.1, t), 95, 99.6),
        poseEstimation: clamp(96 + jitter(0, 1.3, t + 1), 92, 98.8),
        handTracking: clamp(94 + jitter(0, 1.6, t + 2), 89, 97.5),
        activityRecognition: clamp(93 + jitter(0, 1.8, t + 3), 87, 97),
        sequenceValidation: clamp(99 + jitter(0, 0.5, t + 4), 97.5, 99.9),
        inferenceLatencyMs: Math.round(clamp(42 + jitter(0, 6, t + 5), 28, 61)),
        cameraFps: 30,
        aiFps: Math.round(clamp(24 + jitter(0, 1.5, t + 6), 21, 26)),
      };
      const orientation: OrientationState = {
        ...state.orientation,
        x: clamp(state.orientation.x + jitter(0, 1.5, t + 7), -25, 25),
        y: clamp(state.orientation.y + jitter(0, 1.2, t + 8), -20, 20),
        z: clamp(state.orientation.z + jitter(0, 1, t + 9), 70, 100),
      };
      return { ...state, clockTick: t, elapsedMs, health, ai, orientation };
    }

    case "CORRECT_ACTION": {
      if (state.phase === "COMPLETE") return state;
      const startedAt = state.startedAt ?? Date.now();
      return advanceStep({ ...state, running: true, startedAt });
    }

    case "SKIP_STEP": {
      if (state.phase === "COMPLETE" || state.deviation || state.uncertain) return state;
      const step = state.experiment.steps[state.currentStep];
      if (!step) return state;
      const stepStatuses = state.stepStatuses.map((s, i) =>
        i === state.currentStep ? ("flagged" as StepStatus) : s
      );
      const ev = makeEvent(
        "WARNING",
        "SEQUENCE_SKIPPED",
        `Step skipped — expected "${step.action}" was not performed.`,
        { stepIndex: step.index }
      );
      return {
        ...state,
        stepStatuses,
        phase: "DEVIATION",
        deviation: { kind: "SKIPPED", expected: step.action, detected: "No qualifying action detected", atStep: step.index },
        warningsCount: state.warningsCount + 1,
        events: [ev, ...state.events],
      };
    }

    case "WRONG_SEQUENCE": {
      if (state.phase === "COMPLETE" || state.deviation || state.uncertain) return state;
      const step = state.experiment.steps[state.currentStep];
      const alt = state.experiment.steps[Math.min(state.currentStep + 1, state.experiment.steps.length - 1)];
      if (!step || !alt || alt.id === step.id) return state;
      const stepStatuses = state.stepStatuses.map((s, i) =>
        i === state.currentStep ? ("flagged" as StepStatus) : s
      );
      const ev = makeEvent(
        "WARNING",
        "PROCEDURAL_DEVIATION",
        `Sequence violated — expected "${step.action}", detected "${alt.action}".`,
        { stepIndex: step.index }
      );
      return {
        ...state,
        stepStatuses,
        phase: "DEVIATION",
        deviation: { kind: "WRONG_SEQUENCE", expected: step.action, detected: alt.action, atStep: step.index },
        warningsCount: state.warningsCount + 1,
        events: [ev, ...state.events],
      };
    }

    case "DISMISS_DEVIATION": {
      if (!state.deviation) return state;
      const stepStatuses = state.stepStatuses.map((s, i) =>
        i === state.currentStep ? ("current" as StepStatus) : s
      );
      return {
        ...state,
        deviation: null,
        phase: "RUNNING",
        stepStatuses,
        events: [
          makeEvent("SYSTEM", "CONFIRMATION_RECEIVED", "Deviation acknowledged. Resuming sequence monitoring."),
          ...state.events,
        ],
      };
    }

    case "UNCERTAIN_ACTION": {
      if (state.phase === "COMPLETE" || state.deviation || state.uncertain) return state;
      const step = state.experiment.steps[state.currentStep];
      if (!step) return state;
      const confidence = Math.round(clamp(58 + jitter(0, 6, Date.now()), 52, 68));
      const ev = makeEvent(
        "WARNING",
        "ACTION_UNCERTAIN",
        `Action uncertain during "${step.action}". Confidence below threshold.`,
        { confidence, stepIndex: step.index }
      );
      return {
        ...state,
        phase: "UNCERTAIN",
        uncertain: { confidence, atStep: step.index, reviewed: false },
        uncertainCount: state.uncertainCount + 1,
        events: [ev, ...state.events],
      };
    }

    case "REVIEW_FRAME": {
      if (!state.uncertain) return state;
      return {
        ...state,
        uncertain: { ...state.uncertain, reviewed: true },
        events: [
          makeEvent("SYSTEM", "FRAME_REVIEWED", "Operator reviewed captured frame for uncertain action."),
          ...state.events,
        ],
      };
    }

    case "WAIT_FOR_CONFIRMATION": {
      if (!state.uncertain) return state;
      const ev = makeEvent(
        "SYSTEM",
        "CONFIRMATION_RECEIVED",
        "Ground/operator confirmation received. Action validated manually.",
        { stepIndex: state.uncertain.atStep }
      );
      const cleared = { ...state, uncertain: null, phase: "RUNNING" as MissionPhase, events: [ev, ...state.events] };
      return advanceStep(cleared);
    }

    case "RESET": {
      const fresh = initialState();
      return { ...fresh, experiment: state.experiment, savedProtocols: state.savedProtocols, stepStatuses: initStepStatuses(state.experiment), voiceEnabled: state.voiceEnabled, voiceRate: state.voiceRate };
    }

    case "TOGGLE_PAUSE": {
      return { ...state, running: !state.running };
    }

    case "TOGGLE_NETWORK": {
      const online = !state.system.networkOnline;
      const ev = makeEvent(
        "SYSTEM",
        online ? "NETWORK_RESTORED" : "NETWORK_OFFLINE",
        online
          ? "Network link restored. Cloud telemetry sync resumed."
          : "Network link lost. Mission continues — no cloud dependency.",
      );
      return {
        ...state,
        system: { ...state.system, networkOnline: online },
        events: [ev, ...state.events],
      };
    }

    case "SET_ORIENTATION_REF":
      return { ...state, orientation: { ...state.orientation, reference: action.ref } };

    case "TOGGLE_OVERLAY":
      return { ...state, overlays: { ...state.overlays, [action.key]: !state.overlays[action.key] } };

    case "START_DEMO":
      return {
        ...state,
        demoMode: true,
        running: true,
        startedAt: state.startedAt ?? Date.now(),
        phase: state.phase === "IDLE" ? "RUNNING" : state.phase,
        events: [makeEvent("SYSTEM", "DEMO_STARTED", "Demo mode engaged. Autonomous simulation running."), ...state.events],
      };

    case "PAUSE_DEMO":
      return {
        ...state,
        running: false,
        events: [makeEvent("SYSTEM", "DEMO_PAUSED", "Demo mode paused."), ...state.events],
      };

    case "RESET_DEMO": {
      const fresh = initialState();
      return { ...fresh, experiment: state.experiment, savedProtocols: state.savedProtocols, stepStatuses: initStepStatuses(state.experiment), voiceEnabled: state.voiceEnabled, voiceRate: state.voiceRate };
    }

    case "SET_RECORDING":
      return { ...state, recording: action.value };

    case "SET_STREAMING":
      return { ...state, streaming: action.value };

    case "SET_PROTOCOL":
      return {
        ...state,
        experiment: action.experiment,
        stepStatuses: initStepStatuses(action.experiment),
        currentStep: 0,
        phase: "IDLE",
        deviation: null,
        uncertain: null,
      };

    case "SAVE_PROTOCOL": {
      const exists = state.savedProtocols.some((p) => p.id === action.experiment.id);
      const savedProtocols = exists
        ? state.savedProtocols.map((p) => (p.id === action.experiment.id ? action.experiment : p))
        : [...state.savedProtocols, action.experiment];
      return { ...state, savedProtocols };
    }

    case "SET_VOICE_ENABLED":
      return { ...state, voiceEnabled: action.value };

    case "SET_VOICE_RATE":
      return { ...state, voiceRate: action.value };

    case "LOG_GENERATED":
      return { ...state, lastLogGeneratedAt: Date.now() };

    case "OPEN_REPORT":
      return { ...state, completionReportOpen: true };

    case "CLOSE_REPORT":
      return { ...state, completionReportOpen: false };

    case "TOGGLE_THEME": {
      const nextTheme = state.theme === "light" ? "dark" : "light";
      try {
        localStorage.setItem("astra_theme", nextTheme);
      } catch {}
      return { ...state, theme: nextTheme };
    }

    case "SET_THEME": {
      try {
        localStorage.setItem("astra_theme", action.theme);
      } catch {}
      return { ...state, theme: action.theme };
    }

    default:
      return state;
  }
}

interface MissionContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  speak: (text: string) => void;
  downloadLog: (format: "txt" | "json") => void;
}

const MissionContext = createContext<MissionContextValue | null>(null);

const STORAGE_KEY_PROTOCOLS = "astra-har:protocols";
const STORAGE_KEY_SETTINGS = "astra-har:settings";

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const demoTimer = useRef<number | null>(null);

  // Load persisted protocols/settings once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROTOCOLS);
      if (raw) {
        const protocols: Experiment[] = JSON.parse(raw);
        if (Array.isArray(protocols) && protocols.length) {
          protocols.forEach((p) => dispatch({ type: "SAVE_PROTOCOL", experiment: p }));
        }
      }
      const settingsRaw = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (settingsRaw) {
        const settings = JSON.parse(settingsRaw);
        if (typeof settings.voiceEnabled === "boolean") dispatch({ type: "SET_VOICE_ENABLED", value: settings.voiceEnabled });
        if (typeof settings.voiceRate === "number") dispatch({ type: "SET_VOICE_RATE", value: settings.voiceRate });
      }
    } catch {
      // ignore corrupted storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROTOCOLS, JSON.stringify(state.savedProtocols));
    } catch {
      // storage may be unavailable; fail silently in prototype
    }
  }, [state.savedProtocols]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({ voiceEnabled: state.voiceEnabled, voiceRate: state.voiceRate })
      );
    } catch {
      // ignore
    }
  }, [state.voiceEnabled, state.voiceRate]);

  // 1Hz simulation tick.
  useEffect(() => {
    const id = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Proactively cancel any browser speech synthesis on load (audio completely disabled)
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }, []);

  const speak = useCallback((_text: string) => {
    // Audio completely eliminated per mission directive
  }, []);

  // Demo mode auto-play: deterministic timed correct actions.
  useEffect(() => {
    if (demoTimer.current) window.clearTimeout(demoTimer.current);
    if (!state.demoMode || !state.running || state.phase === "COMPLETE" || state.deviation || state.uncertain) {
      return;
    }
    demoTimer.current = window.setTimeout(() => {
      dispatch({ type: "CORRECT_ACTION" });
    }, 3200);
    return () => {
      if (demoTimer.current) window.clearTimeout(demoTimer.current);
    };
  }, [state.demoMode, state.running, state.currentStep, state.phase, state.deviation, state.uncertain]);

  const downloadLog = useCallback(
    (format: "txt" | "json") => {
      const rows = [...state.events].reverse().map((e) => ({
        timestamp: e.timestamp,
        step: e.stepIndex !== undefined ? state.experiment.steps[e.stepIndex]?.action ?? "" : "",
        detectedAction: e.message,
        expectedAction:
          e.stepIndex !== undefined ? state.experiment.steps[e.stepIndex]?.action ?? "" : "",
        status: e.category,
        confidence: e.confidence !== undefined ? e.confidence.toFixed(1) : "",
      }));

      let content: string;
      let mime: string;
      let filename: string;

      if (format === "json") {
        content = JSON.stringify(
          {
            experimentId: state.experiment.id,
            generatedAt: new Date().toISOString(),
            protocolCompliance: computeCompliance(state),
            warnings: state.warningsCount,
            uncertainActions: state.uncertainCount,
            stepsCompleted: state.stepStatuses.filter((s) => s === "complete").length,
            totalSteps: state.experiment.steps.length,
            events: rows,
          },
          null,
          2
        );
        mime = "application/json";
        filename = `${state.experiment.id}-log.json`;
      } else {
        const header = "timestamp | step | detected action | expected action | status | confidence";
        const lines = rows.map(
          (r) =>
            `${r.timestamp} | ${r.step || "-"} | ${r.detectedAction} | ${r.expectedAction || "-"} | ${r.status} | ${
              r.confidence || "-"
            }`
        );
        content = [header, ...lines].join("\n");
        mime = "text/plain";
        filename = `${state.experiment.id}-log.txt`;
      }

      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      dispatch({ type: "LOG_GENERATED" });
    },
    [state]
  );

  const value = useMemo(() => ({ state, dispatch, speak, downloadLog }), [state, speak, downloadLog]);

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
};

export function useMission(): MissionContextValue {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error("useMission must be used within MissionProvider");
  return ctx;
}

export function computeCompliance(state: State): number {
  const flagged = state.stepStatuses.filter((s) => s === "flagged").length;
  const completed = state.stepStatuses.filter((s) => s === "complete").length;
  if (completed === 0 && flagged === 0) return 100;
  const denom = completed + flagged || 1;
  return Math.round(((completed) / denom) * 100 - flagged * 2);
}
