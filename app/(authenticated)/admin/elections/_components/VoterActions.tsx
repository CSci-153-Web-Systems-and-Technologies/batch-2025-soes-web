"use client";

import { useState } from "react";
import { UserPlus, Upload } from "lucide-react";
import AddVoterModal from "./AddVoterModal";
import ImportVotersModal from "./ImportVotersModal";

export default function VoterActions({
  electionId,
  onDataChange,
}: {
  electionId: string;
  onDataChange?: () => void;
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        {/* Import CSV Button */}
        <button
          onClick={() => setIsImportOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Upload size={16} />
          Import CSV
        </button>

        {/* Add Manually Button */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
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
      />

      <ImportVotersModal
        electionId={electionId}
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={onDataChange}
      />
    </>
  );
}
