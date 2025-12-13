"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Power, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ToggleElectionStatusButtonProps {
  electionId: string;
  currentStatus: string;
}

export default function ToggleElectionStatusButton({
  electionId,
  currentStatus,
}: ToggleElectionStatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const isActive = currentStatus === "active";
  const newStatus = isActive ? "draft" : "active";

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("election_sessions")
        .update({ status: newStatus })
        .eq("id", electionId);

      if (error) {
        toast.error("Failed to update election status: " + error.message);
        setIsLoading(false);
        return;
      }

      toast.success(
        `Election ${isActive ? "deactivated" : "activated"} successfully`
      );
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while updating the election status");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggleStatus}
      disabled={isLoading}
      size="sm"
      className={`h-7 px-2 py-1 text-xs font-semibold gap-1 ${
        isActive
          ? "bg-red-600 hover:bg-red-700"
          : "bg-green-700 hover:bg-green-900"
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Updating...
        </>
      ) : (
        <>
          <Power size={16} />
          {isActive ? "Deactivate" : "Activate"} Election
        </>
      )}
    </Button>
  );
}
