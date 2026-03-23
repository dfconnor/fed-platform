"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
} from "lucide-react";

const faqs = [
  {
    q: "Do I need an account to order food?",
    a: "No! You can order as a guest — just add items to your cart, enter your name and email at checkout, and pay. Creating an account lets you track order history, but it's never required.",
  },
  {
    q: "How much does Fed cost for restaurants?",
    a: "Fed charges zero commission on orders. Our Free plan includes everything you need to start taking orders online. The Pro plan ($29/month) adds advanced analytics, promotions, and custom domain support. The only per-order cost is Stripe's standard processing fee (2.9% + $0.30).",
  },
  {
    q: "How do I set up my restaurant on Fed?",
    a: "Sign up for a free account, add your restaurant details, upload your menu, and share your ordering link. The whole process takes about 5 minutes. We'll generate a QR code you can print for tables too.",
  },
  {
    q: "What payment methods do you support?",
    a: "We support credit/debit cards, Apple Pay, and Google Pay through Stripe. All payments are processed securely — we never see or store your card details.",
  },
  {
    q: "I have an issue with my order. What do I do?",
    a: "Contact the restaurant directly — their phone number is shown on your order confirmation page. For platform issues (payments, account problems), use the contact form on this page and we'll get back to you within 24 hours.",
  },
  {
    q: "Can I cancel or modify my order?",
    a: "Once an order is placed, contact the restaurant directly as soon as possible. They can cancel or modify it from their dashboard if preparation hasn't started yet.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    // Log the support request (in production this would POST to an API or email service)
    console.info("[Support Request]", {
      ...data,
      timestamp: new Date().toISOString(),
    });

    // Simulate a brief delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-warm-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-display text-4xl sm:text-5xl">How can we help?</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you're ordering food or running a restaurant, we're here
            for you.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-2xl">Frequently asked questions</h2>
          <div className="mt-8 space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border bg-card">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left text-sm font-medium"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  {faq.q}
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>
                {openFaq === i && (
                  <div id={`faq-answer-${i}`} role="region" className="border-t px-4 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t bg-warm-50 py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-2xl">Still need help?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Send us a message and we'll get back to you within 24 hours.
          </p>

          <div className="mt-6 flex gap-4">
            <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              support@getfed.com
            </div>
          </div>

          {submitted ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
              <h3 className="text-lg font-semibold">Message sent!</h3>
              <p className="text-sm text-muted-foreground">
                We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="What's this about?" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="gap-2" disabled={submitting}>
                {submitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
