"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface GlobalPartylist {
  id: string;
  name: string;
  description: string | null;
}

interface AddPartylistModalProps {
  electionId: string;
  disabled?: boolean;
}

export default function AddPartylistModal({
  electionId,
  disabled,
}: AddPartylistModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [globalPartylists, setGlobalPartylists] = useState<GlobalPartylist[]>(
    []
  );
  const [electionPartylists, setElectionPartylists] = useState<string[]>([]);
  const [selectedPartylists, setSelectedPartylists] = useState<string[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Load global partylists when modal opens
  useEffect(() => {
    if (open) {
      void fetchGlobalPartylists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchGlobalPartylists = async () => {
    setIsLoadingGlobal(true);
    try {
      // Fetch all global partylists
      const { data: allPartylists, error: allError } = await supabase
        .from("partylists")
        .select("id, name, description")
        .is("election_id", null)
        .order("name", { ascending: true });

      // Fetch partylists already in this election
      const { data: currentPartylists, error: currentError } = await supabase
        .from("partylists")
        .select("id")
        .eq("election_id", electionId);

      if (allError || currentError) {
        toast.error("Failed to load partylists");
        return;
      }

      setGlobalPartylists((allPartylists as GlobalPartylist[]) || []);
      setElectionPartylists((currentPartylists || []).map((p) => p.id));
      setSelectedPartylists([]);
    } catch (error) {
      console.error("Error fetching partylists:", error);
      toast.error("Failed to load partylists");
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  const handleAddPartylist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled) {
      toast.error("Cannot add partylists to an ended election.");
      return;
    }

    setIsLoading(true);

    if (!name.trim()) {
      toast.error("Partylist name is required");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("partylists").insert({
        election_id: electionId,
        name: name.trim(),
        description: description.trim() || null,
      });

      if (error) {
        toast.error("Failed to create partylist: " + error.message);
        return;
      }

      toast.success(`Partylist "${name}" created successfully`);
      setName("");
      setDescription("");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while creating the partylist");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncludePartylists = async () => {
    if (selectedPartylists.length === 0) {
      toast.error("Please select at least one partylist");
      return;
    }

    setIsLoading(true);
    try {
      // Update selected partylists to link them to this election
      const { error } = await supabase
        .from("partylists")
        .update({ election_id: electionId })
        .in("id", selectedPartylists);

      if (error) {
        toast.error("Failed to include partylists: " + error.message);
        return;
      }

      toast.success(
        `Successfully included ${selectedPartylists.length} partylist(s)`
      );
      setSelectedPartylists([]);
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while including partylists");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePartylistSelection = (id: string) => {
    setSelectedPartylists((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const availablePartylists = globalPartylists.filter(
    (p) => !electionPartylists.includes(p.id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="gap-2 bg-green-700 hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Add Partylist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Partylists</DialogTitle>
          <DialogDescription>
            Create a new partylist or include existing ones from the partylist
            page.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="include">Include Existing</TabsTrigger>
          </TabsList>

          {/* Create New Tab */}
          <TabsContent value="create" className="space-y-6 mt-6">
            <form onSubmit={handleAddPartylist} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="partylist-name" className="text-sm font-medium">
                  Partylist Name *
                </Label>
                <Input
                  id="partylist-name"
                  placeholder="e.g., Iska Kami"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="partylist-description"
                  className="text-sm font-medium"
                >
                  Description (Optional)
                </Label>
                <Textarea
                  id="partylist-description"
                  placeholder="Brief description of the partylist..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className="border-gray-300 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-700 hover:bg-green-900 gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create Partylist
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Include Existing Tab */}
          <TabsContent value="include" className="space-y-6 mt-6">
            <div className="space-y-4">
              {isLoadingGlobal ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={20} className="animate-spin text-gray-400" />
                </div>
              ) : availablePartylists.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500">
                    No available partylists to include. All global partylists
                    are already added to this election.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Select partylists from the global list to add to this
                    election:
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {availablePartylists.map((partylist) => (
                      <label
                        key={partylist.id}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPartylists.includes(partylist.id)}
                          onChange={() =>
                            togglePartylistSelection(partylist.id)
                          }
                          disabled={isLoading}
                          className="mt-1 w-4 h-4 accent-green-700"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {partylist.name}
                          </p>
                          {partylist.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {partylist.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleIncludePartylists}
                      disabled={isLoading || selectedPartylists.length === 0}
                      className="bg-green-700 hover:bg-green-900 gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Including...
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Include
                          {selectedPartylists.length > 0 &&
                            ` (${selectedPartylists.length})`}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
