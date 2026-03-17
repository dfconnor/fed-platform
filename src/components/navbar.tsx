"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { UtensilsCrossed, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOnRestaurantPage = pathname.startsWith("/r/");

  // Don't render the global navbar on restaurant pages (they have their own header)
  if (isOnRestaurantPage) return null;

  const dashboardHref = session?.user?.role === "admin"
    ? "/admin"
    : session?.user?.role === "owner"
    ? "/dashboard"
    : null;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl tracking-tight">Fed</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 sm:flex">
          <Link href="/pricing">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                pathname === "/pricing" && "text-foreground"
              )}
            >
              For Restaurants
            </Button>
          </Link>
          <Link href="/about">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                pathname === "/about" && "text-foreground"
              )}
            >
              About
            </Button>
          </Link>

          <div className="ml-2 h-5 w-px bg-border" />

          {session ? (
            <div className="ml-2 flex items-center gap-2">
              {dashboardHref && (
                <Link href={dashboardHref}>
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link href="/api/auth/signout">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Sign out
                </Button>
              </Link>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted sm:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 pt-2 sm:hidden animate-slide-down">
          <div className="flex flex-col gap-1">
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              For Restaurants
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              About
            </Link>
            <Link
              href="/support"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Support
            </Link>
            <div className="my-2 h-px bg-border" />
            {session ? (
              <>
                {dashboardHref && (
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/api/auth/signout"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Log in
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                  <Button className="mt-1 w-full" size="sm">
                    Sign up free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
