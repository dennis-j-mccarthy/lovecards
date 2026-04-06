"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

interface ScenarioItem {
  id: string
  label: string
  description: string
  color: string
  isLink?: boolean
  href?: string
}

interface ScenarioGroup {
  title: string
  items: ScenarioItem[]
}

// Notes keyed by path (exact or prefix match)
const pathNotes: Record<string, string> = {
  "/": "This is where we introduce users to the concept, hopefully self-explanatory. Not visible to normal users, only active here for demo purposes.",
  "/checkout": "This is where the user begins the process of buying a card box, which gives them access to the system. Go ahead and click Continue to Payment — it's simulated and fully functional.",
  "/checkout/success": "Now the user has purchased access and can begin with their Love Card Box creation.",
}

// Notes keyed by scenario ID (used when a dev toolbar button navigates to a dynamic route)
const scenarioNotes: Record<string, string> = {
  "buyer-with-tribute": "Here is where the user can view sent contributions, invite additional contributors, and even choose designs of their Love Card Box and cards. Note that the design function isn't working yet.",
  "sample-email": "This email is sent to each contributor — they don't have to log in. They just need to click the button to begin the process of contributing.",
  "sample-nudge": "People being as they are, it will be necessary to remind them repeatedly. Here we also make use of the phone number as a more effective way of nudging people.",
  "contributor": "Users add their avatar (this is important), their basic information, and write their card. If they choose to stay anonymous, their cards won't be visible to other contributors. Click the ? icon for guidelines on what makes a great card, or the arrow to expand tips. They can also add a photo. Note: the cards on the right are from their peers and serve as further inspiration for writing great cards.",
  "populated-dashboard": "Here we have contributions made for admins to review. This Love Card Box is about ready to send to the printer. Choose Generate Cards at top right to simulate this.",
}

const DEV_SCENARIO_KEY = "dev-last-scenario"

// Ordered flow of all navigable steps (for "next step" arrow)
const flowOrder = [
  "homepage",
  "purchase-sim",
  "buyer-fresh",
  "buyer-with-tribute",
  "sample-email",
  "sample-nudge",
  "contributor",
  "populated-dashboard",
  "generate-cards",
]

function getDevNote(pathname: string): string | null {
  // Exact path match first
  if (pathNotes[pathname]) return pathNotes[pathname]

  // Check scenario-based notes (stored when a dev toolbar button is clicked)
  if (typeof window !== "undefined") {
    const lastScenario = sessionStorage.getItem(DEV_SCENARIO_KEY)
    if (lastScenario && scenarioNotes[lastScenario]) return scenarioNotes[lastScenario]
  }

  // Prefix match for dynamic routes
  for (const [pattern, note] of Object.entries(pathNotes)) {
    if (pathname.startsWith(pattern) && pattern !== "/") return note
  }
  return null
}

function getCurrentScenario(pathname: string): string | null {
  // Path-based mapping
  const pathToScenario: Record<string, string> = {
    "/": "homepage",
    "/checkout": "purchase-sim",
    "/checkout/success": "buyer-fresh",
  }
  if (pathToScenario[pathname]) return pathToScenario[pathname]

  // Session-based for dynamic routes
  if (typeof window !== "undefined") {
    const lastScenario = sessionStorage.getItem(DEV_SCENARIO_KEY)
    if (lastScenario) return lastScenario
  }
  return null
}

function getNextScenario(current: string | null): string | null {
  if (!current) return null
  const idx = flowOrder.indexOf(current)
  if (idx === -1 || idx >= flowOrder.length - 1) return null
  return flowOrder[idx + 1]
}

