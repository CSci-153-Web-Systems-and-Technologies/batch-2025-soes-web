import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import VoteClient from "./_components/VoteClient";

export default async function VotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: electionId } = await params;

  // Create admin client to fetch election details
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

  if (!election || election.status !== "active") {
    redirect("/");
  }

  return <VoteClient election={election} />;
}
