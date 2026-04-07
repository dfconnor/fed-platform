/**
 * Lightweight password strength scorer.
 *
 * Returns 0-4 (weak → strong) plus a label and a tailwind color class.
 * Heuristics chosen to be useful for casual users without dragging in zxcvbn:
 *   +1 ≥ 8 chars
 *   +1 ≥ 12 chars
 *   +1 mixed case
 *   +1 contains a digit
 *   +1 contains a symbol
 * Score is clamped to [0, 4] and returns "Very weak" → "Strong".
 */

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  colorClass: string;
}

const LABELS = ["Very weak", "Weak", "Okay", "Good", "Strong"] as const;
const COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
] as const;

export function passwordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: LABELS[0], colorClass: COLORS[0] };
  }

  let raw = 0;
  if (password.length >= 8) raw++;
  if (password.length >= 12) raw++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) raw++;
  if (/[0-9]/.test(password)) raw++;
  if (/[^a-zA-Z0-9]/.test(password)) raw++;

  // Clamp 0-5 → 0-4 (we don't reward absurdly long passwords double)
  const score = Math.min(4, raw) as PasswordStrength["score"];
  return { score, label: LABELS[score], colorClass: COLORS[score] };
}
