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
  const [showDeactivatedDialog, setShowDeactivatedDialog] = useState(false);
  const [showEndedDialog, setShowEndedDialog] = useState(false);
  const [dialogElectionTitle, setDialogElectionTitle] = useState("");
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    setLoading(true);
    setError("");

    const schoolId = formData.get("school_id") as string;
    const accessCode = formData.get("access_code") as string;

    // Call Server Action
    const result = await verifyVoter(schoolId, accessCode);

    if (result.success) {
      // Redirect to the actual ballot page with the encrypted voter session
      router.push(`/ballot/${result.electionId}`);
    } else {
      // Check if the error is about already voting
      if (result.message?.includes("already voted")) {
        setShowAlreadyVotedDialog(true);
      } else if (result.message === "ELECTION_DEACTIVATED") {
        setDialogElectionTitle(result.electionTitle || election.title);
        setShowDeactivatedDialog(true);
      } else if (result.message === "ELECTION_ENDED") {
        setDialogElectionTitle(result.electionTitle || election.title);
        setShowEndedDialog(true);
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

          {/* Hidden school_id field - can be removed or made optional based on your needs */}
          <input name="school_id" type="hidden" value="" />

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

      {/* Election Deactivated Alert Dialog */}
      <AlertDialog
        open={showDeactivatedDialog}
        onOpenChange={setShowDeactivatedDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <AlertDialogTitle className="text-xl">
                Election Currently on Hold
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              <strong>{dialogElectionTitle}</strong> has been temporarily
              deactivated by the administrators. Voting is currently paused and
              will resume once the election is reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-muted/50 p-4 rounded-lg my-2">
            <p className="text-sm text-muted-foreground">
              Please check back later or contact the election committee for more
              information about when voting will resume.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowDeactivatedDialog(false)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Election Ended Alert Dialog */}
      <AlertDialog open={showEndedDialog} onOpenChange={setShowEndedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <AlertDialogTitle className="text-xl">
                Election Has Concluded
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              <strong>{dialogElectionTitle}</strong> has already ended and is no
              longer accepting votes. The voting period has concluded and final
              results are being compiled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-muted/50 p-4 rounded-lg my-2">
            <p className="text-sm text-muted-foreground">
              You can view the final election results by contacting the election
              committee or checking the official results page.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowEndedDialog(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
