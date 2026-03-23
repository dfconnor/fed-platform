import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Zero commission restaurant ordering. Free tier or $29/mo Pro — compare with DoorDash, Grubhub, and Toast.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
