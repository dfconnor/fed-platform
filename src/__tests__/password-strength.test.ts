import { describe, it, expect } from "vitest";
import { passwordStrength } from "@/lib/password-strength";

describe("passwordStrength", () => {
  it("returns score 0 / Very weak for empty input", () => {
    const r = passwordStrength("");
    expect(r.score).toBe(0);
    expect(r.label).toBe("Very weak");
  });

  it("returns Very weak for very short passwords", () => {
    expect(passwordStrength("abc").score).toBe(0);
  });

  it("returns Weak for an 8-char lowercase-only password", () => {
    const r = passwordStrength("abcdefgh");
    // Score: +1 for length ≥ 8 = 1
    expect(r.score).toBe(1);
    expect(r.label).toBe("Weak");
  });

  it("returns Okay for an 8-char password with mixed case", () => {
    const r = passwordStrength("abcdEFGH");
    // +1 length ≥ 8, +1 mixed case = 2
    expect(r.score).toBe(2);
    expect(r.label).toBe("Okay");
  });

  it("returns Good for an 8-char password with mixed case + digit", () => {
    const r = passwordStrength("abcdEFG1");
    // +1 length ≥ 8, +1 mixed case, +1 digit = 3
    expect(r.score).toBe(3);
    expect(r.label).toBe("Good");
  });

  it("returns Strong for a 12+ char password with mixed case + digit + symbol", () => {
    const r = passwordStrength("Abcdef12345!");
    // +1 length ≥ 8, +1 length ≥ 12, +1 mixed case, +1 digit, +1 symbol = 5 → clamp 4
    expect(r.score).toBe(4);
    expect(r.label).toBe("Strong");
  });

  it("clamps score to 4 maximum", () => {
    const r = passwordStrength("VeryLongPassword12345!@#$%");
    expect(r.score).toBe(4);
  });

  it("returns a tailwind color class", () => {
    expect(passwordStrength("VeryLongPassword12345!@#$%").colorClass).toMatch(
      /bg-(red|orange|yellow|lime|green)-500/
    );
  });
});
