"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import { Store } from "@/lib/types";

const priorityWeight = { high: 0, medium: 1, low: 2 };
const priorityLabel = { high: "High Priority", medium: "Medium Priority", low: "Low Priority" };

function buildMapsUrl(store: Store) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.city}`)}`;
}

export default function RouteScreen({
  stores,
  onOpenStop,
  onOpenEndOfDay,
}: {
  stores: Store[];
  onOpenStop: (id: string) => void;
  onOpenEndOfDay: () => void;
}) {
  const [deprioritized, setDeprioritized] = useState<Record<string, number>>({});
  const [ignored, setIgnored] = useState<Set<string>>(new Set());

  const completedCount = stores.filter((s) => s.status === "completed").length;

  const recommended = useMemo(() => {
    const candidates = stores.filter((s) => s.status !== "completed" && !ignored.has(s.id));
    if (candidates.length === 0) return null;
    return [...candidates].sort((a, b) => {
      const attentionA = a.status === "needs-attention" || a.status === "catch-up" ? 0 : 1;
      const attentionB = b.status === "needs-attention" || b.status === "catch-up" ? 0 : 1;
      if (attentionA !== attentionB) return attentionA - attentionB;
      const deprioA = deprioritized[a.id] ?? 0;
      const deprioB = deprioritized[b.id] ?? 0;
      if (deprioA !== deprioB) return deprioA - deprioB;
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[a.priority] - priorityWeight[b.priority];
      }
      return a.distanceMinutes - b.distanceMinutes;
    })[0];
  }, [stores, deprioritized, ignored]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Today&apos;s Route</h1>
        <p className="text-slate-500">
          {completedCount} / {stores.length} stops completed
        </p>
      </div>

      {recommended && (
        <Card className="flex flex-col gap-3 border-2 border-blue-200 bg-blue-50">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">Next Recommended Stop</p>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {recommended.name} — {recommended.city}
            </h3>
            <p className="text-sm text-slate-600">
              {priorityLabel[recommended.priority]} · {recommended.distanceMinutes} min away
            </p>
            <p className="text-sm text-slate-600">
              Receiving closes {recommended.receivingHours.split("–")[1]?.trim() ?? recommended.receivingHours}
            </p>
            <p className="text-sm text-slate-600">Expected service: {recommended.estServiceTimeMinutes} min</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="success" onClick={() => onOpenStop(recommended.id)}>
              ACCEPT
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setDeprioritized((prev) => ({ ...prev, [recommended.id]: (prev[recommended.id] ?? 0) + 1 }))
              }
            >
              REORDER
            </Button>
            <Button variant="outline" onClick={() => setIgnored((prev) => new Set(prev).add(recommended.id))}>
              IGNORE
            </Button>
          </div>
          <a
            href={buildMapsUrl(recommended)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm font-semibold text-blue-600"
          >
            📍 Navigate with Maps
          </a>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {stores.map((store) => (
          <Card key={store.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Stop {store.stopNumber}</p>
                <h3 className="text-lg font-bold text-slate-900">
                  {store.name} — {store.city}
                </h3>
                <p className="text-sm text-slate-500">{store.time}</p>
              </div>
              <StatusBadge status={store.status} />
            </div>
            <p className="text-sm text-slate-600">
              Suggested Order: <span className="font-semibold text-slate-900">{store.suggestedOrderCases} cases</span>
            </p>
            <Button onClick={() => onOpenStop(store.id)}>OPEN STOP</Button>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={onOpenEndOfDay}>
        View End of Day Summary →
      </Button>
    </div>
  );
}
