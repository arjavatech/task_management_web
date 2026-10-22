/**
 * Firebase SDK initialisation and re-exported service instances.
 *
 * All components that need Firestore or Auth should import from here,
 * not call initializeApp() again. Firebase is initialised once per app load.
 *
 * Environment variables (set in .env):
 *   VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
 *   VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID
 */
import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

// ── Service singletons ─────────────────────────────────────────────────────
/** Firebase Auth instance — used for sign-in, sign-up, and token refresh. */
export const auth = getAuth(app)

/** Firestore database instance — used for all document reads and writes. */
export const db = getFirestore(app)

// ── Auth helpers ───────────────────────────────────────────────────────────

/**
 * Sign in with email and password.
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Create a new Firebase Auth account and optionally set the display name.
 * @param {string} name - Optional display name for the new user.
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export const registerUser = async (email, password, name = "") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    if (name) {
      await updateProfile(userCredential.user, { displayName: name })
    }
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Sign the current user out of Firebase Auth.
 * @returns {{ success: boolean, error?: string }}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ── Generic Firestore helpers ──────────────────────────────────────────────
// These are low-level wrappers. For domain-specific CRUD prefer firebaseService.js.

/**
 * Add a new document to a collection (auto-generated ID).
 * @param {string} collectionPath - Firestore collection path.
 * @param {object} data - Document data.
 * @returns {{ success: boolean, id?: string, error?: string }}
 */
export const createDocument = async (collectionPath, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionPath), data)
    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Query all documents in a collection with optional filter conditions.
 * @param {string} collectionPath - Firestore collection path.
 * @param {Array} conditions - Optional array of Firestore query constraints.
 * @returns {{ success: boolean, data?: object[], error?: string }}
 */
export const getDocuments = async (collectionPath, conditions = []) => {
  try {
    let q = collection(db, collectionPath)

    if (conditions.length > 0) {
      q = query(q, ...conditions)
    }

    const querySnapshot = await getDocs(q)
    const documents = []
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: documents }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Fetch a single document by ID.
 * @param {string} collectionPath - Firestore collection path.
 * @param {string} docId - Document ID.
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export const getDocument = async (collectionPath, docId) => {
  try {
    const docRef = doc(db, collectionPath, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } }
    } else {
      return { success: false, error: "Document not found" }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Merge-update an existing document (partial update).
 * @param {string} collectionPath - Firestore collection path.
 * @param {string} docId - Document ID.
 * @param {object} data - Fields to update.
 * @returns {{ success: boolean, error?: string }}
 */
export const updateDocument = async (collectionPath, docId, data) => {
  try {
    const docRef = doc(db, collectionPath, docId)
    await updateDoc(docRef, data)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Delete a document by ID.
 * @param {string} collectionPath - Firestore collection path.
 * @param {string} docId - Document ID.
 * @returns {{ success: boolean, error?: string }}
 */
export const deleteDocument = async (collectionPath, docId) => {
  try {
    const docRef = doc(db, collectionPath, docId)
    await deleteDoc(docRef)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default app
