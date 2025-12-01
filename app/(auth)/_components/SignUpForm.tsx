"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Hash,
  LoaderCircle,
  Lock,
  Mail,
  User,
} from "lucide-react";
import SignInWithGoogleButton from "./SignInWithGoogleButton";

export default function SignUpForm() {
  const router = useRouter();

  // -- STATE MANAGEMENT --
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1 Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2 Fields
  const [setupType, setSetupType] = useState<"join" | "create">("join");
  const [organizationCode, setOrganizationCode] = useState("");
  const [organizationName, setOrganizationName] = useState("");

  // -- HANDLERS --
  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    setCurrentStep(2);
  };

  const isStep2Valid = () => {
    if (setupType === "join") return organizationCode.trim().length > 0;
    if (setupType === "create") return organizationName.trim().length > 0;
    return false;
  };

  const handleCompleteSignup = async () => {
    if (!isStep2Valid()) return;
    setIsLoading(true);

    try {
      const formData = new FormData();

      // 1. Split Full Name
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || ".";

      formData.append("first-name", firstName);
      formData.append("last-name", lastName);
      formData.append("email", email);
      formData.append("password", password);

      // 2. Org Logic
      formData.append("setup_mode", setupType);
      const orgValue =
        setupType === "join" ? organizationCode : organizationName;
      formData.append("organization", orgValue);

      // 3. Server Action
      await signup(formData);
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">
        {/* Header - Matching LoginForm style */}
        <div className="text-center w-full">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground text-sm">
            {currentStep === 1
              ? "Sign up to start managing your student elections"
              : "Set up your organization to continue"}
          </p>
        </div>

        {/* Progress Indicator (Subtle) */}
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentStep >= 1 ? "w-8 bg-green-700" : "w-2 bg-muted"
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentStep >= 2 ? "w-8 bg-green-700" : "w-2 bg-muted"
            }`}
          />
        </div>

        <Card>
          {currentStep === 1 ? (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Admin Details</CardTitle>
                <CardDescription>
                  Enter your information to create your admin account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Sign In - Added to match Login */}
                <SignInWithGoogleButton />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleStep1Continue} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Dr. Sarah Martinez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-destructive mt-1">
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800"
                  >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    Already have an account?{" "}
                  </span>
                  <Button
                    variant="link"
                    className="px-0"
                    onClick={() => router.push("/login")}
                  >
                    Sign in
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Organization Setup</CardTitle>
                <CardDescription>
                  How are you setting up your account?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={setupType}
                  onValueChange={(value: string) =>
                    setSetupType(value as "join" | "create")
                  }
                >
                  <div className="space-y-4">
                    {/* Join Existing */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="join" id="join" />
                        <Label
                          htmlFor="join"
                          className="font-medium cursor-pointer"
                        >
                          Join an Existing Organization
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">
                        Select this if you are a co-admin and have an
                        organization code.
                      </p>
                      {setupType === "join" && (
                        <div className="pl-6 pt-1 animate-in slide-in-from-top-2 duration-200">
                          <div className="relative">
                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="orgCode"
                              placeholder="Enter organization code"
                              value={organizationCode}
                              onChange={(e) =>
                                setOrganizationCode(e.target.value)
                              }
                              className="pl-9"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Create New */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="create" id="create" />
                        <Label
                          htmlFor="create"
                          className="font-medium cursor-pointer"
                        >
                          Create a New Organization
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">
                        Select this if you are the first administrator for your
                        school.
                      </p>
                      {setupType === "create" && (
                        <div className="pl-6 pt-1 animate-in slide-in-from-top-2 duration-200">
                          <div className="relative">
                            <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="orgName"
                              placeholder="e.g. University of Example"
                              value={organizationName}
                              onChange={(e) =>
                                setOrganizationName(e.target.value)
                              }
                              className="pl-9"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </RadioGroup>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button
                    onClick={handleCompleteSignup}
                    disabled={!isStep2Valid() || isLoading}
                    className="flex-1 bg-green-700 hover:bg-green-800"
                  >
                    {isLoading ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      "Complete Setup"
                    )}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
