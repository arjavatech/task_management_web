import { useState, useEffect } from 'react'

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionIssue, setConnectionIssue] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setConnectionIssue(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setConnectionIssue(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check connection periodically
    const checkConnection = () => {
      if (!navigator.onLine) {
        setConnectionIssue(true)
      }
    }

    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  return { isOnline, connectionIssue }
}