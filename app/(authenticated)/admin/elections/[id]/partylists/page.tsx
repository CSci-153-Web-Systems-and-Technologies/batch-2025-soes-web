import { createClient } from "@/utils/supabase/server";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddPartylistModal from "../../_components/AddPartylistModal";

interface Candidate {
  id: string;
  student_id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
  positions: {
    id: string;
    title: string;
  } | null;
}

interface Partylist {
  id: string;
  name: string;
  description: string | null;
  election_id: string;
  created_at: string;
  candidates?: Candidate[];
}

export default async function ElectionPartylistsPage({
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

  // Fetch partylists for this election
  const { data: partylistsData } = await supabase
    .from("partylists")
    .select("*")
    .eq("election_id", electionId)
    .order("created_at", { ascending: true });

  const partylists = (partylistsData as unknown as Partylist[]) || [];

  // Fetch all candidates for this election to potentially link to partylists
  // (if there's a partylist_id in the candidates table)
  const { data: candidatesData } = await supabase
    .from("candidates")
    .select(
      "id, student_id, full_name, description, avatar_url, positions(id, title), partylist_id"
    )
    .eq("election_id", electionId);

  const candidates =
    (candidatesData as unknown as (Candidate & { partylist_id?: string })[]) ||
    [];

  // Group candidates by partylist_id if available
  const candidatesByPartylist: Record<string, typeof candidates> = {};
  candidates.forEach((candidate) => {
    const partylistId = candidate.partylist_id || "unassigned";
    if (!candidatesByPartylist[partylistId]) {
      candidatesByPartylist[partylistId] = [];
    }
    candidatesByPartylist[partylistId].push(candidate);
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Partylists</h2>
          <p className="text-sm text-gray-500">
            View partylists and the candidates running under them.
          </p>
        </div>
        <AddPartylistModal electionId={electionId} disabled={isElectionEnded} />
      </div>

      {/* Partylists Grid */}
      {partylists.length === 0 ? (
        <Card className="bg-white border border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-gray-100 p-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  No Partylists Yet
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Create partylists to organize candidates into groups.
                </p>
              </div>
              <AddPartylistModal
                electionId={electionId}
                disabled={isElectionEnded}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partylists.map((partylist) => {
            const partylistCandidates =
              candidatesByPartylist[partylist.id] || [];
            return (
              <Card
                key={partylist.id}
                className="bg-white border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-gray-900 truncate">
                        {partylist.name}
                      </CardTitle>
                      {partylist.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {partylist.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Candidates List */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Candidates ({partylistCandidates.length})
                    </h4>
                    {partylistCandidates.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {partylistCandidates.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {candidate.full_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ID: {candidate.student_id}
                                </p>
                                {candidate.positions && (
                                  <p className="text-xs text-blue-600 font-medium mt-1">
                                    Running for: {candidate.positions.title}
                                  </p>
                                )}
                                {candidate.description && (
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                    {candidate.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic text-center py-4">
                        No candidates in this partylist
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      disabled
                      className="flex-1 px-3 py-2 text-sm text-gray-400 bg-gray-50 rounded-md border border-gray-200 cursor-not-allowed"
                    >
                      Edit
                    </button>
                    <button
                      disabled
                      className="flex-1 px-3 py-2 text-sm text-gray-400 bg-gray-50 rounded-md border border-gray-200 cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
