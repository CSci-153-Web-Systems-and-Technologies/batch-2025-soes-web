"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PositionOption } from "../[id]/candidates/page";

interface PartylistOption {
  id: string;
  name: string;
}

interface AddCandidateModalProps {
  electionId: string;
  positions: PositionOption[];
  partylists: PartylistOption[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  disabled?: boolean;
}

export default function AddCandidateModal({
  electionId,
  positions,
  partylists,
  isOpen,
  onClose,
  onSuccess,
  disabled,
}: AddCandidateModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    student_id: "",
    full_name: "",
    nickname: "",
    position_id: "",
    partylist_id: "",
    platform: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled) {
      toast.error("Cannot add candidates to an ended election.");
      return;
    }

    if (!formData.position_id) {
      toast.error("Please select a position.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("candidates").insert({
        election_id: electionId,
        student_id: formData.student_id,
        full_name: formData.full_name,
        nickname: formData.nickname || null,
        position_id: formData.position_id,
        partylist_id: formData.partylist_id || null,
        platform: formData.platform || null,
      });

      if (error) throw error;

      toast.success("Candidate added successfully!");
      setFormData({
        student_id: "",
        full_name: "",
        nickname: "",
        position_id: "",
        partylist_id: "",
        platform: "",
      });
      onClose();
      onSuccess?.();
    } catch (error: unknown) {
      // Use unknown
      console.error("Error adding candidate:", error);

      let msg = "Failed to add candidate.";
      if (error instanceof Error) {
        msg = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        msg = (error as { message: string }).message;
      }
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Add New Candidate
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Running For Position <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              value={formData.position_id}
              onChange={(e) =>
                setFormData({ ...formData, position_id: e.target.value })
              }
            >
              <option value="" disabled>
                Select a position...
              </option>
              {positions.length === 0 ? (
                <option value="" disabled>
                  No positions found. Create one first.
                </option>
              ) : (
                positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.title}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              School ID <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.student_id}
              onChange={(e) =>
                setFormData({ ...formData, student_id: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Nickname{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Partylist{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              value={formData.partylist_id}
              onChange={(e) =>
                setFormData({ ...formData, partylist_id: e.target.value })
              }
            >
              <option value="">Select a partylist (optional)...</option>
              {partylists.length === 0 ? (
                <option value="" disabled>
                  No partylists found
                </option>
              ) : (
                partylists.map((partylist) => (
                  <option key={partylist.id} value={partylist.id}>
                    {partylist.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Platform / Statement{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              value={formData.platform}
              onChange={(e) =>
                setFormData({ ...formData, platform: e.target.value })
              }
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || positions.length === 0}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} /> Save Candidate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
