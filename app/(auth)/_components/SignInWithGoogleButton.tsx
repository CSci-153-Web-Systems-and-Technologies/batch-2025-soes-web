"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-actions";
import React from "react";
import {Chromium} from "lucide-react";

const SignInWithGoogleButton = () => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        signInWithGoogle();
      }}
    >
      <Chromium className="w-4 h-4"/>
      Login with Google
    </Button>
  );
};

export default SignInWithGoogleButton;
