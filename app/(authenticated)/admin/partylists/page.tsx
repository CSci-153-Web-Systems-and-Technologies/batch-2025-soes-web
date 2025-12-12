"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Loader2, Trash2, Edit2, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreatePartylistModal from "./_components/CreatePartylistModal";
import ImportPartyleysModal from "./_components/ImportPartyleysModal";
import EditPartylistModal from "./_components/EditPartylistModal";
import ViewPartylistMembersModal from "./_components/ViewPartylistMembersModal";

interface Candidate {
  id: string;
  student_id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
  partylist_id: string;
  position_id: string | null;
  positions?: {
    id: string;
    title: string;
  } | null;
}

interface Partylist {
  id: string;
  name: string;
  description: string | null;
  members_count: number;
  created_at: string;
  candidates?: Candidate[];
}

export default function PartylistsPage() {
  const [partylists, setPartylists] = useState<Partylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPartylist, setSelectedPartylist] = useState<Partylist | null>(
    null
  );
  const supabase = createClient();

  useEffect(() => {
    fetchPartylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPartylists = async () => {
    setIsLoading(true);
    try {
      // Fetch partylists first
      const { data: partylistData, error: partylistError } = await supabase
        .from("partylists")
        .select("id, name, description, created_at")
        .order("created_at", { ascending: false });

      if (partylistError) {
        toast.error("Failed to load partylists");
        setIsLoading(false);
        return;
      }

      // Fetch all candidates with their positions using the position_id foreign key
      const { data: candidatesData, error: candidatesError } = await supabase
        .from("candidates")
        .select("id, student_id, full_name, description, avatar_url, partylist_id, position_id, positions:position_id(id, title)");

      if (candidatesError) {
        console.error("Candidates fetch error:", candidatesError);
        toast.error("Failed to load candidates");
        setIsLoading(false);
        return;
      }

      // Map candidates to their partylists
      const partylistsWithCount = partylistData.map((p) => {
        const partyCandidates = (candidatesData as Candidate[]).filter(
          (c) => c.partylist_id === p.id
        );
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          created_at: p.created_at,
          candidates: partyCandidates,
          members_count: partyCandidates.length,
        };
      });

      setPartylists(partylistsWithCount);
    } catch (error) {
      console.error("Error fetching partylists:", error);
      toast.error("An error occurred while loading partylists");
    }
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    await fetchPartylists();
    toast.success("Data refreshed");
  };

  const handleEdit = (partylist: Partylist) => {
    setSelectedPartylist(partylist);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const { error } = await supabase.from("partylists").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete partylist");
    } else {
      toast.success("Partylist deleted successfully");
      fetchPartylists();
    }
  };

  // Stats Logic
  const totalPartylists = partylists.length;
  const totalMembers = partylists.reduce(
    (acc, curr) => acc + curr.members_count,
    0
  );
  const averageMembersPerList =
    totalPartylists > 0 ? Math.round(totalMembers / totalPartylists) : 0;

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Manage Partylists
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage political party lists and organizations
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
          <Button
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Upload className="mr-2 h-4 w-4" /> Import CSV
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-700 hover:bg-green-800 text-white shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Partylist
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Partylists" value={totalPartylists} />
        <StatCard title="Total Members" value={totalMembers} />
        <StatCard title="Average Members" value={averageMembersPerList} />
        <StatCard title="Active Partylists" value={totalPartylists} />
      </div>

      {/* Partylists Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">
            All Partylists
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage and configure your partylists
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : partylists.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-gray-600">
                No partylists yet. Create one to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50">
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Name
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Description
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Candidates
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partylists.map((partylist) => (
                  <TableRow
                    key={partylist.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {partylist.name}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-gray-600">
                      {partylist.description || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {partylist.members_count}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ViewPartylistMembersModal
                          partylistName={partylist.name}
                          candidates={partylist.candidates || []}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(partylist)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDelete(partylist.id, partylist.name)
                          }
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreatePartylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchPartylists}
      />
      <ImportPartyleysModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchPartylists}
      />
      <EditPartylistModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchPartylists}
        partylist={selectedPartylist || undefined}
      />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  );
}
