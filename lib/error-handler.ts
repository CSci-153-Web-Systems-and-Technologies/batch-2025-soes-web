/**
 * Custom Error Classes and Error Handling Utilities
 * Provides structured error handling throughout the application
 */

/**
 * Base application error class
 * Extends the native Error class with additional context
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}

/**
 * Authentication/Authorization errors
 */
export class AuthError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "AUTH_ERROR", 401, context);
    this.name = "AuthError";
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>,
    context?: Record<string, unknown>
  ) {
    super(message, "VALIDATION_ERROR", 400, context);
    this.name = "ValidationError";
  }
}

/**
 * Not found errors
 */
export class NotFoundError extends AppError {
  constructor(resource: string, context?: Record<string, unknown>) {
    super(`${resource} not found`, "NOT_FOUND", 404, context);
    this.name = "NotFoundError";
  }
}

/**
 * Network/API errors
 */
export class NetworkError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "NETWORK_ERROR", 503, context);
    this.name = "NetworkError";
  }
}

/**
 * Database errors
 */
export class DatabaseError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "DATABASE_ERROR", 500, context);
    this.name = "DatabaseError";
  }
}

/**
 * Type guard to check if an error is an AppError instance
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard for ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard for AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Extract a user-friendly error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

/**
 * Log error with context (can be extended to send to monitoring service)
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  if (isAppError(error)) {
    console.error(`[${error.code}] ${error.message}`, {
      statusCode: error.statusCode,
      context: error.context,
      additionalContext: context,
    });
  } else if (error instanceof Error) {
    console.error(error.message, {
      name: error.name,
      stack: error.stack,
      context,
    });
  } else {
    console.error("Unknown error:", error, context);
  }

  // TODO: Send to monitoring service (e.g., Sentry)
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: context });
  // }
}

/**
 * Handle errors in async functions with proper typing
 */
export async function handleAsyncError<T>(
  promise: Promise<T>,
  errorMessage?: string
): Promise<[T | null, AppError | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const appError = isAppError(error)
      ? error
      : new AppError(
          errorMessage || getErrorMessage(error),
          "ASYNC_ERROR",
          500
        );

    logError(appError);
    return [null, appError];
  }
}

/**
 * Create a standardized error response for API routes
 */
export function createErrorResponse(error: unknown, fallbackMessage?: string) {
  if (isAppError(error)) {
    return {
      error: true,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  return {
    error: true,
    message: fallbackMessage || getErrorMessage(error),
    code: "UNKNOWN_ERROR",
    statusCode: 500,
  };
}

/**
 * Wrapper for server actions with automatic error handling
 */
export async function withErrorHandling<T = void>(
  action: () => Promise<T>
): Promise<{ data?: T; error?: string; success?: boolean }> {
  try {
    const data = await action();
    return { data, success: true };
  } catch (error) {
    const message = getErrorMessage(error);
    logError(error);
    return { error: message, success: false };
  }
}

/**
 * Retry logic for failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayMs * attempt)
        );
      }
    }
  }

  throw new AppError(
    `Operation failed after ${maxRetries} attempts: ${getErrorMessage(lastError)}`,
    "RETRY_EXHAUSTED",
    500,
    { attempts: maxRetries, lastError }
  );
}
