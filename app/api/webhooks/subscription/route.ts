export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { db } from "@/lib/db";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    if (!WEBHOOK_SECRET) {
      return new Response("Lemon Squeezy Webhook Secret not set in .env", {
        status: 500,
      });
    }

    const rawBody = await request.text();

    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(
      request.headers.get("X-Signature") || "",
      "utf8"
    );

    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    const event = JSON.parse(rawBody);
    const { meta, data } = event;

    const { event_name: eventName, custom_data } = meta;

    if (eventName.startsWith("subscription_")) {
      const subscriptionData = {
        lemonsqueezyId: data?.id?.toString(),
        userId: custom_data?.user_id,
        plan: data?.attributes?.product_name?.toUpperCase(),
        status: data?.attributes?.status?.toUpperCase(),
        currentPeriodEnd: new Date(data?.attributes?.renews_at),
        orderId: data?.attributes?.order_id?.toString(),
        customerId: data?.attributes?.customer_id?.toString(),
      };

      switch (eventName) {
        case "subscription_created":
        case "subscription_updated":
          await db.subscription.upsert({
            where: {
              userId: subscriptionData.userId,
            },
            create: {
              ...subscriptionData,
            },
            update: {
              ...subscriptionData,
              cancelAtPeriodEnd:
                subscriptionData.status === "ACTIVE" ? false : true,
              currentPeriodEnd: subscriptionData.currentPeriodEnd,
            },
          });
          break;

        case "subscription_cancelled":
          await db.subscription.update({
            where: {
              userId: subscriptionData.userId,
            },
            data: {
              status: "CANCELLED",
              cancelAtPeriodEnd: true,
            },
          });
          break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
