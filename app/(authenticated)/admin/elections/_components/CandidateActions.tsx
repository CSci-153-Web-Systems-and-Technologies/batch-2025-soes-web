"use client";

import { useState } from "react";
import { Upload, UserPlus } from "lucide-react";
import AddCandidateModal from "./AddCandidateModal";
import ImportCandidatesModal from "./ImportCandidatesModal";

// Interface for the positions passed from the page
interface PositionOption {
  id: string;
  title: string;
}

interface PartylistOption {
  id: string;
  name: string;
}

interface CandidateActionsProps {
  electionId: string;
  positions: PositionOption[];
  partylists: PartylistOption[];
  onDataChange?: () => void;
  isElectionEnded?: boolean;
}

export default function CandidateActions({
  electionId,
  positions,
  partylists,
  onDataChange,
  isElectionEnded = false,
}: CandidateActionsProps) {
  // 1. Manage state for both modals here
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  return (
    <>
      {/* --- BUTTONS --- */}

      {/* Import Button */}
      <button
        onClick={() => setIsImportOpen(true)}
        disabled={isElectionEnded}
        className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors w-full sm:w-auto ${
          isElectionEnded
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "text-foreground bg-background border border-input hover:bg-accent"
        }`}
      >
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Import CSV</span>
        <span className="sm:hidden">Import</span>
      </button>

      {/* Add Candidate Button */}
      <button
        onClick={() => setIsAddOpen(true)}
        disabled={isElectionEnded}
        className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors w-full sm:w-auto ${
          isElectionEnded
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "text-primary-foreground bg-primary hover:bg-primary/90"
        }`}
      >
        <UserPlus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Candidate</span>
        <span className="sm:hidden">Add</span>
      </button>

      {/* --- MODALS --- */}

      {/* We pass the state (isOpen) and the closer (onClose) to the modals */}
      <ImportCandidatesModal
        electionId={electionId}
        positions={positions}
        partylists={partylists}
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={onDataChange}
        disabled={isElectionEnded}
      />

      <AddCandidateModal
        electionId={electionId}
        positions={positions}
        partylists={partylists}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={onDataChange}
        disabled={isElectionEnded}
      />
    </>
  );
}
