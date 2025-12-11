"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface ActionResponse {
  success: boolean;
  message: string;
}

// Define the exact shape of your DB row based on your screenshot
interface TemplateDefinitionRow {
  title: string;
  rank: number;
  slots: number;
}

export async function importPositionsFromTemplate(
  electionId: string,
  templateId: string
): Promise<ActionResponse> {
  const supabase = await createClient();

  // 1. Fetch definitions using YOUR ACTUAL COLUMN NAMES (title, rank, slots)
  const { data: definitions, error: fetchError } = await supabase
    .from("template_definitions")
    .select("title, rank, slots") 
    .eq("template_id", templateId)
    .returns<TemplateDefinitionRow[]>(); // Strict typing for the return

  if (fetchError || !definitions) {
    console.error("Fetch Error:", fetchError);
    return { success: false, message: "Failed to load template data" };
  }

  if (definitions.length === 0) {
    return { success: false, message: "Selected template has no positions." };
  }

  // 2. Map them to the live positions table structure
  const newPositions = definitions.map((def) => ({
    election_id: electionId,
    title: def.title,       // DB 'title' -> Positions 'title'
    rank: def.rank,         // DB 'rank' -> Positions 'rank'
    rules: { 
      vote_limit: def.slots, // DB 'slots' -> Rules JSON 'vote_limit'
      allow_abstain: true 
    },
  }));

  // 3. Insert into public.positions
  const { error: insertError } = await supabase
    .from("positions")
    .insert(newPositions);

  if (insertError) {
    console.error("Insert Error:", insertError);
    return { success: false, message: "Failed to import positions" };
  }

  revalidatePath(`/admin/elections/${electionId}/positions`);
  return { success: true, message: "Positions imported successfully" };
}