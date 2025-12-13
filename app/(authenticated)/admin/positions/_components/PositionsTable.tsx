"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch"; // Ensure you have this component
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { PositionTemplate } from "@/types/types";
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface PositionsTableProps {
  data: PositionTemplate[];
  onEdit: (template: PositionTemplate) => void;
  refreshData: () => void;
  // Add the new prop type
  onToggleStatus: (id: string, currentStatus: string) => void;
}

export default function PositionsTable({
  data,
  onEdit,
  refreshData,
  onToggleStatus, // Destructure it here
}: PositionsTableProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("position_templates")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete template");
    } else {
      toast.success("Template deleted");
      refreshData();
    }
  };

  const getCategoryStyle = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case "student government":
        return "bg-transparent text-green-700 dark:text-green-400 border-green-700 dark:border-green-400";
      case "academic":
        return "bg-transparent text-emerald-700 dark:text-emerald-400 border-emerald-700 dark:border-emerald-400";
      default:
        return "bg-transparent text-muted-foreground border-border";
    }
  };

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead className="w-[300px] font-medium text-foreground">
              Template Name
            </TableHead>
            <TableHead className="font-medium text-foreground">
              Category
            </TableHead>
            <TableHead className="font-medium text-foreground">
              Positions
            </TableHead>
            <TableHead className="font-medium text-foreground">
              Status
            </TableHead>
            <TableHead className="font-medium text-foreground">
              Last Modified
            </TableHead>
            <TableHead className="text-right font-medium text-foreground">
              Act
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                No templates found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            data.map((template) => (
              <TableRow
                key={template.id}
                className="border-b hover:bg-accent transition-colors"
              >
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-sm">
                      {template.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                      {template.description || "No description provided"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={`rounded-md font-medium px-2.5 py-0.5 ${getCategoryStyle(
                      template.category
                    )}`}
                  >
                    {template.category || "General"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={16} className="text-muted-foreground" />
                    <span>
                      {template.template_definitions?.length || 0} positions
                    </span>
                  </div>
                </TableCell>

                {/* --- UPDATE: Status Switch --- */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      // Checked if status is active (handles null case safely)
                      checked={template.status === "active"}
                      // Call the function when clicked
                      onCheckedChange={() =>
                        onToggleStatus(
                          template.id,
                          template.status || "inactive"
                        )
                      }
                      className="data-[state=checked]:bg-green-700 scale-90"
                    />
                    <span className="text-sm text-foreground">
                      {template.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  {template.updated_at
                    ? format(new Date(template.updated_at), "yyyy-MM-dd")
                    : format(new Date(template.created_at), "yyyy-MM-dd")}
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(template)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(template.id)}
                        className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
