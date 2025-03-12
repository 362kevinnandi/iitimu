"use client";

import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const ReminderSetting = () => {
  const router = useRouter();
  const [isRemindersEnabled, setIsRemindersEnabled] = React.useState(false);
  const [reminderType, setReminderType] = React.useState("smart");
  const [dailyDigest, setDailyDigest] = React.useState(false);

  const handleSavePreferences = () => {
    // TODO: Implement save functionality
    toast.success("Notification preferences saved successfully!");
  };

  return (
    <>
      <Card className="mb-6 max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reminder Settings</CardTitle>

            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </div>
          <CardDescription>
            Configure your task notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Enable Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your tasks
              </p>
            </div>
            <Switch
              checked={isRemindersEnabled}
              onCheckedChange={setIsRemindersEnabled}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-400 dark:data-[state=unchecked]:bg-gray-600"
            />
          </div>

          {isRemindersEnabled && (
            <>
              <div className="border-t pt-6">
                <RadioGroup
                  value={reminderType}
                  onValueChange={setReminderType}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-4">
                    <RadioGroupItem value="smart" id="smart" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="smart" className="font-medium">
                        Smart Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications: 3 days before, 1 day before, on
                        the due date, and overdue notifications
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="weekly" className="font-medium">
                        Weekly Digest
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a summary of all tasks due every Monday morning
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <RadioGroupItem value="daily" id="daily" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="daily" className="font-medium">
                        Daily Digest
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive daily updates about tasks due in the next 3-5
                        days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <RadioGroupItem value="none" id="none" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="none" className="font-medium">
                        No Reminders/Basic Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive only initial assignment notifications
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSavePreferences} className="w-full max-w-2xl">
        Save Preferences
      </Button>
    </>
  );
};
