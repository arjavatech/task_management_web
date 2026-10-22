/**
 * useTasks — CRUD actions for tasks with automatic feedback.
 *
 * Tasks are scoped under a company; companyId must be passed on create/update
 * so the backend can resolve the correct Firestore subcollection path:
 *   users/{userId}/companies/{companyId}/tasks/{taskId}
 *
 * @param {() => void}               onDataChange - Refresh callback.
 * @param {(type, message) => void}  showModal    - Display feedback modal.
 */
import { createTask, updateTask, deleteTask } from "../services/api"
import { useApi } from "./useApi"

export const useTasks = (onDataChange, showModal) => {
  const { loading, error, execute } = useApi()

  /**
   * Create a new task under a specific company.
   * @param {string} companyId - Firestore ID of the owning company.
   * @param {object} taskData  - Task fields (name, description, dueDate, status).
   */
  const addTask = async (companyId, taskData) => {
    return execute(
      () => createTask({ companyId, ...taskData }),
      () => {
        onDataChange?.()
        showModal?.("success", "Task created successfully!")
      },
      (error) => showModal?.("error", error)
    )
  }

  /**
   * Update an existing task.
   * @param {string} taskId    - Firestore ID of the task.
   * @param {string} companyId - Firestore ID of the owning company.
   * @param {object} taskData  - Updated task fields.
   */
  const editTask = async (taskId, companyId, taskData) => {
    return execute(
      () => updateTask(taskId, { companyId, ...taskData }),
      () => {
        onDataChange?.()
        showModal?.("success", "Task updated successfully!")
      },
      (error) => showModal?.("error", error)
    )
  }

  /**
   * Delete a task by its Firestore document ID.
   * @param {string} taskId    - Firestore ID of the task.
   * @param {string} companyId - Firestore ID of the owning company (unused by backend but kept for API symmetry).
   */
  const removeTask = async (taskId, companyId) => {
    return execute(
      () => deleteTask(taskId),
      () => {
        onDataChange?.()
        showModal?.("success", "Task deleted successfully!")
      },
      (error) => showModal?.("error", error)
    )
  }

  return { addTask, editTask, removeTask, loading, error }
}
