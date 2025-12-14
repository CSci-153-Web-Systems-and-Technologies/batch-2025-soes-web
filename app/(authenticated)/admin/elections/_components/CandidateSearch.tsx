"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CandidateRowActions from "./CandidateRowActions";
import { Candidate, PositionOption, PartylistOption } from "@/types/types";

interface CandidateSearchProps {
  candidates: Candidate[];
  allCandidatesCount: number;
  positions: PositionOption[];
  partylists: PartylistOption[];
  onDataChange?: () => void;
}

export default function CandidateSearch({
  candidates,
  allCandidatesCount,
  positions,
  partylists,
  onDataChange,
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
      const partylistMatch = candidate.partylists?.name
        .toLowerCase()
        .includes(term);

      return nameMatch || idMatch || positionMatch || partylistMatch;
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
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by name, ID, position, or partylist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-input rounded-lg w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
        />
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-background">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-3">Candidate</th>
                  <th className="px-6 py-3">Running For</th>
                  <th className="px-6 py-3">Partylist</th>
                  <th className="px-6 py-3">Student ID</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-foreground"
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
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border shrink-0">
                            <AvatarImage src={candidate.avatar_url || ""} />
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              {getInitials(candidate.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {candidate.full_name}
                            </div>

                            {/* Render Description */}
                            {candidate.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-xs leading-relaxed">
                                {candidate.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {candidate.positions ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-transparent text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400">
                            {candidate.positions.title}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic">
                            No Position
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {candidate.partylists ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-transparent text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400">
                            {candidate.partylists.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic">
                            No Partylist
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-foreground">
                        {candidate.student_id}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <CandidateRowActions
                          candidateId={candidate.id}
                          candidateData={{
                            full_name: candidate.full_name,
                            nickname: candidate.nickname,
                            position_id: candidate.position_id,
                            partylist_id: candidate.partylist_id,
                            platform: candidate.platform,
                          }}
                          positions={positions}
                          partylists={partylists}
                          onDataChange={onDataChange}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
