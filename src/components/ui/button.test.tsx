import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./button"

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("handles click events", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("can be disabled", async () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Disabled</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies primary variant by default", () => {
    render(<Button>Primary</Button>)
    const button = screen.getByRole("button")
    expect(button.className).toContain("bg-[#800020]")
  })

  it("applies secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole("button")
    expect(button.className).toContain("bg-gray-900")
  })

  it("applies outline variant", () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole("button")
    expect(button.className).toContain("border")
  })

  it("applies ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole("button")
    expect(button.className).toContain("text-gray-600")
  })

  it("applies danger variant", () => {
    render(<Button variant="danger">Danger</Button>)
    const button = screen.getByRole("button")
    expect(button.className).toContain("bg-red-600")
  })

  it("applies size classes", () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole("button")
    expect(button.className).toContain("px-6")
  })

  it("merges custom className", () => {
    render(<Button className="mt-4">Custom</Button>)
    const button = screen.getByRole("button")
    expect(button.className).toContain("mt-4")
  })

  it("forwards ref", () => {
    const ref = vi.fn()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })
})
