"use client";

import { StopCircle, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { createTimeLog, endTimeLog } from "@/app/actions/time-log";
import { ConfirmExitModal } from "../modals/confirm-exit-modal";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface TimeTrackerProps {
  taskId: string;
}

export const TimeTracker = ({ taskId }: TimeTrackerProps) => {
  const router = useRouter();
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeLogId, setActiveLogId] = useState<string | null>(null);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const unloadBlocked = useRef(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "navigation" | "reload";
    callback?: () => void;
  } | null>(null);

  // Handle stopping the timer
  const handleStopTracking = useCallback(async () => {
    if (!activeLogId) return;

    try {
      await endTimeLog({
        timeLogId: activeLogId,
        endTime: new Date().toISOString(),
      });

      setIsTracking(false);
      setStartTime(null);
      setElapsedTime(0);
      setActiveLogId(null);
      unloadBlocked.current = false;

      router.refresh();

      // Execute pending action if exists
      if (pendingAction?.type === "reload") {
        window.location.reload();
      } else if (pendingAction?.callback) {
        pendingAction.callback();
      }
      setPendingAction(null);
    } catch (error) {
      console.error("Failed to stop time tracking:", error);
    }
  }, [activeLogId, pendingAction, router]);

  // Handle browser refresh/exit
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isTracking && !unloadBlocked.current) {
        unloadBlocked.current = true;
        e.preventDefault();
        setShowExitConfirmation(true);
        setPendingAction({ type: "reload" });
        // Return null to prevent the browser dialog but keep the page from unloading
        return null;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload, {
      capture: true,
    });
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload, {
        capture: true,
      });
  }, [isTracking]);

  // Handle client-side navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    let navigationBlocked = false;

    // Create a function to intercept next.js route changes
    const handleRouteChange = (url: string) => {
      if (isTracking && !navigationBlocked) {
        navigationBlocked = true;
        // Store the navigation action
        setPendingAction({
          type: "navigation",
          callback: () => router.push(url),
        });
        // Show confirmation modal
        setShowExitConfirmation(true);
        // Prevent default navigation
        router.events?.emit("routeChangeError");
        throw "Navigation cancelled";
      }
      return true;
    };

    // Handle browser back/forward buttons
    const handlePopState = () => {
      if (isTracking && !navigationBlocked) {
        navigationBlocked = true;
        setShowExitConfirmation(true);
        // Push current state back to prevent navigation
        window.history.pushState(null, "", window.location.href);
      }
    };

    router.events?.on("routeChangeStart", handleRouteChange);
    window.addEventListener("popstate", handlePopState);

    return () => {
      router.events?.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("popstate", handlePopState);
      navigationBlocked = false;
    };
  }, [isTracking, router]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const handleStartTracking = async () => {
    const now = new Date();
    setStartTime(now);
    setIsTracking(true);

    try {
      const timeLog = await createTimeLog({
        taskId,
        startTime: now.toISOString(),
      });
      setActiveLogId(timeLog.id);
    } catch (error) {
      console.error("Failed to start time tracking:", error);
    }
  };

  const handleConfirmExit = async () => {
    await handleStopTracking();
    setShowExitConfirmation(false);
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
    setPendingAction(null);
    unloadBlocked.current = false;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Card className="fixed bottom-4 right-4 p-4 shadow-lg z-50">
        <div className="flex items-center gap-4">
          <div className="text-xl font-mono">{formatTime(elapsedTime)}</div>
          {!isTracking ? (
            <Button
              onClick={handleStartTracking}
              variant="default"
              className="gap-2"
            >
              <Timer className="h-4 w-4" />
              Start Timer
            </Button>
          ) : (
            <Button
              onClick={handleStopTracking}
              variant="destructive"
              className="gap-2"
            >
              <StopCircle className="h-4 w-4" />
              Stop Timer
            </Button>
          )}
        </div>
      </Card>

      <ConfirmExitModal
        isOpen={showExitConfirmation}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </>
  );
};
