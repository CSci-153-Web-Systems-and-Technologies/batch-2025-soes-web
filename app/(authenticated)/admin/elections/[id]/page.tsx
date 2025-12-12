import { createClient } from "@/utils/supabase/server";
import { AlertCircle, CheckCircle2, Zap, Calendar, Clock } from "lucide-react";

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
    red: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300",
    yellow: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300",
    green: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
    blue: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{election?.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor and manage your election session
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Voters Card */}
        <div className="p-4 border border-border rounded-xl bg-card shadow-sm flex flex-col justify-between">
          <div className="text-sm text-muted-foreground font-medium">Total Voters</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {totalVoters}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Registered students</div>
        </div>

        {/* Votes Cast Card */}
        <div className="p-4 border border-border rounded-xl bg-card shadow-sm flex flex-col justify-between">
          <div className="text-sm text-muted-foreground font-medium">Votes Cast</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {votesCast}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Completed ballots</div>
        </div>

        {/* Turnout Card */}
        <div className="p-4 border border-border rounded-xl bg-card shadow-sm flex flex-col justify-between">
          <div className="text-sm text-muted-foreground font-medium">Turnout</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {turnout}%
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
            <div
              className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${turnout}%` }}
            ></div>
          </div>
        </div>

        {/* Candidates Card */}
        <div className="p-4 border border-border rounded-xl bg-card shadow-sm flex flex-col justify-between">
          <div className="text-sm text-muted-foreground font-medium">Setup Status</div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {candidateCount > 0 ? "✓" : "—"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
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
        <div className="p-4 border border-border rounded-xl bg-card shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Setup Progress
          </h3>
          <div className="space-y-2">
            {nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.complete
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.complete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4 border-2 border-current rounded-full"></span>
                  )}
                </div>
                <span
                  className={step.complete ? "text-foreground" : "text-muted-foreground"}
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
        <div className="p-4 border border-border rounded-xl bg-card shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Election Timeline
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                Start: {new Date(election.start_date).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>End: {new Date(election.end_date).toLocaleString()}</span>
            </div>
            {election.status === "draft" && isSetupComplete && (
              <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 p-2 rounded border border-blue-200 dark:border-blue-800">
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
