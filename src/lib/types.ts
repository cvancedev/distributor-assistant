export type Priority = "high" | "medium" | "low";
export type StopStatus = "upcoming" | "in-progress" | "completed" | "needs-attention" | "catch-up";
export type Confidence = "high" | "medium" | "low";

export type StoreWorkflowStep =
  | "order-scan"
  | "dates-stales"
  | "pick-load"
  | "receiving"
  | "stock-shelves"
  | "complete";

export const STORE_WORKFLOW_STEPS: { id: StoreWorkflowStep; label: string }[] = [
  { id: "order-scan", label: "Order / Scan" },
  { id: "dates-stales", label: "Dates & Stales" },
  { id: "pick-load", label: "Pick / Load Cart" },
  { id: "receiving", label: "Receiving" },
  { id: "stock-shelves", label: "Stock Shelves" },
  { id: "complete", label: "Complete" },
];

export interface Product {
  id: string;
  name: string;
  seasonal?: boolean;
  truckInventory: number;
  storageInventory: number;
}

export interface StoreContact {
  managerName: string;
  phone: string;
}

export interface StoreNote {
  id: string;
  text: string;
}

export interface StoreRequest {
  id: string;
  storeId: string;
  storeName: string;
  productName: string;
  quantity: number;
  neededBy: string;
  type: "Special Request" | "Order Adjustment";
  status: "open" | "fulfilled";
  createdVia: "voice" | "manual";
  rawVoiceText?: string;
}

export type ShelfScanLocation =
  | "Main Shelf"
  | "Endcap"
  | "Seasonal Display"
  | "Secondary Display"
  | "Backstock"
  | "Other";

export interface ShelfScanPhoto {
  id: string;
  location: ShelfScanLocation;
}

export interface ShelfScanResult {
  productId: string;
  productName: string;
  shelfStatus: "Empty" | "Low" | "Full";
  backstockEstimate: number;
  backstockRange?: [number, number];
  truckAvailable: number;
  suggestedDelivery: number;
  confidence: Confidence;
}

export interface Store {
  id: string;
  stopNumber: number;
  name: string;
  city: string;
  priority: Priority;
  status: StopStatus;
  time: string;
  distanceMinutes: number;
  receivingHours: string;
  estServiceTimeMinutes: number;
  lastDeliveryCases: number;
  recentSalesTrend: string;
  suggestedOrderCases: number;
  suggestedOrderConfidence: Confidence;
  suggestedOrderReasons: string[];
  approvedOrderCases: number | null;
  adjustReason?: string;
  rememberAdjustment: boolean;
  orderedCases: number;
  pickedCases: number;
  deliveredCases: number;
  stalesCases: number;
  staleRiskCases: number;
  staleRiskNote?: string;
  promotion?: string;
  specialRequestIds: string[];
  contact: StoreContact;
  notes: StoreNote[];
  workflowStep: StoreWorkflowStep;
  assignedHelper?: string;
  isCatchUpFromYesterday?: boolean;
}

export interface LoadPlanItem {
  productId: string;
  productName: string;
  needed: number;
  loaded: number;
  seasonal?: boolean;
  order: number;
}

export interface ShortageAllocationEntry {
  storeId: string;
  storeName: string;
  quantity: number;
  reason: string;
}

export interface ShortageAllocation {
  productId: string;
  productName: string;
  neededToday: number;
  available: number;
  allocations: ShortageAllocationEntry[];
}

export interface ReconciliationItem {
  productId: string;
  productName: string;
  location: "Truck" | "Storage";
  expected: number;
  physical: number;
}

export interface BusinessSummary {
  routeSales: number;
  productCost: number;
  staleLoss: number;
  franchiseFee: number;
  fuel: number;
  truckPayment: number;
  insurance: number;
  repairs: number;
  helperCost: number;
  storageRental: number;
  taxesOther: number;
}

export interface HelperAssignment {
  storeId: string;
  helperName: string;
}
