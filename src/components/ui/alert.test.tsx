import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Alert } from "./alert"

describe("Alert", () => {
  it("renders children", () => {
    render(<Alert>Something happened</Alert>)
    expect(screen.getByRole("alert")).toHaveTextContent("Something happened")
  })

  it("applies info variant by default", () => {
    render(<Alert>Info</Alert>)
    expect(screen.getByRole("alert").className).toContain("bg-blue-50")
  })

  it("applies error variant", () => {
    render(<Alert variant="error">Error!</Alert>)
    expect(screen.getByRole("alert").className).toContain("bg-red-50")
  })

  it("applies success variant", () => {
    render(<Alert variant="success">Done</Alert>)
    expect(screen.getByRole("alert").className).toContain("bg-green-50")
  })

  it("applies warning variant", () => {
    render(<Alert variant="warning">Careful</Alert>)
    expect(screen.getByRole("alert").className).toContain("bg-amber-50")
  })

  it("merges custom className", () => {
    render(<Alert className="mt-4">Test</Alert>)
    expect(screen.getByRole("alert").className).toContain("mt-4")
  })
})
