import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get("electionId");

    if (!electionId) {
      return NextResponse.json(
        { error: "Election ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch election details
    const { data: election } = await supabase
      .from("election_sessions")
      .select("*")
      .eq("id", electionId)
      .eq("user_id", user.id)
      .single();

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    // Fetch statistics
    const [
      { count: totalVoters },
      { count: votesCast },
      { count: totalPositions },
      { count: totalCandidates },
    ] = await Promise.all([
      supabase
        .from("eligible_voters")
        .select("*", { count: "exact", head: true })
        .eq("election_id", electionId),
      supabase
        .from("eligible_voters")
        .select("*", { count: "exact", head: true })
        .eq("election_id", electionId)
        .eq("has_voted", true),
      supabase
        .from("positions")
        .select("*", { count: "exact", head: true })
        .eq("election_id", electionId),
      supabase
        .from("candidates")
        .select("*", { count: "exact", head: true })
        .eq("election_id", electionId),
    ]);

    const turnoutPercentage =
      (totalVoters || 0) > 0
        ? Math.round(((votesCast || 0) / (totalVoters || 0)) * 100)
        : 0;

    return NextResponse.json({
      id: electionId,
      title: election.title,
      totalVoters: totalVoters || 0,
      votesCast: votesCast || 0,
      turnoutPercentage,
      totalPositions: totalPositions || 0,
      totalCandidates: totalCandidates || 0,
      start_date: election.start_date || "",
      end_date: election.end_date || "",
    });
  } catch (error) {
    console.error("Error fetching election stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch election stats" },
      { status: 500 }
    );
  }
}
