import { createClient } from "@/utils/supabase/server";
import CandidatesPageClient from "./_components/CandidatesPageClient";

export default async function CandidatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: electionId } = await params;
  const supabase = await createClient();

  // Get election status
  const { data: election } = await supabase
    .from("election_sessions")
    .select("status")
    .eq("id", electionId)
    .single();

  const isElectionEnded = election?.status === "ended";

  return <CandidatesPageClient electionId={electionId} isElectionEnded={isElectionEnded} />;
}
