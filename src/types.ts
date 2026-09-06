// Core domain types for ASTRA-HAR mission console.
// All AI/telemetry values in this prototype are deterministically simulated.

export type ObjectTag =
  | "RED BOX"
  | "YELLOW BOX"
  | "EXPERIMENT CONTAINER"
  | "TARGET AREA";

export type InteractionTag =
  | "PICK UP"
  | "PLACE"
  | "OPEN"
  | "CLOSE"
  | "IDENTIFY";

export interface ExperimentStep {
  id: string;
  index: number;
  action: string;
  requiredObject: ObjectTag;
  interaction: InteractionTag;
  confidenceThreshold: number; // 0-100
  voiceInstruction: string;
  verifiedLine: string; // spoken/shown once verified
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  steps: ExperimentStep[];
}

export type StepStatus = "complete" | "current" | "pending" | "flagged";

export type AIEventCategory =
  | "OBJECT"
  | "ACTION"
  | "WARNING"
  | "SYSTEM";

export type AIEventKind =
  | "OBJECT_DETECTED"
  | "HAND_OBJECT_INTERACTION"
  | "ACTION_RECOGNIZED"
  | "STEP_VERIFIED"
  | "NEXT_STEP_SUGGESTED"
  | "PROCEDURAL_DEVIATION"
  | "SEQUENCE_SKIPPED"
  | "ACTION_UNCERTAIN"
  | "NETWORK_OFFLINE"
  | "NETWORK_RESTORED"
  | "EXPERIMENT_RESET"
  | "EXPERIMENT_COMPLETE"
  | "DEMO_STARTED"
  | "DEMO_PAUSED"
  | "FRAME_REVIEWED"
  | "CONFIRMATION_RECEIVED";

export interface AIEvent {
  id: string;
  t: number; // ms since experiment start
  timestamp: string; // formatted HH:MM:SS
  category: AIEventCategory;
  kind: AIEventKind;
  message: string;
  detail?: string;
  confidence?: number;
  stepIndex?: number;
}

export interface Detection {
  id: string;
  label: ObjectTag | "ASTRONAUT";
  confidence: number;
  box: { x: number; y: number; w: number; h: number }; // percentages
}

export interface SystemStatus {
  edgeAiOnline: boolean;
  cameraOnline: boolean;
  voiceReady: boolean;
  networkOnline: boolean;
  sequenceEngineOnline: boolean;
  loggingOnline: boolean;
}

export interface AIConfidenceMetrics {
  objectDetection: number;
  poseEstimation: number;
  handTracking: number;
  activityRecognition: number;
  sequenceValidation: number;
  inferenceLatencyMs: number;
  cameraFps: number;
  aiFps: number;
}

export interface SystemHealthSample {
  t: number;
  cpu: number;
  gpu: number;
  memory: number;
  temp: number;
}

export type MissionPhase =
  | "IDLE"
  | "RUNNING"
  | "DEVIATION"
  | "UNCERTAIN"
  | "COMPLETE";

export interface OrientationState {
  reference: "FLOOR" | "RACK";
  x: number;
  y: number;
  z: number;
}
