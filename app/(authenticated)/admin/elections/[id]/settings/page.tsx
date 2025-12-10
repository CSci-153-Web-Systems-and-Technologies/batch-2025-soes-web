import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Info } from "lucide-react";
import DeleteElectionDialog from "../../_components/DeleteElectionDialog";
import CopyBallotLinkButton from "../../_components/CopyBallotLinkButton";

interface ElectionSession {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default async function ElectionSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: electionId } = await params;
  const supabase = await createClient();

  // Fetch election session details
  const { data: electionData } = await supabase
    .from("election_sessions")
    .select("*")
    .eq("id", electionId)
    .single();

  const election = (electionData as unknown as ElectionSession) || null;

  // Fetch related counts
  const [
    { count: positionCount },
    { count: candidateCount },
    { count: voterCount },
    { count: votesCastCount },
  ] = await Promise.all([
    supabase
      .from("positions")
      .select("*", { count: "exact", head: true })
      .eq("election_id", electionId),
    supabase
      .from("candidates")
      .select("*", { count: "exact", head: true })
      .eq("election_id", electionId),
    supabase
      .from("eligible_voters")
      .select("*", { count: "exact", head: true })
      .eq("election_id", electionId),
    supabase
      .from("eligible_voters")
      .select("*", { count: "exact", head: true })
      .eq("election_id", electionId)
      .eq("has_voted", true),
  ]);

  const ballotUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/ballot/${electionId}`;
  const createdDate = election?.created_at
    ? new Date(election.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Election Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your election session, view details, and access the ballot
          link.
        </p>
      </div>

      {/* Election Information Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Election Information</CardTitle>
          <CardDescription>
            Basic details about this election session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Election Title
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-medium">
                {election?.title || "N/A"}
              </p>
            </div>
          </div>

          {/* Description */}
          {election?.description && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Description
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">{election.description}</p>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Status
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    election?.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : election?.status === "completed"
                      ? "bg-gray-100 text-gray-700 border border-gray-200"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  {election?.status?.charAt(0).toUpperCase() +
                    election?.status?.slice(1) || "N/A"}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Created Date
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">{createdDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Election Statistics Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Election Statistics</CardTitle>
          <CardDescription>
            Overview of positions, candidates, and voters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-2xl font-bold text-blue-600">
                {positionCount || 0}
              </p>
              <p className="text-xs text-blue-600 font-medium mt-1">
                Positions
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-2xl font-bold text-purple-600">
                {candidateCount || 0}
              </p>
              <p className="text-xs text-purple-600 font-medium mt-1">
                Candidates
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-2xl font-bold text-green-600">
                {voterCount || 0}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">Voters</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-2xl font-bold text-orange-600">
                {votesCastCount || 0}
              </p>
              <p className="text-xs text-orange-600 font-medium mt-1">
                Votes Cast
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ballot Link Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={18} className="text-blue-600" />
            Ballot Link
          </CardTitle>
          <CardDescription>
            Share this link with voters to access the ballot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 mb-2">Ballot URL:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm text-blue-900 font-mono break-all">
                {ballotUrl}
              </code>
              <CopyBallotLinkButton ballotUrl={ballotUrl} />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            ⓘ Voters can access the ballot using this link. It can be shared via
            email, QR code, or direct link.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-white border border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Deleting this election session will permanently remove all
            associated data including positions, candidates, voters, and votes.
            This action cannot be undone.
          </p>
          <DeleteElectionDialog
            electionId={electionId}
            electionTitle={election?.title || "Election"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
