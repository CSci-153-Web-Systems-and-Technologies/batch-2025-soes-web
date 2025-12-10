"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CandidateRowActions from "./CandidateRowActions";

interface CandidateData {
  id: string;
  student_id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
  positions: {
    id: string;
    title: string;
  } | null;
}

interface CandidateSearchProps {
  candidates: CandidateData[];
  allCandidatesCount: number;
}

export default function CandidateSearch({
  candidates,
  allCandidatesCount,
}: CandidateSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCandidates = useMemo(() => {
    if (!searchTerm.trim()) {
      return candidates;
    }

    const term = searchTerm.toLowerCase();
    return candidates.filter((candidate) => {
      const nameMatch = candidate.full_name.toLowerCase().includes(term);
      const idMatch = candidate.student_id.toLowerCase().includes(term);
      const positionMatch = candidate.positions?.title
        .toLowerCase()
        .includes(term);

      return nameMatch || idMatch || positionMatch;
    });
  }, [candidates, searchTerm]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, ID, or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Candidate</th>
              <th className="px-6 py-3">Running For</th>
              <th className="px-6 py-3">School ID</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {allCandidatesCount === 0
                    ? 'No candidates found. Click "Add Candidate" to get started.'
                    : "No candidates match your search."}
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 border border-gray-200 mt-1">
                        <AvatarImage src={candidate.avatar_url || ""} />
                        <AvatarFallback className="bg-gray-100 text-gray-500">
                          {getInitials(candidate.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">
                          {candidate.full_name}
                        </div>

                        {/* Render Description */}
                        {candidate.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-[240px] leading-relaxed">
                            {candidate.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top pt-5">
                    {candidate.positions ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {candidate.positions.title}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">No Position</span>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top pt-5 font-mono text-gray-600">
                    {candidate.student_id}
                  </td>
                  <td className="px-6 py-4 align-top pt-5 text-right">
                    <CandidateRowActions candidateId={candidate.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
