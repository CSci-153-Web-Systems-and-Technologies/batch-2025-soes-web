import { createClient } from "@/utils/supabase/server";
import { Search } from "lucide-react"; 
import VoterActions from "../../_components/VoterActions";
import VoterRowActions from "../../_components/VoterRowActions";

interface Voter {
  id: string;
  school_id: string;
  full_name: string;
  email: string | null;
  has_voted: boolean;
}

export default async function VotersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch real data from your table
  const { data: voters } = await supabase
    .from("eligible_voters")
    .select("*")
    .eq("election_id", id)
    .order("full_name", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Registered Voters
          </h2>
          <p className="text-sm text-gray-500">
            Manage who is allowed to vote in this session.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Add/Import Buttons */}
          <VoterActions electionId={id} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or school ID..."
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">School ID</th>
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!voters || voters.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No voters found. Click &quot;Add Voter&quot; to import
                  students.
                </td>
              </tr>
            ) : (
              voters.map((voter: Voter) => (
                <tr
                  key={voter.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 font-mono text-gray-600">
                    {voter.school_id}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {voter.full_name}
                  </td>
                  <td className="px-6 py-3">
                    {voter.has_voted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Voted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Not Voted
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-3 text-right">
                    <VoterRowActions 
                      voterId={voter.id} 
                      hasVoted={voter.has_voted} 
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}