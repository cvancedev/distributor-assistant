interface StepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
}

export default function Stepper({ label, value, onChange, unit = "cases", min = 0 }: StepperProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl font-bold text-slate-700 active:bg-slate-200"
        >
          −
        </button>
        <span className="w-16 text-center text-lg font-bold tabular-nums text-slate-900">
          {value}
          <span className="ml-1 text-xs font-normal text-slate-400">{unit}</span>
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white active:bg-blue-700"
        >
          +
        </button>
      </div>
    </div>
  );
}
