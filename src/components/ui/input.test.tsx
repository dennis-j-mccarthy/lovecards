import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Input } from "./input"

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })

  it("shows error message", () => {
    render(<Input label="Email" error="Required field" />)
    expect(screen.getByText("Required field")).toBeInTheDocument()
  })

  it("applies error styling", () => {
    render(<Input error="Error" />)
    const input = screen.getByRole("textbox")
    expect(input.className).toContain("border-red-300")
  })

  it("handles user input", async () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    await userEvent.type(screen.getByRole("textbox"), "hello")
    expect(onChange).toHaveBeenCalledTimes(5)
  })

  it("can be disabled", () => {
    render(<Input disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("generates id from label", () => {
    render(<Input label="Your Name" />)
    const input = screen.getByLabelText("Your Name")
    expect(input.id).toBe("your-name")
  })

  it("uses custom id over generated one", () => {
    render(<Input label="Name" id="custom-id" />)
    const input = screen.getByLabelText("Name")
    expect(input.id).toBe("custom-id")
  })

  it("forwards ref", () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))
  })
})
