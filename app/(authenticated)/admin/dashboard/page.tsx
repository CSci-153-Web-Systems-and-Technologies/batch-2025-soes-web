import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Vote,
  Zap,
  TrendingUp,
  BarChart3,
  Plus,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch active election
  const { data: activeElection } = await supabase
    .from("election_sessions")
    .select("*")
    .eq("election_status", "active")
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
    { count: totalCandidates },
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
    supabase
      .from("candidates")
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Monitor and manage your election campaign
        </p>
      </div>

      {/* Active Election Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-2">
                ✓ Active
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeElection.title}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {activeElection.description || "Election campaign"}
              </p>
            </div>
            <Link href={`/admin/elections/${activeElection.id}`}>
              <Button className="bg-green-700 hover:bg-green-900 gap-2">
                Manage
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {/* Election Period */}
          <div className="bg-white/50 rounded-lg p-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                  Start Date
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {electionStart
                    ? format(electionStart, "MMM dd, yyyy")
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                  End Date
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {electionEnd
                    ? format(electionEnd, "MMM dd, yyyy")
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                  Voter Turnout
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-semibold text-gray-900">
                    {turnoutPercentage}%
                  </p>
                  <p className="text-xs text-gray-600">
                    ({votesCast || 0}/{totalVoters || 0})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Voters */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Total</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {totalVoters || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Registered Voters</p>
            </div>
          </div>
        </Card>

        {/* Votes Cast */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Vote className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Live</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {votesCast || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Votes Cast</p>
            </div>
          </div>
        </Card>

        {/* Total Positions */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500">
                Active
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {totalPositions || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Positions</p>
            </div>
          </div>
        </Card>

        {/* Total Candidates */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Total</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {totalCandidates || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Candidates</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/admin/elections/${activeElection.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">View Results</h3>
              </div>
              <p className="text-sm text-gray-600">
                Monitor real-time voting progress and preliminary results
              </p>
            </div>
          </Card>
        </Link>

        <Link href={`/admin/elections/${activeElection.id}/positions`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  Manage Candidates
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Add, edit, or review candidate registrations and profiles
              </p>
            </div>
          </Card>
        </Link>

        <Link href={`/admin/elections/${activeElection.id}/settings`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  Election Settings
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Configure voting periods, positions, and system settings
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
