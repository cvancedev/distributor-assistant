"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getNeedsAttentionItems } from "@/lib/selectors";
import { Store, StoreRequest } from "@/lib/types";

export default function SmartEndOfDayScreen({
  stores,
  requests,
  tomorrowsEstimatedLoad,
  onEndDay,
  onOpenFridayReconciliation,
}: {
  stores: Store[];
  requests: StoreRequest[];
  tomorrowsEstimatedLoad: number;
  onEndDay: () => void;
  onOpenFridayReconciliation: () => void;
}) {
  const [simulateFriday, setSimulateFriday] = useState(false);
  const completedCount = stores.filter((s) => s.status === "completed").length;
  const needsAttention = getNeedsAttentionItems(stores, requests);
  const catchUps = stores.filter((s) => s.isCatchUpFromYesterday && s.status !== "completed");

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">End of Day</h1>
        <p className="text-slate-500">
          {completedCount} / {stores.length} stops completed
        </p>
      </div>

      <button
        onClick={() => setSimulateFriday((v) => !v)}
        className="w-fit self-center text-xs font-semibold text-slate-400 underline"
      >
        {simulateFriday ? "Previewing Friday" : "Preview Friday end-of-day"}
      </button>

      {needsAttention.length > 0 && (
        <Card className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Unresolved Today</h2>
          {needsAttention.map((item) => (
            <p key={item.id} className="text-sm text-slate-600">
              ⚠️ {item.label} — {item.detail}
            </p>
          ))}
        </Card>
      )}

      {catchUps.length > 0 && (
        <Card className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Catch-Up Stores</h2>
          {catchUps.map((c) => (
            <p key={c.id} className="text-sm text-slate-600">
              {c.name} — {c.city}
            </p>
          ))}
        </Card>
      )}

      <Card className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Important Tomorrow</h2>
        <p className="text-sm text-slate-600">Estimated load: {tomorrowsEstimatedLoad} cases</p>
      </Card>

      {simulateFriday && (
        <Card className="flex flex-col gap-2 border-2 border-blue-200 bg-blue-50">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600">Friday Checkpoint</h2>
          <p className="text-sm text-slate-600">Weekly inventory reconciliation is due before you go.</p>
          <Button variant="outline" onClick={onOpenFridayReconciliation}>
            OPEN RECONCILIATION
          </Button>
        </Card>
      )}

      <Button variant="outline">RETURN TO STORAGE</Button>

      <Button size="lg" variant="secondary" onClick={onEndDay}>
        END DAY
      </Button>
    </div>
  );
}
