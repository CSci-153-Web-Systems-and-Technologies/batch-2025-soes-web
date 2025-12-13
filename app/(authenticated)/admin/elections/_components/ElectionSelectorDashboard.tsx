"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface Election {
  id: string;
  title: string;
  status: string;
}

interface ElectionSelectorDashboardProps {
  elections: Election[];
}

export default function ElectionSelectorDashboard({
  elections,
}: ElectionSelectorDashboardProps) {
  const router = useRouter();

  if (elections.length <= 1) return null;

  const handleElectionChange = (electionId: string) => {
    router.push(`/admin/elections/${electionId}`);
  };

  // Get active elections
  const activeElections = elections.filter((e) => e.status === "active");

  if (activeElections.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="dashboard-election-selector"
        className="text-sm font-medium text-foreground"
      >
        Quick View:
      </label>
      <div className="relative">
        <select
          id="dashboard-election-selector"
          onChange={(e) => handleElectionChange(e.target.value)}
          defaultValue=""
          className="appearance-none px-3 py-2 pr-8 border border-input rounded-lg bg-background text-sm font-medium text-foreground hover:border-accent focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
        >
          <option value="" disabled>
            Select active election...
          </option>
          {activeElections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.title}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}
