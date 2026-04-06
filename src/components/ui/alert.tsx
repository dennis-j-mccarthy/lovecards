import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export type AlertVariant = "error" | "success" | "warning" | "info"

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

const variantStyles: Record<AlertVariant, string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-green-200 bg-green-50 text-green-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
}

export function Alert({ className, variant = "info", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "p-3 border rounded-lg text-sm",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  )
}
