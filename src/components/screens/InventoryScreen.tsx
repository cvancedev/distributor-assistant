import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Stepper from "@/components/ui/Stepper";
import { Product } from "@/lib/types";

export default function InventoryScreen({
  products,
  onUpdate,
  onOpenFridayReconciliation,
}: {
  products: Product[];
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onOpenFridayReconciliation: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
        <p className="text-slate-500">Truck vs. storage/drop location — operational awareness only</p>
      </div>

      <Button variant="outline" onClick={onOpenFridayReconciliation}>
        📋 Friday Inventory Reconciliation
      </Button>

      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-slate-900">
              {product.seasonal && "🎄 "}
              {product.name}
            </h3>
            <div className="divide-y divide-slate-100">
              <Stepper
                label="Truck"
                value={product.truckInventory}
                onChange={(v) => onUpdate(product.id, { truckInventory: v })}
              />
              <Stepper
                label="Storage / Drop"
                value={product.storageInventory}
                onChange={(v) => onUpdate(product.id, { storageInventory: v })}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
