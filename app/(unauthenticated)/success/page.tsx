"use client";

import React from "react";
import { CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const VoteSuccess = () => {
  const router = useRouter();
  return (
    <div className="bg-background flex h-[90svh] flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <div className="mb-6 flex size-24 items-center justify-center rounded-3xl bg-transparent border-2 border-green-700 dark:border-green-400">
          <CircleCheckBig className="size-12 text-green-700 dark:text-green-400" />
        </div>

        <h1 className="mb-2 text-3xl font-bold text-green-800 dark:text-green-400">
          Thank You!
        </h1>
        <p className="text-muted-foreground">
          Your vote has been recorded successfully
        </p>

        <div className="bg-muted text-muted-foreground mt-6 rounded-xl p-6 text-sm leading-relaxed">
          Your ballot has been encrypted and submitted to the secure voting
          system. Results will be available after the voting period ends.
        </div>
        <Button
          variant="outline"
          size="lg"
          className="mt-6 w-full font-medium"
          onClick={() => router.push("/")}
        >
          Return to Main Page
        </Button>
      </div>
    </div>
  );
};

export default VoteSuccess;
