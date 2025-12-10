"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import ImportTemplateModal, { TemplateOption } from "./ImportTemplateModal";

// Explicitly define props interface
interface ImportTemplateModalWrapperProps {
  electionId: string;
  templates: TemplateOption[];
}

export default function ImportTemplateModalWrapper({
  electionId,
  templates,
}: ImportTemplateModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gray-900 text-white hover:bg-gray-800 gap-2 shadow-sm"
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