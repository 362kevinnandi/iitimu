import { ReactNode } from "react";

import { HomeNavbar } from "@/components/home/navbar";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <HomeNavbar />

      <div>{children}</div>
    </div>
  );
};

export default PublicLayout;
