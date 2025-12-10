"use client";

import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { toast } from "sonner";
import DeletePositionDialog from "./DeletePositionDialog";

interface PositionActionsProps {
  positionId: string;
  positionTitle: string;
}

export default function PositionActions({
  positionId,
  positionTitle,
}: PositionActionsProps) {
  const handleEditPosition = () => {
    // TODO: Implement edit functionality
    toast.info("Edit feature coming soon");
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEditPosition}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-auto"
        title="Edit position"
      >
        <Edit2 size={16} />
      </Button>
      <DeletePositionDialog
        positionId={positionId}
        positionTitle={positionTitle}
      />
    </div>
  );
}
