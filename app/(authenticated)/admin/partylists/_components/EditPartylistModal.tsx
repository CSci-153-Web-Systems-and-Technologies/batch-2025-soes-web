"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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

interface EditPartylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  partylist?: {
    id: string;
    name: string;
    description: string | null;
  };
}

export default function EditPartylistModal({
  isOpen,
  onClose,
  partylist,
}: EditPartylistModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (partylist && isOpen) {
      setFormData({
        name: partylist.name,
        description: partylist.description || "",
      });
    }
  }, [partylist, isOpen]);

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

    if (!partylist) {
      toast.error("No partylist selected");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("partylists")
        .update({
          name: formData.name,
          description: formData.description || null,
        })
        .eq("id", partylist.id);

      if (error) throw error;

      toast.success("Partylist updated successfully");
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error updating partylist:", error);
      toast.error("Failed to update partylist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Edit Partylist
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update partylist information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-900">
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
              className="text-sm font-medium text-gray-900"
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
                  Updating...
                </>
              ) : (
                "Update Partylist"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
