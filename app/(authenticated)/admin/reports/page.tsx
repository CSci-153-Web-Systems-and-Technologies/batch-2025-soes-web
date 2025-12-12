import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import ElectionReportsSelector from "./_components/ElectionReportsSelector";

interface CompletedElection {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default async function ReportsPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Fetch ended elections for the current user
  const { data: completedElections } = await supabase
    .from("election_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "ended")
    .order("updated_at", { ascending: false });

  const elections =
    (completedElections as unknown as CompletedElection[]) || [];

  return (
    <div className="space-y-6 mt-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Results</h1>
        <p className="text-gray-600 mt-2">
          View final election results and generate comprehensive reports for
          completed elections
        </p>
      </div>

      {/* Election Selector and Report Display */}
      {elections.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 mb-2">
              No Completed Elections
            </p>
            <p className="text-gray-500">
              Completed elections will appear here. End an active election
              session to generate reports.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ElectionReportsSelector elections={elections} />
      )}
    </div>
  );
}
