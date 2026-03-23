import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as USD currency.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format a date into a friendly, human-readable string.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

/**
 * Generate a unique, human-readable order number.
 * Format: "FED-<4-char timestamp base36>-<4-char random>" e.g. "FED-1Z3F-K8M2"
 * The timestamp component (seconds since epoch mod 36^4 ~ every 19 days) combined
 * with 4 random alphanumeric chars virtually eliminates collision risk.
 */
export function generateOrderNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const timePart = (Math.floor(Date.now() / 1000) % 1679616)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FED-${timePart}-${rand}`;
}

/**
 * Convert a string to a URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Business hours shape stored as JSON in the database.
 */
interface DayHours {
  open: string; // "HH:MM" 24-hour format
  close: string;
}

type BusinessHours = Partial<
  Record<
    "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
    DayHours
  >
>;

const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/**
 * Check if a restaurant is currently open based on its businessHours JSON string.
 * Returns null if hours data is missing or unparseable (badge should be hidden).
 */
export function getOpenStatus(businessHoursJson: string | null | undefined): {
  isOpen: boolean;
  todayHours: string | null; // e.g. "11:00 AM - 9:00 PM"
} | null {
  if (!businessHoursJson) return null;

  let hours: BusinessHours;
  try {
    hours = JSON.parse(businessHoursJson);
  } catch {
    return null;
  }

  if (!hours || typeof hours !== "object") return null;

  const now = new Date();
  const dayKey = dayNames[now.getDay()];
  const todayHours = hours[dayKey];

  if (!todayHours?.open || !todayHours?.close) {
    // No hours for today means closed
    return { isOpen: false, todayHours: null };
  }

  const [openH, openM] = todayHours.open.split(":").map(Number);
  const [closeH, closeM] = todayHours.close.split(":").map(Number);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const isOpen = nowMinutes >= openMinutes && nowMinutes < closeMinutes;

  // Format for display
  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return m === 0 ? `${h12} ${period}` : `${h12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const todayDisplay = `${formatTime(openH, openM)} - ${formatTime(closeH, closeM)}`;

  return { isOpen, todayHours: todayDisplay };
}

/**
 * Extract initials from a name (up to 2 characters).
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
