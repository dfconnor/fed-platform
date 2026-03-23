import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Fed account to order food, manage your restaurant, or access the admin panel.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