const groups: ScenarioGroup[] = [
  {
    title: "Pages",
    items: [
      {
        id: "homepage",
        label: "Homepage",
        description: "Landing page",
        color: "#800020",
        isLink: true,
        href: "/",
      },
    ],
  },
  {
    title: "Purchasing",
    items: [
      {
        id: "purchase-sim",
        label: "Purchase Simulation",
        description: "Pre-purchase → payment → Love Card Box creation",
        color: "#c25d45",
      },
      {
        id: "buyer-fresh",
        label: "Fresh Buyer",
        description: "Post-checkout, create Love Card Box form",
        color: "#e8785e",
      },
      {
        id: "buyer-with-tribute",
        label: "Empty Buyer Dashboard",
        description: "Love Card Box created, no contributions yet",
        color: "#d4922e",
      },
    ],
  },
  {
    title: "Contributor",
    items: [
      {
        id: "sample-email",
        label: "Invite Email",
        description: "Sample invite email",
        color: "#9b6ba8",
        isLink: true,
        href: "/dev/sample-email",
      },
      {
        id: "sample-nudge",
        label: "Nudge Email",
        description: "Sample reminder email",
        color: "#7b6ba8",
        isLink: true,
        href: "/dev/sample-nudge-email",
      },
      {
        id: "contributor",
        label: "Contributor View",
        description: "Contribution form with existing cards",
        color: "#5ba887",
      },
    ],
  },
  {
    title: "Buyer Dashboard",
    items: [
      {
        id: "populated-dashboard",
        label: "Populated Buyer Dashboard",
        description: "12 cards from 4 contributors",
        color: "#3a7ca5",
      },
    ],
  },
]

