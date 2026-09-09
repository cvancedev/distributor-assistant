"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ReconciliationItem } from "@/lib/types";

export default function FridayReconciliationScreen({
  items,
  onBack,
}: {
  items: ReconciliationItem[];
  onBack: () => void;
}) {
  const [verified, setVerified] = useState(false);
  const mismatches = items.filter((i) => i.expected !== i.physical);

  return (
    <div className="flex flex-col gap-5 p-4">
      <button onClick={onBack} className="flex w-fit items-center gap-1 text-sm font-semibold text-blue-600">
        ← Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Friday Inventory Reconciliation</h1>
        <p className="text-slate-500">Company app expected vs. physical count — {mismatches.length} mismatch(es)</p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const diff = item.physical - item.expected;
          const matched = diff === 0;
          return (
            <Card key={`${item.productId}-${item.location}-${i}`} className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">{item.productName}</h3>
                <p className="text-xs uppercase tracking-wide text-slate-400">{item.location}</p>
                <p className="text-sm text-slate-600">
                  Expected: {item.expected} · Physical: {item.physical}
                </p>
              </div>
              {matched ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  MATCHED
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  {diff > 0 ? `+${diff}` : diff}
                </span>
              )}
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-slate-400">
        Official corrections happen in the company distributor app. This view is for awareness only.
      </p>

      {verified ? (
        <Card className="text-center text-lg font-bold text-emerald-700">WEEKLY INVENTORY VERIFIED</Card>
      ) : (
        <Button size="lg" variant="success" onClick={() => setVerified(true)}>
          MARK WEEK VERIFIED
        </Button>
      )}
    </div>
  );
}
