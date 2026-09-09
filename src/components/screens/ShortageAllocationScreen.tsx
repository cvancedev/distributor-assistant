"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Stepper from "@/components/ui/Stepper";
import { ShortageAllocation } from "@/lib/types";

export default function ShortageAllocationScreen({
  allocations,
  onBack,
}: {
  allocations: ShortageAllocation[];
  onBack: () => void;
}) {
  const [edited, setEdited] = useState<Record<string, Record<string, number>>>({});
  const [approved, setApproved] = useState<Record<string, boolean>>({});

  const getQty = (allocation: ShortageAllocation, storeId: string, original: number) =>
    edited[allocation.productId]?.[storeId] ?? original;

  return (
    <div className="flex flex-col gap-5 p-4">
      <button onClick={onBack} className="flex w-fit items-center gap-1 text-sm font-semibold text-blue-600">
        ← Back to Load Plan
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Shortage Allocation</h1>
        <p className="text-slate-500">Recommended splits when supply doesn&apos;t cover demand</p>
      </div>

      {allocations.map((allocation) => (
        <Card key={allocation.productId} className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{allocation.productName}</h2>
            <p className="text-sm text-slate-500">
              Needed today: {allocation.neededToday} · Available: {allocation.available}
            </p>
          </div>

          <div className="flex flex-col divide-y divide-slate-100">
            {allocation.allocations.map((entry) => (
              <div key={entry.storeId} className="flex flex-col gap-1 py-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{entry.storeName}</p>
                  <span className="text-sm text-slate-500">{entry.reason}</span>
                </div>
                <Stepper
                  label="Allocated"
                  value={getQty(allocation, entry.storeId, entry.quantity)}
                  onChange={(v) =>
                    setEdited((prev) => ({
                      ...prev,
                      [allocation.productId]: { ...prev[allocation.productId], [entry.storeId]: v },
                    }))
                  }
                />
              </div>
            ))}
          </div>

          {approved[allocation.productId] ? (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Allocation approved
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="success"
                onClick={() => setApproved((prev) => ({ ...prev, [allocation.productId]: true }))}
              >
                APPROVE
              </Button>
              <Button variant="outline" onClick={() => setEdited((prev) => ({ ...prev, [allocation.productId]: {} }))}>
                RESET
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
