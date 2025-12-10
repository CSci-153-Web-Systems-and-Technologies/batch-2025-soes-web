"use client";

import DeletePositionDialog from "./DeletePositionDialog";

interface PositionActionsProps {
  positionId: string;
  positionTitle: string;
}

export default function PositionActions({
  positionId,
  positionTitle,
}: PositionActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <DeletePositionDialog
        positionId={positionId}
        positionTitle={positionTitle}
      />
    </div>
  );
}
