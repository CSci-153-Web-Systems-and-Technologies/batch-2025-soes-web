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
    <div className="flex flex-col h-full pt-6 px-8 max-w-8xl mx-full">
      <div className="mb-4">
        <Link
          href="/admin/elections"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to All Elections
        </Link>
      </div>

      {/* Session Title Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {election.title}
          </h1>
          <span
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
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
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>This election has ended.</strong> You cannot add, edit, or
            delete any data. You can check the results and export reports from
            the Results and Reports pages.
          </p>
        </div>
      )}

      {/* Tabs */}
      <TabNavigation electionId={id} />

      {/* The Tab Content */}
      <div className="flex-1 bg-background border border-t-0 rounded-b-xl shadow-sm p-6 min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
