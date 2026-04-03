import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripeApiKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeApiKey ? new Stripe(stripeApiKey) : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    if (!endpointSecret) {
      console.warn("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set — rejecting request");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 400 });
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.warn("[stripe/webhook] Signature verification failed:", message);
      return NextResponse.json({ error: `Webhook signature verification failed` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const orderId = session.metadata?.orderId || session.client_reference_id;
      
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "paid",
            status: "confirmed",
          },
        });
        // Payment confirmed for order
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe/webhook] Unhandled exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
