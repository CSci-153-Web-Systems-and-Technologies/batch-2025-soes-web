"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface Election {
  id: string;
  title: string;
  status: string;
}

interface ElectionSelectorProps {
  currentElectionId: string;
  elections: Election[];
}

export default function ElectionSelector({
  currentElectionId,
  elections,
}: ElectionSelectorProps) {
  const router = useRouter();

  const handleElectionChange = (electionId: string) => {
    if (electionId !== currentElectionId) {
      router.push(`/admin/elections/${electionId}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="election-selector"
        className="text-sm font-medium text-gray-700"
      >
        Current Election:
      </label>
      <div className="relative">
        <select
          id="election-selector"
          value={currentElectionId}
          onChange={(e) => handleElectionChange(e.target.value)}
          className="appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
        >
          {elections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.title} ({election.status})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}
