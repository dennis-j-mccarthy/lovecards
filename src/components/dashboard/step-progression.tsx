import Link from "next/link"

interface StepProgressionProps {
  tributeId: string
  activeStep: 1 | 2 | 3
}

const steps = [
  { num: 1 as const, label: "Invitations", desc: "Send to loved ones", path: "invite", color: "indigo" as const },
  { num: 2 as const, label: "Contributions", desc: "Cards from loved ones", path: "", color: "violet" as const },
  { num: 3 as const, label: "Generate", desc: "Print your cards", path: "generate", color: "emerald" as const },
]

const colorMap = {
  indigo: {
    active: "bg-[#800020] shadow-[#800020]/30 ring-4 ring-[#800020]/20",
    inactive: "bg-[#800020] shadow-[#800020]/30",
    hover: "group-hover:bg-[#5c0018] group-hover:scale-105",
  },
  violet: {
    active: "bg-violet-500 shadow-violet-500/30 ring-4 ring-violet-200",
    inactive: "bg-violet-500 shadow-violet-500/30",
    hover: "group-hover:bg-violet-600 group-hover:scale-105",
  },
  emerald: {
    active: "bg-emerald-500 shadow-emerald-500/30 ring-4 ring-emerald-200",
    inactive: "bg-emerald-500 shadow-emerald-500/30",
    hover: "group-hover:bg-emerald-600 group-hover:scale-105",
  },
}

const connectorGradients = [
  "bg-gradient-to-r from-[#800020] to-violet-500",
  "bg-gradient-to-r from-violet-500 to-emerald-500",
]

export function StepProgression({ tributeId, activeStep }: StepProgressionProps) {
  return (
    <div className="border-b border-[#e5e7eb] bg-gray-50/50 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => {
            const isActive = step.num === activeStep
            const colors = colorMap[step.color]
            const circleClass = `w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl font-bold shadow-lg transition-all ${
              isActive ? colors.active : colors.inactive
            }`
            const href = step.path
              ? `/dashboard/${tributeId}/${step.path}`
              : `/dashboard/${tributeId}`

            return (
              <div key={step.num} className="contents">
                <Link
                  href={href}
                  className="flex flex-col items-center gap-3 group flex-1"
                >
                  <div className={`${circleClass} ${!isActive ? colors.hover : ""}`}>
                    {step.num}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${isActive ? "text-[#800020]" : "text-gray-900"}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                    {isActive && (
                      <p className="text-[10px] text-[#800020] font-medium mt-1 tracking-wide uppercase">
                        You are here
                      </p>
                    )}
                  </div>
                </Link>
                {i < steps.length - 1 && (
                  <div className={`flex-1 max-w-[120px] h-1 rounded-full ${connectorGradients[i]} mx-2 mt-[-28px]`} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
