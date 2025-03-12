import { usePathname } from "next/navigation";

export const useURLPathName = () => {
  const path = usePathname();
  const splittedPathName = path?.split("/");

  if (splittedPathName?.length === 3) {
    return {
      label: "home",
      description: "Monitor your workspace activities and projects",
    };
  } else if (splittedPathName?.length === 4) {
    return { label: splittedPathName[3], description: "" };
  } else if (splittedPathName?.length === 5) {
    return {
      label: splittedPathName[3],
      description: "Manage project tasks and activities",
    };
  }
};
