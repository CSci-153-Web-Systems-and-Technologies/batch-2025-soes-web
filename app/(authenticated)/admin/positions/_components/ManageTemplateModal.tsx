"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, Plus, Trash2, Save, Loader2, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PositionTemplate } from "@/types/types";

// Draft type for form handling
interface PositionDraft {
  title: string;
  rank: number;
  slots: number;
}

interface ManageTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateToEdit?: PositionTemplate | null;
}

export default function ManageTemplateModal({
  isOpen,
  onClose,
  templateToEdit,
}: ManageTemplateModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [positions, setPositions] = useState<PositionDraft[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (templateToEdit) {
        setName(templateToEdit.name || ""); // Ensure fallback
        setDescription(templateToEdit.description || "");

        // Safely map DB data to Draft format
        const definitions = templateToEdit.template_definitions || [];
        const drafts: PositionDraft[] = definitions
          .sort((a, b) => a.order - b.order)
          .map((def) => ({
            title: def.name || "", // Ensure fallback if DB field is null
            rank: def.order,
            slots: def.vote_limit,
          }));

        setPositions(drafts);
      } else {
        setName("");
        setDescription("");
        setPositions([{ title: "President", rank: 1, slots: 1 }]);
      }
    }
  }, [isOpen, templateToEdit]);

  const handleAddPositionRow = () => {
    const nextRank =
      positions.length > 0 ? positions[positions.length - 1].rank + 1 : 1;
    setPositions([...positions, { title: "", rank: nextRank, slots: 1 }]);
  };

  const handleRemovePositionRow = (index: number) => {
    const newRows = [...positions];
    newRows.splice(index, 1);
    setPositions(newRows);
  };

  const handlePositionChange = (
    index: number,
    field: keyof PositionDraft,
    val: string | number
  ) => {
    const newRows = [...positions];
    // Create a shallow copy of the item to avoid direct mutation
    const row = { ...newRows[index] };

    if (field === "title" && typeof val === "string") {
      row.title = val;
    } else if (field === "slots" && typeof val === "number") {
      row.slots = val;
    }

    newRows[index] = row;
    setPositions(newRows);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Template name is required");
    if (positions.some((p) => !p.title.trim()))
      return toast.error("All position titles must be filled");

    setIsLoading(true);
    const supabase = createClient();

    try {
      let templateId = templateToEdit?.id;

      if (templateToEdit) {
        const { error } = await supabase
          .from("position_templates")
          .update({ name, description })
          .eq("id", templateId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("position_templates")
          .insert({ name, description })
          .select("id")
          .single();
        if (error) throw error;
        templateId = data.id;
      }

      if (!templateId) throw new Error("Failed to get template ID");

      // Delete existing definitions
      const { error: deleteError } = await supabase
        .from("template_definitions")
        .delete()
        .eq("template_id", templateId);

      if (deleteError) throw deleteError;

      // Insert new definitions
      const definitionsToInsert = positions.map((p, idx) => ({
        template_id: templateId,
        name: p.title,
        order: idx + 1,
        vote_limit: p.slots || 1,
      }));

      const { error: insertError } = await supabase
        .from("template_definitions")
        .insert(definitionsToInsert);

      if (insertError) throw insertError;

      toast.success(
        templateToEdit
          ? "Template updated successfully!"
          : "Template created successfully!"
      );
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-foreground">
            {templateToEdit ? "Edit Template" : "Create New Template"}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Template Name
                </label>
                <input
                  required
                  placeholder="e.g. Standard SSG"
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  value={name || ""} // Added fallback here
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Description (Optional)
                </label>
                <input
                  placeholder="e.g. For main campus elections"
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  value={description || ""} // Added fallback here
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Positions & Slots
                </label>
                <button
                  type="button"
                  onClick={handleAddPositionRow}
                  className="text-xs flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                >
                  <Plus size={14} /> Add Position
                </button>
              </div>

              <div className="bg-muted rounded-lg border overflow-hidden">
                {positions.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No positions added yet. Click &quot;Add Position&quot;.
                  </div>
                ) : (
                  <div className="divide-y">
                    <div className="grid grid-cols-12 px-3 py-2 bg-muted text-xs font-semibold text-muted-foreground uppercase">
                      <div className="col-span-1 text-center">#</div>
                      <div className="col-span-8">Position Title</div>
                      <div className="col-span-2 text-center">Slots</div>
                      <div className="col-span-1"></div>
                    </div>
                    {positions.map((pos, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 items-center gap-2 p-2 bg-card hover:bg-accent"
                      >
                        <div className="col-span-1 flex justify-center text-muted-foreground cursor-move">
                          <GripVertical size={16} />
                        </div>

                        <div className="col-span-8">
                          {/* THIS IS WHERE THE ERROR WAS */}
                          <input
                            required
                            placeholder="Title (e.g. Senator)"
                            className="w-full px-3 py-1.5 border rounded text-sm bg-background text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                            value={pos.title || ""} // FIXED: Added || "" fallback
                            onChange={(e) =>
                              handlePositionChange(idx, "title", e.target.value)
                            }
                          />
                        </div>

                        <div className="col-span-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min="1"
                            className="w-full px-2 py-1.5 border rounded text-sm text-center bg-background text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                            value={pos.slots || 1} // Ensure fallback
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              handlePositionChange(
                                idx,
                                "slots",
                                parseInt(value) || 1
                              );
                            }}
                          />
                        </div>

                        <div className="col-span-1 flex justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePositionRow(idx)}
                            className="text-muted-foreground hover:text-red-500 dark:hover:text-red-400 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-muted border-t flex justify-end gap-3 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
