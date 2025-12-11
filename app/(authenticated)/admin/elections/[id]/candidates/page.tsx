"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CandidateActions from "../../_components/CandidateActions";
import CandidateSearch from "../../_components/CandidateSearch";

export interface PositionOption {
  id: string;
  title: string;
}

export interface PartylistOption {
  id: string;
  name: string;
}

// UPDATE: Matched interface to your DB Schema
interface CandidateData {
  id: string;
  student_id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
  partylist_id: string | null;
  positions: {
    id: string;
    title: string;
  } | null;
  partylists: {
    id: string;
    name: string;
  } | null;
}

export default function CandidatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [positions, setPositions] = useState<PositionOption[]>([]);
  const [partylists, setPartylists] = useState<PartylistOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
      await fetchCandidatesData(resolvedParams.id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCandidatesData = async (electionId: string) => {
    setIsLoading(true);
    try {
      const [candidatesRes, positionsRes, partyleistsRes] = await Promise.all([
        supabase
          .from("candidates")
          .select(
            "id, student_id, full_name, description, avatar_url, partylist_id, positions(id, title), partylists(id, name)"
          )
          .eq("election_id", electionId)
          .order("title", { foreignTable: "positions", ascending: true })
          .order("full_name", { ascending: true }),
        supabase
          .from("positions")
          .select("id, title")
          .eq("election_id", electionId)
          .order("title", { ascending: true }),
        supabase
          .from("partylists")
          .select("id, name")
          .eq("election_id", electionId)
          .order("name", { ascending: true }),
      ]);

      if (!candidatesRes.error && candidatesRes.data) {
        setCandidates(candidatesRes.data as unknown as CandidateData[]);
      }
      if (!positionsRes.error && positionsRes.data) {
        setPositions(positionsRes.data as PositionOption[]);
      }
      if (!partyleistsRes.error && partyleistsRes.data) {
        setPartylists(partyleistsRes.data as PartylistOption[]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchCandidatesData(id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Candidates</h2>
          <p className="text-sm text-gray-500">
            Manage the official candidates running for positions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <CandidateActions
            electionId={id}
            positions={positions}
            partylists={partylists}
            onDataChange={() => fetchCandidatesData(id)}
          />
        </div>
      </div>

      <CandidateSearch
        candidates={candidates}
        allCandidatesCount={candidates.length}
      />
    </div>
  );
}
