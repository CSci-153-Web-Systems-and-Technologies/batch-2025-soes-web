import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import BallotClient from "./_components/BallotClient";

export default async function BallotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: electionId } = await params;
  const cookieStore = await cookies();
  const voterSession = cookieStore.get("voter_session")?.value;

  if (!voterSession) {
    redirect("/vote");
  }

  // Parse voter session
  let voterId: string;
  try {
    const parsed = JSON.parse(voterSession);
    voterId = parsed.voterId;
  } catch {
    redirect("/vote");
  }

  // Create admin client to fetch data
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch voter details
  const { data: voter } = await supabaseAdmin
    .from("eligible_voters")
    .select("*")
    .eq("id", voterId)
    .single();

  if (!voter || voter.has_voted) {
    redirect("/vote");
  }

  // Fetch election details
  const { data: election } = await supabaseAdmin
    .from("election_sessions")
    .select("*")
    .eq("id", electionId)
    .single();

  if (!election || election.status !== "active") {
    redirect("/vote");
  }

  // Fetch positions with candidates
  const { data: positions, error: positionsError } = await supabaseAdmin
    .from("positions")
    .select(
      `
      id,
      title,
      rank
    `
    )
    .eq("election_id", electionId)
    .order("rank");

  if (positionsError) {
    console.error("Positions fetch error:", positionsError);
  }

  // Fetch candidates for this election
  const { data: candidates, error: candidatesError } = await supabaseAdmin
    .from("candidates")
    .select(
      `
      id,
      full_name,
      avatar_url,
      description,
      position_id,
      partylist_id,
      partylists:partylist_id (
        id,
        name
      )
    `
    )
    .eq("election_id", electionId);

  if (candidatesError) {
    console.error("Candidates fetch error:", candidatesError);
  }

  // Group candidates by position
  const positionsWithCandidates = (positions || []).map((position) => ({
    ...position,
    candidates: (candidates || [])
      .filter((candidate) => candidate.position_id === position.id)
      .map((candidate) => ({
        ...candidate,
        partylists: Array.isArray(candidate.partylists)
          ? candidate.partylists[0] || null
          : candidate.partylists,
      })),
  }));

  // Debug log
  console.log(
    "Positions with candidates:",
    JSON.stringify(positionsWithCandidates, null, 2)
  );

  return (
    <BallotClient
      election={election}
      positions={positionsWithCandidates}
      voter={voter}
    />
  );
}
