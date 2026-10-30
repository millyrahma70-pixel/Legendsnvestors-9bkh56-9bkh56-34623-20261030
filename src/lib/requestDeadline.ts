export class RequestTimeoutError extends Error {
  constructor() {
    super('Cloud is taking too long to respond. Check your connection and retry.');
    this.name = 'RequestTimeoutError';
  }
}

// Covers initialization, session lookup, transport, and response parsing, not just fetch headers.
export async function withRequestDeadline<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  milliseconds: number,
  externalSignal?: AbortSignal,
): Promise<T> {
  if (externalSignal?.aborted) throw externalSignal.reason;
  const controller = new AbortController();
  let rejectAbort: (reason: unknown) => void = () => {};
  const aborted = new Promise<never>((_resolve, reject) => { rejectAbort = reject; });
  const onAbort = () => rejectAbort(controller.signal.reason);
  const onCancel = () => controller.abort(externalSignal?.reason);
  controller.signal.addEventListener('abort', onAbort, { once: true });
  externalSignal?.addEventListener('abort', onCancel, { once: true });
  const timer = setTimeout(() => controller.abort(new RequestTimeoutError()), milliseconds);
  try {
    return await Promise.race([operation(controller.signal), aborted]);
  } finally {
    clearTimeout(timer);
    controller.signal.removeEventListener('abort', onAbort);
    externalSignal?.removeEventListener('abort', onCancel);
  }
}
