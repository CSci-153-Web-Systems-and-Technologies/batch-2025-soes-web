"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import DeleteCandidateDialog from "./DeleteCandidateDialog";

interface Candidate {
  id: string;
  student_id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
}

interface PositionCandidatesProps {
  positionTitle: string;
  candidates: Candidate[];
}

export default function PositionCandidates({
  positionTitle,
  candidates,
}: PositionCandidatesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      {/* Header with expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
      >
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
        <span>Candidates ({candidates.length})</span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-2 pl-6">
          {candidates.length === 0 ? (
            <div className="py-2 text-sm text-muted-foreground italic">
              No candidates running for {positionTitle}
            </div>
          ) : (
            <div className="space-y-2">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between bg-muted p-3 rounded-lg border border-border hover:border-accent hover:bg-accent transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
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
                  <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                    <DeleteCandidateDialog
                      candidateId={candidate.id}
                      candidateName={candidate.full_name}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
