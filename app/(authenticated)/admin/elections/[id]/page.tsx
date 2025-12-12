import { createClient } from "@/utils/supabase/server";
import { AlertCircle, CheckCircle2, Zap, Calendar, Clock } from "lucide-react";
import ElectionSelector from "../_components/ElectionSelector";

export default async function ElectionOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch election details
  const { data: election } = await supabase
    .from("election_sessions")
    .select("*")
    .eq("id", id)
    .single();

  // Fetch all elections for the selector
  const { data: allElections } = await supabase
    .from("election_sessions")
    .select("id, title, status")
    .order("created_at", { ascending: false });

  // Fetch counts in parallel
  const [totalVotersReq, votesCastReq, positionsReq, candidatesReq] =
    await Promise.all([
      supabase
        .from("eligible_voters")
        .select("*", { count: "exact", head: true })
        .eq("election_id", id),
      supabase
        .from("eligible_voters")
        .select("*", { count: "exact", head: true })
        .eq("election_id", id)
        .eq("has_voted", true),
      supabase
        .from("positions")
        .select("*", { count: "exact", head: true })
        .eq("election_id", id),
      supabase
        .from("candidates")
        .select("*", { count: "exact", head: true })
        .eq("election_id", id),
    ]);

  const totalVoters = totalVotersReq.count || 0;
  const votesCast = votesCastReq.count || 0;
  const positionCount = positionsReq.count || 0;
  const candidateCount = candidatesReq.count || 0;
  const turnout =
    totalVoters > 0 ? ((votesCast / totalVoters) * 100).toFixed(1) : "0";

  // Determine setup completion
  const hasVoters = totalVoters > 0;
  const hasPositions = positionCount > 0;
  const hasCandidates = candidateCount > 0;
  const isSetupComplete = hasVoters && hasPositions && hasCandidates;

  // Determine status message and actions
  let statusMessage = "";
  let statusColor = "blue";
  let nextSteps: { label: string; complete: boolean }[] = [];

  if (election.status === "ended") {
    statusMessage =
      "This election has ended. You can check the results and export reports from the Results and Reports pages.";
    statusColor = "red";
  } else if (election.status === "active") {
    statusMessage = `Election is ongoing with ${votesCast} votes cast out of ${totalVoters} voters (${turnout}% turnout).`;
    statusColor = "green";
    nextSteps = [
      { label: "Monitor votes in real-time", complete: true },
      { label: "Deactivate election anytime", complete: true },
      { label: "End session when done", complete: true },
    ];
  } else {
    // Draft status
    nextSteps = [
      { label: "Add voters", complete: hasVoters },
      { label: "Create positions", complete: hasPositions },
      { label: "Add candidates", complete: hasCandidates },
    ];

    if (!isSetupComplete) {
      if (!hasVoters) {
        statusMessage = "Start by adding voters to your election.";
        statusColor = "yellow";
      } else if (!hasPositions) {
        statusMessage = `You have ${totalVoters} voters registered. Now create positions for candidates to apply to.`;
        statusColor = "yellow";
      } else if (!hasCandidates) {
        statusMessage = `You have ${positionCount} position(s) created. Now add candidates to those positions.`;
        statusColor = "yellow";
      }
    } else {
      statusMessage =
        "All setup complete! Ready to activate the election and share the voting link with voters.";
      statusColor = "green";
    }
  }

  const getStatusIcon = () => {
    if (election.status === "ended") return <AlertCircle className="w-5 h-5" />;
    if (election.status === "active") return <Zap className="w-5 h-5" />;
    if (isSetupComplete) return <CheckCircle2 className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  const statusBgColors: Record<string, string> = {
    red: "bg-red-50 border-red-200 text-red-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    green: "bg-green-50 border-green-200 text-green-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div className="space-y-6">
      {/* Election Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {election?.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage your election session
          </p>
        </div>
        {allElections && allElections.length > 1 && (
          <ElectionSelector
            currentElectionId={id}
            elections={
              allElections as Array<{
                id: string;
                title: string;
                status: string;
              }>
            }
          />
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Voters Card */}
        <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col justify-between">
          <div className="text-sm text-gray-500 font-medium">Total Voters</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {totalVoters}
          </div>
          <div className="text-xs text-gray-400 mt-1">Registered students</div>
        </div>

        {/* Votes Cast Card */}
        <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col justify-between">
          <div className="text-sm text-gray-500 font-medium">Votes Cast</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {votesCast}
          </div>
          <div className="text-xs text-gray-400 mt-1">Completed ballots</div>
        </div>

        {/* Turnout Card */}
        <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col justify-between">
          <div className="text-sm text-gray-500 font-medium">Turnout</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {turnout}%
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${turnout}%` }}
            ></div>
          </div>
        </div>

        {/* Candidates Card */}
        <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col justify-between">
          <div className="text-sm text-gray-500 font-medium">Setup Status</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {candidateCount > 0 ? "✓" : "—"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {candidateCount} candidate{candidateCount !== 1 ? "s" : ""} ready
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div
        className={`p-4 border rounded-lg flex items-start gap-3 ${statusBgColors[statusColor]}`}
      >
        <div className="flex-shrink-0 mt-0.5">{getStatusIcon()}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{statusMessage}</p>
        </div>
      </div>

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Setup Progress
          </h3>
          <div className="space-y-2">
            {nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.complete
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.complete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4 border-2 border-current rounded-full"></span>
                  )}
                </div>
                <span
                  className={step.complete ? "text-gray-900" : "text-gray-500"}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Election Timeline */}
      {election && (
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Election Timeline
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                Start: {new Date(election.start_date).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>End: {new Date(election.end_date).toLocaleString()}</span>
            </div>
            {election.status === "draft" && isSetupComplete && (
              <div className="mt-3 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                When you click &quot;Activate Election&quot;, voters will
                receive the voting link and can start voting immediately.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
