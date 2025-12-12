import { createClient } from "@/utils/supabase/server";
import { Users, LayoutTemplate } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ImportTemplateModalWrapper from "../../_components/ImportTemplateModalWrapper";
import AddPositionModal from "../../_components/AddPositionModal";
import PositionCandidates from "../../_components/PositionCandidates";
import PositionActions from "../../_components/PositionActions";
import ClearPositionsButton from "../../_components/ClearPositionsButton";
import ViewPartylistCandidatesModal from "../../_components/ViewPartylistCandidatesModal";

interface PositionRule {
  vote_limit?: number;
  allow_abstain?: boolean;
}

interface Candidate {
  id: string;
  student_id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
  partylists?: {
    id: string;
    name: string;
  };
}

interface Position {
  id: string;
  rank: number;
  title: string;
  rules: PositionRule | null; // JSONB can be null
  candidates?: Candidate[];
}

export default async function ElectionPositionsPage({
  params,
}: {
  params: Promise<{ id: string }>; // In Next.js 15, params is a Promise
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

  // 1. Fetch Current Positions for this Election (with candidates and partylist info)
  const { data: positionsData } = await supabase
    .from("positions")
    .select(
      "*, candidates(id, student_id, full_name, description, avatar_url, partylists(id, name))"
    )
    .eq("election_id", electionId)
    .order("rank", { ascending: true });

  // Cast the data to our interface (Supabase returns JSONB as any/unknown usually)
  const positions = (positionsData as unknown as Position[]) || [];

  // 2. Fetch Available Templates (active only)
  const { data: templatesData } = await supabase
    .from("position_templates")
    .select("id, name")
    .eq("status", "active");

  // Transform/Cast data to match the Modal's expected type
  const templates =
    templatesData?.map((t) => ({
      id: t.id,
      name: t.name,
    })) || [];

  // Collect all candidates from all positions for the partylist viewer
  const allCandidates: Candidate[] = [];
  positions.forEach((pos) => {
    if (pos.candidates) {
      allCandidates.push(...pos.candidates);
    }
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Positions</h2>
          <p className="text-sm text-gray-500">
            Manage the positions candidates can run for.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Wrapper handles the client-side modal state */}
          <ImportTemplateModalWrapper
            electionId={electionId}
            templates={templates}
            disabled={positions.length > 0 || isElectionEnded}
          />

          <AddPositionModal
            electionId={electionId}
            disabled={positions.length > 0 || isElectionEnded}
          />

          <ViewPartylistCandidatesModal candidates={allCandidates} />

          <ClearPositionsButton
            electionId={electionId}
            disabled={isElectionEnded}
          />
        </div>
      </div>

      {/* Positions List */}
      {positions.length === 0 ? (
        <Card className="bg-white border border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <LayoutTemplate className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">No positions yet</p>
                <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                  You can manually add positions or import them from a template
                  to get started quickly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {positions.map((pos) => (
            <Card
              key={pos.id}
              className="bg-white border border-gray-200 overflow-hidden"
            >
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-gray-400">
                        #{pos.rank}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {pos.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        <Users size={14} className="mr-1.5" />
                        {pos.rules?.vote_limit || 1} Seat(s)
                      </span>
                    </div>
                  </div>
                  <PositionActions
                    positionId={pos.id}
                    positionTitle={pos.title}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <PositionCandidates
                  positionTitle={pos.title}
                  candidates={pos.candidates || []}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
