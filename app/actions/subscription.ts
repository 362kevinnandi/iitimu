"use server";

import { db } from "@/lib/db";
import { lemonSqueezyClient } from "@/lib/ls-client";
import { requiredUser } from "../data/user/is-user-authenticated";

export const createSubscription = async (variantType: "pro" | "enterprise") => {
  try {
    const { user } = await requiredUser();

    const VARIANT_ID =
      variantType === "pro"
        ? process.env.LEMONSQUEEZY_PRO_VARIANT_ID
        : process.env.LEMONSQUEEZY_ENTERPRISE_VARIANT_ID;

    const subscription = await lemonSqueezyClient().post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              user_id: user.id,
            },
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/`,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMONSQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: VARIANT_ID,
            },
          },
        },
      },
    });

    const checkoutUrl = subscription.data.data.attributes.url;

    return { url: checkoutUrl, success: true };
  } catch (error) {
    console.error(error);
    return {
      url: null,
      success: false,
      message: "Failed to create subscription.",
    };
  }
};

export const cancelSubscriptionByMenSqueezyId = async () => {
  try {
    const { user } = await requiredUser();

    const subscription = await db.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription) {
      throw new Error(`Subscription #${user.id} not found.`);
    }

    const cancelledSub = await lemonSqueezyClient().delete(
      `/subscriptions/${subscription?.lemonsqueezyId}`
    );

    return { success: true, message: "Subscription cancelled successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to cancel subscription");
  }
};

export const resumeSubscription = async () => {
  try {
    const { user } = await requiredUser();

    const subscription = await db.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription) {
      throw new Error(`Subscription #${user.id} not found.`);
    }

    const resumedSub = await lemonSqueezyClient().patch(
      `/subscriptions/${subscription?.lemonsqueezyId}`,
      {
        data: {
          type: "subscriptions",
          id: subscription?.lemonsqueezyId,
          attributes: {
            pause: null,
            cancelled: false,
          },
        },
      }
    );

    return { success: true, message: "Subscription resumed successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to resume subscription");
  }
};
