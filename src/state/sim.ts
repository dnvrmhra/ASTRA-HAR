// Deterministic simulation helpers. Nothing here is a real ML model —
// values are generated with smooth pseudo-random functions so the UI
// behaves believably without claiming real inference performance.

export function seededWave(t: number, base: number, amplitude: number, period: number, phase = 0): number {
  return base + amplitude * Math.sin(t / period + phase);
}

export function jitter(base: number, spread: number, seed: number): number {
  const n = Math.sin(seed * 12.9898) * 43758.5453;
  const frac = n - Math.floor(n);
  return base + (frac - 0.5) * 2 * spread;
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function formatTimeOfDay(date: Date): string {
  return date.toTimeString().slice(0, 8);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

let idCounter = 0;
export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter.toString(36)}-${Date.now().toString(36)}`;
}
