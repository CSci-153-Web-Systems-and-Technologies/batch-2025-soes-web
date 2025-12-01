"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-actions";
import React from "react";
import { Chromium } from "lucide-react";
import { useFormStatus } from "react-dom";

const SignInWithGoogleButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        signInWithGoogle();
      }}
      disabled={pending}
    >
      {pending ? (
        <>
          <Chromium className="mr-2 h-4 w-4 animate-spin" /> Signing In...
        </>
      ) : (
        <>
          {" "}
          <Chromium className="w-4 h-4" />
          Login with Google
        </>
      )}
    </Button>
  );
};

export default SignInWithGoogleButton;
