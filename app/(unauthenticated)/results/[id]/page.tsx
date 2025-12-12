import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import ResultsClient from "./_components/ResultsClient";

export const revalidate = 1800; // Revalidate every 30 minutes (1800 seconds)

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

export default async function LiveResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: electionId } = await params;

  // Create admin client to bypass RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch election details
  const { data: election } = await supabaseAdmin
    .from("election_sessions")
    .select("*")
    .eq("id", electionId)
    .single();

  if (!election) {
    redirect("/");
  }

  // Fetch positions
  const { data: positions } = await supabaseAdmin
    .from("positions")
    .select("id, title, rank, rules")
    .eq("election_id", electionId)
    .order("rank");

  // Fetch all votes with candidate and partylist info
  const { data: votes } = await supabaseAdmin
    .from("votes")
    .select(
      `
      id,
      candidate_id,
      position_id,
      candidates:candidate_id (
        id,
        full_name,
        avatar_url,
        partylist_id,
        partylists:partylist_id (
          id,
          name
        )
      )
    `
    )
    .eq("election_id", electionId)
    .not("candidate_id", "is", null); // Exclude abstain votes

  // Fetch total registered voters
  const { count: totalVoters } = await supabaseAdmin
    .from("eligible_voters")
    .select("*", { count: "exact", head: true })
    .eq("election_id", electionId);

  // Fetch voters who have voted
  const { count: votedCount } = await supabaseAdmin
    .from("eligible_voters")
    .select("*", { count: "exact", head: true })
    .eq("election_id", electionId)
    .eq("has_voted", true);

  // Calculate vote counts per candidate
  const voteCounts: Record<string, number> = {};
  votes?.forEach((vote) => {
    if (vote.candidate_id) {
      voteCounts[vote.candidate_id] = (voteCounts[vote.candidate_id] || 0) + 1;
    }
  });

  // Calculate total votes per position
  const positionVoteCounts: Record<string, number> = {};
  votes?.forEach((vote) => {
    if (vote.position_id) {
      positionVoteCounts[vote.position_id] =
        (positionVoteCounts[vote.position_id] || 0) + 1;
    }
  });

  // Build positions with candidates and vote data
  const positionsWithResults: Position[] = await Promise.all(
    (positions || []).map(async (position) => {
      // Fetch candidates for this position
      const { data: candidates } = await supabaseAdmin
        .from("candidates")
        .select(
          `
          id,
          full_name,
          avatar_url,
          partylist_id,
          partylists:partylist_id (
            id,
            name
          )
        `
        )
        .eq("position_id", position.id);

      const totalPositionVotes = positionVoteCounts[position.id] || 0;

      const candidatesWithVotes: Candidate[] = (candidates || [])
        .map((candidate) => {
          const voteCount = voteCounts[candidate.id] || 0;
          const votePercentage =
            totalPositionVotes > 0 ? (voteCount / totalPositionVotes) * 100 : 0;

          return {
            ...candidate,
            partylists: Array.isArray(candidate.partylists)
              ? candidate.partylists[0]
              : candidate.partylists,
            vote_count: voteCount,
            vote_percentage: votePercentage,
          };
        })
        .sort((a, b) => b.vote_count - a.vote_count); // Sort by vote count descending

      return {
        ...position,
        candidates: candidatesWithVotes,
        total_votes: totalPositionVotes,
      };
    })
  );

  // Calculate turnout percentage
  const turnoutPercentage =
    totalVoters && totalVoters > 0
      ? ((votedCount || 0) / totalVoters) * 100
      : 0;

  return (
    <ResultsClient
      election={election}
      positions={positionsWithResults}
      stats={{
        registeredVoters: totalVoters || 0,
        votedCount: votedCount || 0,
        turnoutPercentage,
      }}
    />
  );
}
