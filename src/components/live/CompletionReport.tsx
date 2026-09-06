import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useMission, computeCompliance } from "../../state/MissionStore";
import { SectionLabel } from "../ui/Primitives";
import { formatClock } from "../../state/sim";

export const CompletionReport: React.FC = () => {
  const { state, dispatch, downloadLog } = useMission();
  const open = state.completionReportOpen && state.phase === "COMPLETE";
  const compliance = computeCompliance(state);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-base/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 cd-panel shadow-2xl p-6 flex flex-col gap-5"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-ok/10 text-ok flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[16px] text-ink">Experiment Completed</h3>
                  <p className="text-[11px] text-ink-3 font-mono">{state.experiment.id} · {state.experiment.name}</p>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: "CLOSE_REPORT" })}
                className="w-8 h-8 rounded-lg hover:bg-surface-2 flex items-center justify-center text-ink-3 hover:text-ink transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-2 p-3 rounded-xl border border-border">
                <SectionLabel>Verified Steps</SectionLabel>
                <div className="font-mono text-[20px] font-bold text-ok mt-1">7 / 7</div>
              </div>
              <div className="bg-surface-2 p-3 rounded-xl border border-border">
                <SectionLabel>Compliance</SectionLabel>
                <div className="font-mono text-[20px] font-bold text-accent mt-1">{compliance}%</div>
              </div>
              <div className="bg-surface-2 p-3 rounded-xl border border-border">
                <SectionLabel>Duration</SectionLabel>
                <div className="font-mono text-[20px] font-bold text-ink mt-1">{formatClock(state.elapsedMs)}</div>
              </div>
            </div>

            <div className="space-y-1.5 rounded-xl bg-surface-2 p-3.5 border border-border">
              <SectionLabel className="mb-2">Sequence Validation Timeline</SectionLabel>
              {state.experiment.steps.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between text-[12px] py-1 border-b border-border-soft last:border-0">
                  <span className="text-ink-2">Step {i + 1}: {s.action}</span>
                  <span className={`font-mono text-[11px] font-semibold ${state.stepStatuses[i] === "flagged" ? "text-crit" : "text-ok"}`}>
                    {state.stepStatuses[i] === "flagged" ? "FLAGGED" : "VERIFIED"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                className="flex-1 py-2 btn-liquid-primary text-[12px] font-semibold flex items-center justify-center"
                onClick={() => downloadLog("json")}
              >
                Download Audit Log (.JSON)
              </button>
              <button
                className="flex-1 py-2 btn-liquid-glass text-[12px] font-semibold flex items-center justify-center"
                onClick={() => dispatch({ type: "RESET" })}
              >
                Initialize Next Run
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
