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
}

export default function CandidateActions({
  electionId,
  positions,
  partylists,
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
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Upload size={16} />
        <span className="hidden sm:inline">Import CSV</span>
      </button>

      {/* Add Candidate Button */}
      <button
        onClick={() => setIsAddOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <UserPlus size={16} />
        <span>Add Candidate</span>
      </button>

      {/* --- MODALS --- */}

      {/* We pass the state (isOpen) and the closer (onClose) to the modals */}
      <ImportCandidatesModal
        electionId={electionId}
        positions={positions}
        partylists={partylists}
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      <AddCandidateModal
        electionId={electionId}
        positions={positions}
        partylists={partylists}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </>
  );
}
