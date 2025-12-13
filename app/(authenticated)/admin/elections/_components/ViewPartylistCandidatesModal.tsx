"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Candidate } from "@/types/types";

interface ViewPartylistCandidatesModalProps {
  candidates: Candidate[];
}

export default function ViewPartylistCandidatesModal({
  candidates,
}: ViewPartylistCandidatesModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Group candidates by partylist
  const candidatesByPartylist = candidates.reduce(
    (
      acc: Record<string, { name: string; candidates: Candidate[] }>,
      candidate: Candidate
    ) => {
      if (!candidate.partylists) return acc;

      const partylistId = candidate.partylists.id;
      const partylistName = candidate.partylists.name;

      if (!acc[partylistId]) {
        acc[partylistId] = {
          name: partylistName,
          candidates: [],
        };
      }

      acc[partylistId].candidates.push(candidate);
      return acc;
    },
    {}
  );

  const partylists = Object.values(candidatesByPartylist);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-foreground bg-background border border-input rounded-lg hover:bg-accent transition-colors"
        title="View candidates by partylist"
      >
        <Eye className="h-4 w-4" />
        <span className="hidden sm:inline">View Partylists</span>
        <span className="sm:hidden">Partylists</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidates by Partylist</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {partylists.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No candidates assigned to partylists
                </p>
              </div>
            ) : (
              partylists.map((partylist) => (
                <div
                  key={partylist.name}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  {/* Partylist Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-foreground">
                      {partylist.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {partylist.candidates.length} candidate(s)
                    </p>
                  </div>

                  {/* Candidates List */}
                  <div className="divide-y divide-gray-100">
                    {partylist.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="px-4 py-3 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {candidate.avatar_url && (
                            <Image
                              src={candidate.avatar_url}
                              alt={candidate.full_name}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {candidate.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {candidate.student_id}
                            </p>
                            {candidate.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {candidate.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
