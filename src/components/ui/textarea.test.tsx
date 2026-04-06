import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Textarea } from "./textarea"

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="Write something" />)
    expect(screen.getByPlaceholderText("Write something")).toBeInTheDocument()
  })

  it("renders with label", () => {
    render(<Textarea label="Message" />)
    expect(screen.getByLabelText("Message")).toBeInTheDocument()
  })

  it("shows error message", () => {
    render(<Textarea label="Message" error="Too short" />)
    expect(screen.getByText("Too short")).toBeInTheDocument()
  })

  it("handles user typing", async () => {
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} />)
    await userEvent.type(screen.getByRole("textbox"), "hello")
    expect(onChange).toHaveBeenCalledTimes(5)
  })

  it("can be disabled", () => {
    render(<Textarea disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("forwards ref", () => {
    const ref = vi.fn()
    render(<Textarea ref={ref} />)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement))
  })
})
