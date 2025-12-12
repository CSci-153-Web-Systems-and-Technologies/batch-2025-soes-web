"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyBallotLinkButtonProps {
  ballotUrl: string;
  linkType?: string;
}

export default function CopyBallotLinkButton({
  ballotUrl,
  linkType = "Ballot",
}: CopyBallotLinkButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(ballotUrl);
    toast.success(`${linkType} link copied to clipboard!`);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
      title="Copy to clipboard"
    >
      <Copy size={16} className="text-blue-600" />
    </button>
  );
}
