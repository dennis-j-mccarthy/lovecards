import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Card, CardTitle, CardContent } from "./card"

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText("Card content")).toBeInTheDocument()
  })

  it("has base styling", () => {
    render(<Card data-testid="card">Content</Card>)
    const card = screen.getByTestId("card")
    expect(card.className).toContain("bg-white")
    expect(card.className).toContain("border")
    expect(card.className).toContain("rounded-xl")
  })

  it("applies hover styles when hoverable", () => {
    render(<Card hoverable data-testid="card">Hover me</Card>)
    const card = screen.getByTestId("card")
    expect(card.className).toContain("hover:border-gray-300")
    expect(card.className).toContain("cursor-pointer")
  })

  it("does not apply hover styles by default", () => {
    render(<Card data-testid="card">Static</Card>)
    const card = screen.getByTestId("card")
    expect(card.className).not.toContain("cursor-pointer")
  })
})

describe("CardTitle", () => {
  it("renders as heading", () => {
    render(<CardTitle>My Title</CardTitle>)
    expect(screen.getByText("My Title")).toBeInTheDocument()
  })
})

describe("CardContent", () => {
  it("renders content", () => {
    render(<CardContent>Body text</CardContent>)
    expect(screen.getByText("Body text")).toBeInTheDocument()
  })
})
