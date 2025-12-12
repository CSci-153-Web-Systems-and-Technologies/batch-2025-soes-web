"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart3, AlertCircle, Trophy } from "lucide-react";
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
  votes: VoteCount[];
  totalVotes: number;
}

export default function ResultsPage() {
  const params = useParams();
  const electionId = params.id as string;

  const [results, setResults] = useState<PositionResults[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalVotesCast, setTotalVotesCast] = useState(0);
  const [electionStatus, setElectionStatus] = useState<string>("");
  const [electionTitle, setElectionTitle] = useState<string>("");

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
      // First, get the election status and title
      const { data: election, error: electionError } = await supabase
        .from("election_sessions")
        .select("status, title")
        .eq("id", electionId)
        .single();

      if (electionError) {
        console.error(
          "Election error:",
          electionError.message || electionError
        );
        throw electionError;
      }

      if (election) {
        setElectionStatus(election.status);
        setElectionTitle(election.title);
      }

      // Get all positions for this election
      const { data: positions, error: positionsError } = await supabase
        .from("positions")
        .select("id, title, rank")
        .eq("election_id", electionId)
        .order("rank", { ascending: true });

      if (positionsError) {
        console.error(
          "Positions error:",
          positionsError.message || positionsError
        );
        throw positionsError;
      }

      if (!positions || positions.length === 0) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // Get all candidates for this election
      const { data: candidates, error: candidatesError } = await supabase
        .from("candidates")
        .select("id, full_name, partylist_id, partylists(id, name)")
        .eq("election_id", electionId);

      if (candidatesError) {
        console.error(
          "Candidates error:",
          candidatesError.message || candidatesError
        );
        throw candidatesError;
      }

      // Create a map for quick candidate lookup
      const candidateMap = new Map<string, CandidateInfo>();
      interface CandidateFromDB {
        id: string;
        full_name: string;
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
          name: candidate.full_name,
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

        const positionTitle = position.title;

        if (votesError) {
          console.error(
            "Votes error for position",
            position.id,
            ":",
            votesError.message || votesError
          );
          throw votesError;
        }

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
          positionName: positionTitle,
          votes: voteArray,
          totalVotes: positionTotalVotes,
        });

        totalVotes += positionTotalVotes;
      }

      setResults(positionResults);
      setTotalVotesCast(totalVotes);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error fetching results:", errorMessage);
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
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  const isActive = electionStatus === "active";
  const isDraft = electionStatus === "draft";
  const isEnded = electionStatus === "ended";

  return (
    <div className="space-y-6">
      {/* Status Banners */}
      {isDraft && (
        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
                  {electionTitle} is Currently Deactivated
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                  This election has been temporarily deactivated. Voting is paused and results shown are current.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isEnded && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                  {electionTitle} Has Ended
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                  This election has concluded. The results displayed are final and official.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header with Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-foreground" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {isEnded ? "Final Results" : isDraft ? "Results Preview" : "Live Results"}
            </h2>
            {isActive && (
              <p className="text-sm text-muted-foreground mt-0.5">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Updates in real-time
                </span>
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="gap-2 w-full sm:w-auto"
          disabled={isLoading || electionStatus === "ended"}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          {electionStatus === "ended" ? "Election Ended" : "Refresh"}
        </Button>
      </div>

      {/* Total Votes Cast */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-900 dark:text-blue-300">
            Total Votes Cast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {totalVotesCast}
          </p>
        </CardContent>
      </Card>

      {/* Positions Results */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center">
              <p className="text-muted-foreground">No votes cast yet</p>
            </CardContent>
          </Card>
        ) : (
          results.map((position) => (
            <Card key={position.positionId}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">
                      {position.positionName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {position.totalVotes} vote
                      {position.totalVotes !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {position.votes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
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
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground truncate">
                                {candidate.candidateName}
                              </p>
                              {candidate.partylist && (
                                <p className="text-sm text-muted-foreground">
                                  {candidate.partylist}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-bold text-foreground">
                                {candidate.voteCount}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {percentage}%
                              </p>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-muted rounded-full h-2">
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
      <Card className="bg-muted border-border">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            This page updates in real-time as votes are cast
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
