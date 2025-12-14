/**
 * Example: Improved Election Actions with Error Handling
 * This demonstrates best practices with error handling, validation, and logging
 */

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  AppError,
  DatabaseError,
  ValidationError,
  NotFoundError,
  logError,
  getErrorMessage,
} from "@/lib/error-handler";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ELECTION_STATUS,
} from "@/lib/constants";
import { CreateElectionSchema, UpdateElectionSchema } from "@/lib/schemas";

interface ActionResponse<T = unknown> {
  success?: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface TemplateDefinitionRow {
  title: string;
  rank: number;
  slots: number;
}

/**
 * Import positions from a template
 * Improved with validation and error handling
 */
export async function importPositionsFromTemplate(
  electionId: string,
  templateId: string
): Promise<ActionResponse<{ count: number }>> {
  try {
    const supabase = await createClient();

    // Validate input
    if (!electionId || !templateId) {
      const errors: Record<string, string> = {};
      if (!electionId) errors.electionId = "Election ID is required";
      if (!templateId) errors.templateId = "Template ID is required";
      throw new ValidationError(ERROR_MESSAGES.VALIDATION_FAILED, errors);
    }

    // Verify election exists
    const { data: election, error: electionError } = await supabase
      .from("election_sessions")
      .select("id, status")
      .eq("id", electionId)
      .single();

    if (electionError || !election) {
      throw new NotFoundError("Election", { electionId });
    }

    // Check if election can be modified
    if (election.status !== ELECTION_STATUS.DRAFT) {
      throw new AppError(
        ERROR_MESSAGES.ELECTION_ALREADY_STARTED,
        "ELECTION_LOCKED",
        400
      );
    }

    // Fetch template definitions
    const { data: definitions, error: fetchError } = await supabase
      .from("template_definitions")
      .select("title, rank, slots")
      .eq("template_id", templateId)
      .returns<TemplateDefinitionRow[]>();

    if (fetchError) {
      logError(fetchError, { templateId, action: "fetch_template" });
      throw new DatabaseError(ERROR_MESSAGES.GENERIC);
    }

    if (!definitions || definitions.length === 0) {
      throw new ValidationError("Selected template has no positions.", {
        templateId: "Template is empty",
      });
    }

    // Map to position structure
    const newPositions = definitions.map((def) => ({
      election_id: electionId,
      title: def.title,
      rank: def.rank,
      rules: {
        vote_limit: def.slots,
        allow_abstain: true,
      },
    }));

    // Insert positions
    const { error: insertError } = await supabase
      .from("positions")
      .insert(newPositions);

    if (insertError) {
      logError(insertError, { electionId, templateId, action: "insert_positions" });
      throw new DatabaseError("Failed to import positions from template");
    }

    revalidatePath(`/admin/elections/${electionId}`);

    return {
      success: true,
      message: `Successfully imported ${definitions.length} positions`,
      data: { count: definitions.length },
    };
  } catch (error) {
    logError(error);
    return {
      success: false,
      message: getErrorMessage(error),
      error: getErrorMessage(error),
    };
  }
}

/**
 * Create a new election
 * Improved with validation
 */
export async function createElection(formData: {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
}): Promise<ActionResponse<{ id: string }>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new AppError(ERROR_MESSAGES.AUTH_FAILED, "AUTH_ERROR", 401);
    }

    // Validate input with Zod
    const validationResult = CreateElectionSchema.safeParse(formData);

    if (!validationResult.success) {
      throw new ValidationError(
        ERROR_MESSAGES.VALIDATION_FAILED,
        validationResult.error.flatten().fieldErrors as Record<string, string>
      );
    }

    // Insert election
    const { data, error: insertError } = await supabase
      .from("election_sessions")
      .insert({
        ...validationResult.data,
        user_id: user.id,
        status: ELECTION_STATUS.DRAFT,
      })
      .select("id")
      .single();

    if (insertError) {
      logError(insertError, { action: "create_election", userId: user.id });
      throw new DatabaseError(ERROR_MESSAGES.ELECTION_CREATE_FAILED);
    }

    revalidatePath("/admin/elections");

    return {
      success: true,
      message: SUCCESS_MESSAGES.ELECTION_CREATED,
      data: { id: data.id },
    };
  } catch (error) {
    logError(error);
    return {
      success: false,
      message: getErrorMessage(error),
      error: getErrorMessage(error),
    };
  }
}

/**
 * Update election
 * Improved with validation and status checks
 */
