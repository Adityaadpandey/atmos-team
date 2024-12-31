"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip"; // Assuming shadcn/ui has a Chip component
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function InputForm() {
  const [emails, setEmails] = useState<string[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleEmailInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const email = event.currentTarget.value.trim();
      if (email && validateEmail(email)) {
        if (!emails.includes(email)) {
          setEmails([...emails, email]);
        }
        event.currentTarget.value = ""; // Clear the input
      }
    }
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRemoveChip = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Username:", data.username);
    console.log("Emails:", emails);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-primary-foreground text-primary">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Create Your Team</FormLabel>
                <FormControl>
                  <Input placeholder="Your Team Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <Separator /> */}

          <FormItem>
            <FormLabel>Emails</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter email and press Enter"
                onKeyDown={handleEmailInput}
              />
            </FormControl>
            <FormDescription>
              Add emails by pressing Enter. They will appear below.
            </FormDescription>
            <div className="mt-4 flex flex-wrap gap-2">
              {emails.map((email, index) => (
                <Chip
                  key={index}
                  onClose={() => handleRemoveChip(email)}
                  className="bg-primary text-primary-foreground max-w-[50vw]"
                >
                  {email}
                </Chip>
              ))}
            </div>
          </FormItem>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
