"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Download } from "lucide-react";
import { importPositionsFromTemplate } from "@/lib/election-action";

// Strict type for the data passed from the parent
export interface TemplateOption {
  id: string;
  name: string;
}

interface ImportTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  electionId: string;
  templates: TemplateOption[];
}

export default function ImportTemplateModal({
  isOpen,
  onClose,
  electionId,
  templates,
}: ImportTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!selectedTemplate) return;

    setIsLoading(true);
    try {
      const result = await importPositionsFromTemplate(
        electionId,
        selectedTemplate
      );

      if (result.success) {
        toast.success(result.message);
        onClose();
        setSelectedTemplate(""); // Reset selection
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import from Template</DialogTitle>
          <DialogDescription>
            Select a template to automatically generate positions for this
            election. Existing positions will remain.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Template
            </label>
            <Select
              onValueChange={setSelectedTemplate}
              value={selectedTemplate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplate && (
              <p className="text-xs text-muted-foreground">
                This will import all positions defined in this template.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedTemplate || isLoading}
            className="bg-green-700 hover:bg-green-800 text-white"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Import Positions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
