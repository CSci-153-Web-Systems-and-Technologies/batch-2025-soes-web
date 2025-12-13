"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddPositionModalProps {
  electionId: string;
  disabled?: boolean;
}

export default function AddPositionModal({
  electionId,
  disabled = false,
}: AddPositionModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [voteLimit, setVoteLimit] = useState("1");
  const router = useRouter();
  const supabase = createClient();

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title.trim()) {
      toast.error("Position title is required");
      setIsLoading(false);
      return;
    }

    try {
      // Get the highest rank
      const { data: positionsData } = await supabase
        .from("positions")
        .select("rank")
        .eq("election_id", electionId)
        .order("rank", { ascending: false })
        .limit(1);

      const nextRank = ((positionsData?.[0]?.rank as number) || 0) + 1;

      const { error } = await supabase.from("positions").insert({
        election_id: electionId,
        title: title.trim(),
        rank: nextRank,
        rules: {
          vote_limit: parseInt(voteLimit) || 1,
          allow_abstain: true,
        },
      });

      if (error) {
        toast.error("Failed to create position: " + error.message);
        setIsLoading(false);
        return;
      }

      toast.success(`Position "${title}" created successfully`);
      setTitle("");
      setVoteLimit("1");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while creating the position");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs sm:text-sm"
          disabled={disabled}
          title={disabled ? "Cannot add positions after template import" : ""}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Manually</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Position</DialogTitle>
          <DialogDescription>
            Create a new position for candidates to run for.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddPosition} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="position-title" className="text-sm font-medium">
              Position Title *
            </Label>
            <Input
              id="position-title"
              placeholder="e.g., President, Vice President"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
              className="bg-background border-input focus:ring-green-500/20 focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vote-limit" className="text-sm font-medium">
              Vote Limit
            </Label>
            <Input
              id="vote-limit"
              type="number"
              min="1"
              value={voteLimit}
              onChange={(e) => setVoteLimit(e.target.value)}
              disabled={isLoading}
              className="border-gray-300"
            />
            <p className="text-xs text-gray-500">
              Maximum number of votes voters can cast for this position
            </p>
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
                  Create Position
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
