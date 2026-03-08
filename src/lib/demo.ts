/** Returns true when demo mode is enabled (dev toolbar, sample emails, dev API routes) */
export function isDemo(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  )
}
