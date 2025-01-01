"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
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
import { Card } from "@/components/ui/card";

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
        event.currentTarget.value = "";
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
    <div className="flex h-screen items-center justify-center bg-background">
      <Card>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-8 rounded-lg bg-card p-6 shadow-lg"
          >
            {/* Team Name Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-primary">
                    Create Your Team
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Team Name"
                      {...field}
                      className="text-input-text placeholder:text-placeholder border-input-border focus:border-focus rounded-md border-2 bg-input focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-error text-sm" />
                </FormItem>
              )}
            />

            {/* Emails Input Section */}
            <FormItem>
              <FormLabel className="text-lg font-medium text-primary">
                Emails
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email and press Enter"
                  onKeyDown={handleEmailInput}
                  className="text-input-text placeholder:text-placeholder border-input-border focus:border-focus rounded-md border-2 bg-input focus:ring-2 focus:ring-primary"
                />
              </FormControl>
              <FormDescription className="text-sm text-muted">
                Add emails by pressing Enter. They will appear below.
              </FormDescription>
              <div className="mt-4 flex flex-wrap gap-2">
                {emails.map((email, index) => (
                  <Chip
                    key={index}
                    onClose={() => handleRemoveChip(email)}
                    className="bg-chip border-chip rounded-full border px-4 py-1 text-primary-foreground"
                  >
                    {email}
                  </Chip>
                ))}
              </div>
            </FormItem>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button variant="secondary">Create Team</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
