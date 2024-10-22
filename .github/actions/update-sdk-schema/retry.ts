import { circuitBreaker, ConsecutiveBreaker, ExponentialBackoff, handleAll, retry, wrap } from 'cockatiel'

/**
 * Utility function to wrap a function with retry logic.
 *
 * The function will be retried up to 5 times with an exponential backoff if it throws an error.
 * If the function fails 5 times in a row, it will be stopped for 10 seconds using a circuit breaker.
 *
 * @param fn - the function to execute
 */
export function withRetry<T>(fn: () => Promise<T>) {
  const policy = wrap(
    retry(handleAll, { maxAttempts: 5, backoff: new ExponentialBackoff() }),
    // stop calling the executed function for 10 seconds if it fails 5 times in a row
    circuitBreaker(handleAll, {
      halfOpenAfter: 10 * 1000,
      breaker: new ConsecutiveBreaker(5),
    })
  )

  return policy.execute(async ({ attempt }) => {
    if (attempt > 1) {
      console.info(`Retrying attempt: ${attempt}`)
    }

    try {
      return await fn()
    } catch (e) {
      console.error(`Attempt ${attempt} failed:`, e)

      throw e
    }
  })
}
