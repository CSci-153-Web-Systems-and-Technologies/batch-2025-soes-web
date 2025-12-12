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
        {/* Send Email Button */}
        <SendEmailButton electionId={electionId} disabled={disabled} />

        {/* Import CSV Button */}
        <button
          onClick={() => setIsImportOpen(true)}
          disabled={disabled}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Upload size={16} />
          Import CSV
        </button>

        {/* Add Manually Button */}
        <button
          onClick={() => setIsAddOpen(true)}
          disabled={disabled}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          <UserPlus size={16} />
          Add Voter
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
