import { StopStatus } from "@/lib/types";

const statusConfig: Record<StopStatus, { label: string; classes: string }> = {
  upcoming: { label: "Ready", classes: "bg-slate-100 text-slate-700" },
  "in-progress": { label: "In Progress", classes: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", classes: "bg-emerald-100 text-emerald-700" },
  "needs-attention": { label: "Needs Attention", classes: "bg-amber-100 text-amber-800" },
  "catch-up": { label: "Catch-Up", classes: "bg-purple-100 text-purple-700" },
};

export default function StatusBadge({ status }: { status: StopStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.classes}`}>
      {config.label}
    </span>
  );
}
