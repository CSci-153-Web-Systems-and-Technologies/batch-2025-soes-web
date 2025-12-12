"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { submitVote } from "@/lib/vote-action";

interface Candidate {
  id: string;
  full_name: string;
  partylists: {
    name: string;
  } | null;
}

interface Position {
  id: string;
  title: string;
  candidates: Candidate[];
}

interface ConfirmVoteDialogProps {
  open: boolean;
  onClose: () => void;
  selections: Record<string, string>;
  positions: Position[];
  electionId: string;
  voterId: string;
}

export default function ConfirmVoteDialog({
  open,
  onClose,
  selections,
  positions,
  electionId,
  voterId,
}: ConfirmVoteDialogProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirmVote = async () => {
    setSubmitting(true);

    // Prepare votes array
    const votes = Object.entries(selections).map(
      ([positionId, candidateId]) => ({
        electionId,
        positionId,
        candidateId,
        voterId,
      })
    );

    const result = await submitVote(votes);

    if (result.success) {
      router.push("/success");
    } else {
      alert(result.message || "Failed to submit vote. Please try again.");
      setSubmitting(false);
    }
  };

  const getSelectedCandidate = (positionId: string) => {
    const candidateId = selections[positionId];
    const position = positions.find((p) => p.id === positionId);
    return position?.candidates.find((c) => c.id === candidateId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Confirm Your Vote
          </DialogTitle>
          <DialogDescription>
            Once submitted, your vote cannot be changed. Are you sure you want
            to proceed?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <p className="text-sm font-medium text-foreground">
            Your selections:
          </p>

          {positions.map((position) => {
            const candidate = getSelectedCandidate(position.id);
            if (!candidate) return null;

            return (
              <div
                key={position.id}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {position.title}
                  </p>
                  <p className="font-medium text-foreground">
                    {candidate.full_name}
                  </p>
                  {candidate.partylists && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {candidate.partylists.name}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={submitting}
          >
            Review My Choices
          </Button>
          <Button
            onClick={handleConfirmVote}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Yes, Submit Vote"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
