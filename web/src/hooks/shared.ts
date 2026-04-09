/**
 * Shared async state helpers used by data-fetching hooks.
 *
 * The utilities in this file standardize how hooks represent request lifecycle:
 * initial loading, successful resolution, and failure with a user-facing message.
 */
export interface AsyncState<T> {
  /** Resolved payload, or `null` before success or after a failure. */
  data: T | null
  /** Indicates whether the async operation is currently in progress. */
  loading: boolean
  /** Human-readable error message for display in the UI. */
  error: string | null
}

/** Internal actions used by `asyncStateReducer` to model request transitions. */
type AsyncAction<T> =
  | { type: 'start' }
  | { type: 'success'; data: T }
  | { type: 'failure'; error: string }

/**
 * Creates the default async state for a hook before data has been loaded.
 *
 * Hooks typically use this as the initial value for `useReducer`.
 */
export function createAsyncState<T>(): AsyncState<T> {
  return {
    data: null,
    loading: true,
    error: null,
  }
}

/**
 * Reducer that updates async state in response to request lifecycle events.
 *
 * - `start` keeps existing data but clears any previous error and marks loading
 * - `success` stores the resolved data and ends loading
 * - `failure` clears data, stores the error message, and ends loading
 */
export function asyncStateReducer<T>(
  state: AsyncState<T>,
  action: AsyncAction<T>,
): AsyncState<T> {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'success':
      return {
        data: action.data,
        loading: false,
        error: null,
      }
    case 'failure':
      return {
        data: null,
        loading: false,
        error: action.error,
      }
  }
}

/**
 * Extracts a safe error message from an unknown thrown value.
 *
 * Returns the original `Error.message` when available; otherwise falls back to
 * the provided default text.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}
