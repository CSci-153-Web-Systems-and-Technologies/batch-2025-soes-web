"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart3 } from "lucide-react";
import { useParams } from "next/navigation";

interface CandidateInfo {
  id: string;
  name: string;
  partylist?: string;
}

interface VoteCount {
  candidateId: string;
  candidateName: string;
  partylist?: string;
  voteCount: number;
}

interface PositionResults {
  positionId: string;
  positionName: string;
  voteLimit: number;
  votes: VoteCount[];
  totalVotes: number;
}

export default function ResultsPage() {
  const params = useParams();
  const electionId = params.id as string;

  const [results, setResults] = useState<PositionResults[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalVotesCast, setTotalVotesCast] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    // Set up real-time subscription for vote changes
    const channel = supabase
      .channel(`election_${electionId}_votes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          filter: `election_id=eq.${electionId}`,
        },
        () => {
          // Refresh results when votes change
          fetchResults();
        }
      )
      .subscribe();

    // Fetch initial results
    fetchResults();

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [electionId]);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      // Get all positions for this election
      const { data: positions, error: positionsError } = await supabase
        .from("positions")
        .select("id, name, vote_limit")
        .eq("election_id", electionId)
        .order("order", { ascending: true });

      if (positionsError) throw positionsError;

      if (!positions || positions.length === 0) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // Get all candidates for this election
      const { data: candidates, error: candidatesError } = await supabase
        .from("candidates")
        .select("id, name, partylist_id, partylists(id, name)")
        .eq("election_id", electionId);

      if (candidatesError) throw candidatesError;

      // Create a map for quick candidate lookup
      const candidateMap = new Map<string, CandidateInfo>();
      interface CandidateFromDB {
        id: string;
        name: string;
        partylist_id?: string;
        partylists?:
          | { id: string; name: string }[]
          | { id: string; name: string };
      }
      candidates?.forEach((candidate: CandidateFromDB) => {
        const partylistName =
          candidate.partylists && Array.isArray(candidate.partylists)
            ? candidate.partylists[0]?.name
            : candidate.partylists?.name;

        candidateMap.set(candidate.id, {
          id: candidate.id,
          name: candidate.name,
          partylist: partylistName,
        });
      });

      // Get vote counts for each position
      const positionResults: PositionResults[] = [];
      let totalVotes = 0;

      for (const position of positions) {
        // Get all votes for this position
        const { data: votes, error: votesError } = await supabase
          .from("votes")
          .select("id, candidate_id")
          .eq("election_id", electionId)
          .eq("position_id", position.id);

        if (votesError) throw votesError;

        // Group votes by candidate
        const candidateVotes = new Map<string, VoteCount>();

        votes?.forEach((vote: { id: string; candidate_id: string }) => {
          if (vote.candidate_id) {
            const candidate = candidateMap.get(vote.candidate_id);

            if (candidate) {
              if (!candidateVotes.has(vote.candidate_id)) {
                candidateVotes.set(vote.candidate_id, {
                  candidateId: candidate.id,
                  candidateName: candidate.name,
                  partylist: candidate.partylist,
                  voteCount: 0,
                });
              }

              const candidateData = candidateVotes.get(vote.candidate_id)!;
              candidateData.voteCount += 1;
            }
          }
        });

        const voteArray = Array.from(candidateVotes.values()).sort(
          (a, b) => b.voteCount - a.voteCount
        );

        const positionTotalVotes = voteArray.reduce(
          (sum, v) => sum + v.voteCount,
          0
        );

        positionResults.push({
          positionId: position.id,
          positionName: position.name,
          voteLimit: position.vote_limit,
          votes: voteArray,
          totalVotes: positionTotalVotes,
        });

        totalVotes += positionTotalVotes;
      }

      setResults(positionResults);
      setTotalVotesCast(totalVotes);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchResults();
  };

  if (isLoading && results.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          <p className="text-gray-500">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h2 className="text-2xl font-bold tracking-tight">Live Results</h2>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Total Votes Cast */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-900">
            Total Votes Cast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">{totalVotesCast}</p>
        </CardContent>
      </Card>

      {/* Positions Results */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center">
              <p className="text-gray-500">No votes cast yet</p>
            </CardContent>
          </Card>
        ) : (
          results.map((position) => (
            <Card key={position.positionId}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {position.positionName}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {position.totalVotes} vote
                      {position.totalVotes !== 1 ? "s" : ""} • Up to{" "}
                      {position.voteLimit} candidate
                      {position.voteLimit !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {position.votes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No votes for this position yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {position.votes.map((candidate) => {
                      const percentage =
                        position.totalVotes > 0
                          ? Math.round(
                              (candidate.voteCount / position.totalVotes) * 100
                            )
                          : 0;

                      return (
                        <div key={candidate.candidateId} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {candidate.candidateName}
                              </p>
                              {candidate.partylist && (
                                <p className="text-sm text-gray-500">
                                  {candidate.partylist}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                {candidate.voteCount}
                              </p>
                              <p className="text-sm text-gray-500">
                                {percentage}%
                              </p>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Real-time Status */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <p className="text-xs text-gray-500 text-center">
            This page updates in real-time as votes are cast
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
