import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_demo");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        restaurant: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Use request origin for URLs — works in both dev (localhost:3001) and production
    const baseUrl = new URL(req.url).origin;

    // Fallback: If no real Stripe key, bypass Stripe and redirect to order confirmation
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        url: `/r/${order.restaurant.slug}/order/${order.id}`
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${baseUrl}/r/${order.restaurant.slug}/order/${order.id}?success=true`,
      cancel_url: `${baseUrl}/r/${order.restaurant.slug}/cart`,
      client_reference_id: order.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order #${order.orderNumber} from ${order.restaurant.name}`,
            },
            unit_amount: Math.round(order.total * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order.id,
        restaurantId: order.restaurantId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
