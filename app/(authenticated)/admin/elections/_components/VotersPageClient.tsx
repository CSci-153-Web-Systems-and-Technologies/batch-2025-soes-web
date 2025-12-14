"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoterActions from "./VoterActions";
import VoterRowActions from "./VoterRowActions";
import { Voter } from "@/types/types";

interface VotersPageClientProps {
  electionId: string;
  isElectionEnded: boolean;
}

export default function VotersPageClient({
  electionId,
  isElectionEnded,
}: VotersPageClientProps) {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchVoters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVoters = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("eligible_voters")
      .select("*")
      .eq("election_id", electionId)
      .order("full_name", { ascending: true });

    setVoters((data as Voter[]) || []);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    await fetchVoters();
  };

  const filteredVoters = voters.filter((voter) => {
    const term = searchTerm.toLowerCase();
    return (
      voter.full_name.toLowerCase().includes(term) ||
      voter.student_id.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Registered Voters
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage who is allowed to vote in this session.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {/* Add/Import Buttons */}
          <VoterActions
            electionId={electionId}
            onDataChange={() => fetchVoters()}
            disabled={isElectionEnded}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by name or student ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-border rounded-lg w-full sm:w-80 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-x-auto shadow-sm bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-4 sm:px-6 py-3">Student ID</th>
              <th className="px-4 sm:px-6 py-3">Full Name</th>
              <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Status</th>
              <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">
                Email Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!filteredVoters || filteredVoters.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 sm:px-6 py-12 text-center text-muted-foreground"
                >
                  {voters.length === 0
                    ? 'No voters found. Click "Add Voter" to import students.'
                    : "No voters match your search."}
                </td>
              </tr>
            ) : (
              filteredVoters.map((voter: Voter) => (
                <tr
                  key={voter.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-3 font-mono text-muted-foreground">
                    {voter.student_id}
                  </td>
                  <td className="px-4 sm:px-6 py-3 font-medium text-foreground">
                    {voter.full_name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 hidden md:table-cell">
                    {voter.has_voted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 border">
                        Voted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 border">
                        Not Voted
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-3 hidden lg:table-cell">
                    {voter.emailed_at ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 border">
                        ✓ Emailed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50/50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300 border">
                        Not Sent
                      </span>
                    )}
                  </td>

                  <td className="px-4 sm:px-6 py-3 text-right">
                    <VoterRowActions
                      voterId={voter.id}
                      hasVoted={voter.has_voted}
                      voterEmail={voter.email || undefined}
                      voterName={voter.full_name}
                      electionId={electionId}
                      disabled={isElectionEnded}
                      emailedAt={voter.emailed_at || undefined}
                      voterFullName={voter.full_name}
                      onDataChange={() => fetchVoters()}
                    />
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
