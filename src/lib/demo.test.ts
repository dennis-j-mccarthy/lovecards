import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { isDemo } from "./demo"

describe("isDemo", () => {

  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "")
    vi.stubEnv("DEMO_MODE", "")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("returns true in non-production environment", () => {
    vi.stubEnv("NODE_ENV", "development")
    expect(isDemo()).toBe(true)
  })

  it("returns true when NEXT_PUBLIC_DEMO_MODE is true", () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "true")
    expect(isDemo()).toBe(true)
  })

  it("returns true when DEMO_MODE is true", () => {
    vi.stubEnv("DEMO_MODE", "true")
    expect(isDemo()).toBe(true)
  })

  it("returns false in production without demo flags", () => {
    expect(isDemo()).toBe(false)
  })
})
