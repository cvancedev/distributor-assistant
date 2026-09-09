"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Store } from "@/lib/types";

export default function HelperModeScreen({
  store,
  onBack,
  onMarkComplete,
}: {
  store: Store;
  onBack: () => void;
  onMarkComplete: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 p-4">
      <button onClick={onBack} className="flex w-fit items-center gap-1 text-sm font-semibold text-blue-600">
        ← Exit Helper Mode
      </button>

      <div>
        <span className="w-fit rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white">
          Helper Mode
        </span>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {store.name} — {store.city}
        </h1>
      </div>

      <Card className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Delivery Task</h2>
        <p className="text-sm text-slate-600">Quantity to deliver: {store.suggestedOrderCases} cases</p>
        <p className="text-sm text-slate-600">Shelf / display: Main shelf + endcap</p>
      </Card>

      {store.notes.length > 0 && (
        <Card className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Store Instructions</h2>
          {store.notes.map((n) => (
            <p key={n.id} className="text-sm text-slate-600">
              📌 {n.text}
            </p>
          ))}
        </Card>
      )}

      {store.specialRequestIds.length > 0 && (
        <Card className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Special Requests</h2>
          <p className="text-sm text-slate-600">See distributor notes for details.</p>
        </Card>
      )}

      <Card className="flex flex-col items-center gap-2 border-dashed border-2 border-slate-300 py-6 text-center">
        <span className="text-2xl">📷</span>
        <p className="text-sm text-slate-500">Optional: add a completion photo</p>
      </Card>

      <p className="text-xs text-slate-400">
        Helper access does not include profit, product cost, or other business information.
      </p>

      <Button size="lg" variant="success" onClick={onMarkComplete}>
        MARK STORE COMPLETE
      </Button>
    </div>
  );
}
