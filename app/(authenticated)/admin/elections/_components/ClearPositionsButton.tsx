"use client";

import ClearPositionsDialog from "./ClearPositionsDialog";

interface ClearPositionsButtonProps {
  electionId: string;
  disabled?: boolean;
}

export default function ClearPositionsButton({
  electionId,
  disabled = false,
}: ClearPositionsButtonProps) {
  return <ClearPositionsDialog electionId={electionId} disabled={disabled} />;
}
