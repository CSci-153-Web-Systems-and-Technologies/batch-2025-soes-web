"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreatePartylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  electionId?: string;
}

export default function CreatePartylistModal({
  isOpen,
  onClose,
  onSuccess,
  electionId,
}: CreatePartylistModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Partylist name is required");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("partylists").insert({
        name: formData.name,
        description: formData.description || null,
        election_id: electionId || null,
      });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          toast.error(
            "A partylist with this name already exists in this election"
          );
        } else {
          throw error;
        }
        return;
      }

      toast.success("Partylist created successfully");
      setFormData({ name: "", description: "" });
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating partylist:", error);
      toast.error("Failed to create partylist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Create New Partylist
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new political party list or organization
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Partylist Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., ABC Party, Student Union"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-foreground"
            >
              Description
            </Label>
            <textarea
              id="description"
              name="description"
              placeholder="Add a brief description of the partylist (optional)"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Partylist"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
