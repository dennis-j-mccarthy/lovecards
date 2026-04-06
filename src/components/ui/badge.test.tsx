import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Badge } from "./badge"

describe("Badge", () => {
  it("renders text content", () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText("Active")).toBeInTheDocument()
  })

  it("applies default variant", () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText("Default").className).toContain("bg-gray-100")
  })

  it("applies success variant", () => {
    render(<Badge variant="success">Done</Badge>)
    expect(screen.getByText("Done").className).toContain("bg-green-50")
  })

  it("applies error variant", () => {
    render(<Badge variant="error">Failed</Badge>)
    expect(screen.getByText("Failed").className).toContain("bg-red-50")
  })

  it("applies warning variant", () => {
    render(<Badge variant="warning">Pending</Badge>)
    expect(screen.getByText("Pending").className).toContain("bg-amber-50")
  })

  it("applies info variant", () => {
    render(<Badge variant="info">New</Badge>)
    expect(screen.getByText("New").className).toContain("bg-blue-50")
  })
})
