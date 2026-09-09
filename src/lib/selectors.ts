import { BusinessSummary, ShelfScanResult, Store, StoreRequest } from "./types";

export interface NeedsAttentionItem {
  id: string;
  label: string;
  detail: string;
  kind: "store-attention" | "request" | "stale-risk" | "catch-up";
}

export function getNeedsAttentionItems(stores: Store[], requests: StoreRequest[]): NeedsAttentionItem[] {
  const items: NeedsAttentionItem[] = [];

  for (const store of stores) {
    if (store.status === "needs-attention") {
      items.push({
        id: `store-${store.id}`,
        label: `${store.name} — ${store.city}`,
        detail: store.suggestedOrderReasons[0] ?? "Needs attention",
        kind: "store-attention",
      });
    }
    if (store.staleRiskCases > 0) {
      items.push({
        id: `stale-${store.id}`,
        label: `${store.name} — ${store.city}`,
        detail: store.staleRiskNote ?? `${store.staleRiskCases} cases may become stale soon`,
        kind: "stale-risk",
      });
    }
    if (store.isCatchUpFromYesterday) {
      items.push({
        id: `catchup-${store.id}`,
        label: `${store.name} — ${store.city}`,
        detail: "Carried over from yesterday — catch-up stop",
        kind: "catch-up",
      });
    }
  }

  for (const request of requests) {
    if (request.status === "open") {
      items.push({
        id: `request-${request.id}`,
        label: request.storeName,
        detail: `${request.type}: +${request.quantity} ${request.productName} needed by ${request.neededBy}`,
        kind: "request",
      });
    }
  }

  return items;
}

export function calculateEstimatedEarnings(summary: BusinessSummary): number {
  return (
    summary.routeSales -
    summary.productCost -
    summary.staleLoss -
    summary.franchiseFee -
    summary.fuel -
    summary.truckPayment -
    summary.insurance -
    summary.repairs -
    summary.helperCost -
    summary.storageRental -
    summary.taxesOther
  );
}

const CANNED_SCAN_RESULTS_BY_PRODUCT: Record<string, Omit<ShelfScanResult, "productId" | "productName">> = {
  p1: { shelfStatus: "Empty", backstockEstimate: 0, truckAvailable: 6, suggestedDelivery: 4, confidence: "high" },
  p2: {
    shelfStatus: "Low",
    backstockEstimate: 5,
    backstockRange: [4, 6],
    truckAvailable: 4,
    suggestedDelivery: 5,
    confidence: "medium",
  },
  p3: { shelfStatus: "Low", backstockEstimate: 2, truckAvailable: 14, suggestedDelivery: 6, confidence: "high" },
  p4: { shelfStatus: "Full", backstockEstimate: 8, truckAvailable: 10, suggestedDelivery: 0, confidence: "high" },
  p5: {
    shelfStatus: "Low",
    backstockEstimate: 3,
    backstockRange: [2, 4],
    truckAvailable: 8,
    suggestedDelivery: 4,
    confidence: "medium",
  },
  p6: { shelfStatus: "Empty", backstockEstimate: 0, truckAvailable: 5, suggestedDelivery: 3, confidence: "high" },
};

export function getSimulatedShelfScanResults(
  productId: string,
  productName: string
): ShelfScanResult {
  const base = CANNED_SCAN_RESULTS_BY_PRODUCT[productId] ?? {
    shelfStatus: "Low" as const,
    backstockEstimate: 2,
    truckAvailable: 6,
    suggestedDelivery: 4,
    confidence: "medium" as const,
  };
  return { productId, productName, ...base };
}
