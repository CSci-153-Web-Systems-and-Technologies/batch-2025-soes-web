"use client";

import ClearPositionsDialog from "./ClearPositionsDialog";

interface ClearPositionsButtonProps {
  electionId: string;
  positionCount: number;
}

export default function ClearPositionsButton({
  electionId,
  positionCount,
}: ClearPositionsButtonProps) {
  return (
    <ClearPositionsDialog
      electionId={electionId}
      positionCount={positionCount}
    />
  );
}
