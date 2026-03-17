import { NextRequest, NextResponse } from "next/server";

// Stripe payment intent creation
// In production, this would use the Stripe SDK with your secret key
// For demo purposes, we simulate the payment flow

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "usd", metadata } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    // In production, uncomment and use real Stripe:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Convert to cents
    //   currency,
    //   metadata,
    //   payment_method_types: ['card', 'apple_pay', 'google_pay'],
    // });
    // return NextResponse.json({ clientSecret: paymentIntent.client_secret });

    // Demo mode: simulate payment intent
    const demoClientSecret = `pi_demo_${Date.now()}_secret_${Math.random().toString(36).slice(2)}`;

    return NextResponse.json({
      clientSecret: demoClientSecret,
      amount,
      currency,
      metadata,
      demo: true,
      message: "Demo mode - no real charges. Add STRIPE_SECRET_KEY to .env for live payments.",
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
