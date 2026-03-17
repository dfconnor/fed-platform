"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  UtensilsCrossed,
  Loader2,
  User,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Role = "customer" | "owner";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer" as Role,
    terms: false,
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!form.terms) e.terms = "You must accept the terms";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });
      if (res.ok) {
        router.push("/auth/login?registered=true");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({
          form: data.error || "Registration failed. Please try again.",
        });
      }
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const roles: { value: Role; label: string; desc: string; icon: typeof User }[] = [
    {
      value: "customer",
      label: "Customer",
      desc: "I want to order food",
      icon: User,
    },
    {
      value: "owner",
      label: "Restaurant Owner",
      desc: "I want to list my restaurant",
      icon: Store,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Fed</span>
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Start ordering from your favorite restaurants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {errors.form}
                </div>
              )}

              {/* Role selector */}
              <div className="space-y-2">
                <Label>I am a</Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => {
                    const active = form.role === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => updateField("role", r.value)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                          active
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <r.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{r.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {r.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  error={!!errors.name}
                  autoComplete="name"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  error={!!errors.email}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    error={!!errors.password}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  error={!!errors.confirmPassword}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={form.terms}
                  onChange={(e) => updateField("terms", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary accent-primary"
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-destructive">{errors.terms}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
