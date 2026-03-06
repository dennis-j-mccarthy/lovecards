"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { DesignTemplate } from "@prisma/client"

interface TemplatePickerProps {
  templates: DesignTemplate[]
  selectedId: string | null
  tributeId: string
}

const THEME_PREVIEWS: Record<
  string,
  { bg: string; cardBg: string; accent: string; border: string }
> = {
  classic: { bg: "#faf9f7", cardBg: "#fff", accent: "#8b7355", border: "#d4c5a9" },
  dark: { bg: "#1a1a1a", cardBg: "#2d2d2d", accent: "#c9a96e", border: "#444" },
  floral: { bg: "#fdf6f0", cardBg: "#fff9f5", accent: "#c17d5c", border: "#e8c9b0" },
  minimalist: { bg: "#f5f5f5", cardBg: "#fff", accent: "#666", border: "#e0e0e0" },
}

export function TemplatePicker({ templates, selectedId, tributeId }: TemplatePickerProps) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(selectedId)
  const [saving, setSaving] = useState(false)

  async function handleSelect(templateId: string) {
    setSelected(templateId)
    setSaving(true)

    try {
      await fetch(`/api/tributes/${tributeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      })
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-[#d4c5a9]">
        <p className="text-[#999] text-sm">No design templates available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {templates.map((template) => {
        const colors = THEME_PREVIEWS[template.theme] ?? THEME_PREVIEWS.classic
        const isSelected = selected === template.id

        return (
          <button
            key={template.id}
            onClick={() => handleSelect(template.id)}
            disabled={saving}
            className={`text-left border-2 transition-all ${
              isSelected
                ? "border-[#8b7355] shadow-md"
                : "border-[#d4c5a9] hover:border-[#8b7355]"
            }`}
          >
            {/* Preview miniature */}
            <div
              className="p-4 h-32 relative"
              style={{ background: colors.bg }}
            >
              <div className="grid grid-cols-3 gap-1 h-full">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: i === 0 ? colors.accent : colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      opacity: i === 0 ? 1 : 0.7,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Label */}
            <div
              className="p-3 border-t"
              style={{ borderColor: colors.border, background: colors.bg }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-normal"
                    style={{ color: colors.accent }}
                  >
                    {template.name}
                  </p>
                  {template.description && (
                    <p className="text-xs mt-0.5" style={{ color: colors.accent + "99" }}>
                      {template.description}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <span
                    className="text-xs border px-2 py-0.5"
                    style={{ borderColor: colors.accent, color: colors.accent }}
                  >
                    Selected
                  </span>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
