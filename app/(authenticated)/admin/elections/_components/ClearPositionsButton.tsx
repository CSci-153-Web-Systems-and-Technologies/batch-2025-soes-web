"use client";

import ClearPositionsDialog from "./ClearPositionsDialog";

interface ClearPositionsButtonProps {
  electionId: string;
}

export default function ClearPositionsButton({
  electionId,
}: ClearPositionsButtonProps) {
  return <ClearPositionsDialog electionId={electionId} />;
}
