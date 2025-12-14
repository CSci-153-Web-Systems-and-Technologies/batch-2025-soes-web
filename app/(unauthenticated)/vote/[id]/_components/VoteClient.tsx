"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyVoter } from "@/lib/vote-action";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Election {
  id: string;
  title: string;
  description: string | null;
}

interface VoteClientProps {
  election: Election;
}

export default function VoteClient({ election }: VoteClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlreadyVotedDialog, setShowAlreadyVotedDialog] = useState(false);
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    setLoading(true);
    setError("");

    const studentId = formData.get("student_id") as string;
    const accessCode = formData.get("access_code") as string;

    // Call Server Action
    const result = await verifyVoter(studentId, accessCode);

    if (result.success) {
      // Redirect to the actual ballot page with the encrypted voter session
      router.push(`/ballot/${result.electionId}`);
    } else {
      // Check if the error is about already voting
      if (result.message?.includes("already voted")) {
        setShowAlreadyVotedDialog(true);
      } else {
        setError(result.message || "An unknown error occurred.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-xl shadow-lg border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {election.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your unique voting code to cast your ballot securely
          </p>
        </div>

        <form action={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm text-center border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="student_id" className="text-foreground font-medium">
              Student ID
            </Label>
            <Input
              id="student_id"
              name="student_id"
              type="text"
              required
              placeholder="Enter your Student ID"
              className="w-full h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="access_code"
              className="text-foreground font-medium"
            >
              One-time Voting Code
            </Label>
            <Input
              id="access_code"
              name="access_code"
              type="text"
              required
              placeholder="Input Code Here"
              className="w-full h-12 text-base"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-medium text-base gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Proceed to Vote
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Your vote is anonymous and secure
          </p>
        </form>
      </div>

      {/* Already Voted Alert Dialog */}
      <AlertDialog
        open={showAlreadyVotedDialog}
        onOpenChange={setShowAlreadyVotedDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <AlertDialogTitle className="text-xl">
                Already Voted
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Our records show that you have already cast your vote in this
              election. Each student is only allowed to vote once to ensure fair
              and secure elections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-muted/50 p-4 rounded-lg my-2">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact the election
              administrator for assistance.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowAlreadyVotedDialog(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
