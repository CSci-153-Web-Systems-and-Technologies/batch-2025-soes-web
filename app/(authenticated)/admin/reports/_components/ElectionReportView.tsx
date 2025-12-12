"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BarChart3, Users, Vote, TrendingUp } from "lucide-react";

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface CandidateResult {
  candidateId: string;
  candidateName: string;
  partylist?: string;
  voteCount: number;
  percentage: number;
}

interface PositionResult {
  positionId: string;
  positionName: string;
  candidates: CandidateResult[];
  totalVotes: number;
}

interface ElectionReportViewProps {
  electionId: string;
  electionTitle: string;
  onReportDataReady?: (data: {
    totalVoters: number;
    votesCast: number;
    turnoutPercentage: string;
    positionResults: PositionResult[];
  }) => void;
}

export default function ElectionReportView({
  electionId,
  onReportDataReady,
}: ElectionReportViewProps) {
  const [reportData, setReportData] = useState<{
    stats: StatCard[];
    positionResults: PositionResult[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [electionId]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // Get candidates with partylist info
      const { data: candidates } = await supabase
        .from("candidates")
        .select("id, name, partylist_id, partylists(id, name)")
        .eq("election_id", electionId);

      interface CandidateFromDB {
        id: string;
        name: string;
        partylist_id?: string;
        partylists?:
          | { id: string; name: string }[]
          | { id: string; name: string };
      }

      const candidateMap = new Map();
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

      // Get positions
      const { data: positions } = await supabase
        .from("positions")
        .select("id, name")
        .eq("election_id", electionId)
        .order("order", { ascending: true });

      // Get voter stats
      const { count: totalVoters } = await supabase
        .from("eligible_voters")
        .select("*", { count: "exact", head: true })
        .eq("election_id", electionId);

      const { count: votesCast } = await supabase
        .from("eligible_voters")
        .select("*", { count: "exact", head: true })
        .eq("election_id", electionId)
        .eq("has_voted", true);

      const turnout = totalVoters
        ? Math.round(((votesCast || 0) / totalVoters) * 100)
        : 0;

      // Get position results
      const positionResults: PositionResult[] = [];

      for (const position of positions || []) {
        const { data: votes } = await supabase
          .from("votes")
          .select("id, candidate_id")
          .eq("election_id", electionId)
          .eq("position_id", position.id);

        interface VoteData {
          id: string;
          candidate_id: string;
        }

        const candidateVotes = new Map<string, number>();

        votes?.forEach((vote: VoteData) => {
          if (vote.candidate_id) {
            candidateVotes.set(
              vote.candidate_id,
              (candidateVotes.get(vote.candidate_id) || 0) + 1
            );
          }
        });

        const positionTotalVotes = Array.from(candidateVotes.values()).reduce(
          (a, b) => a + b,
          0
        );

        const candidatesResults = Array.from(candidateVotes.entries())
          .map(([candidateId, voteCount]) => {
            const candidate = candidateMap.get(candidateId);
            return {
              candidateId,
              candidateName: candidate?.name || "Unknown",
              partylist: candidate?.partylist,
              voteCount,
              percentage:
                positionTotalVotes > 0
                  ? Math.round((voteCount / positionTotalVotes) * 100)
                  : 0,
            };
          })
          .sort((a, b) => b.voteCount - a.voteCount);

        positionResults.push({
          positionId: position.id,
          positionName: position.name,
          candidates: candidatesResults,
          totalVotes: positionTotalVotes,
        });
      }

      const stats: StatCard[] = [
        {
          label: "Total Voters",
          value: totalVoters || 0,
          icon: <Users className="w-5 h-5" />,
          color: "bg-blue-50 text-blue-700 border-blue-200",
        },
        {
          label: "Votes Cast",
          value: votesCast || 0,
          icon: <Vote className="w-5 h-5" />,
          color: "bg-green-50 text-green-700 border-green-200",
        },
        {
          label: "Turnout",
          value: `${turnout}%`,
          icon: <TrendingUp className="w-5 h-5" />,
          color: "bg-purple-50 text-purple-700 border-purple-200",
        },
      ];

      setReportData({ stats, positionResults });

      // Call the callback to notify parent component that data is ready
      if (onReportDataReady) {
        onReportDataReady({
          totalVoters: totalVoters || 0,
          votesCast: votesCast || 0,
          turnoutPercentage: `${turnout}%`,
          positionResults,
        });
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-500">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <Card>
        <CardContent className="pt-8 text-center">
          <p className="text-gray-500">No data available for this election</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportData.stats.map((stat, idx) => (
          <Card key={idx} className={`border ${stat.color.split(" ").pop()}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Position Results */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-bold">Final Results by Position</h2>
        </div>

        {reportData.positionResults.map((position) => (
          <Card key={position.positionId}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{position.positionName}</span>
                <span className="text-sm font-normal text-gray-500">
                  {position.totalVotes} vote
                  {position.totalVotes !== 1 ? "s" : ""}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {position.candidates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No votes for this position
                </p>
              ) : (
                <div className="space-y-4">
                  {position.candidates.map((candidate, idx) => (
                    <div key={candidate.candidateId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              #{idx + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {candidate.candidateName}
                              </p>
                              {candidate.partylist && (
                                <p className="text-sm text-gray-500">
                                  {candidate.partylist}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {candidate.voteCount}
                          </p>
                          <p className="text-sm text-gray-500">
                            {candidate.percentage}%
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${candidate.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
