import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateOrderNumber, getOpenStatus, cn } from "@/lib/utils";

// ============================================
// generateOrderNumber
// ============================================

describe("generateOrderNumber", () => {
  it("returns a string matching FED-XXXX-XXXX format", () => {
    const orderNum = generateOrderNumber();
    expect(orderNum).toMatch(/^FED-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it("generates unique order numbers across multiple calls", () => {
    const numbers = new Set<string>();
    for (let i = 0; i < 100; i++) {
      numbers.add(generateOrderNumber());
    }
    // With 4 random alphanumeric chars, collisions in 100 calls are essentially impossible
    expect(numbers.size).toBe(100);
  });

  it("always starts with the FED- prefix", () => {
    for (let i = 0; i < 10; i++) {
      expect(generateOrderNumber().startsWith("FED-")).toBe(true);
    }
  });

  it("contains only uppercase letters and digits (no lowercase)", () => {
    for (let i = 0; i < 20; i++) {
      const num = generateOrderNumber();
      // Remove the dashes, everything should be uppercase alphanumeric
      const stripped = num.replace(/-/g, "").replace("FED", "");
      expect(stripped).toMatch(/^[A-Z0-9]+$/);
    }
  });
});

// ============================================
// getOpenStatus
// ============================================

describe("getOpenStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null for null/undefined/empty input", () => {
    expect(getOpenStatus(null)).toBeNull();
    expect(getOpenStatus(undefined)).toBeNull();
    expect(getOpenStatus("")).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    expect(getOpenStatus("not json")).toBeNull();
    expect(getOpenStatus("{bad}")).toBeNull();
  });

  it("returns null for non-object parsed values", () => {
    expect(getOpenStatus('"just a string"')).toBeNull();
    expect(getOpenStatus("42")).toBeNull();
  });

  it("returns isOpen: true when current time is within hours", () => {
    // Set time to Wednesday 12:00 PM
    vi.setSystemTime(new Date("2025-06-04T12:00:00")); // Wednesday
    const hours = JSON.stringify({
      wednesday: { open: "09:00", close: "17:00" },
    });
    const result = getOpenStatus(hours);
    expect(result).not.toBeNull();
    expect(result!.isOpen).toBe(true);
    expect(result!.todayHours).toBe("9 AM - 5 PM");
  });

  it("returns isOpen: false when current time is outside hours", () => {
    // Set time to Wednesday 8:00 AM (before 9 AM open)
    vi.setSystemTime(new Date("2025-06-04T08:00:00")); // Wednesday
    const hours = JSON.stringify({
      wednesday: { open: "09:00", close: "17:00" },
    });
    const result = getOpenStatus(hours);
    expect(result).not.toBeNull();
    expect(result!.isOpen).toBe(false);
  });

  it("returns isOpen: false when no hours exist for today", () => {
    // Set time to Wednesday, but only provide Monday hours
    vi.setSystemTime(new Date("2025-06-04T12:00:00")); // Wednesday
    const hours = JSON.stringify({
      monday: { open: "09:00", close: "17:00" },
    });
    const result = getOpenStatus(hours);
    expect(result).not.toBeNull();
    expect(result!.isOpen).toBe(false);
    expect(result!.todayHours).toBeNull();
  });

  it("formats hours with minutes correctly", () => {
    vi.setSystemTime(new Date("2025-06-04T12:00:00")); // Wednesday
    const hours = JSON.stringify({
      wednesday: { open: "11:30", close: "21:45" },
    });
    const result = getOpenStatus(hours);
    expect(result).not.toBeNull();
    expect(result!.todayHours).toBe("11:30 AM - 9:45 PM");
  });

  it("handles closing time correctly (open until close, not at close)", () => {
    // Set time to exactly the closing time
    vi.setSystemTime(new Date("2025-06-04T17:00:00")); // Wednesday 5 PM
    const hours = JSON.stringify({
      wednesday: { open: "09:00", close: "17:00" },
    });
    const result = getOpenStatus(hours);
    expect(result).not.toBeNull();
    expect(result!.isOpen).toBe(false); // Should be closed at exactly closing time
  });
});

// ============================================
// cn (className helper)
// ============================================

describe("cn", () => {
  it("merges simple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes via clsx", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    const result = cn("px-4", "px-8");
    expect(result).toBe("px-8");
  });

  it("handles undefined and null inputs", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});
