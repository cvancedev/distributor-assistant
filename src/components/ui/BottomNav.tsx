export type Tab = "today" | "route" | "inventory" | "business";

interface NavItem {
  id: Tab;
  label: string;
  icon: string;
}

const items: NavItem[] = [
  { id: "today", label: "Today", icon: "☀️" },
  { id: "route", label: "Route", icon: "🚚" },
  { id: "inventory", label: "Inventory", icon: "📦" },
  { id: "business", label: "Business", icon: "💵" },
];

export default function BottomNav({ active, onSelect }: { active: Tab; onSelect: (tab: Tab) => void }) {
  return (
    <nav className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-3xl">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => onSelect(item.id)}
                className={`flex w-full flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors ${
                  isActive ? "text-blue-600" : "text-slate-400"
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
