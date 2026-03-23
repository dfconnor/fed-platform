import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Fed — FAQ, contact form, and support resources.",
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
