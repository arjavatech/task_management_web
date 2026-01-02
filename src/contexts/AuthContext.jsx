import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { getUserProfile, createUserProfile, updateUserProfile as updateUserProfileService } from '../services/firebaseService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser)

      if (authUser) {
        // Store token in localStorage
        const token = await authUser.getIdToken()
        localStorage.setItem('authToken', token)
        
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
      } else {
        setUserProfile(null)
        localStorage.removeItem('authToken')
      }

      setLoading(false)
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
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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