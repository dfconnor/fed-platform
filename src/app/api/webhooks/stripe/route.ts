import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripeApiKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeApiKey ? new Stripe(stripeApiKey, {
  apiVersion: "2025-02-24.acacia" as any,
}) : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature && endpointSecret) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      if (endpointSecret && signature) {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      } else {
        event = JSON.parse(body);
      }
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
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
        console.log(`Order ${orderId} marked as paid`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
