/**
 * Validation Schemas using Zod
 * Provides runtime type validation for forms and API inputs
 */

import { z } from "zod";
import { VALIDATION_RULES, ELECTION_STATUS } from "./constants";

/**
 * Election Schemas
 */
export const ElectionSchema = z
  .object({
    title: z
      .string()
      .min(
        VALIDATION_RULES.ELECTION_TITLE.MIN_LENGTH,
        `Title must be at least ${VALIDATION_RULES.ELECTION_TITLE.MIN_LENGTH} characters`
      )
      .max(
        VALIDATION_RULES.ELECTION_TITLE.MAX_LENGTH,
        `Title must not exceed ${VALIDATION_RULES.ELECTION_TITLE.MAX_LENGTH} characters`
      ),
    description: z
      .string()
      .max(
        VALIDATION_RULES.ELECTION_DESCRIPTION.MAX_LENGTH,
        `Description must not exceed ${VALIDATION_RULES.ELECTION_DESCRIPTION.MAX_LENGTH} characters`
      )
      .optional(),
    start_date: z.string().datetime("Invalid start date format"),
    end_date: z.string().datetime("Invalid end date format"),
    status: z.enum([
      ELECTION_STATUS.DRAFT,
      ELECTION_STATUS.ACTIVE,
      ELECTION_STATUS.ENDED,
    ] as const),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  });

export const CreateElectionSchema = ElectionSchema.omit({ status: true });
export const UpdateElectionSchema = ElectionSchema.partial();

export type ElectionInput = z.infer<typeof ElectionSchema>;
export type CreateElectionInput = z.infer<typeof CreateElectionSchema>;
export type UpdateElectionInput = z.infer<typeof UpdateElectionSchema>;

/**
 * Candidate Schemas
 */
export const CandidateSchema = z.object({
  name: z
    .string()
    .min(
      VALIDATION_RULES.CANDIDATE_NAME.MIN_LENGTH,
      `Name must be at least ${VALIDATION_RULES.CANDIDATE_NAME.MIN_LENGTH} characters`
    )
    .max(
      VALIDATION_RULES.CANDIDATE_NAME.MAX_LENGTH,
      `Name must not exceed ${VALIDATION_RULES.CANDIDATE_NAME.MAX_LENGTH} characters`
    ),
  position_id: z.string().uuid("Invalid position ID"),
  election_id: z.string().uuid("Invalid election ID"),
  partylist: z.string().optional(),
  photo_url: z.string().url("Invalid photo URL").optional(),
});

export const CreateCandidateSchema = CandidateSchema;
export const UpdateCandidateSchema = CandidateSchema.partial();

export type CandidateInput = z.infer<typeof CandidateSchema>;
export type CreateCandidateInput = z.infer<typeof CreateCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof UpdateCandidateSchema>;

/**
 * Position Schemas
 */
export const PositionSchema = z.object({
  name: z
    .string()
    .min(
      VALIDATION_RULES.POSITION_NAME.MIN_LENGTH,
      `Position name must be at least ${VALIDATION_RULES.POSITION_NAME.MIN_LENGTH} characters`
    )
    .max(
      VALIDATION_RULES.POSITION_NAME.MAX_LENGTH,
      `Position name must not exceed ${VALIDATION_RULES.POSITION_NAME.MAX_LENGTH} characters`
    ),
  election_id: z.string().uuid("Invalid election ID"),
  order: z.number().int().positive("Order must be a positive integer"),
});

export const CreatePositionSchema = PositionSchema.omit({ order: true });
export const UpdatePositionSchema = PositionSchema.partial();

export type PositionInput = z.infer<typeof PositionSchema>;
export type CreatePositionInput = z.infer<typeof CreatePositionSchema>;
export type UpdatePositionInput = z.infer<typeof UpdatePositionSchema>;

/**
 * Voter Schemas
 */
export const VoterSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(
      VALIDATION_RULES.EMAIL.MIN_LENGTH,
      `Email must be at least ${VALIDATION_RULES.EMAIL.MIN_LENGTH} characters`
    )
    .max(
      VALIDATION_RULES.EMAIL.MAX_LENGTH,
      `Email must not exceed ${VALIDATION_RULES.EMAIL.MAX_LENGTH} characters`
    ),
  election_id: z.string().uuid("Invalid election ID"),
  name: z.string().optional(),
});

export const CreateVoterSchema = VoterSchema;
export const BulkCreateVotersSchema = z.object({
  election_id: z.string().uuid("Invalid election ID"),
  voters: z.array(
    z.object({
      email: z.string().email("Invalid email address"),
      name: z.string().optional(),
    })
  ),
});

export type VoterInput = z.infer<typeof VoterSchema>;
export type CreateVoterInput = z.infer<typeof CreateVoterSchema>;
export type BulkCreateVotersInput = z.infer<typeof BulkCreateVotersSchema>;

/**
 * Vote Schemas
 */
export const VoteSchema = z.object({
  election_id: z.string().uuid("Invalid election ID"),
  candidate_id: z.string().uuid("Invalid candidate ID"),
  position_id: z.string().uuid("Invalid position ID"),
  voter_email: z.string().email("Invalid voter email"),
});

export const BulkVoteSchema = z.object({
  election_id: z.string().uuid("Invalid election ID"),
  votes: z.array(
    z.object({
      candidate_id: z.string().uuid("Invalid candidate ID"),
      position_id: z.string().uuid("Invalid position ID"),
    })
  ),
  voter_email: z.string().email("Invalid voter email"),
});

export type VoteInput = z.infer<typeof VoteSchema>;
export type BulkVoteInput = z.infer<typeof BulkVoteSchema>;

/**
 * Authentication Schemas
 */
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(
      VALIDATION_RULES.PASSWORD.MIN_LENGTH,
      `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`
    ),
});

export const SignUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(
        VALIDATION_RULES.PASSWORD.MIN_LENGTH,
        `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`
      )
      .max(
        VALIDATION_RULES.PASSWORD.MAX_LENGTH,
        `Password must not exceed ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`
      ),
    confirmPassword: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        VALIDATION_RULES.PASSWORD.MIN_LENGTH,
        `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`
      )
      .max(
        VALIDATION_RULES.PASSWORD.MAX_LENGTH,
        `Password must not exceed ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const OTPSchema = z.object({
  otp: z
    .string()
    .length(
      VALIDATION_RULES.OTP.LENGTH,
      `OTP must be ${VALIDATION_RULES.OTP.LENGTH} digits`
    )
    .regex(/^\d+$/, "OTP must contain only numbers"),
  email: z.string().email("Invalid email address"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type OTPInput = z.infer<typeof OTPSchema>;

/**
 * Helper function to validate data and return formatted errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const flattened = result.error.flatten();
  const errors: Record<string, string> = {};
  
  Object.entries(flattened.fieldErrors).forEach(([field, messages]) => {
    if (Array.isArray(messages) && messages.length > 0) {
      errors[field] = messages[0];
    }
  });

  return { success: false, errors };
}

/**
 * Helper to extract first error message from Zod error
 */
export function getFirstErrorMessage(error: z.ZodError<unknown>): string {
  const flattened = error.flatten();
  const fieldErrors = Object.values(flattened.fieldErrors);
  const firstError = fieldErrors[0];
  return (Array.isArray(firstError) && firstError[0]) || "Validation failed";
}
