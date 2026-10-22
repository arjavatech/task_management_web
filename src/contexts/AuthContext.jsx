/**
 * AuthContext — global authentication and user-profile state.
 *
 * Wrap the app root with <AuthProvider> once. Every component that needs the
 * current user calls useAuth() to get:
 *   - user         Firebase Auth user object (null when logged out)
 *   - userProfile  Firestore user document  (null when logged out)
 *   - loading      True while the initial auth state is being resolved
 *   - updateUserProfile  Update Firestore profile and refresh local state
 */
import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "../firebase/config"
import { onAuthStateChanged } from "firebase/auth"
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile as updateUserProfileService,
} from "../services/firebaseService"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Firebase Auth user (email, uid, displayName, etc.)
  const [user, setUser] = useState(null)

  // Extended profile stored in Firestore users/{uid}
  const [userProfile, setUserProfile] = useState(null)

  // True until onAuthStateChanged fires for the first time
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChanged fires once on mount with the current session,
    // then again on every sign-in / sign-out. Return the unsubscribe
    // function so the listener is cleaned up when the provider unmounts.
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser)

      if (authUser) {
        // Try to load an existing Firestore profile for this UID
        const profileResult = await getUserProfile(authUser.uid)

        if (profileResult.success) {
          setUserProfile(profileResult.data)
        } else {
          // First sign-in — bootstrap the Firestore profile document
          await createUserProfile(authUser.uid, authUser.email, authUser.displayName || "")
          const newProfileResult = await getUserProfile(authUser.uid)
          if (newProfileResult.success) {
            setUserProfile(newProfileResult.data)
          }
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  /**
   * Persist profile changes to Firestore and refresh the in-memory copy.
   * @param {object} profileData - Partial profile fields to update.
   * @returns {{ success: boolean, error?: string }}
   */
  const updateUserProfile = async (profileData) => {
    if (!user) return { success: false, error: "No authenticated user" }

    const result = await updateUserProfileService(user.uid, profileData)

    if (result.success) {
      // Re-fetch to keep local state in sync with Firestore
      const profileResult = await getUserProfile(user.uid)
      if (profileResult.success) {
        setUserProfile(profileResult.data)
      }
    }

    return result
  }

  const value = { user, userProfile, loading, updateUserProfile }

  // Hold rendering until we know whether the user is logged in or not
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to consume AuthContext.
 * Must be called inside a component tree wrapped by <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
