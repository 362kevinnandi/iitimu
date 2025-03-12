"use client";

import { ArrowLeft, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateUser } from "@/app/actions/user";
import { industryTypesList, roleList } from "@/utils";
import { countryList } from "@/utils/countriesList";
import { userSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User as UserType } from "@prisma/client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export const UserProfileInfo = ({ user }: { user: UserType }) => {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      about: user.about || "",
      country: user.country || "",
      name: user.name || "",
      role: user.role || "",
      industryType: user.industryType || "",
      email: user.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      setPending(true);
      await updateUser(values);

      router.refresh();
      toast.success("Profile updated successfully");
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="max-w-2xl w-full shadow-md bg-background">
      <CardHeader className="items-start">
        <Button variant="outline" className="p-0" onClick={() => router.back()}>
          <ArrowLeftIcon className="size-5 mr-2" />
          Go Back
        </Button>

        <CardTitle className="flex items-center justify-between w-full">
          <span>Profile Information</span>
        </CardTitle>
        <CardDescription>
          Make changes to your profile here. Click save when you're done.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email address"
                      {...field}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Country</SelectLabel>
                        {countryList.map((country) => (
                          <SelectItem value={country.name} key={country.code}>
                            <div className="flex flex-row items-center">
                              <img
                                src={country.flag}
                                alt={country.name}
                                className="w-4 h-3"
                              />
                              <span className="pl-2">{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Industry Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {industryTypesList.map((industry) => (
                          <SelectItem value={industry} key={industry}>
                            <span>{industry}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role in the Organization</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {roleList.map((role) => (
                          <SelectItem value={role} key={role}>
                            <span>{role}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
