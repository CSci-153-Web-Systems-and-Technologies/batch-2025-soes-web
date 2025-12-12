"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoterActions from "../../../_components/VoterActions";
import VoterRowActions from "../../../_components/VoterRowActions";

interface Voter {
  id: string;
  school_id: string;
  full_name: string;
  email: string | null;
  has_voted: boolean;
}

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
      voter.school_id.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Registered Voters
          </h2>
          <p className="text-sm text-gray-500">
            Manage who is allowed to vote in this session.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or school ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">School ID</th>
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!filteredVoters || filteredVoters.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500"
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
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 font-mono text-gray-600">
                    {voter.school_id}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {voter.full_name}
                  </td>
                  <td className="px-6 py-3">
                    {voter.has_voted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Voted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Not Voted
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-3 text-right">
                    <VoterRowActions
                      voterId={voter.id}
                      hasVoted={voter.has_voted}
                      disabled={isElectionEnded}
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
