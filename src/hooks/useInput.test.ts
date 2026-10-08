import { describe, it, expect } from "vitest";
import { useInput } from "./useInput";

describe("useInput hook", () => {
  it("should initialize with default empty string", () => {
    const [value] = useInput();
    expect(value.value).toBe("");
  });

  it("should initialize with specified initial value", () => {
    const [value] = useInput("Initial Text");
    expect(value.value).toBe("Initial Text");
  });

  it("should update value via onChange event", () => {
    const [value, onChange] = useInput("Start");
    const mockEvent = {
      target: { value: "New Text" }
    } as unknown as Event;

    onChange(mockEvent);
    expect(value.value).toBe("New Text");
  });

  it("should update value via setValue directly", () => {
    const [value, , setValue] = useInput("Old");
    setValue("Updated");
    expect(value.value).toBe("Updated");
  });

  it("should reset value to initialValue", () => {
    const [value, , setValue, reset] = useInput("Default");
    setValue("Changed");
    expect(value.value).toBe("Changed");
    reset();
    expect(value.value).toBe("Default");
  });
});

