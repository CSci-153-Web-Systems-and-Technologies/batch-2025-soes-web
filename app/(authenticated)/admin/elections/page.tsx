import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import CreateElectionModal from "./_components/CreateElectionModal";

export default async function ElectionsListPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // 1. Fetch Elections - explicitly filter by user_id for user isolation
  const { data: elections } = await supabase
    .from("election_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 2. Fetch turnout data for each election
  const electionsWithTurnout = await Promise.all(
    (elections || []).map(async (election) => {
      const [{ count: voterCount }, { count: votesCastCount }] =
        await Promise.all([
          supabase
            .from("eligible_voters")
            .select("*", { count: "exact", head: true })
            .eq("election_id", election.id),
          supabase
            .from("eligible_voters")
            .select("*", { count: "exact", head: true })
            .eq("election_id", election.id)
            .eq("has_voted", true),
        ]);

      const totalVoters = voterCount || 0;
      const votesCast = votesCastCount || 0;
      const turnoutPercentage =
        totalVoters > 0 ? Math.round((votesCast / totalVoters) * 100) : 0;

      return {
        ...election,
        totalVoters,
        votesCast,
        turnoutPercentage,
      };
    })
  );

  // Helper for Status Badge Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
      case "ended":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-8xl mx-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">
            Elections Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage election campaigns
          </p>
        </div>

        <div className="flex items-center gap-4">
          <CreateElectionModal />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border">
          <h2 className="font-medium text-foreground">All Elections</h2>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted-foreground font-semibold tracking-wide">
              <th className="px-4 md:px-6 py-4">Election Title</th>
              <th className="px-4 md:px-6 py-4 hidden sm:table-cell">Status</th>
              <th className="px-4 md:px-6 py-4 hidden md:table-cell">Period</th>
              <th className="px-4 md:px-6 py-4 hidden lg:table-cell">Turnout</th>
              <th className="px-4 md:px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {electionsWithTurnout?.map((election) => (
              <tr
                key={election.id}
                className="hover:bg-accent transition-colors group"
              >
                {/* Title & Link */}
                <td className="px-4 md:px-6 py-4">
                  <div className="font-medium text-foreground">
                    {election.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                    ID: {election.id.slice(0, 8)}...
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      election.status
                    )}`}
                  >
                    {election.status.charAt(0).toUpperCase() +
                      election.status.slice(1)}
                  </span>
                </td>

                {/* Date Range */}
                <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                  <div className="text-sm text-foreground font-medium">
                    {format(new Date(election.start_date), "yyyy-MM-dd")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    to {format(new Date(election.end_date), "yyyy-MM-dd")}
                  </div>
                </td>

                {/* Turnout */}
                <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                  <div className="text-sm font-semibold text-foreground">
                    {election.votesCast} / {election.totalVoters}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {election.turnoutPercentage}%
                  </div>
                </td>

                {/* Action Button: THIS ENTERS THE [ID] FOLDER */}
                <td className="px-4 md:px-6 py-4 text-right">
                  <Link
                    href={`/admin/elections/${election.id}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Manage <ArrowRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}

            {(!electionsWithTurnout || electionsWithTurnout.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No elections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
