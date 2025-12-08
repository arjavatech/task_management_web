import { useState, useCallback } from 'react'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (apiCall, onSuccess, onError) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      
      if (result.success) {
        onSuccess?.(result)
        return result
      } else {
        const errorMsg = result.error || 'Operation failed'
        setError(errorMsg)
        onError?.(errorMsg)
        return result
      }
    } catch (err) {
      const errorMsg = err.message || 'An unexpected error occurred'
      setError(errorMsg)
      onError?.(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, execute, setError }
}