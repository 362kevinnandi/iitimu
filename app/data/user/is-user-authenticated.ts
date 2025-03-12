import { redirect } from "next/navigation";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const requiredUser = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect("/api/auth/login");

  const user = await getUser();

  return { user, isUserAuthenticated };
};
