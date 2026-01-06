import { auth, db } from '../firebase/config'
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
  serverTimestamp
} from 'firebase/firestore'

// Get current authenticated user
const getCurrentUser = () => {
  return auth.currentUser
}

// Retry helper for Firebase operations
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      
      // Don't retry on permission errors
      if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
        throw error
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
}

// ===== USER OPERATIONS =====

export const getUserProfile = async (userId) => {
  try {
    const result = await retryOperation(async () => {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        return { success: true, data: { id: userDoc.id, ...userDoc.data() } }
      } else {
        return { success: false, error: 'User profile not found' }
      }
    })
    return result
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const createUserProfile = async (userId, email, name = '') => {
  try {
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, {
      email,
      name,
      phone: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      companyCount: 0,
      taskCount: 0
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== COMPANY OPERATIONS =====

export const getCompanies = async (userId) => {
  try {
    const result = await retryOperation(async () => {
      const companiesRef = collection(db, `users/${userId}/companies`)
      const q = query(companiesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const companies = []
      querySnapshot.forEach((doc) => {
        companies.push({ id: doc.id, ...doc.data() })
      })

      return { success: true, data: companies }
    })
    return result
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const createCompany = async (userId, companyData) => {
  try {
    const companiesRef = collection(db, `users/${userId}/companies`)
    const docRef = await addDoc(companiesRef, {
      ...companyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      taskStats: {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0
      }
    })

    // Update user's company count
    const userRef = doc(db, 'users', userId)
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

export const updateCompany = async (userId, companyId, companyData) => {
  try {
    const companyRef = doc(db, `users/${userId}/companies`, companyId)
    await updateDoc(companyRef, {
      ...companyData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const deleteCompany = async (userId, companyId) => {
  try {
    const companyRef = doc(db, `users/${userId}/companies`, companyId)
    await deleteDoc(companyRef)

    // Update user's company count
    const userRef = doc(db, 'users', userId)
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

export const getTasks = async (userId) => {
  try {
    const result = await retryOperation(async () => {
      const companiesRef = collection(db, `users/${userId}/companies`)
      const companiesSnapshot = await getDocs(companiesRef)

      let allTasks = []

      // Get tasks from all companies
      for (const companyDoc of companiesSnapshot.docs) {
        const tasksRef = collection(db, `users/${userId}/companies/${companyDoc.id}/tasks`)
        const tasksSnapshot = await getDocs(tasksRef)

        tasksSnapshot.forEach((taskDoc) => {
          allTasks.push({
            id: taskDoc.id,
            companyId: companyDoc.id,
            ...taskDoc.data()
          })
        })
      }

      return { success: true, data: allTasks }
    })
    return result
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getTasksByCompany = async (userId, companyId) => {
  try {
    const tasksRef = collection(db, `users/${userId}/companies/${companyId}/tasks`)
    const q = query(tasksRef, orderBy('dueDate', 'asc'))
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

export const createTask = async (userId, companyId, taskData) => {
  try {
    const tasksRef = collection(db, `users/${userId}/companies/${companyId}/tasks`)
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      reminderSent: false
    })

    // Update company's task stats
    await updateCompanyTaskStats(userId, companyId)

    // Update user's task count
    await updateUserTaskCount(userId)

    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const updateTask = async (userId, companyId, taskId, taskData) => {
  try {
    const taskRef = doc(db, `users/${userId}/companies/${companyId}/tasks`, taskId)
    await updateDoc(taskRef, {
      ...taskData,
      updatedAt: serverTimestamp()
    })

    // Update company's task stats
    await updateCompanyTaskStats(userId, companyId)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const deleteTask = async (userId, companyId, taskId) => {
  try {
    const taskRef = doc(db, `users/${userId}/companies/${companyId}/tasks`, taskId)
    await deleteDoc(taskRef)

    // Update company's task stats
    await updateCompanyTaskStats(userId, companyId)

    // Update user's task count
    await updateUserTaskCount(userId)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== TASK TEMPLATE OPERATIONS =====

export const getTaskTemplates = async (userId) => {
  try {
    const result = await retryOperation(async () => {
      const templatesRef = collection(db, `users/${userId}/taskTemplates`)
      const q = query(templatesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const templates = []
      querySnapshot.forEach((doc) => {
        templates.push({ id: doc.id, ...doc.data() })
      })

      return { success: true, data: templates }
    })
    return result
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const createTaskTemplate = async (userId, templateData) => {
  try {
    const templatesRef = collection(db, `users/${userId}/taskTemplates`)
    const docRef = await addDoc(templatesRef, {
      ...templateData,
      usageCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    })

    return { success: true, id: docRef.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const deleteTaskTemplate = async (userId, templateId) => {
  try {
    const templateRef = doc(db, `users/${userId}/taskTemplates`, templateId)
    await deleteDoc(templateRef)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const assignTemplate = async (userId, templateId, assignData) => {
  try {
    const { companyIds, startDate, dueDate } = assignData
    const templateRef = doc(db, `users/${userId}/taskTemplates`, templateId)
    const templateDoc = await getDoc(templateRef)

    if (!templateDoc.exists()) {
      return { success: false, error: 'Template not found' }
    }

    const templateData = templateDoc.data()
    let tasksCreated = 0

    // Create tasks for each selected company
    for (const companyId of companyIds) {
      await createTask(userId, companyId, {
        name: templateData.name,
        description: templateData.description || '',
        dueDate: dueDate,
        status: 'Pending',
        templateId: templateId
      })
      tasksCreated++
    }

    // Update template usage count
    await updateDoc(templateRef, {
      usageCount: (templateData.usageCount || 0) + tasksCreated,
      updatedAt: serverTimestamp()
    })

    return { success: true, tasksCreated }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ===== HELPER FUNCTIONS =====

const updateCompanyTaskStats = async (userId, companyId) => {
  try {
    const tasksResult = await getTasksByCompany(userId, companyId)
    if (!tasksResult.success) return

    const tasks = tasksResult.data
    const stats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'Done').length,
      inProgress: tasks.filter(task => task.status === 'In Progress').length,
      pending: tasks.filter(task => task.status === 'Pending').length
    }

    const companyRef = doc(db, `users/${userId}/companies`, companyId)
    await updateDoc(companyRef, { taskStats: stats })
  } catch (error) {
    console.error('Error updating company task stats:', error)
  }
}

const updateUserTaskCount = async (userId) => {
  try {
    const tasksResult = await getTasks(userId)
    if (!tasksResult.success) return

    const taskCount = tasksResult.data.length
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, { taskCount })
  } catch (error) {
    console.error('Error updating user task count:', error)
  }
}

export { getCurrentUser }