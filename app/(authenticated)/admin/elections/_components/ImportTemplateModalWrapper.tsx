"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import ImportTemplateModal, { TemplateOption } from "./ImportTemplateModal";

// Explicitly define props interface
interface ImportTemplateModalWrapperProps {
  electionId: string;
  templates: TemplateOption[];
  disabled?: boolean;
}

export default function ImportTemplateModalWrapper({
  electionId,
  templates,
  disabled = false,
}: ImportTemplateModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title={
          disabled ? "Cannot import after template is already imported" : ""
        }
      >
        <LayoutTemplate size={16} />
        Use Template
      </Button>

      <ImportTemplateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        electionId={electionId}
        templates={templates}
      />
    </>
  );
}
