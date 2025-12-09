import { createClient } from "@/utils/supabase/server";

export default async function ElectionOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>; 
}) {
  // 1. Await params to get the ID
  const { id } = await params;
  const supabase = await createClient();

  // 2. Run queries in parallel for performance
  const [totalVotersReq, votesCastReq] = await Promise.all([
    // Query A: Get Total Count of registered voters
    supabase
      .from("eligible_voters")
      .select("*", { count: "exact", head: true }) // head: true means "don't fetch data, just count"
      .eq("election_id", id),

    // Query B: Get Count of those who have voted
    supabase
      .from("eligible_voters")
      .select("*", { count: "exact", head: true })
      .eq("election_id", id)
      .eq("has_voted", true),
  ]);

  // 3. Extract the numbers (default to 0 if null)
  const totalVoters = totalVotersReq.count || 0;
  const votesCast = votesCastReq.count || 0;

  // 4. Calculate Turnout Percentage
  // Avoid division by zero if there are no voters yet
  const turnout = totalVoters > 0 
    ? ((votesCast / totalVoters) * 100).toFixed(1) 
    : "0";

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Session Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Voters Card */}
        <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col justify-between">
          <div className="text-sm text-gray-500 font-medium">Total Voters</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {totalVoters}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Registered students
          </div>
        </div>

        {/* Votes Cast Card */}
        <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col justify-between">
          <div className="text-sm text-gray-500 font-medium">Votes Cast</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {votesCast}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Completed ballots
          </div>
        </div>

        {/* Turnout Card */}
        <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col justify-between">
          <div className="text-sm text-gray-500 font-medium">Turnout</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {turnout}%
          </div>
          {/* Visual Progress Bar for Turnout */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${turnout}%` }}
            ></div>
          </div>
        </div>

      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
        <p>
          <strong>Next Steps:</strong> You have registered <strong>{totalVoters} voters</strong>. 
          Make sure to set up the <strong>Positions</strong> next so candidates can apply.
        </p>
      </div>
    </div>
  );
}