"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <TriangleAlert className="size-8" />
      <p className="text-base font-bold mb-2">Oops! Something went wrong.</p>
      <Button onClick={() => router.back()}>
        <ArrowLeft className="size-4 mr-2" />
        Go back
      </Button>
    </div>
  );
};

export default ErrorPage;
