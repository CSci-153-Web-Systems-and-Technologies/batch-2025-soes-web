"use client";

import { useState } from "react";
import { UserPlus, Upload } from "lucide-react";
import AddVoterModal from "./AddVoterModal";
import ImportVotersModal from "./ImportVotersModal";
import SendEmailButton from "./SendEmailButton";

export default function VoterActions({
  electionId,
  onDataChange,
  disabled,
}: {
  electionId: string;
  onDataChange?: () => void;
  disabled?: boolean;
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        {/* Send Email Button - Always active to allow status notifications */}
        <SendEmailButton electionId={electionId} disabled={false} />

        {/* Import CSV Button */}
        <button
          onClick={() => setIsImportOpen(true)}
          disabled={disabled}
          className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
            disabled
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-background text-foreground border border-input hover:bg-accent"
          }`}
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Import CSV</span>
          <span className="sm:hidden">Import</span>
        </button>

        {/* Add Manually Button */}
        <button
          onClick={() => setIsAddOpen(true)}
          disabled={disabled}
          className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
            disabled
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Voter</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Modals */}
      <AddVoterModal
        electionId={electionId}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={onDataChange}
        disabled={disabled}
      />

      <ImportVotersModal
        electionId={electionId}
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={onDataChange}
        disabled={disabled}
      />
    </>
  );
}
