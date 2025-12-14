"use client";

import { useState } from "react";
import { CheckCircle2, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ConfirmVoteDialog from "./ConfirmVoteDialog";

interface Candidate {
  id: string;
  full_name: string;
  avatar_url: string | null;
  description: string | null;
  position_id: string;
  partylist_id: string | null;
  partylists: {
    id: string;
    name: string;
  } | null;
}

interface Position {
  id: string;
  title: string;
  rank: number;
  rules?: {
    vote_limit?: number;
    allow_abstain?: boolean;
  } | null;
  candidates: Candidate[];
}

interface Election {
  id: string;
  title: string;
  description: string | null;
}

interface Voter {
  id: string;
  student_id: string;
  full_name: string;
}

interface BallotClientProps {
  election: Election;
  positions: Position[];
  voter: Voter;
}

export default function BallotClient({
  election,
  positions,
  voter,
}: BallotClientProps) {
  const [selections, setSelections] = useState<
    Record<string, (string | null)[]>
  >({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSelectCandidate = (
    positionId: string,
    candidateId: string | null,
    voteLimit: number = 1
  ) => {
    setSelections((prev) => {
      const currentSelections = prev[positionId] || [];

      // If abstain (null) is clicked
      if (candidateId === null) {
        return { ...prev, [positionId]: [null] };
      }

      // If selecting a candidate while abstain is active, replace abstain
      if (currentSelections.includes(null)) {
        return { ...prev, [positionId]: [candidateId] };
      }

      // Check if already selected
      if (currentSelections.includes(candidateId)) {
        // Deselect
        return {
          ...prev,
          [positionId]: currentSelections.filter((id) => id !== candidateId),
        };
      }

      // Check if limit reached
      if (currentSelections.length >= voteLimit) {
        // Replace first selection if limit is 1, otherwise don't add
        if (voteLimit === 1) {
          return { ...prev, [positionId]: [candidateId] };
        }
        return prev;
      }

      // Add to selections
      return {
        ...prev,
        [positionId]: [...currentSelections, candidateId],
      };
    });
  };

  const isSelected = (positionId: string, candidateId: string | null) => {
    const currentSelections = selections[positionId] || [];
    return currentSelections.includes(candidateId);
  };

  const handleSubmit = () => {
    setShowConfirmDialog(true);
  };

  // Check if all positions have selections (including abstain)
  const isVoteComplete = positions.every((position) => {
    const currentSelections = selections[position.id] || [];
    return currentSelections.length > 0;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center">
            {election.title}
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Select one candidate for each position below
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Voting as: <span className="font-semibold">{voter.student_id}</span>
          </p>
        </div>
      </div>

      {/* Ballot Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <div className="space-y-8">
          {positions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No positions available for this election.
              </p>
            </div>
          ) : (
            positions.map((position) => (
              <div key={position.id} className="space-y-4">
                {/* Position Header */}
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <h2 className="text-lg font-semibold text-foreground">
                        {position.title}
                      </h2>
                    </div>
                    {(position.rules?.vote_limit || 1) > 1 && (
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        Select up to {position.rules?.vote_limit || 1}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(position.rules?.vote_limit || 1) === 1
                      ? "Choose one candidate for this position"
                      : `Choose up to ${
                          position.rules?.vote_limit || 1
                        } candidates for this position`}
                  </p>
                  {(position.rules?.vote_limit || 1) > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Selected:{" "}
                      {
                        (selections[position.id] || []).filter(
                          (id) => id !== null
                        ).length
                      }
                      /{position.rules?.vote_limit || 1}
                    </p>
                  )}
                </div>

                {/* Candidates List */}
                <div className="space-y-3">
                  {!position.candidates || position.candidates.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No candidates available for this position
                    </div>
                  ) : (
                    <>
                      {position.candidates.map((candidate) => {
                        const selected = isSelected(position.id, candidate.id);

                        return (
                          <button
                            key={candidate.id}
                            onClick={() =>
                              handleSelectCandidate(
                                position.id,
                                candidate.id,
                                position.rules?.vote_limit || 1
                              )
                            }
                            className={`w-full p-4 rounded-lg border-2 transition-all ${
                              selected
                                ? "border-green-500 bg-green-50/50 dark:bg-green-950/20"
                                : "border-border bg-card hover:border-muted-foreground/50"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              {/* Avatar */}
                              <div className="relative flex-shrink-0">
                                {candidate.avatar_url ? (
                                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
                                    <Image
                                      src={candidate.avatar_url}
                                      alt={candidate.full_name}
                                      width={48}
                                      height={48}
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center">
                                    <span className="text-sm font-semibold text-muted-foreground">
                                      {getInitials(candidate.full_name)}
                                    </span>
                                  </div>
                                )}
                                {selected && (
                                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>

                              {/* Candidate Info */}
                              <div className="flex-1 text-left">
                                <h3 className="font-semibold text-foreground">
                                  {candidate.full_name}
                                </h3>
                                {candidate.partylists && (
                                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                    {candidate.partylists.name}
                                  </span>
                                )}
                                {candidate.description && (
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {candidate.description}
                                  </p>
                                )}
                              </div>

                              {/* Selection Indicator */}
                              {selected && (
                                <div className="flex items-center text-green-600 dark:text-green-400">
                                  <span className="text-sm font-medium">
                                    Selected
                                  </span>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}

                      {/* Abstain Option */}
                      <button
                        onClick={() =>
                          handleSelectCandidate(
                            position.id,
                            null,
                            position.rules?.vote_limit || 1
                          )
                        }
                        className={`w-full p-4 rounded-lg border-2 transition-all ${
                          isSelected(position.id, null)
                            ? "border-gray-500 bg-gray-50/50 dark:bg-gray-900/20"
                            : "border-border bg-card hover:border-muted-foreground/50"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className="text-center">
                            <h3 className="font-semibold text-muted-foreground">
                              Abstain
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              I choose not to vote for this position
                            </p>
                          </div>

                          {/* Selection Indicator */}
                          {isSelected(position.id, null) && (
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit Button - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            onClick={handleSubmit}
            disabled={!isVoteComplete}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit My Vote
          </Button>
        </div>
      </div>

      {/* Confirm Vote Dialog */}
      <ConfirmVoteDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        selections={selections}
        positions={positions}
        electionId={election.id}
        voterId={voter.id}
      />
    </div>
  );
}