export function DevToolbar() {
  const [loading, setLoading] = useState<string | null>(null)
  const [minimized, setMinimized] = useState(false)
  const pathname = usePathname()
  const devNote = getDevNote(pathname)
  const currentScenario = getCurrentScenario(pathname)
  const nextScenario = getNextScenario(currentScenario)

  // Find the next scenario's item info for navigation
  const allItems = groups.flatMap((g) => g.items)
  const nextItem = nextScenario ? allItems.find((s) => s.id === nextScenario) : null

  async function runScenario(scenario: string) {
    setLoading(scenario)
    sessionStorage.setItem(DEV_SCENARIO_KEY, scenario)
    try {
      const res = await fetch("/api/dev/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed")

      if (scenario === "contributor" && data.contributeUrl) {
        window.open(data.contributeUrl, "_blank")
      } else if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      }
    } catch {
      // ignore
    } finally {
      setLoading(null)
    }
  }

  async function clearDemo() {
    setLoading("clear")
    try {
      await fetch("/api/dev/demo", { method: "DELETE" })
      window.location.href = "/"
    } catch {
      // ignore
    } finally {
      setLoading(null)
    }
  }

  function handleLink(href: string, scenarioId?: string) {
    if (scenarioId) sessionStorage.setItem(DEV_SCENARIO_KEY, scenarioId)
    window.location.href = href
  }

  function goToNext() {
    if (!nextScenario) return
    if (nextScenario === "generate-cards") {
      const match = pathname.match(/^\/dashboard\/([^/]+)/)
      if (match) {
        sessionStorage.setItem(DEV_SCENARIO_KEY, "generate-cards")
        window.location.href = `/dashboard/${match[1]}/generate`
      }
      return
    }
    const item = allItems.find((s) => s.id === nextScenario)
    if (item?.isLink && item.href) {
      handleLink(item.href, item.id)
    } else if (item) {
      runScenario(item.id)
    }
  }

  if (minimized) {
    return (
      <div className="fixed bottom-0 right-0 z-[9999]">
        <button
          onClick={() => setMinimized(false)}
          className="bg-white border border-[#e5e7eb] border-b-0 border-r-0 text-[#800020] text-xs tracking-[1px] uppercase px-4 py-2 rounded-tl-lg hover:bg-white transition-colors shadow-sm"
        >
          Dev Tools
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t-2 border-[#e5e7eb] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-6xl mx-auto px-6 py-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-[#111827] tracking-wide">
            Development Navigation <span className="font-normal text-gray-400">(only visible in demo mode)</span>
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={clearDemo}
              disabled={loading !== null}
              className="text-sm text-gray-400 hover:text-red-500 px-3 py-1 border border-[#e8e0d4] rounded hover:border-red-200 transition-colors disabled:opacity-40"
            >
              {loading === "clear" ? "Clearing..." : "Clear Demo Data"}
            </button>
            <button
              onClick={() => setMinimized(true)}
              className="text-gray-300 hover:text-gray-500 transition-colors p-1"
              aria-label="Minimize toolbar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 15 12 9 18 15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dev note for current page */}
        {devNote && (
          <div className="mb-3 flex items-center gap-2">
            <div className="flex-1 bg-[#8b2020] text-white text-xs font-bold px-4 py-2.5 rounded-lg leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {devNote}
            </div>
            {nextScenario && (
              <button
                onClick={goToNext}
                disabled={loading !== null}
                className="flex items-center gap-1.5 bg-[#8b2020] text-white text-xs font-bold px-3 py-2.5 rounded-lg hover:bg-[#a02828] transition-colors disabled:opacity-40 whitespace-nowrap"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Next: {nextScenario === "generate-cards" ? "Generate Cards" : nextItem?.label ?? "Next"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Grouped scenarios */}
        <div className="flex items-start gap-4 overflow-x-auto">
          {groups.map((group, gi) => (
            <div key={group.title} className="flex items-start gap-4 flex-shrink-0">
              {gi > 0 && (
                <div className="flex items-center pt-6 text-[#e5e7eb]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </div>
              )}
              <div>
                <p className="text-[10px] tracking-[2px] uppercase text-[#800020] mb-2">
                  {group.title}
                </p>
                <div className="flex gap-2">
                  {group.items.map((s, si) => (
                    <div key={s.id} className="flex items-center gap-2">
                      {si > 0 && (
                        <span className="text-[#e5e7eb] text-sm">→</span>
                      )}
                      <button
                        onClick={() =>
                          s.isLink && s.href
                            ? handleLink(s.href, s.id)
                            : runScenario(s.id)
                        }
                        disabled={loading !== null}
                        className="flex items-center gap-2.5 px-4 py-2.5 border-2 border-[#e8e0d4] rounded-lg bg-white hover:bg-[#fdf2f4] hover:border-[#e5e7eb] transition-all disabled:opacity-40 text-left shadow-sm hover:shadow-md"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: s.color }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#111827] leading-tight whitespace-nowrap">
                            {loading === s.id ? "Loading..." : s.label}
                          </p>
                          <p className="text-[11px] text-gray-400 leading-tight whitespace-nowrap">
                            {s.description}
                          </p>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Generate Cards — far right */}
          <div className="flex items-start gap-4 flex-shrink-0 ml-auto">
            <div className="flex items-center pt-6 text-[#e5e7eb]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] tracking-[2px] uppercase text-[#800020] mb-2">
                Finish
              </p>
              <button
                onClick={() => {
                  const match = pathname.match(/^\/dashboard\/([^/]+)/)
                  if (match) {
                    sessionStorage.setItem(DEV_SCENARIO_KEY, "generate-cards")
                    window.location.href = `/dashboard/${match[1]}/generate`
                  }
                }}
                disabled={loading !== null || !pathname.startsWith("/dashboard/")}
                className="flex items-center gap-2.5 px-4 py-2.5 border-2 border-[#e8e0d4] rounded-lg bg-white hover:bg-[#fdf2f4] hover:border-[#e5e7eb] transition-all disabled:opacity-40 text-left shadow-sm hover:shadow-md"
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-[#2d8a4e]" />
                <div>
                  <p className="text-sm font-semibold text-[#111827] leading-tight whitespace-nowrap">
                    Generate Cards
                  </p>
                  <p className="text-[11px] text-gray-400 leading-tight whitespace-nowrap">
                    Send to printer
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
