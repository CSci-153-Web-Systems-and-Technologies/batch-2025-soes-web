"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner"; // <--- 1. Import toast

interface AddVoterModalProps {
  electionId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  disabled?: boolean;
}

export default function AddVoterModal({
  electionId,
  isOpen,
  onClose,
  onSuccess,
  disabled,
}: AddVoterModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    student_id: "",
    full_name: "",
    email: "",
  });

  const generateAccessCode = () => {
    return Math.random().toString(36).slice(-8).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled) {
      toast.error("Cannot add voters to an ended election.");
      return;
    }

    setIsLoading(true);

    const supabase = createClient();
    const accessCode = generateAccessCode();

    try {
      const { error } = await supabase.from("eligible_voters").insert({
        election_id: electionId,
        student_id: formData.student_id,
        full_name: formData.full_name,
        email: formData.email,
        access_code: accessCode,
        has_voted: false,
      });

      if (error) throw error;

      // 2. Success Alert
      toast.success("Voter added successfully!");

      setFormData({ student_id: "", full_name: "", email: "" });
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error adding voter:", error);
      // 3. Error Alert
      toast.error("Failed to add voter. ID might already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Add New Voter
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Student ID
            </label>
            <input
              required
              type="text"
              placeholder="e.g., 2021-12345"
              className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              value={formData.student_id}
              onChange={(e) =>
                setFormData({ ...formData, student_id: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Juan Dela Cruz"
              className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              required
              type="email"
              placeholder="student@university.edu"
              className="w-full px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg text-xs flex gap-2 items-start border border-blue-200 dark:border-blue-800">
            <KeyRound size={14} className="mt-0.5 shrink-0" />
            <p>
              An access code will be automatically generated for this voter.
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-accent rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Save Voter"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
