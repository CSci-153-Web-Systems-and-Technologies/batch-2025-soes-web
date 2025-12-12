"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface Candidate {
  id: string;
  student_id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
}

interface ViewPartylistMembersModalProps {
  partylistName: string;
  candidates: Candidate[];
}

export default function ViewPartylistMembersModal({
  partylistName,
  candidates,
}: ViewPartylistMembersModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        title={`View ${candidates.length} candidate(s) in ${partylistName}`}
      >
        <Eye size={16} />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{partylistName} - Members ({candidates.length})</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {candidates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No candidates in this partylist</p>
              </div>
            ) : (
              candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {candidate.avatar_url && (
                    <Image
                      src={candidate.avatar_url}
                      alt={candidate.full_name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {candidate.full_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      ID: {candidate.student_id}
                    </p>
                    {candidate.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {candidate.description}
                      </p>
                    )}
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
