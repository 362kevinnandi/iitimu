import axios from "axios";

export const lemonSqueezyClient = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_LEMONSQUEEZY_API_URL,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
    },
  });
};
