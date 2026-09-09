import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getNeedsAttentionItems } from "@/lib/selectors";
import { LoadPlanItem, ShortageAllocation, Store, StoreRequest } from "@/lib/types";

export default function TodayScreen({
  stores,
  requests,
  loadPlan,
  shortages,
  weatherNote,
  estimatedRouteTime,
  onStartToday,
  onOpenLoadPlan,
  onOpenStoreRequests,
}: {
  stores: Store[];
  requests: StoreRequest[];
  loadPlan: LoadPlanItem[];
  shortages: ShortageAllocation[];
  weatherNote: string;
  estimatedRouteTime: string;
  onStartToday: () => void;
  onOpenLoadPlan: () => void;
  onOpenStoreRequests: () => void;
}) {
  const scheduledStores = stores.length;
  const highPriorityStores = stores.filter((s) => s.priority === "high").length;
  const seasonalItems = loadPlan.filter((i) => i.seasonal);
  const catchUps = stores.filter((s) => s.isCatchUpFromYesterday);
  const tightestReceiving = stores.filter((s) => s.priority === "high")[0] ?? stores[0];
  const needsAttention = getNeedsAttentionItems(stores, requests);
  const openRequests = requests.filter((r) => r.status === "open");

  return (
    <div className="flex flex-col gap-5 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Here&apos;s Your Day</h1>
        <p className="text-slate-500">Tuesday, September 9</p>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Stat value={scheduledStores} label="Scheduled Stores" />
          <Stat value={highPriorityStores} label="High Priority" accent="text-red-600" />
          <Stat value={estimatedRouteTime} label="Estimated Workload" />
          <Stat value={loadPlan.reduce((sum, i) => sum + i.needed, 0)} label="Cases To Load" />
        </div>
        <Button size="lg" onClick={onStartToday}>
          START TODAY / START LOADING
        </Button>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Products To Load</h2>
          <p className="text-sm text-slate-600">
            {loadPlan.length} products, {loadPlan.reduce((sum, i) => sum + i.needed, 0)} cases planned
          </p>
          <button onClick={onOpenLoadPlan} className="mt-1 w-fit text-sm font-semibold text-blue-600">
            View Load Plan →
          </button>
        </Card>

        <Card className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Product Shortages</h2>
          {shortages.length === 0 ? (
            <p className="text-sm text-slate-500">No shortages today.</p>
          ) : (
            shortages.map((s) => (
              <p key={s.productId} className="text-sm text-slate-600">
                {s.productName}: need {s.neededToday}, have {s.available}
              </p>
            ))
          )}
        </Card>

        <Card className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Special Store Requests</h2>
          {openRequests.length === 0 ? (
            <p className="text-sm text-slate-500">No open requests.</p>
          ) : (
            openRequests.map((r) => (
              <p key={r.id} className="text-sm text-slate-600">
                {r.storeName}: +{r.quantity} {r.productName} by {r.neededBy}
              </p>
            ))
          )}
          <button onClick={onOpenStoreRequests} className="mt-1 w-fit text-sm font-semibold text-blue-600">
            View Store Requests →
          </button>
        </Card>

        <Card className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Seasonal Products</h2>
          {seasonalItems.length === 0 ? (
            <p className="text-sm text-slate-500">None active today.</p>
          ) : (
            seasonalItems.map((i) => (
              <p key={i.productId} className="text-sm text-slate-600">
                🎄 {i.productName} — {i.needed} cases planned
              </p>
            ))
          )}
        </Card>

        <Card className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Receiving Deadlines</h2>
          <p className="text-sm text-slate-600">
            {tightestReceiving.name} closes at {tightestReceiving.receivingHours.split("–")[1]?.trim() ?? tightestReceiving.receivingHours}
          </p>
        </Card>

        <Card className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Weather</h2>
          <p className="text-sm text-slate-600">🌧️ {weatherNote}</p>
        </Card>

        {catchUps.length > 0 && (
          <Card className="flex flex-col gap-1 sm:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Carryovers From Yesterday</h2>
            {catchUps.map((c) => (
              <p key={c.id} className="text-sm text-slate-600">
                {c.name} — {c.city}
              </p>
            ))}
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Needs Attention</h2>
        {needsAttention.length === 0 ? (
          <Card className="text-sm text-slate-500">Nothing needs attention right now.</Card>
        ) : (
          needsAttention.map((item) => (
            <Card key={item.id} className="flex items-center gap-3 py-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-slate-900">{item.label}</p>
                <p className="text-sm text-slate-500">{item.detail}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function Stat({ value, label, accent }: { value: string | number; accent?: string; label: string }) {
  return (
    <div>
      <p className={`text-3xl font-bold ${accent ?? "text-slate-900"}`}>{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
