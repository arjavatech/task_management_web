import { useState, useCallback } from 'react'
import { auth } from '../firebase/config'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (apiCall, onSuccess, onError) => {
    setLoading(true)
    setError(null)
    
    try {
      // Ensure fresh auth token for Firebase operations
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true)
      }
      
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
      // Handle auth-specific errors
      if (err.code === 'permission-denied' || err.code === 'unauthenticated') {
        const errorMsg = 'Authentication required. Please sign in again.'
        setError(errorMsg)
        onError?.(errorMsg)
        return { success: false, error: errorMsg }
      }
      
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