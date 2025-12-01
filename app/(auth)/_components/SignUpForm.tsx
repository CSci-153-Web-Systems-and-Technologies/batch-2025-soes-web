import Link from "next/link";

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

export function SignUpForm() {
  
  return (
    <div className="mx-auto max-w-lg">
      <div className="w-full max-w-md space-y-5">
        {/* Header */}
        <div className="text-center w-full">
          <div>
            <h1 className="text-2xl font-bold">
              Make Your Elections Better With SOES
            </h1>
            <p className="text-muted-foreground text-sm">
              Create your account and setup your organization
            </p>
          </div>
        </div>

        {/* Sing-Up Card */}

      </div>
    </div>
  );
}
