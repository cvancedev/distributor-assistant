"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Stepper from "@/components/ui/Stepper";
import { Product, Store, StoreRequest } from "@/lib/types";

const DAYS = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function StoreRequestsScreen({
  stores,
  products,
  requests,
  onAddRequest,
  onFulfillRequest,
  onBack,
}: {
  stores: Store[];
  products: Product[];
  requests: StoreRequest[];
  onAddRequest: (request: StoreRequest) => void;
  onFulfillRequest: (id: string) => void;
  onBack: () => void;
}) {
  const [storeId, setStoreId] = useState(stores[0]?.id ?? "");
  const [productName, setProductName] = useState(products[0]?.name ?? "");
  const [quantity, setQuantity] = useState(5);
  const [neededBy, setNeededBy] = useState("Thursday");
  const [type, setType] = useState<StoreRequest["type"]>("Special Request");

  const submit = (createdVia: "voice" | "manual", rawVoiceText?: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return;
    onAddRequest({
      id: `r-${Date.now()}`,
      storeId,
      storeName: `${store.name} — ${store.city}`,
      productName,
      quantity,
      neededBy,
      type,
      status: "open",
      createdVia,
      rawVoiceText,
    });
  };

  const simulateVoice = () => {
    const store = stores.find((s) => s.name === "Value Foods") ?? stores[0];
    setStoreId(store.id);
    setProductName("Christmas Tree Cakes");
    setQuantity(5);
    setNeededBy("Thursday");
    setType("Special Request");
    submit("voice", `${store.name} wants five extra Christmas Tree Cakes Thursday.`);
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <button onClick={onBack} className="flex w-fit items-center gap-1 text-sm font-semibold text-blue-600">
        ← Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Store Requests</h1>
        <p className="text-slate-500">Quick capture — feeds load plans, suggested orders, and store workspaces</p>
      </div>

      <Card className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Quick Store Request</h2>
        <Button variant="outline" onClick={simulateVoice}>
          🎙️ Add Voice Request
        </Button>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Store
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="h-11 rounded-xl border border-slate-300 px-3"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.city}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Product
          <select
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="h-11 rounded-xl border border-slate-300 px-3"
          >
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <Stepper label="Quantity" value={quantity} onChange={setQuantity} />

        <div className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Needed By
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setNeededBy(day)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  neededBy === day ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          Type
          <div className="flex gap-2">
            {(["Special Request", "Order Adjustment"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  type === t ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={() => submit("manual")}>ADD REQUEST</Button>
      </Card>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">All Requests</h2>
        {requests.length === 0 && <Card className="text-sm text-slate-500">No requests yet.</Card>}
        {requests.map((r) => (
          <Card key={r.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">{r.storeName}</p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  r.status === "open" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {r.status === "open" ? "Open" : "Fulfilled"}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {r.type}: +{r.quantity} {r.productName} needed by {r.neededBy}
            </p>
            {r.rawVoiceText && <p className="text-xs italic text-slate-400">&ldquo;{r.rawVoiceText}&rdquo;</p>}
            {r.status === "open" && (
              <Button size="md" variant="outline" className="mt-1" onClick={() => onFulfillRequest(r.id)}>
                MARK FULFILLED
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
