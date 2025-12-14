"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PositionOption, PartylistOption } from "@/types/types";

interface EditCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  initialData: {
    full_name: string;
    nickname?: string | null;
    position_id?: string;
    partylist_id?: string | null;
    platform?: string | null;
  };
  positions: PositionOption[];
  partylists: PartylistOption[];
  onSuccess?: () => void;
}

export default function EditCandidateModal({
  isOpen,
  onClose,
  candidateId,
  initialData,
  positions,
  partylists,
  onSuccess,
}: EditCandidateModalProps) {
  const [fullName, setFullName] = useState(initialData.full_name);
  const [nickname, setNickname] = useState(initialData.nickname || "");
  const [positionId, setPositionId] = useState(initialData.position_id || "");
  const [partylistId, setPartylistId] = useState(
    initialData.partylist_id || ""
  );
  const [platform, setPlatform] = useState(initialData.platform || "");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setFullName(initialData.full_name);
    setNickname(initialData.nickname || "");
    setPositionId(initialData.position_id || "");
    setPartylistId(initialData.partylist_id || "");
    setPlatform(initialData.platform || "");
  }, [initialData, isOpen]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!positionId) {
      toast.error("Please select a position");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("candidates")
        .update({
          full_name: fullName.trim(),
          nickname: nickname.trim() || null,
          position_id: positionId,
          partylist_id: partylistId || null,
          platform: platform.trim() || null,
        })
        .eq("id", candidateId);

      if (error) throw error;

      toast.success("Candidate updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast.error("Failed to update candidate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Candidate</DialogTitle>
          <DialogDescription>
            Update candidate information below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="position">
              Running For Position <span className="text-red-500">*</span>
            </Label>
            <select
              id="position"
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Select a position...</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="full-name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="full-name"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nickname">Nickname (Optional)</Label>
            <Input
              id="nickname"
              placeholder="Enter nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="partylist">Partylist (Optional)</Label>
            <select
              id="partylist"
              value={partylistId}
              onChange={(e) => setPartylistId(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">No Partylist</option>
              {partylists.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="platform">Platform (Optional)</Label>
            <textarea
              id="platform"
              placeholder="Enter candidate platform or bio"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
