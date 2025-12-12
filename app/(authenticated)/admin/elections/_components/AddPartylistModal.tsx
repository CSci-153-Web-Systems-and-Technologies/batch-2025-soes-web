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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const supabase = createClient();

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Partylist</DialogTitle>
          <DialogDescription>
            Add a new partylist for candidates to join.
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
