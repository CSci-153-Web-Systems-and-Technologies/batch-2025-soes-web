"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Election {
  id: string;
  title: string;
}

interface DashboardElectionSelectorProps {
  elections: Election[];
  defaultElectionId: string;
}

export default function DashboardElectionSelector({
  elections,
  defaultElectionId,
}: DashboardElectionSelectorProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(defaultElectionId);

  const handleElectionChange = (electionId: string) => {
    setSelectedId(electionId);
    router.push(`/admin/elections/${electionId}`);
  };

  // Only show if there are 2+ active elections
  if (elections.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="dashboard-active-selector" className="text-sm font-medium text-gray-700">
        Switch Election:
      </label>
      <div className="relative">
        <select
          id="dashboard-active-selector"
          value={selectedId}
          onChange={(e) => handleElectionChange(e.target.value)}
          className="appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
        >
          {elections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.title}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}
