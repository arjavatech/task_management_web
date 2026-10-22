/**
 * firebaseService.js — domain-level Firestore operations.
 *
 * All reads and writes that involve the app's data model (users, companies,
 * tasks, templates) go through this file. Components should call these
 * functions rather than talking to Firestore directly.
 *
 * Firestore collection structure:
 *   users/{userId}
 *     companies/{companyId}
 *       tasks/{taskId}
 *     taskTemplates/{templateId}
 */
import { auth, db } from "../firebase/config"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

/** Return the currently signed-in Firebase Auth user, or null. */
const getCurrentUser = () => auth.currentUser

// ===== USER OPERATIONS =====

/**
 * Fetch a user's Firestore profile document.
 * @param {string} userId - Firebase Auth UID.
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } }
    } else {
      return { success: false, error: "User profile not found" }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Merge-update a user's Firestore profile (partial update).
 * Automatically sets updatedAt to the server timestamp.
 * @param {string} userId      - Firebase Auth UID.
 * @param {object} profileData - Fields to update.
 * @returns {{ success: boolean, error?: string }}
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, { ...profileData, updatedAt: serverTimestamp() })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Create a new user profile document on first sign-in.
 * Uses setDoc so the document ID matches the Firebase Auth UID.
 * @param {string} userId - Firebase Auth UID.
 * @param {string} email  - User's email address.
 * @param {string} name   - Optional display name.
 * @returns {{ success: boolean, error?: string }}
 */
