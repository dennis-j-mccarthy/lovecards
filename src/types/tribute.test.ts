import { describe, it, expect } from "vitest"
import { toPublicContribution } from "./tribute"

// Minimal mock that satisfies the Contribution type shape
function makeContribution(overrides: Record<string, unknown> = {}) {
  return {
    id: "cont_1",
    tributeId: "tribute_1",
    type: "MESSAGE" as const,
    status: "APPROVED" as const,
    isAnonymous: false,
    isHidden: false,
    contributorName: "Alice",
    contributorEmail: "alice@example.com",
    contributorPhone: null,
    smsOptIn: false,
    avatarUrl: "https://example.com/avatar.jpg",
    message: "You are wonderful",
    photoUrl: "https://example.com/photo.jpg",
    createdAt: new Date("2024-06-15"),
    updatedAt: new Date("2024-06-15"),
    ...overrides,
  } as Parameters<typeof toPublicContribution>[0]
}

describe("toPublicContribution", () => {
  it("returns public fields for a normal contribution", () => {
    const result = toPublicContribution(makeContribution())
    expect(result).toEqual({
      id: "cont_1",
      type: "MESSAGE",
      isAnonymous: false,
      contributorName: "Alice",
      avatarUrl: "https://example.com/avatar.jpg",
      message: "You are wonderful",
      photoUrl: "https://example.com/photo.jpg",
      createdAt: new Date("2024-06-15"),
    })
  })

  it("hides name and avatar for anonymous contributions", () => {
    const result = toPublicContribution(
      makeContribution({ isAnonymous: true, contributorName: "Alice" })
    )
    expect(result.contributorName).toBeNull()
    expect(result.avatarUrl).toBeNull()
  })

  it("hides message and photo for hidden contributions", () => {
    const result = toPublicContribution(makeContribution({ isHidden: true }))
    expect(result.message).toBeNull()
    expect(result.photoUrl).toBeNull()
  })

  it("strips private fields like email and phone", () => {
    const result = toPublicContribution(makeContribution())
    expect(result).not.toHaveProperty("contributorEmail")
    expect(result).not.toHaveProperty("contributorPhone")
    expect(result).not.toHaveProperty("smsOptIn")
    expect(result).not.toHaveProperty("status")
    expect(result).not.toHaveProperty("tributeId")
  })
})
