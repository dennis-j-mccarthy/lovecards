import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { UserAvatar } from "./user-avatar"

describe("UserAvatar", () => {
  it("shows initials from full name", () => {
    render(<UserAvatar name="Dennis McCarthy" />)
    expect(screen.getByText("DM")).toBeInTheDocument()
  })

  it("shows first two letters when only first name", () => {
    render(<UserAvatar name="Dennis" />)
    expect(screen.getByText("DE")).toBeInTheDocument()
  })

  it("falls back to email when no name", () => {
    render(<UserAvatar email="dennis@example.com" />)
    expect(screen.getByText("DE")).toBeInTheDocument()
  })

  it("shows ? when no name or email", () => {
    render(<UserAvatar />)
    expect(screen.getByText("?")).toBeInTheDocument()
  })

  it("renders an image when image URL is provided", () => {
    render(<UserAvatar name="Dennis" image="https://example.com/avatar.jpg" />)
    const img = screen.getByAltText("Dennis")
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg")
  })

  it("does not render an image when no image URL", () => {
    render(<UserAvatar name="Dennis" />)
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  it("applies xl size class", () => {
    render(<UserAvatar name="DM" size="xl" />)
    const el = screen.getByText("DM")
    expect(el.className).toContain("w-20")
    expect(el.className).toContain("h-20")
  })

  it("applies sm size class", () => {
    render(<UserAvatar name="DM" size="sm" />)
    const el = screen.getByText("DM")
    expect(el.className).toContain("w-8")
    expect(el.className).toContain("h-8")
  })

  it("uses last name initial for multi-word names", () => {
    render(<UserAvatar name="John Paul Jones" />)
    expect(screen.getByText("JJ")).toBeInTheDocument()
  })

  it("applies a consistent color based on email", () => {
    const { container: c1 } = render(<UserAvatar email="a@test.com" />)
    const { container: c2 } = render(<UserAvatar email="a@test.com" />)
    const div1 = c1.firstChild as HTMLElement
    const div2 = c2.firstChild as HTMLElement
    expect(div1.className).toBe(div2.className)
  })
})
