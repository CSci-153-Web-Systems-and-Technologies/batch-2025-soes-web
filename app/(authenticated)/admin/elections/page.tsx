import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { ArrowRight, MoreVertical } from "lucide-react";
import CreateElectionModal from "./_components/CreateElectionModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
        return "bg-transparent text-green-700 dark:text-green-400 border-green-700 dark:border-green-400";
      case "ended":
        return "bg-transparent text-red-700 dark:text-red-400 border-red-700 dark:border-red-400";
      default:
        return "bg-transparent text-yellow-700 dark:text-yellow-400 border-yellow-700 dark:border-yellow-400";
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-8xl mx-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-3 md:gap-4">
        <div>
          <h1 className="text-lg md:text-2xl font-semibold text-foreground">
            Elections Management
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            Create and manage election campaigns
          </p>
        </div>

        <CreateElectionModal />
      </div>

      {/* Table Card */}
      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 md:p-6 border-b border-border">
          <h2 className="text-sm md:text-base font-medium text-foreground">
            All Elections
          </h2>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground font-semibold tracking-wide">
                <th className="px-4 md:px-6 py-4">Election Title</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4">Period</th>
                <th className="px-4 md:px-6 py-4">Turnout</th>
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
                  <td className="px-4 md:px-6 py-4">
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
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-sm text-foreground font-medium">
                      {format(new Date(election.start_date), "yyyy-MM-dd")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      to {format(new Date(election.end_date), "yyyy-MM-dd")}
                    </div>
                  </td>

                  {/* Turnout */}
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-sm font-semibold text-foreground">
                      {election.votesCast} / {election.totalVoters}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {election.turnoutPercentage}%
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="px-4 md:px-6 py-4 text-right">
                    <Link
                      href={`/admin/elections/${election.id}`}
                      className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium"
                    >
                      Manage <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}

              {(!electionsWithTurnout || electionsWithTurnout.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No elections found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-border">
          {electionsWithTurnout?.map((election) => (
            <div key={election.id} className="p-3 space-y-2">
              {/* Title, Status Badge, and Menu */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {election.title}
                  </h3>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${getStatusColor(
                      election.status
                    )}`}
                  >
                    {election.status.charAt(0).toUpperCase() +
                      election.status.slice(1)}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/elections/${election.id}`}
                        className="cursor-pointer text-sm"
                      >
                        Manage Election
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* ID */}
              <p className="text-[10px] text-muted-foreground font-mono">
                ID: {election.id.slice(0, 8)}...
              </p>

              {/* Date Range */}
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground">Period</p>
                <p className="text-xs text-foreground font-medium">
                  {format(new Date(election.start_date), "MMM dd, yyyy")} -{" "}
                  {format(new Date(election.end_date), "MMM dd, yyyy")}
                </p>
              </div>

              {/* Turnout */}
              <div className="flex items-center justify-between pt-1.5 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground">Turnout</p>
                  <p className="text-xs font-semibold text-foreground">
                    {election.votesCast} / {election.totalVoters} voters
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {election.turnoutPercentage}%
                  </p>
                </div>
              </div>
            </div>
          ))}

          {(!electionsWithTurnout || electionsWithTurnout.length === 0) && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No elections found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
