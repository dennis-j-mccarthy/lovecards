import { forwardRef, type TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "w-full border border-gray-200 bg-white px-4 py-3 text-sm rounded-lg outline-none transition-colors resize-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] disabled:opacity-50",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = "Textarea"
