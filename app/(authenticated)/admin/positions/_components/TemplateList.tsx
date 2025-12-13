"use client";

import { useState } from "react";
import { PositionTemplate } from "@/types/types";
import { Edit, FileText, ChevronDown, ChevronRight, Users } from "lucide-react";
import ManageTemplateModal from "./ManageTemplateModal";
import DeleteTemplateDialog from "./DeleteTemplateDialog";

export default function TemplateList({
  templates,
}: {
  templates: PositionTemplate[];
}) {
  const [editingTemplate, setEditingTemplate] =
    useState<PositionTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Track which rows are expanded
  const [expandedTemplateIds, setExpandedTemplateIds] = useState<string[]>([]);

  const handleCreate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (template: PositionTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const toggleRow = (id: string) => {
    if (expandedTemplateIds.includes(id)) {
      setExpandedTemplateIds(expandedTemplateIds.filter((tid) => tid !== id));
    } else {
      setExpandedTemplateIds([...expandedTemplateIds, id]);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FileText size={16} />
          Create New Template
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-background">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="w-12 px-6 py-3"></th>
                  <th className="px-6 py-3">Template Name</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Positions</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {templates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No templates found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  templates.map((template) => {
                    const isExpanded = expandedTemplateIds.includes(
                      template.id
                    );
                    // Safe access to definitions in case it's undefined
                    const definitions = template.template_definitions || [];

                    return (
                      <div key={template.id} style={{ display: "contents" }}>
                        {/* Main Row */}
                        <tr
                          className={`hover:bg-muted/50 transition-colors ${
                            isExpanded ? "bg-muted/50" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleRow(template.id)}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition"
                            >
                              {isExpanded ? (
                                <ChevronDown size={18} />
                              ) : (
                                <ChevronRight size={18} />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {template.name}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {template.description || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {definitions.length} positions
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(template)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <DeleteTemplateDialog
                              templateId={template.id.toString()}
                            />
                          </td>
                        </tr>

                        {/* EXPANDED ROW: The View Positions Logic */}
                        {isExpanded && (
                          <tr className="bg-gray-50/50">
                            <td
                              colSpan={5}
                              className="px-6 py-4 border-t border-gray-100 shadow-inner"
                            >
                              <div className="ml-8 max-w-2xl bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-500 border-b border-gray-200 flex justify-between">
                                  <span>POSITION STRUCTURE</span>
                                  <span>CAPACITY</span>
                                </div>

                                <div className="divide-y divide-gray-100">
                                  {/* FIX: Use correct DB field names (order, name, vote_limit) */}
                                  {definitions
                                    .sort((a, b) => a.order - b.order)
                                    .map((pos) => (
                                      <div key={pos.id}>
                                        {/* The Position Title Row */}
                                        <div className="flex items-center justify-between px-4 py-3">
                                          <div className="flex items-center gap-3">
                                            <div className="w-6 text-center text-xs font-mono text-gray-400">
                                              #{pos.order}
                                            </div>
                                            <span className="font-medium text-gray-700">
                                              {pos.name}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {pos.vote_limit > 1 && (
                                              <Users
                                                size={14}
                                                className="text-blue-500"
                                              />
                                            )}
                                            <span
                                              className={`text-xs px-2 py-1 rounded font-medium ${
                                                pos.vote_limit > 1
                                                  ? "bg-blue-100 text-blue-700"
                                                  : "bg-gray-100 text-gray-500"
                                              }`}
                                            >
                                              {pos.vote_limit}{" "}
                                              {pos.vote_limit === 1
                                                ? "Seat"
                                                : "Seats"}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Sub-row Logic */}
                                        {pos.vote_limit > 1 && (
                                          <div className="bg-gray-50 border-t border-gray-100">
                                            {Array.from({
                                              length: pos.vote_limit,
                                            }).map((_, index) => (
                                              <div
                                                key={index}
                                                className="flex items-center gap-3 py-2 px-4 pl-14 text-sm border-b border-gray-100 last:border-0 text-gray-500"
                                              >
                                                <div className="text-gray-300">
                                                  └
                                                </div>
                                                <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-mono">
                                                  {index + 1}
                                                </div>
                                                <span className="text-xs">
                                                  Candidate Slot {index + 1} for{" "}
                                                  {pos.name}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </div>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ManageTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templateToEdit={editingTemplate}
      />
    </>
  );
}
