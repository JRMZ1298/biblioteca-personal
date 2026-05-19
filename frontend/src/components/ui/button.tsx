import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-primary text-white hover:bg-primary-active",
  outline:
    "bg-transparent text-ink border border-hairline-strong hover:bg-surface-strong",
  ghost: "bg-transparent text-ink hover:bg-surface-strong",
};

const sizes = {
  sm: "px-3 py-1.5 text-caption",
  md: "px-5 py-2.5 text-[15px] font-medium leading-none",
  lg: "px-6 py-3 text-[15px] font-medium leading-none",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-pill transition-colors focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
