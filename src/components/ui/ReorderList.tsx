import { ReactNode } from "react";

interface ReorderListProps<T> {
  items: T[];
  getId: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onMove: (id: string, direction: "up" | "down") => void;
}

export default function ReorderList<T>({ items, getId, renderItem, onMove }: ReorderListProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const id = getId(item);
        return (
          <div key={id} className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <button
                type="button"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => onMove(id, "up")}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={i === items.length - 1}
                onClick={() => onMove(id, "down")}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 disabled:opacity-30"
              >
                ↓
              </button>
            </div>
            <div className="flex-1">{renderItem(item)}</div>
          </div>
        );
      })}
    </div>
  );
}
