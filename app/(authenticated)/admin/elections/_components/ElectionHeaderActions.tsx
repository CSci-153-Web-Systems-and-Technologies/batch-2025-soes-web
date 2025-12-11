"use client";

import { useState } from "react";
import { Share2, Power, Loader2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ElectionHeaderActionsProps {
  electionId: string;
  electionStatus: string;
}

export default function ElectionHeaderActions({
  electionId,
  electionStatus,
}: ElectionHeaderActionsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const ballotUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/ballot/${electionId}`;

  const isActive = electionStatus === "active";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ballotUrl);
      setIsCopied(true);
      toast.success("Ballot link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      const newStatus = isActive ? "inactive" : "active";
      const { error } = await supabase
        .from("election_sessions")
        .update({ status: newStatus })
        .eq("id", electionId);

      if (error) {
        toast.error("Failed to update election status: " + error.message);
        setIsToggling(false);
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
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status Toggle Button */}
      {electionStatus !== "completed" && (
        <Button
          onClick={handleToggleStatus}
          disabled={isToggling}
          size="sm"
          className={`gap-2 ${
            isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-700 hover:bg-green-900"
          }`}
        >
          {isToggling ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Power size={16} />
              {isActive ? "Deactivate" : "Activate"}
            </>
          )}
        </Button>
      )}

      {/* Share Button - Only show if active */}
      {isActive && (
        <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-gray-300"
            >
              <Share2 size={16} />
              Share Ballot Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Share Ballot Link</DialogTitle>
              <DialogDescription>
                Share this link with voters to access the ballot
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-2">Ballot URL:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-blue-900 font-mono break-all">
                    {ballotUrl}
                  </code>
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0 hover:bg-blue-100"
                  >
                    {isCopied ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} className="text-blue-600" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                ⓘ This link can be shared via email, QR code, messaging, or
                direct link.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
