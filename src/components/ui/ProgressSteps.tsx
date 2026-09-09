import { STORE_WORKFLOW_STEPS, StoreWorkflowStep } from "@/lib/types";

export default function ProgressSteps({ current }: { current: StoreWorkflowStep }) {
  const currentIndex = STORE_WORKFLOW_STEPS.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {STORE_WORKFLOW_STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step.id} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                isCurrent
                  ? "bg-blue-600 text-white"
                  : isDone
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {isDone ? "✓" : i + 1} {step.label}
            </div>
            {i < STORE_WORKFLOW_STEPS.length - 1 && <span className="text-slate-300">→</span>}
          </div>
        );
      })}
    </div>
  );
}
