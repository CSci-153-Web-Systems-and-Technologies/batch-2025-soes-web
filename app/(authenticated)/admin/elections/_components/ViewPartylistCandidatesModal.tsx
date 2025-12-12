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

interface Candidate {
  id: string;
  student_id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
  partylists?: {
    id: string;
    name: string;
  };
  positions?: {
    id: string;
    title: string;
  };
}

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
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        title="View candidates by partylist"
      >
        <Eye size={16} />
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
                <p className="text-gray-500">
                  No candidates assigned to partylists
                </p>
              </div>
            ) : (
              partylists.map((partylist) => (
                <div
                  key={partylist.name}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Partylist Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      {partylist.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {partylist.candidates.length} candidate(s)
                    </p>
                  </div>

                  {/* Candidates List */}
                  <div className="divide-y divide-gray-100">
                    {partylist.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="px-4 py-3 hover:bg-gray-50 transition-colors"
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
                            <p className="font-medium text-gray-900 truncate">
                              {candidate.full_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {candidate.student_id}
                            </p>
                            {candidate.description && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
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
