"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfidenceBadge from "@/components/ui/ConfidenceBadge";
import ProgressSteps from "@/components/ui/ProgressSteps";
import Stepper from "@/components/ui/Stepper";
import { STORE_WORKFLOW_STEPS, Store, StoreRequest, StoreWorkflowStep } from "@/lib/types";

const CANNED_VOICE_NOTES = [
  "Manager requested two additional cases for Friday.",
  "Endcap display needs to be restocked next visit.",
  "Store asked about a new flavor for next month.",
  "Delivery door code changed — see front desk.",
];

const CANNED_ADJUST_REASONS = [
  "Manager reducing shelf space next week.",
  "Store still has too much backstock.",
  "Upcoming promotion ending soon.",
];

function nextStep(step: StoreWorkflowStep): StoreWorkflowStep | null {
  const idx = STORE_WORKFLOW_STEPS.findIndex((s) => s.id === step);
  return STORE_WORKFLOW_STEPS[idx + 1]?.id ?? null;
}

export default function StoreWorkspaceScreen({
  store,
  totalTruckCases,
  requests,
  onUpdateStore,
  onBack,
  onOpenShelfScan,
  onOpenHelperMode,
  onCompleteStop,
  nextRecommendedStoreName,
  nextRecommendedDistance,
}: {
  store: Store;
  totalTruckCases: number;
  requests: StoreRequest[];
  onUpdateStore: (updates: Partial<Store>) => void;
  onBack: () => void;
  onOpenShelfScan: () => void;
  onOpenHelperMode: () => void;
  onCompleteStop: (navigateNext: boolean) => void;
  nextRecommendedStoreName?: string;
  nextRecommendedDistance?: number;
}) {
  const [adjusting, setAdjusting] = useState(false);
  const noteIndex = store.notes.length % CANNED_VOICE_NOTES.length;
  const reasonIndex = 0;

  const storeRequests = requests.filter((r) => r.storeId === store.id);
  const openRequests = storeRequests.filter((r) => r.status === "open");

  const finalOrder = store.approvedOrderCases ?? store.suggestedOrderCases;
  const shortage = Math.max(0, finalOrder - totalTruckCases);
  const pickedShortage = Math.max(0, finalOrder - store.pickedCases);

  const advance = () => {
    const next = nextStep(store.workflowStep);
    if (next) onUpdateStore({ workflowStep: next });
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex w-fit items-center gap-1 text-sm font-semibold text-blue-600">
          ← Back to Route
        </button>
        <button onClick={onOpenHelperMode} className="text-sm font-semibold text-slate-500">
          👤 Helper Mode Preview
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            {store.name} — {store.city}
          </h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-slate-500">
            {store.priority} priority
          </span>
        </div>
        <p className="text-slate-500">
          Stop {store.stopNumber} · {store.time}
        </p>
      </div>

      <ProgressSteps current={store.workflowStep} />

      <Card className="flex flex-col gap-2 text-sm text-slate-700">
        <Row label="Last Delivery" value={`${store.lastDeliveryCases} cases`} />
        <Row label="Recent Sales" value={store.recentSalesTrend} />
        <Row label="Suggested Order" value={`${store.suggestedOrderCases} cases`} />
        <Row label="Truck Inventory" value={`${totalTruckCases} cases available`} />
        <Row label="Receiving Hours" value={store.receivingHours} />
        <Row label="Est. Service Time" value={`${store.estServiceTimeMinutes} min`} />
        {store.promotion && <Row label="Upcoming Promotion" value={store.promotion} />}
        {store.staleRiskNote && <Row label="Stale Risk" value={store.staleRiskNote} warn />}
        <Row label="Manager" value={`${store.contact.managerName} · ${store.contact.phone}`} />
        {openRequests.length > 0 && (
          <Row
            label="Open Requests"
            value={openRequests.map((r) => `+${r.quantity} ${r.productName} by ${r.neededBy}`).join(", ")}
            warn
          />
        )}
        {store.notes.length > 0 && (
          <div className="mt-1 flex flex-col gap-1 border-t border-slate-100 pt-2">
            {store.notes.map((n) => (
              <p key={n.id} className="text-xs text-slate-500">
                📌 {n.text}
              </p>
            ))}
          </div>
        )}
      </Card>

      {store.workflowStep === "order-scan" && (
        <Card className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Suggested Order</h2>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-slate-900">Suggested: {store.suggestedOrderCases} cases</p>
            <ConfidenceBadge level={store.suggestedOrderConfidence} />
          </div>
          <ul className="list-inside list-disc text-sm text-slate-600">
            {store.suggestedOrderReasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          {store.approvedOrderCases !== null && !adjusting ? (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Approved order: {store.approvedOrderCases} cases
              {store.adjustReason && <p className="mt-1 font-normal text-emerald-700">Reason: {store.adjustReason}</p>}
            </div>
          ) : adjusting ? (
            <div className="flex flex-col gap-2">
              <Stepper
                label="Adjusted order"
                value={store.approvedOrderCases ?? store.suggestedOrderCases}
                onChange={(v) => onUpdateStore({ approvedOrderCases: v })}
              />
              <Button
                variant="outline"
                onClick={() => onUpdateStore({ adjustReason: CANNED_ADJUST_REASONS[reasonIndex] })}
              >
                🎙️ Tell Us Why
              </Button>
              {store.adjustReason && <p className="text-sm text-slate-600">Reason: {store.adjustReason}</p>}
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={store.rememberAdjustment}
                  onChange={(e) => onUpdateStore({ rememberAdjustment: e.target.checked })}
                />
                Remember for future recommendations
              </label>
              <Button variant="success" onClick={() => setAdjusting(false)}>
                SAVE ORDER
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="success" onClick={() => onUpdateStore({ approvedOrderCases: store.suggestedOrderCases })}>
                APPROVE SUGGESTION
              </Button>
              <Button variant="outline" onClick={() => setAdjusting(true)}>
                ADJUST ORDER
              </Button>
            </div>
          )}

          <Button variant="outline" onClick={onOpenShelfScan}>
            📷 Open Smart Shelf Scan
          </Button>

          <Button size="md" onClick={advance}>
            NEXT: DATES &amp; STALES
          </Button>
        </Card>
      )}

      {store.workflowStep === "dates-stales" && (
        <Card className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Dates &amp; Stales</h2>
          {store.staleRiskNote ? (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">⚠️ {store.staleRiskNote}</p>
          ) : (
            <p className="text-sm text-slate-500">No stale risk flagged for this store.</p>
          )}
          <Stepper label="Stales / damaged this visit" value={store.stalesCases} onChange={(v) => onUpdateStore({ stalesCases: v })} />
          <p className="text-xs text-slate-400">
            Future concept: photograph date codes and let AI identify expiration dates automatically.
          </p>
          <Button size="md" onClick={advance}>
            NEXT: PICK / LOAD CART
          </Button>
        </Card>
      )}

      {store.workflowStep === "pick-load" && (
        <Card className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Pick / Load Cart</h2>
          <p className="text-sm text-slate-600">Ordered: {finalOrder} cases</p>
          <Stepper label="Picked so far" value={store.pickedCases} onChange={(v) => onUpdateStore({ pickedCases: v })} />
          {pickedShortage > 0 && (
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
              Still Need: {pickedShortage} cases before leaving the truck
            </p>
          )}
          {shortage > 0 && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              <p className="font-semibold">Truck available: {totalTruckCases} — short {shortage} cases</p>
              <p>Deliver {Math.min(finalOrder, totalTruckCases)}, remaining shortage {shortage}.</p>
              {store.priority === "high" && <p className="mt-1 font-bold">RETURN DELIVERY RECOMMENDED</p>}
            </div>
          )}
          <Button
            size="md"
            onClick={() => {
              if (pickedShortage > 0 && !window.confirm(`${pickedShortage} cases still not picked. Continue anyway?`)) {
                return;
              }
              advance();
            }}
          >
            NEXT: RECEIVING
          </Button>
        </Card>
      )}

      {store.workflowStep === "receiving" && (
        <Card className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Receiving</h2>
          <p className="text-sm text-slate-600">Confirm the store has checked in and accepted the delivery.</p>
          <Button size="md" onClick={advance}>
            NEXT: STOCK SHELVES
          </Button>
        </Card>
      )}

      {store.workflowStep === "stock-shelves" && (
        <Card className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Stock Shelves</h2>
          <Stepper
            label="Delivered quantity"
            value={store.deliveredCases || store.pickedCases}
            onChange={(v) => onUpdateStore({ deliveredCases: v })}
          />
          <Button
            variant="outline"
            onClick={() => onUpdateStore({ notes: [...store.notes, { id: `note-${Date.now()}`, text: CANNED_VOICE_NOTES[noteIndex] }] })}
          >
            🎙️ Add Voice Note
          </Button>
          <Button size="md" onClick={advance}>
            NEXT: COMPLETE
          </Button>
        </Card>
      )}

      {store.workflowStep === "complete" && (
        <Card className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-slate-900">{store.name.toUpperCase()} COMPLETE</h2>
          <Row label="Delivered" value={`${store.deliveredCases || store.pickedCases} cases`} />
          <Row label="Stales" value={`${store.stalesCases}`} />
          <Row label="Special Request" value={openRequests.length > 0 ? "Still Open" : "None / Fulfilled"} />
          <Row label="Remaining Shortage" value={`${shortage} cases`} warn={shortage > 0} />
          {nextRecommendedStoreName && (
            <p className="text-sm text-slate-600">
              Next Recommended Stop: <span className="font-semibold">{nextRecommendedStoreName}</span>
              {nextRecommendedDistance !== undefined && ` — ${nextRecommendedDistance} min away`}
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="success" onClick={() => onCompleteStop(true)}>
              COMPLETE &amp; NAVIGATE
            </Button>
            <Button variant="outline" onClick={() => onCompleteStop(false)}>
              COMPLETE ONLY
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-400">{label}</span>
      <span className={`text-right font-semibold ${warn ? "text-amber-700" : "text-slate-900"}`}>{value}</span>
    </div>
  );
}