export async function updateElection(
  electionId: string,
  updates: Partial<{
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
  }>
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    // Validate election ID
    if (!electionId) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION_FAILED, {
        electionId: "Election ID is required",
      });
    }

    // Verify election exists and get current status
    const { data: election, error: fetchError } = await supabase
      .from("election_sessions")
      .select("id, status")
      .eq("id", electionId)
      .single();

    if (fetchError || !election) {
      throw new NotFoundError("Election", { electionId });
    }

    // Check if election can be modified (if updating non-status fields)
    const isStatusUpdate = Object.keys(updates).length === 1 && "status" in updates;
    if (!isStatusUpdate && election.status !== ELECTION_STATUS.DRAFT) {
      throw new AppError(
        ERROR_MESSAGES.ELECTION_ALREADY_STARTED,
        "ELECTION_LOCKED",
        400
      );
    }

    // Validate updates with Zod
    const validationResult = UpdateElectionSchema.safeParse(updates);

    if (!validationResult.success) {
      throw new ValidationError(
        ERROR_MESSAGES.VALIDATION_FAILED,
        validationResult.error.flatten().fieldErrors as Record<string, string>
      );
    }

    // Update election
    const { error: updateError } = await supabase
      .from("election_sessions")
      .update(validationResult.data)
      .eq("id", electionId);

    if (updateError) {
      logError(updateError, { action: "update_election", electionId });
      throw new DatabaseError(ERROR_MESSAGES.ELECTION_UPDATE_FAILED);
    }

    revalidatePath(`/admin/elections/${electionId}`);
    revalidatePath("/admin/elections");

    return {
      success: true,
      message: SUCCESS_MESSAGES.ELECTION_UPDATED,
    };
  } catch (error) {
    logError(error);
    return {
      success: false,
      message: getErrorMessage(error),
      error: getErrorMessage(error),
    };
  }
}

/**
 * Delete election
 * Improved with proper checks
 */
export async function deleteElection(
  electionId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    if (!electionId) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION_FAILED, {
        electionId: "Election ID is required",
      });
    }

    // Verify election exists
    const { data: election, error: fetchError } = await supabase
      .from("election_sessions")
      .select("id, status")
      .eq("id", electionId)
      .single();

    if (fetchError || !election) {
      throw new NotFoundError("Election", { electionId });
    }

    // Don't allow deletion of active elections
    if (election.status === ELECTION_STATUS.ACTIVE) {
      throw new AppError(
        "Cannot delete an active election",
        "ELECTION_ACTIVE",
        400
      );
    }

    // Delete election (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from("election_sessions")
      .delete()
      .eq("id", electionId);

    if (deleteError) {
      logError(deleteError, { action: "delete_election", electionId });
      throw new DatabaseError(ERROR_MESSAGES.ELECTION_DELETE_FAILED);
    }

    revalidatePath("/admin/elections");

    return {
      success: true,
      message: SUCCESS_MESSAGES.ELECTION_DELETED,
    };
  } catch (error) {
    logError(error);
    return {
      success: false,
      message: getErrorMessage(error),
      error: getErrorMessage(error),
    };
  }
}

/**
 * Publish election (change status from draft to active)
 */
export async function publishElection(
  electionId: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    // Verify election is ready to publish
    const { data: election, error: fetchError } = await supabase
      .from("election_sessions")
      .select(`
        id,
        status,
        positions (
          id,
          candidates (id)
        )
      `)
      .eq("id", electionId)
      .single();

    if (fetchError || !election) {
      throw new NotFoundError("Election", { electionId });
    }

    if (election.status !== ELECTION_STATUS.DRAFT) {
      throw new AppError(
        "Election is already published or ended",
        "INVALID_STATUS",
        400
      );
    }

    // Check if there are positions and candidates
    const positions = election.positions as Array<{
      id: string;
      candidates: Array<{ id: string }>;
    }>;

    if (!positions || positions.length === 0) {
      throw new ValidationError(
        "Cannot publish election without positions",
        { positions: "At least one position is required" }
      );
    }

    const hasNoCandidates = positions.every(
      (p) => !p.candidates || p.candidates.length === 0
    );

    if (hasNoCandidates) {
      throw new ValidationError(
        "Cannot publish election without candidates",
        { candidates: "At least one candidate is required" }
      );
    }

    // Update status to active
    const { error: updateError } = await supabase
      .from("election_sessions")
      .update({ status: ELECTION_STATUS.ACTIVE })
      .eq("id", electionId);

    if (updateError) {
      logError(updateError, { action: "publish_election", electionId });
      throw new DatabaseError("Failed to publish election");
    }

    revalidatePath(`/admin/elections/${electionId}`);
    revalidatePath("/admin/elections");

    return {
      success: true,
      message: SUCCESS_MESSAGES.ELECTION_PUBLISHED,
    };
  } catch (error) {
    logError(error);
    return {
      success: false,
      message: getErrorMessage(error),
      error: getErrorMessage(error),
    };
  }
}
