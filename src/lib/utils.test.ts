import { describe, it, expect, vi, beforeEach } from "vitest"
import { cn, generateSlug, formatDate, absoluteUrl } from "./utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
  })

  it("deduplicates tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  it("handles empty input", () => {
    expect(cn()).toBe("")
  })
})

describe("generateSlug", () => {
  it("converts name to lowercase slug", () => {
    const slug = generateSlug("John Doe")
    expect(slug).toMatch(/^john-doe-[a-z0-9]{6}$/)
  })

  it("removes special characters", () => {
    const slug = generateSlug("Mom's Birthday!")
    expect(slug).toMatch(/^moms-birthday-[a-z0-9]{6}$/)
  })

  it("collapses multiple spaces and hyphens", () => {
    const slug = generateSlug("My   Great   Name")
    expect(slug).toMatch(/^my-great-name-[a-z0-9]{6}$/)
  })

  it("truncates long names to 50 chars", () => {
    const longName = "A".repeat(100)
    const slug = generateSlug(longName)
    // 50 chars of 'a's + '-' + 6 random chars = 57
    expect(slug.length).toBeLessThanOrEqual(57)
  })

  it("handles empty string", () => {
    const slug = generateSlug("")
    expect(slug).toMatch(/^-[a-z0-9]{6}$/)
  })

  it("generates unique slugs each time", () => {
    const slug1 = generateSlug("Test")
    const slug2 = generateSlug("Test")
    expect(slug1).not.toBe(slug2)
  })
})

describe("formatDate", () => {
  it("formats a Date object", () => {
    const result = formatDate(new Date("2024-06-15T00:00:00"))
    expect(result).toBe("June 15, 2024")
  })

  it("formats a string date", () => {
    const result = formatDate("2024-01-01T00:00:00")
    expect(result).toBe("January 1, 2024")
  })

  it("returns empty string for null", () => {
    expect(formatDate(null)).toBe("")
  })

  it("returns empty string for undefined", () => {
    expect(formatDate(undefined)).toBe("")
  })
})

describe("absoluteUrl", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com")
  })

  it("prepends the app URL", () => {
    expect(absoluteUrl("/dashboard")).toBe("https://example.com/dashboard")
  })

  it("handles paths without leading slash", () => {
    expect(absoluteUrl("api/test")).toBe("https://example.comapi/test")
  })
})
