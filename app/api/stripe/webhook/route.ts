import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || !webhookSecret || !supabaseUrl || !serviceKey) return new NextResponse("Not configured", { status: 503 });
  const stripe = new Stripe(secret);
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature") || "", webhookSecret); }
  catch { return new NextResponse("Invalid signature", { status: 400 }); }
  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.client_reference_id) await db.from("profiles").upsert({ id: session.client_reference_id, plan: "pro", stripe_customer_id: String(session.customer || ""), subscription_status: "active" });
  }
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    await db.from("profiles").update({ plan: "free", subscription_status: "canceled" }).eq("stripe_customer_id", String(sub.customer));
  }
  return NextResponse.json({ received: true });
}