export const createUserProfile = async (userId, email, name = "") => {
  try {
    const userRef = doc(db, "users", userId)
    await setDoc(userRef, {
      email,
      name,
      phone: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      companyCount: 0,
      taskCount: 0,
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== COMPANY OPERATIONS =====

/**
 * Fetch all companies for a user, ordered by creation date (newest first).
 * @param {string} userId - Firebase Auth UID.
 * @returns {{ success: boolean, data?: object[], error?: string }}
 */
export const getCompanies = async (userId) => {
  try {
    const companiesRef = collection(db, `users/${userId}/companies`)
    const q = query(companiesRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const companies = []
    querySnapshot.forEach((doc) => {
      companies.push({ id: doc.id, ...doc.data() })
    })

    return { success: true, data: companies }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Create a new company and increment the user's companyCount.
 * Also initialises taskStats counters for the company.
 * @param {string} userId      - Firebase Auth UID.
 * @param {object} companyData - Company fields (name, EIN, address, etc.).
 * @returns {{ success: boolean, id?: string, error?: string }}
 */
export const createCompany = async (userId, companyData) => {
  try {
    const companiesRef = collection(db, `users/${userId}/companies`)
    const docRef = await addDoc(companiesRef, {
      ...companyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      taskStats: { total: 0, completed: 0, inProgress: 0, pending: 0 },
    })

    // Keep the user's company counter in sync
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      const currentCount = userDoc.data().companyCount || 0
      await updateDoc(userRef, { companyCount: currentCount + 1 })
    }

    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Update company fields (partial merge). Sets updatedAt automatically.
 * @param {string} userId      - Firebase Auth UID.
 * @param {string} companyId   - Firestore document ID of the company.
 * @param {object} companyData - Fields to update.
 * @returns {{ success: boolean, error?: string }}
 */
export const updateCompany = async (userId, companyId, companyData) => {
  try {
    const companyRef = doc(db, `users/${userId}/companies`, companyId)
    await updateDoc(companyRef, { ...companyData, updatedAt: serverTimestamp() })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Delete a company and decrement the user's companyCount.
 * Note: Firestore does not automatically delete the company's task subcollection.
 * @param {string} userId    - Firebase Auth UID.
 * @param {string} companyId - Firestore document ID of the company.
 * @returns {{ success: boolean, error?: string }}
 */
export const deleteCompany = async (userId, companyId) => {
  try {
    const companyRef = doc(db, `users/${userId}/companies`, companyId)
    await deleteDoc(companyRef)

    // Decrement the user's company counter, flooring at 0
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      const currentCount = userDoc.data().companyCount || 0
      await updateDoc(userRef, { companyCount: Math.max(0, currentCount - 1) })
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== TASK OPERATIONS =====

/**
 * Fetch all tasks across every company for a user.
 * Iterates all companies sequentially to collect their task subcollections.
 * @param {string} userId - Firebase Auth UID.
 * @returns {{ success: boolean, data?: object[], error?: string }}
 */
export const getTasks = async (userId) => {
  try {
    const companiesRef = collection(db, `users/${userId}/companies`)
    const companiesSnapshot = await getDocs(companiesRef)

    let allTasks = []

    for (const companyDoc of companiesSnapshot.docs) {
      const tasksRef = collection(db, `users/${userId}/companies/${companyDoc.id}/tasks`)
      const tasksSnapshot = await getDocs(tasksRef)

      tasksSnapshot.forEach((taskDoc) => {
        allTasks.push({ id: taskDoc.id, companyId: companyDoc.id, ...taskDoc.data() })
      })
    }

    return { success: true, data: allTasks }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Fetch tasks for a single company, ordered by dueDate ascending.
 * @param {string} userId    - Firebase Auth UID.
 * @param {string} companyId - Firestore document ID of the company.
 * @returns {{ success: boolean, data?: object[], error?: string }}
 */
export const getTasksByCompany = async (userId, companyId) => {
  try {
    const tasksRef = collection(db, `users/${userId}/companies/${companyId}/tasks`)
    const q = query(tasksRef, orderBy("dueDate", "asc"))
    const querySnapshot = await getDocs(q)

    const tasks = []
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, companyId, ...doc.data() })
    })

    return { success: true, data: tasks }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Create a new task under a company and refresh the company's task stats.
 * @param {string} userId    - Firebase Auth UID.
 * @param {string} companyId - Firestore document ID of the owning company.
 * @param {object} taskData  - Task fields (name, description, dueDate, status).
 * @returns {{ success: boolean, id?: string, error?: string }}
 */
export const createTask = async (userId, companyId, taskData) => {
  try {
    const tasksRef = collection(db, `users/${userId}/companies/${companyId}/tasks`)
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      reminderSent: false,
    })

    await updateCompanyTaskStats(userId, companyId)
    await updateUserTaskCount(userId)

    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Update a task's fields and refresh the company's task stats.
 * @param {string} userId    - Firebase Auth UID.
 * @param {string} companyId - Firestore document ID of the owning company.
 * @param {string} taskId    - Firestore document ID of the task.
 * @param {object} taskData  - Updated task fields.
 * @returns {{ success: boolean, error?: string }}
 */
export const updateTask = async (userId, companyId, taskId, taskData) => {
  try {
    const taskRef = doc(db, `users/${userId}/companies/${companyId}/tasks`, taskId)
    await updateDoc(taskRef, { ...taskData, updatedAt: serverTimestamp() })

    await updateCompanyTaskStats(userId, companyId)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Delete a task and refresh the company's task stats.
 * @param {string} userId    - Firebase Auth UID.
 * @param {string} companyId - Firestore document ID of the owning company.
 * @param {string} taskId    - Firestore document ID of the task.
 * @returns {{ success: boolean, error?: string }}
 */
export const deleteTask = async (userId, companyId, taskId) => {
  try {
    const taskRef = doc(db, `users/${userId}/companies/${companyId}/tasks`, taskId)
    await deleteDoc(taskRef)

    await updateCompanyTaskStats(userId, companyId)
    await updateUserTaskCount(userId)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== TASK TEMPLATE OPERATIONS =====

/**
 * Fetch all task templates for a user, ordered by creation date (newest first).
 * @param {string} userId - Firebase Auth UID.
 * @returns {{ success: boolean, data?: object[], error?: string }}
 */
export const getTaskTemplates = async (userId) => {
  try {
    const templatesRef = collection(db, `users/${userId}/taskTemplates`)
    const q = query(templatesRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const templates = []
    querySnapshot.forEach((doc) => {
      templates.push({ id: doc.id, ...doc.data() })
    })

    return { success: true, data: templates }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Create a new task template.
 * @param {string} userId        - Firebase Auth UID.
 * @param {object} templateData  - Template fields (name, description, estimatedDays).
 * @returns {{ success: boolean, id?: string, error?: string }}
 */
export const createTaskTemplate = async (userId, templateData) => {
  try {
    const templatesRef = collection(db, `users/${userId}/taskTemplates`)
    const docRef = await addDoc(templatesRef, {
      ...templateData,
      usageCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    })

    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Delete a task template by its Firestore document ID.
 * @param {string} userId      - Firebase Auth UID.
 * @param {string} templateId  - Firestore document ID of the template.
 * @returns {{ success: boolean, error?: string }}
 */
export const deleteTaskTemplate = async (userId, templateId) => {
  try {
    const templateRef = doc(db, `users/${userId}/taskTemplates`, templateId)
    await deleteDoc(templateRef)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Assign a template to companies by creating one task per company.
 * Also increments the template's usageCount by the number of tasks created.
 * @param {string} userId       - Firebase Auth UID.
 * @param {string} templateId   - Firestore document ID of the template.
 * @param {object} assignData   - { companyIds: string[], startDate: string, dueDate: string }
 * @returns {{ success: boolean, tasksCreated?: number, error?: string }}
 */
export const assignTemplate = async (userId, templateId, assignData) => {
  try {
    const { companyIds, startDate, dueDate } = assignData
    const templateRef = doc(db, `users/${userId}/taskTemplates`, templateId)
    const templateDoc = await getDoc(templateRef)

    if (!templateDoc.exists()) {
      return { success: false, error: "Template not found" }
    }

    const templateData = templateDoc.data()
    let tasksCreated = 0

    // Fan out — create a task for each selected company
    for (const companyId of companyIds) {
      await createTask(userId, companyId, {
        name: templateData.name,
        description: templateData.description || "",
        dueDate: dueDate,
        status: "Pending",
        templateId: templateId,
      })
      tasksCreated++
    }

    // Track how many times this template has been assigned
    await updateDoc(templateRef, {
      usageCount: (templateData.usageCount || 0) + tasksCreated,
      updatedAt: serverTimestamp(),
    })

    return { success: true, tasksCreated }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== INTERNAL HELPERS =====

/**
 * Recompute and persist taskStats on a company document after any task mutation.
 * Stats are: total, completed (Done), inProgress (In Progress), pending (Pending).
 */
const updateCompanyTaskStats = async (userId, companyId) => {
  try {
    const tasksResult = await getTasksByCompany(userId, companyId)
    if (!tasksResult.success) return

    const tasks = tasksResult.data
    const stats = {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "Done").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      pending: tasks.filter((t) => t.status === "Pending").length,
    }

    const companyRef = doc(db, `users/${userId}/companies`, companyId)
    await updateDoc(companyRef, { taskStats: stats })
  } catch (error) {
    console.error("Error updating company task stats:", error)
  }
}

/**
 * Recompute and persist the total task count on the user document.
 * Called after every task create or delete.
 */
const updateUserTaskCount = async (userId) => {
  try {
    const tasksResult = await getTasks(userId)
    if (!tasksResult.success) return

    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, { taskCount: tasksResult.data.length })
  } catch (error) {
    console.error("Error updating user task count:", error)
  }
}

export { getCurrentUser }
