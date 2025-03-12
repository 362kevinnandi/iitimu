import { redirect } from "next/navigation";

import { getUserWorkspaces } from "@/app/data/workspace/get-workspaces";
import { OnboardingForm } from "@/components/general/onboarding-form";

const OnboardingPage = async () => {
  const { data } = await getUserWorkspaces();

  if (data?.onboardingCompleted && data?.workspaces.length > 0) {
    redirect("/workspace");
  } else if (data?.onboardingCompleted) redirect("/create-workspace");

  return (
    <div>
      <OnboardingForm />
    </div>
  );
};

export default OnboardingPage;
