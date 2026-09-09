import { Confidence } from "@/lib/types";

const classes: Record<Confidence, string> = {
  high: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-red-100 text-red-700",
};

const labels: Record<Confidence, string> = {
  high: "Confidence: High",
  medium: "Confidence: Medium",
  low: "Confidence: Low",
};

export default function ConfidenceBadge({ level }: { level: Confidence }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${classes[level]}`}>
      {labels[level]}
    </span>
  );
}
