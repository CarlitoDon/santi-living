/**
 * Retry Utility with Exponential Backoff
 *
 * Retries an async function on transient failures.
 * Skips retry for permanent errors (e.g., invalid phone number).
 */

interface RetryOptions {
  /** Max number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay in ms before first retry (default: 2000) */
  baseDelayMs?: number;
  /** Maximum delay cap in ms (default: 15000) */
  maxDelayMs?: number;
  /** Label for logging (default: 'Operation') */
  label?: string;
  /**
   * Return true if the error is permanent and should NOT be retried.
   * Examples: invalid phone number, validation error, 400 Bad Request.
   */
  isPermanentError?: (error: unknown) => boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry an async function with exponential backoff.
 *
 * @example
 * ```ts
 * await retryWithBackoff(
 *   () => botClient.bot.sendOrder.mutate(payload),
 *   {
 *     label: 'sendOrder',
 *     maxRetries: 3,
 *     isPermanentError: (err) => isInvalidPhoneError(err),
 *   }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 2000,
    maxDelayMs = 15000,
    label = "Operation",
    isPermanentError,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry permanent errors
      if (isPermanentError?.(error)) {
        console.error(
          `[Retry] ${label}: Permanent error on attempt ${attempt}, NOT retrying.`,
          error instanceof Error ? error.message : error,
        );
        throw error;
      }

      // If this was the last attempt, give up
      if (attempt > maxRetries) {
        console.error(
          `[Retry] ${label}: All ${maxRetries + 1} attempts failed. Giving up.`,
          error instanceof Error ? error.message : error,
        );
        throw error;
      }

      // Calculate delay with exponential backoff + jitter
      const exponentialDelay = baseDelayMs * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 500;
      const delay = Math.min(exponentialDelay + jitter, maxDelayMs);

      console.warn(
        `[Retry] ${label}: Attempt ${attempt}/${maxRetries + 1} failed. ` +
          `Retrying in ${Math.round(delay)}ms... ` +
          `Error: ${error instanceof Error ? error.message : String(error)}`,
      );

      await sleep(delay);
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError;
}
