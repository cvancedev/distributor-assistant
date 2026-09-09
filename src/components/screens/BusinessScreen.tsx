import Card from "@/components/ui/Card";
import { calculateEstimatedEarnings } from "@/lib/selectors";
import { BusinessSummary } from "@/lib/types";

const rows: { key: keyof BusinessSummary; label: string; negative?: boolean }[] = [
  { key: "routeSales", label: "Route Sales" },
  { key: "productCost", label: "Bakery / Product Cost", negative: true },
  { key: "staleLoss", label: "Stale Loss", negative: true },
  { key: "franchiseFee", label: "Franchise Fee", negative: true },
  { key: "fuel", label: "Fuel", negative: true },
  { key: "truckPayment", label: "Truck Payment", negative: true },
  { key: "insurance", label: "Insurance", negative: true },
  { key: "repairs", label: "Repairs", negative: true },
  { key: "helperCost", label: "Helper / Employee Costs", negative: true },
  { key: "storageRental", label: "Storage Rental", negative: true },
  { key: "taxesOther", label: "Taxes / Other Expenses", negative: true },
];

export default function BusinessScreen({ summary }: { summary: BusinessSummary }) {
  const earnings = calculateEstimatedEarnings(summary);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Business / Profit</h1>
        <p className="text-slate-500">Visibility only — not accounting software</p>
      </div>

      <Card className="flex flex-col divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between py-2 text-sm">
            <span className="text-slate-600">{row.label}</span>
            <span className={`font-semibold ${row.negative ? "text-red-600" : "text-slate-900"}`}>
              {row.negative ? "− " : ""}${summary[row.key].toLocaleString()}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between py-3 text-base font-bold">
          <span className="text-slate-900">Estimated Earnings</span>
          <span className={earnings >= 0 ? "text-emerald-600" : "text-red-600"}>
            ${earnings.toLocaleString()}
          </span>
        </div>
      </Card>

      <p className="text-xs text-slate-400">
        Fictional numbers for prototype purposes. Kept separate from daily route operations.
      </p>
    </div>
  );
}
