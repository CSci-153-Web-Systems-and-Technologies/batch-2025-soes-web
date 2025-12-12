import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Vote, TrendingUp, BarChart3, Plus } from "lucide-react";
import { format } from "date-fns";
import DashboardElectionSelector from "../elections/_components/DashboardElectionSelector";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Fetch all active elections
  const { data: activeElections } = await supabase
    .from("election_sessions")
    .select("id, title, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Fetch detailed data for first active election
  const { data: activeElection } = await supabase
    .from("election_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // If no active election, show empty state
  if (!activeElection) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gray-100 rounded-full">
              <Vote className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            No Election Running
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            There is currently no active election. Create a new election to get
            started.
          </p>
          <Link href="/admin/elections">
            <Button className="bg-green-700 hover:bg-green-900 gap-2 mt-6">
              <Plus size={18} />
              Create Election
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch statistics for active election
  const [
    { count: totalVoters },
    { count: votesCast },
    { count: totalPositions },
  ] = await Promise.all([
    supabase
      .from("eligible_voters")
      .select("*", { count: "exact", head: true })
      .eq("election_id", activeElection.id),
    supabase
      .from("eligible_voters")
      .select("*", { count: "exact", head: true })
      .eq("election_id", activeElection.id)
      .eq("has_voted", true),
    supabase
      .from("positions")
      .select("*", { count: "exact", head: true })
      .eq("election_id", activeElection.id),
  ]);

  const turnoutPercentage =
    (totalVoters || 0) > 0
      ? Math.round(((votesCast || 0) / (totalVoters || 0)) * 100)
      : 0;

  const electionStart = activeElection.start_date
    ? new Date(activeElection.start_date)
    : null;
  const electionEnd = activeElection.end_date
    ? new Date(activeElection.end_date)
    : null;

  return (
    <div className="space-y-6 pt-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Current Running Election Statistics
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Monitor and manage your election campaign
          </p>
        </div>
        {activeElections && activeElections.length > 1 && (
          <DashboardElectionSelector
            elections={activeElections as Array<{ id: string; title: string }>}
            defaultElectionId={activeElection.id}
          />
        )}
      </div>

      {/* Active Election Card - Compact */}
      <Card className="border-2 border-green-600 rounded-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Vote className="w-5 h-5 text-green-600" />
              <div>
                <h2 className="font-semibold text-gray-900">
                  Current Election
                </h2>
                <p className="text-sm text-gray-600">{activeElection.title}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
              Active
            </span>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-3 gap-8 mt-6">
            {/* Voting Period */}
            <div>
              <p className="text-xs text-gray-600 font-medium mb-2">
                Voting Period
              </p>
              <p className="font-semibold text-gray-900">
                {electionStart
                  ? format(electionStart, "MMM dd, yyyy")
                  : "Not set"}{" "}
                -{" "}
                {electionEnd ? format(electionEnd, "MMM dd, yyyy") : "Not set"}
              </p>
            </div>

            {/* Voter Turnout with Progress */}
            <div>
              <p className="text-xs text-gray-600 font-medium mb-2">
                Voter Turnout
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-xl font-bold text-gray-900">
                  {votesCast || 0}
                </p>
                <p className="text-sm text-gray-600">/ {totalVoters || 0}</p>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${turnoutPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {turnoutPercentage}% turnout
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-end gap-3">
              <Link href={`/admin/elections/${activeElection.id}`}>
                <Button className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 px-4 py-2 text-sm font-medium">
                  View Results
                </Button>
              </Link>
              <Link href={`/admin/elections/${activeElection.id}`}>
                <Button className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 px-4 py-2 text-sm font-medium">
                  Manage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Voters */}
        <Card className="border border-gray-200">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">
                Total Registered Voters
              </h3>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {totalVoters || 0}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Active student accounts
            </p>
          </div>
        </Card>

        {/* Votes Cast */}
        <Card className="border border-gray-200">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Votes Cast</h3>
              <Vote className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{votesCast || 0}</p>
            <p className="text-xs text-gray-600 mt-2">+13 from last hour</p>
          </div>
        </Card>

        {/* Active Positions */}
        <Card className="border border-gray-200">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">
                Active Positions
              </h3>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {totalPositions || 0}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Presidential, VP, and more
            </p>
          </div>
        </Card>

        {/* Real-time Updates */}
        <Card className="border border-gray-200">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">
                Real-time Updates
              </h3>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-green-600">Live</p>
            <p className="text-xs text-gray-600 mt-2">Results updating</p>
          </div>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/admin/elections/${activeElection.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-gray-300">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                  View Live Results
                </h3>
              </div>
              <p className="text-xs text-gray-600">
                Monitor real-time voting progress and preliminary results
              </p>
            </div>
          </Card>
        </Link>

        <Link href={`/admin/elections/${activeElection.id}/positions`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-gray-300">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">
                  Manage Candidates
                </h3>
              </div>
              <p className="text-xs text-gray-600">
                Add, edit, or review candidate registrations and profiles
              </p>
            </div>
          </Card>
        </Link>

        <Link href={`/admin/elections/${activeElection.id}/settings`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-gray-300">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">
                  Election Settings
                </h3>
              </div>
              <p className="text-xs text-gray-600">
                Configure voting periods, positions, and system settings
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
