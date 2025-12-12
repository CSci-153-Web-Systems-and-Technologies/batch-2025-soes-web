"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, Vote, TrendingUp, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Candidate {
  id: string;
  full_name: string;
  avatar_url: string | null;
  partylist_id: string | null;
  partylists: {
    id: string;
    name: string;
  } | null;
  vote_count: number;
  vote_percentage: number;
}

interface Position {
  id: string;
  title: string;
  rank: number;
  rules?: {
    vote_limit?: number;
  } | null;
  candidates: Candidate[];
  total_votes: number;
}

interface Election {
  id: string;
  title: string;
  description: string | null;
  status: string;
  start_date: string;
  end_date: string;
}

interface Stats {
  registeredVoters: number;
  votedCount: number;
  turnoutPercentage: number;
}

interface ResultsClientProps {
  election: Election;
  positions: Position[];
  stats: Stats;
}

export default function ResultsClient({
  election,
  positions,
  stats,
}: ResultsClientProps) {
  const router = useRouter();
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(1800); // 30 minutes in seconds
  const isActive = election.status === "active";
  const isDraft = election.status === "draft";
  const isEnded = election.status === "ended";

  useEffect(() => {
    // Only set up auto-refresh for active elections
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 1) {
          // Refresh the page
          router.refresh();
          return 1800;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router, isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {election.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isEnded
                ? "Final Election Results"
                : isDraft
                ? "Election Results Preview"
                : "Live Election Results"}
            </p>
          </div>

          {/* Status-based indicator */}
          {isActive && (
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Live • Updates in {formatTime(timeUntilRefresh)}</span>
              </div>
            </div>
          )}
          {isDraft && (
            <div className="flex items-center gap-2 mt-3 text-xs text-yellow-600 dark:text-yellow-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>Deactivated</span>
              </div>
            </div>
          )}
          {isEnded && (
            <div className="flex items-center gap-2 mt-3 text-xs text-blue-600 dark:text-blue-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Final Results</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Banners */}
      {isDraft && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
                  {election.title} is on Break
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                  This election has been temporarily deactivated by
                  administrators and will be back soon. Results shown are
                  current but voting is paused.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEnded && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                  {election.title} Has Ended
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                  This election has concluded. The results displayed below are
                  final and official.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Registered Voters
              </p>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.registeredVoters.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Votes Cast
              </p>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.votedCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Voter Turnout
              </p>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.turnoutPercentage.toFixed(1)}%
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(stats.turnoutPercentage, 100)}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results by Position */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-foreground">
            Results by Position
          </h2>

          {positions.map((position) => (
            <Card key={position.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {position.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {position.total_votes.toLocaleString()} total votes
                      {(position.rules?.vote_limit || 1) > 1 &&
                        ` • Select up to ${position.rules?.vote_limit}`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {position.candidates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No candidates for this position
                  </div>
                ) : (
                  <div className="space-y-4">
                    {position.candidates.map((candidate, candIndex) => {
                      const isLeader =
                        candIndex === 0 && candidate.vote_count > 0;
                      const voteLimit = position.rules?.vote_limit || 1;
                      const isWinning =
                        candIndex < voteLimit && candidate.vote_count > 0;

                      return (
                        <div
                          key={candidate.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isWinning
                              ? "border-green-500 bg-green-50/50 dark:bg-green-950/20"
                              : "border-border bg-card"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Rank */}
                            <div className="flex-shrink-0 w-8 text-center">
                              <div
                                className={`text-lg font-bold ${
                                  isWinning
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-muted-foreground"
                                }`}
                              >
                                #{candIndex + 1}
                              </div>
                            </div>

                            {/* Avatar */}
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={candidate.avatar_url || undefined}
                                alt={candidate.full_name}
                              />
                              <AvatarFallback>
                                {getInitials(candidate.full_name)}
                              </AvatarFallback>
                            </Avatar>

                            {/* Candidate Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-foreground">
                                  {candidate.full_name}
                                </h4>
                                {isLeader && (
                                  <Badge className="bg-green-600 hover:bg-green-700 text-white gap-1">
                                    <Trophy className="w-3 h-3" />
                                    Leading
                                  </Badge>
                                )}
                                {candidate.partylists && (
                                  <Badge variant="outline" className="text-xs">
                                    {candidate.partylists.name}
                                  </Badge>
                                )}
                              </div>

                              {/* Vote Count and Percentage */}
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">
                                    {candidate.vote_count.toLocaleString()}{" "}
                                    votes
                                  </span>
                                  <span
                                    className={`font-semibold ${
                                      isWinning
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {candidate.vote_percentage.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      isWinning ? "bg-green-600" : "bg-primary"
                                    }`}
                                    style={{
                                      width: `${candidate.vote_percentage}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Notice */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border text-center">
          <p className="text-sm text-muted-foreground">
            Results are updated in real-time during the voting period.
            <br />
            For questions or concerns, please contact the Election Committee.
          </p>
        </div>
      </div>
    </div>
  );
}
