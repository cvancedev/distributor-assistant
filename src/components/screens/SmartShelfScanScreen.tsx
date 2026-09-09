"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfidenceBadge from "@/components/ui/ConfidenceBadge";
import PhotoTile from "@/components/ui/PhotoTile";
import Stepper from "@/components/ui/Stepper";
import { getSimulatedShelfScanResults } from "@/lib/selectors";
import { Product, ShelfScanLocation, ShelfScanResult } from "@/lib/types";

const LOCATIONS: ShelfScanLocation[] = [
  "Main Shelf",
  "Endcap",
  "Seasonal Display",
  "Secondary Display",
  "Backstock",
  "Other",
];

type ScanPhase = "capture" | "analyzing" | "results";

export default function SmartShelfScanScreen({
  storeName,
  products,
  onBack,
}: {
  storeName: string;
  products: Product[];
  onBack: () => void;
}) {
  const [photoCount, setPhotoCount] = useState(0);
  const [activeLocations, setActiveLocations] = useState<Set<ShelfScanLocation>>(new Set(["Main Shelf"]));
  const [phase, setPhase] = useState<ScanPhase>("capture");
  const [results, setResults] = useState<ShelfScanResult[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});

  const toggleLocation = (loc: ShelfScanLocation) => {
    setActiveLocations((prev) => {
      const next = new Set(prev);
      if (next.has(loc)) next.delete(loc);
      else next.add(loc);
      return next;
    });
  };

  const analyze = () => {
    setPhase("analyzing");
    const sampled = products.slice(0, 4).map((p) => getSimulatedShelfScanResults(p.id, p.name));
    setResults(sampled);
    setQuantities(Object.fromEntries(sampled.map((r) => [r.productId, r.suggestedDelivery])));
    setTimeout(() => setPhase("results"), 700);
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <button onClick={onBack} className="flex w-fit items-center gap-1 text-sm font-semibold text-blue-600">
        ← Back to {storeName}
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Smart Shelf Scan</h1>
        <span className="w-fit rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-800">
          Future Concept — Simulated
        </span>
      </div>

      {phase === "capture" && (
        <>
          <Card className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Add Location</h2>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                    activeLocations.has(loc) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Add Photos</h2>
            <p className="text-sm text-slate-500">
              Small store: 1–2 photos. Large store: 5–10+ photos across displays and backstock.
            </p>
            <div className="flex flex-wrap gap-3">
              {Array.from(activeLocations).map((loc) => (
                <PhotoTile key={loc} location={loc} />
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setPhotoCount((c) => c + 1)}
            >
              + ADD PHOTO
            </Button>
            {photoCount > 0 && <p className="text-xs text-slate-400">{photoCount} additional photo(s) queued</p>}
          </Card>

          <Button size="lg" onClick={analyze}>
            ANALYZE STORE
          </Button>
        </>
      )}

      {phase === "analyzing" && (
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="animate-pulse text-4xl">🔍</span>
          <p className="font-semibold text-slate-700">Analyzing photos (simulated)…</p>
        </Card>
      )}

      {phase === "results" && (
        <>
          <p className="text-sm text-slate-500">
            Simulated results — considers shelf photos, backstock, recent sales, previous delivery, and truck
            inventory.
          </p>
          {results.map((r) => {
            const uncertain = !!r.backstockRange;
            const isConfirmed = confirmed[r.productId];
            return (
              <Card key={r.productId} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{r.productName}</h3>
                  <ConfidenceBadge level={r.confidence} />
                </div>
                <p className="text-sm text-slate-600">Shelf: {r.shelfStatus}</p>
                <p className="text-sm text-slate-600">
                  Backstock: {uncertain ? `${r.backstockRange![0]}–${r.backstockRange![1]} cases (estimate)` : `${r.backstockEstimate} cases`}
                </p>
                <p className="text-sm text-slate-600">Truck: {r.truckAvailable} cases</p>
                <Stepper
                  label={uncertain ? "Confirm quantity" : "Suggested delivery"}
                  value={quantities[r.productId] ?? r.suggestedDelivery}
                  onChange={(v) => setQuantities((prev) => ({ ...prev, [r.productId]: v }))}
                />
                {isConfirmed ? (
                  <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    {quantities[r.productId]} cases confirmed
                  </div>
                ) : (
                  <Button
                    variant="success"
                    onClick={() => setConfirmed((prev) => ({ ...prev, [r.productId]: true }))}
                  >
                    {uncertain ? "CONFIRM QUANTITY" : "APPROVE"}
                  </Button>
                )}
              </Card>
            );
          })}
          <Button size="lg" variant="secondary" onClick={onBack}>
            DONE
          </Button>
        </>
      )}
    </div>
  );
}
