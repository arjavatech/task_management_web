import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { getUserProfile, createUserProfile, updateUserProfile as updateUserProfileService } from '../services/firebaseService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true)
      setUser(authUser)

      if (authUser) {
        try {
          // Ensure token is fresh
          await authUser.getIdToken(true)
          
          // Get or create user profile
          const profileResult = await getUserProfile(authUser.uid)

          if (profileResult.success) {
            setUserProfile(profileResult.data)
          } else {
            // Create profile if it doesn't exist
            await createUserProfile(authUser.uid, authUser.email, authUser.displayName || '')
            const newProfileResult = await getUserProfile(authUser.uid)
            if (newProfileResult.success) {
              setUserProfile(newProfileResult.data)
            }
          }
        } catch (error) {
          console.error('Auth setup error:', error)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
      setAuthReady(true)
    })

    return unsubscribe
  }, [])

  const updateUserProfile = async (profileData) => {
    if (!user) return { success: false, error: 'No authenticated user' }

    const result = await updateUserProfileService(user.uid, profileData)

    if (result.success) {
      // Refresh user profile
      const profileResult = await getUserProfile(user.uid)
      if (profileResult.success) {
        setUserProfile(profileResult.data)
      }
    }

    return result
  }

  const value = {
    user,
    userProfile,
    loading,
    authReady,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {authReady && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}