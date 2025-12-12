import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Vote, Plus } from "lucide-react";
import DashboardStats from "./_components/DashboardStats";

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
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-muted rounded-full">
              <Vote className="w-12 h-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            No Election Running
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
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

  const initialStats = {
    id: activeElection.id,
    title: activeElection.title,
    totalVoters: totalVoters || 0,
    votesCast: votesCast || 0,
    turnoutPercentage,
    totalPositions: totalPositions || 0,
    totalCandidates: totalCandidates || 0,
    start_date: activeElection.start_date || "",
    end_date: activeElection.end_date || "",
  };

  return (
    <DashboardStats
      activeElections={activeElections as Array<{ id: string; title: string }>}
      initialStats={initialStats}
    />
  );
}
