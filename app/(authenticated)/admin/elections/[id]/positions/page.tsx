import { createClient } from "@/utils/supabase/server";
import { Users, Plus, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImportTemplateModalWrapper from "../../_components/ImportTemplateModalWrapper";

interface PositionRule {
  vote_limit?: number;
  allow_abstain?: boolean;
}

interface Position {
  id: string;
  rank: number;
  title: string;
  rules: PositionRule | null; // JSONB can be null
}

export default async function ElectionPositionsPage({
  params,
}: {
  params: Promise<{ id: string }>; // In Next.js 15, params is a Promise
}) {
  const { id: electionId } = await params;
  const supabase = await createClient();

  // 1. Fetch Current Positions for this Election
  const { data: positionsData } = await supabase
    .from("positions")
    .select("*")
    .eq("election_id", electionId)
    .order("rank", { ascending: true });

  // Cast the data to our interface (Supabase returns JSONB as any/unknown usually)
  const positions = (positionsData as unknown as Position[]) || [];

  // 2. Fetch Available Templates (active only)
  // We explicitly select the count of definitions to show (optional, but good for UI)
  const { data: templatesData } = await supabase
    .from("position_templates")
    .select("id, name, template_definitions(count)")
    .eq("status", "active");

  // Transform/Cast data to match the Modal's expected type
  // Supabase returns { count: number }[] for count queries
  const templates =
    templatesData?.map((t) => ({
      id: t.id,
      name: t.name,
      template_definitions: t.template_definitions as unknown as {
        count: number;
      }[],
    })) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Positions</h2>
          <p className="text-sm text-gray-500">
            Manage the positions candidates can run for.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Wrapper handles the client-side modal state */}
          <ImportTemplateModalWrapper
            electionId={electionId}
            templates={templates}
          />

          <Button variant="outline" className="gap-2">
            <Plus size={16} />
            Add Manually
          </Button>
        </div>
      </div>

      {/* Positions List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-3 w-16 text-center">Rank</th>
              <th className="px-6 py-3">Position Title</th>
              <th className="px-6 py-3">Configuration</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {positions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <LayoutTemplate className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">
                        No positions yet
                      </p>
                      <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                        You can manually add positions or import them from a
                        template to get started quickly.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              positions.map((pos) => (
                <tr key={pos.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-center text-gray-400 font-mono text-xs">
                    #{pos.rank}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {pos.title}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                        <Users size={12} className="mr-1.5" />
                        {pos.rules?.vote_limit || 1} Seat(s)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-900"
                    >
                      Edit
                    </Button>
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
