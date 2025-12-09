import { createClient } from "@/utils/supabase/server";

export default async function ElectionOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: In Next.js 15 params is a Promise
}) {
  // 1. Await params to get the ID
  const { id } = await params;

  // 2. Fetch real data (Optional: Enable this when ready)
  /*
  const supabase = await createClient();
  const { data: election } = await supabase
    .from("election_sessions")
    .select("*")
    .eq("id", id)
    .single();
  */

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Session Overview</h2>
      
      {/* Debugging: Show ID to confirm it works */}
      <div className="mb-4 text-xs text-blue-600 bg-blue-50 p-2 rounded">
        Viewing Election ID: {id}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Simple Stats Cards Placeholder */}
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <div className="text-sm text-gray-500 font-medium">Total Voters</div>
          <div className="text-2xl font-bold text-gray-900">--</div>
        </div>
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <div className="text-sm text-gray-500 font-medium">Votes Cast</div>
          <div className="text-2xl font-bold text-gray-900">--</div>
        </div>
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <div className="text-sm text-gray-500 font-medium">Turnout</div>
          <div className="text-2xl font-bold text-gray-900">--%</div>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-500">
        Select a tab above to begin managing this election. Start with{" "}
        <strong>Positions</strong>.
      </p>
    </div>
  );
}