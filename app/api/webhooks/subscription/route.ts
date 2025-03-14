// app/api/webhooks/subscription/route.ts
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/lib/db";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    if (!WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Lemon Squeezy Webhook Secret not set in .env" },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get("X-Signature") || "";
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const { meta, data } = event;
    const { event_name: eventName, custom_data } = meta;

    console.log("Webhook received:", { eventName, data, custom_data });

    if (!eventName.startsWith("subscription_") || !data?.id) {
      return NextResponse.json({ received: true });
    }

    // Extract userId from custom_data or fallback to email
    let userId = custom_data?.user_id;
    if (!userId && data.attributes.user_email) {
      const user = await db.user.findUnique({
        where: { email: data.attributes.user_email },
      });
      if (!user) {
        console.error(`User not found for email: ${data.attributes.user_email}`);
        return NextResponse.json({ error: "User not found" }, { status: 400 });
      }
      userId = user.id;
    }

    if (!userId) {
      console.error("No userId provided in custom_data and no email match");
      return NextResponse.json({ error: "No user identified" }, { status: 400 });
    }

    const subscriptionData = {
      lemonsqueezyId: data.id.toString(),
      userId,
      plan: (data.attributes.variant_name || "FREE").toUpperCase() as "FREE" | "PRO" | "ENTERPRISE",
      status: (data.attributes.status || "ACTIVE").toUpperCase() as "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE",
      currentPeriodEnd: data.attributes.renews_at ? new Date(data.attributes.renews_at) : null,
      orderId: data.attributes.order_id?.toString(),
      customerId: data.attributes.customer_id?.toString(),
      cancelAtPeriodEnd: !!data.attributes.cancelled,
      frequency: "monthly",
    };

    console.log("Subscription data to sync:", subscriptionData);

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
        await db.subscription.upsert({
          where: { userId: subscriptionData.userId }, // Use userId since it’s unique
          create: {
            ...subscriptionData,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          update: {
            ...subscriptionData,
            updatedAt: new Date(),
          },
        });
        console.log(`Synced subscription ${subscriptionData.lemonsqueezyId} for user ${userId}`);
        break;

      case "subscription_cancelled":
        await db.subscription.update({
          where: { userId: subscriptionData.userId },
          data: {
            status: "CANCELLED",
            cancelAtPeriodEnd: true,
            updatedAt: new Date(),
          },
        });
        console.log(`Cancelled subscription ${subscriptionData.lemonsqueezyId} for user ${userId}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}