import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { Plus, MoreHorizontal, ArrowRight } from "lucide-react";
import CreateElectionModal from "./_components/CreateElectionModal";

export default async function ElectionsListPage() {
  const supabase = await createClient();

  // 1. Fetch Elections
  // Note: We are mocking the "turnout" counts here for performance,
  // but normally you'd use the helper function I gave you earlier.
  const { data: elections } = await supabase
    .from("election_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  // Helper for Status Badge Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Elections Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create and manage election campaigns
          </p>
        </div>

        <CreateElectionModal />
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-medium text-gray-900">All Elections</h2>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wide">
              <th className="px-6 py-4">Election Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Period</th>
              <th className="px-6 py-4">Turnout</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {elections?.map((election) => (
              <tr
                key={election.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                {/* Title & Link */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {election.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 font-mono">
                    ID: {election.id.slice(0, 8)}...
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
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
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">
                    {format(new Date(election.start_date), "yyyy-MM-dd")}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    to {format(new Date(election.end_date), "yyyy-MM-dd")}
                  </div>
                </td>

                {/* Turnout Placeholder */}
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    -- / --
                  </div>
                  <div className="text-xs text-gray-500">--%</div>
                </td>

                {/* Action Button: THIS ENTERS THE [ID] FOLDER */}
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/elections/${election.id}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Manage <ArrowRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}

            {(!elections || elections.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No elections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
