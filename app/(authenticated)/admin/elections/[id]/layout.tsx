import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import TabNavigation from "../_components/TabNavigation";
import ElectionHeaderActions from "../_components/ElectionHeaderActions";
import { ArrowLeft } from "lucide-react";

export default async function SingleElectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // 1. Type params as a Promise
}) {
  // 2. Await the params before using them
  const { id } = await params;

  const supabase = await createClient(); // 3. Correct await syntax

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const { data: election } = await supabase
    .from("election_sessions")
    .select("title, status, end_date")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!election) return notFound();

  return (
    <div className="flex flex-col h-full pt-4 md:pt-6 px-4 md:px-8 max-w-8xl mx-full">
      <div className="mb-3 md:mb-4">
        <Link
          href="/admin/elections"
          className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} className="md:w-4 md:h-4" />
          Back to All Elections
        </Link>
      </div>

      {/* Session Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <h1 className="text-lg md:text-3xl font-bold tracking-tight text-foreground truncate">
            {election.title}
          </h1>
          <span
            className={`px-2 py-0.5 text-[10px] md:text-xs font-semibold rounded-full border flex-shrink-0 ${
              election.status === "active"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                : election.status === "ended"
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                : "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
            }`}
          >
            {election.status.toUpperCase()}
          </span>
        </div>
        <ElectionHeaderActions
          electionId={id}
          electionStatus={election.status}
          endDate={election.end_date}
        />
      </div>

      {/* Show message if election is ended */}
      {election.status === "ended" && (
        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs md:text-sm text-red-800 dark:text-red-300">
            <strong>This election has ended.</strong> You cannot add, edit, or
            delete any data. You can check the results and export reports from
            the Results and Reports pages.
          </p>
        </div>
      )}

      {/* Tabs */}
      <TabNavigation electionId={id} />

      {/* The Tab Content */}
      <div className="flex-1 bg-background border border-t-0 rounded-b-xl shadow-sm p-4 md:p-6 min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
