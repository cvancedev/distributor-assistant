import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "success" | "danger";
type Size = "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
  secondary: "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950",
  outline: "bg-white text-slate-900 border-2 border-slate-300 hover:bg-slate-50",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

const sizeClasses: Record<Size, string> = {
  md: "h-12 px-5 text-base",
  lg: "h-16 px-6 text-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = true,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
