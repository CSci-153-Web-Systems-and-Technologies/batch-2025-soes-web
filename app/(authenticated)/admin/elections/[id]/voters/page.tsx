import { createClient } from "@/utils/supabase/server";
import VotersPageClient from "./_components/VotersPageClient";

export default async function VotersPage({
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

  return <VotersPageClient electionId={electionId} isElectionEnded={isElectionEnded} />;
}
