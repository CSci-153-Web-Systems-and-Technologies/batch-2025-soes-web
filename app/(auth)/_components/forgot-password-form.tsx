"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";
import Image from "next/image";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="flex justify-center mb-1">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="w-12 h-12 md:w-16 md:h-16"
              />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-xs md:text-sm px-2">
              Password reset instructions sent
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <p className="text-xs md:text-sm text-muted-foreground text-center">
              If you registered using your email and password, you will receive
              a password reset email at <strong>{email}</strong>
            </p>
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-xs md:text-sm underline underline-offset-4 text-green-700 hover:text-green-800 font-medium"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="flex justify-center mb-1">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="w-12 h-12 md:w-16 md:h-16"
              />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-xs md:text-sm px-2">
              Enter your email and we&apos;ll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-xs md:text-sm font-medium"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@university.edu"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 text-sm h-10"
                    />
                  </div>
                </div>
                {error && (
                  <div className="p-2 md:p-3 text-xs md:text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800 text-white text-sm h-10"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send reset email"}
                </Button>
              </div>
              <div className="mt-4 text-center text-xs md:text-sm">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 text-green-700 hover:text-green-800 font-medium"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
