"use client";

import { useState } from "react";
import BottomNav, { Tab } from "@/components/ui/BottomNav";
import TodayScreen from "@/components/screens/TodayScreen";
import RouteScreen from "@/components/screens/RouteScreen";
import StoreWorkspaceScreen from "@/components/screens/StoreWorkspaceScreen";
import InventoryScreen from "@/components/screens/InventoryScreen";
import LoadPlanScreen from "@/components/screens/LoadPlanScreen";
import ShortageAllocationScreen from "@/components/screens/ShortageAllocationScreen";
import StoreRequestsScreen from "@/components/screens/StoreRequestsScreen";
import FridayReconciliationScreen from "@/components/screens/FridayReconciliationScreen";
import BusinessScreen from "@/components/screens/BusinessScreen";
import SmartEndOfDayScreen from "@/components/screens/SmartEndOfDayScreen";
import SmartShelfScanScreen from "@/components/screens/SmartShelfScanScreen";
import HelperModeScreen from "@/components/screens/HelperModeScreen";
import {
  businessSummary,
  loadPlan as initialLoadPlan,
  products as initialProducts,
  reconciliationItems,
  routeMeta,
  shortageAllocations,
  storeRequests as initialRequests,
  stores as initialStores,
} from "@/lib/sample-data";
import { LoadPlanItem, Product, Store, StoreRequest } from "@/lib/types";

type Overlay =
  | { type: "store"; id: string }
  | { type: "loadPlan" }
  | { type: "shortageAllocation" }
  | { type: "storeRequests" }
  | { type: "fridayReconciliation" }
  | { type: "helperMode"; id: string }
  | { type: "smartShelfScan"; id: string }
  | { type: "endOfDay" }
  | null;

export default function DistributorApp() {
  const [tab, setTab] = useState<Tab>("today");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [requests, setRequests] = useState<StoreRequest[]>(initialRequests);
  const [loadPlan, setLoadPlan] = useState<LoadPlanItem[]>(initialLoadPlan);

  const totalTruckCases = products.reduce((sum, p) => sum + p.truckInventory, 0);

  const updateStore = (id: string, updates: Partial<Store>) => {
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const updateLoadPlanLoaded = (productId: string, loaded: number) => {
    setLoadPlan((prev) => prev.map((i) => (i.productId === productId ? { ...i, loaded } : i)));
  };

  const reorderLoadPlan = (productId: string, direction: "up" | "down") => {
    setLoadPlan((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((i) => i.productId === productId);
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[swapWith];
      return prev.map((i) => {
        if (i.productId === a.productId) return { ...i, order: b.order };
        if (i.productId === b.productId) return { ...i, order: a.order };
        return i;
      });
    });
  };

  const addRequest = (request: StoreRequest) => {
    setRequests((prev) => [request, ...prev]);
  };

  const fulfillRequest = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "fulfilled" } : r)));
  };

  const goToTab = (nextTab: Tab) => {
    setOverlay(null);
    setTab(nextTab);
  };

  const openStop = (id: string) => setOverlay({ type: "store", id });

  const nextUpcomingAfter = (id: string) => {
    const remaining = stores.filter((s) => s.id !== id && s.status !== "completed");
    return remaining[0] ?? null;
  };

  const renderOverlay = (current: Exclude<Overlay, null>) => {
    switch (current.type) {
      case "store": {
        const store = stores.find((s) => s.id === current.id);
        if (!store) return null;
        const next = nextUpcomingAfter(store.id);
        return (
          <StoreWorkspaceScreen
            store={store}
            totalTruckCases={totalTruckCases}
            requests={requests}
            onUpdateStore={(updates) => updateStore(store.id, updates)}
            onBack={() => setOverlay(null)}
            onOpenShelfScan={() => setOverlay({ type: "smartShelfScan", id: store.id })}
            onOpenHelperMode={() => setOverlay({ type: "helperMode", id: store.id })}
            onCompleteStop={(navigateNext) => {
              updateStore(store.id, { status: "completed" });
              if (navigateNext && next) {
                setOverlay({ type: "store", id: next.id });
              } else {
                setOverlay(null);
              }
            }}
            nextRecommendedStoreName={next?.name}
            nextRecommendedDistance={next?.distanceMinutes}
          />
        );
      }
      case "smartShelfScan": {
        const store = stores.find((s) => s.id === current.id);
        if (!store) return null;
        return (
          <SmartShelfScanScreen
            storeName={store.name}
            products={products}
            onBack={() => setOverlay({ type: "store", id: store.id })}
          />
        );
      }
      case "helperMode": {
        const store = stores.find((s) => s.id === current.id);
        if (!store) return null;
        return (
          <HelperModeScreen
            store={store}
            onBack={() => setOverlay({ type: "store", id: store.id })}
            onMarkComplete={() => {
              updateStore(store.id, { status: "completed" });
              setOverlay(null);
            }}
          />
        );
      }
      case "loadPlan":
        return (
          <LoadPlanScreen
            items={loadPlan}
            onUpdateLoaded={updateLoadPlanLoaded}
            onReorder={reorderLoadPlan}
            onBack={() => setOverlay(null)}
            onOpenShortageAllocation={() => setOverlay({ type: "shortageAllocation" })}
          />
        );
      case "shortageAllocation":
        return (
          <ShortageAllocationScreen allocations={shortageAllocations} onBack={() => setOverlay({ type: "loadPlan" })} />
        );
      case "storeRequests":
        return (
          <StoreRequestsScreen
            stores={stores}
            products={products}
            requests={requests}
            onAddRequest={addRequest}
            onFulfillRequest={fulfillRequest}
            onBack={() => setOverlay(null)}
          />
        );
      case "fridayReconciliation":
        return <FridayReconciliationScreen items={reconciliationItems} onBack={() => setOverlay(null)} />;
      case "endOfDay":
        return (
          <SmartEndOfDayScreen
            stores={stores}
            requests={requests}
            tomorrowsEstimatedLoad={routeMeta.tomorrowsEstimatedLoad}
            onEndDay={() => goToTab("today")}
            onOpenFridayReconciliation={() => setOverlay({ type: "fridayReconciliation" })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-slate-50">
      <div className="flex-1 pb-4">
        {overlay ? (
          renderOverlay(overlay)
        ) : tab === "today" ? (
          <TodayScreen
            stores={stores}
            requests={requests}
            loadPlan={loadPlan}
            shortages={shortageAllocations}
            weatherNote={routeMeta.weatherNote}
            estimatedRouteTime={routeMeta.estimatedRouteTime}
            onStartToday={() => setOverlay({ type: "loadPlan" })}
            onOpenLoadPlan={() => setOverlay({ type: "loadPlan" })}
            onOpenStoreRequests={() => setOverlay({ type: "storeRequests" })}
          />
        ) : tab === "route" ? (
          <RouteScreen stores={stores} onOpenStop={openStop} onOpenEndOfDay={() => setOverlay({ type: "endOfDay" })} />
        ) : tab === "inventory" ? (
          <InventoryScreen
            products={products}
            onUpdate={updateProduct}
            onOpenFridayReconciliation={() => setOverlay({ type: "fridayReconciliation" })}
          />
        ) : (
          <BusinessScreen summary={businessSummary} />
        )}
      </div>
      <BottomNav active={tab} onSelect={goToTab} />
    </div>
  );
}
