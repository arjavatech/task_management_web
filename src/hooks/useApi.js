/**
 * useApi — generic async-operation state machine.
 *
 * Centralises the loading / error lifecycle that every CRUD operation needs,
 * so individual hooks (useCompanies, useTasks, useTemplates) don't repeat it.
 *
 * Usage:
 *   const { loading, error, execute } = useApi()
 *   execute(
 *     () => someAsyncCall(),          // the API call to run
 *     (result) => handleSuccess(),    // called when result.success === true
 *     (errorMsg) => handleError()     // called when result.success === false or throws
 *   )
 */
import { useState, useCallback } from "react"

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Run an async API call with automatic loading and error state management.
   *
   * @param {() => Promise<{success: boolean, error?: string}>} apiCall - The async function to invoke.
   * @param {(result: object) => void} [onSuccess] - Called when apiCall resolves with success === true.
   * @param {(errorMsg: string) => void} [onError]  - Called when apiCall fails or returns success === false.
   * @returns {Promise<object>} The raw result from apiCall.
   */
  const execute = useCallback(async (apiCall, onSuccess, onError) => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiCall()

      if (result.success) {
        onSuccess?.(result)
        return result
      } else {
        const errorMsg = result.error || "Operation failed"
        setError(errorMsg)
        onError?.(errorMsg)
        return result
      }
    } catch (err) {
      const errorMsg = err.message || "An unexpected error occurred"
      setError(errorMsg)
      onError?.(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, execute, setError }
}
