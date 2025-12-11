import { createClient } from "@/utils/supabase/server";
import CandidateActions from "../../_components/CandidateActions";
import CandidateSearch from "../../_components/CandidateSearch";

export interface PositionOption {
  id: string;
  title: string;
}

// UPDATE: Matched interface to your DB Schema
interface CandidateData {
  id: string;
  student_id: string;
  full_name: string;
  description: string | null; // "platform" is actually "description" in your DB
  avatar_url: string | null;
  positions: {
    id: string;
    title: string;
  } | null;
}

export default async function CandidatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // UPDATE: Removed 'nickname', added 'description'
  const { data, error: candidatesError } = await supabase
    .from("candidates")
    .select(
      "id, student_id, full_name, description, avatar_url, positions(id, title)"
    )
    .eq("election_id", id)
    .order("title", { foreignTable: "positions", ascending: true })
    .order("full_name", { ascending: true });

  if (candidatesError) {
    console.error(
      "Error fetching candidates:",
      JSON.stringify(candidatesError, null, 2)
    );
  }

  const { data: positionsData } = await supabase
    .from("positions")
    .select("id, title")
    .eq("election_id", id)
    .order("title", { ascending: true });

  const candidates = (data as unknown as CandidateData[]) || [];
  const positions = (positionsData as PositionOption[]) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Candidates</h2>
          <p className="text-sm text-gray-500">
            Manage the official candidates running for positions.
          </p>
        </div>
        <div className="flex gap-2">
          <CandidateActions electionId={id} positions={positions} />
        </div>
      </div>

      <CandidateSearch
        candidates={candidates}
        allCandidatesCount={candidates.length}
      />
    </div>
  );
}
