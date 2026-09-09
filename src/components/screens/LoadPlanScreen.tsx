"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ReorderList from "@/components/ui/ReorderList";
import Stepper from "@/components/ui/Stepper";
import { LoadPlanItem } from "@/lib/types";

export default function LoadPlanScreen({
  items,
  onUpdateLoaded,
  onReorder,
  onBack,
  onOpenShortageAllocation,
}: {
  items: LoadPlanItem[];
  onUpdateLoaded: (productId: string, loaded: number) => void;
  onReorder: (productId: string, direction: "up" | "down") => void;
  onBack: () => void;
  onOpenShortageAllocation: () => void;
}) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const totalNeeded = items.reduce((sum, i) => sum + i.needed, 0);
  const totalLoaded = items.reduce((sum, i) => sum + Math.min(i.loaded, i.needed), 0);

  return (
    <div className="flex flex-col gap-5 p-4">
      <button onClick={onBack} className="flex w-fit items-center gap-1 text-sm font-semibold text-blue-600">
        ← Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Monday Load Plan</h1>
        <p className="text-slate-500">
          {totalLoaded} / {totalNeeded} cases loaded — your custom loading order
        </p>
      </div>

      <Button variant="outline" onClick={onOpenShortageAllocation}>
        View Shortage Allocation →
      </Button>

      <ReorderList
        items={sorted}
        getId={(item) => item.productId}
        onMove={onReorder}
        renderItem={(item) => {
          const stillNeeded = Math.max(0, item.needed - item.loaded);
          const complete = item.loaded >= item.needed;
          return (
            <Card className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {item.seasonal && "🎄 "}
                    {item.productName}
                  </h3>
                  <p className="text-sm text-slate-500">Needed: {item.needed}</p>
                </div>
                {complete ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    COMPLETE
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    {stillNeeded} STILL NEEDED
                  </span>
                )}
              </div>
              <Stepper
                label="Loaded"
                value={item.loaded}
                onChange={(v) => onUpdateLoaded(item.productId, v)}
              />
            </Card>
          );
        }}
      />
    </div>
  );
}
