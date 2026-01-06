// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence } from "firebase/auth"
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore"

// Firebase Configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Set session-only persistence to auto-logout when app is closed
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error)
})

// Auto-logout when window is closed
window.addEventListener('beforeunload', () => {
  signOut(auth).catch(() => {})
})

// Authentication functions
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Firestore helper functions
export const createDocument = async (collectionPath, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionPath), data)
    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getDocuments = async (collectionPath, conditions = []) => {
  try {
    let q = collection(db, collectionPath)

    // Add where clauses if conditions are provided
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

export const updateDocument = async (collectionPath, docId, data) => {
  try {
    const docRef = doc(db, collectionPath, docId)
    await updateDoc(docRef, data)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

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