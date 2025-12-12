"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { PositionTemplate } from "@/types/types";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PositionsTable from "./_components/PositionsTable";
import ManageTemplateModal from "./_components/ManageTemplateModal";
import { toast } from "sonner"; // Import toast for feedback

export default function PositionsPage() {
  const [templates, setTemplates] = useState<PositionTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<PositionTemplate | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("position_templates")
      .select("*, template_definitions(*)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTemplates(data);
    }
    setIsLoading(false);
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (template: PositionTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  // --- NEW FUNCTION: Handle Status Toggle ---
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    // 1. Optimistic Update (Update UI immediately)
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    // 2. Update Supabase
    const { error } = await supabase
      .from("position_templates")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      fetchTemplates(); // Revert on error
    } else {
      toast.success(`Template marked as ${newStatus}`);
    }
  };

  // Stats Logic
  const totalTemplates = templates.length;
  // strict check for 'active'
  const activeTemplates = templates.filter((t) => t.status === "active").length;
  const totalPositions = templates.reduce(
    (acc, curr) => acc + (curr.template_definitions?.length || 0),
    0
  );

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Position Templates
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage reusable position templates for elections
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-green-700 hover:bg-green-800 text-white shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Templates" value={totalTemplates} />
        <StatCard title="Active Templates" value={activeTemplates} />
        <StatCard title="Total Positions" value={totalPositions} />
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">
            All Position Templates
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your position templates and their configurations
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <PositionsTable
              data={templates}
              onEdit={handleEdit}
              refreshData={fetchTemplates}
              // Pass the new function down
              onToggleStatus={handleToggleStatus}
            />
          )}
        </CardContent>
      </Card>

      <ManageTemplateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchTemplates();
        }}
        templateToEdit={editingTemplate}
      />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  );
}
