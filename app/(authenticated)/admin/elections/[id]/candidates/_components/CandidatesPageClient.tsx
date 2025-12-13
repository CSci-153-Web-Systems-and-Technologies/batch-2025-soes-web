"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CandidateActions from "../../../_components/CandidateActions";
import CandidateSearch from "../../../_components/CandidateSearch";
import { Candidate, PositionOption, PartylistOption } from "@/types/types";

interface CandidatesPageClientProps {
  electionId: string;
  isElectionEnded: boolean;
}

export default function CandidatesPageClient({
  electionId,
  isElectionEnded,
}: CandidatesPageClientProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<PositionOption[]>([]);
  const [partylists, setPartylists] = useState<PartylistOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchCandidatesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCandidatesData = async () => {
    setIsLoading(true);
    try {
      const [candidatesRes, positionsRes, partylistsRes] = await Promise.all([
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
        setCandidates(candidatesRes.data as unknown as Candidate[]);
      }
      if (!positionsRes.error && positionsRes.data) {
        setPositions(positionsRes.data as PositionOption[]);
      }
      if (!partylistsRes.error && partylistsRes.data) {
        setPartylists(partylistsRes.data as PartylistOption[]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchCandidatesData();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Candidates</h2>
          <p className="text-sm text-muted-foreground">
            Manage the official candidates running for positions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <CandidateActions
            electionId={electionId}
            positions={positions}
            partylists={partylists}
            onDataChange={() => fetchCandidatesData()}
            isElectionEnded={isElectionEnded}
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
