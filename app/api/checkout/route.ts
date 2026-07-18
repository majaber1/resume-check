import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const secret = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRO_PRICE_ID;
  if (!secret || !price) return NextResponse.json({ error: "Billing is not configured" }, { status: 503 });
  const supabase = createClient();
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } } as never;
  if (!user) return NextResponse.json({ error: "Sign in before upgrading" }, { status: 401 });
  const stripe = new Stripe(secret);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({ mode: "subscription", customer_email: user.email, client_reference_id: user.id, line_items: [{ price, quantity: 1 }], success_url: `${origin}/dashboard?checkout=success`, cancel_url: `${origin}/#pricing`, subscription_data: { metadata: { user_id: user.id } }, allow_promotion_codes: true });
  return NextResponse.json({ url: session.url });
}

