"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmExitModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmExitModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmExitModalProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Stop Time Tracking?</AlertDialogTitle>
          <AlertDialogDescription>
            You have an active time tracking session. Would you like to stop and
            save the current time log before leaving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Stop and Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
