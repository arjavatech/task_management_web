import { useAuth } from '../contexts/AuthContext'
import { createTask, updateTask, deleteTask } from '../services/firebaseService'
import { useApi } from './useApi'

export const useTasks = (onDataChange, showModal) => {
  const { user } = useAuth()
  const { loading, error, execute } = useApi()

  const addTask = async (companyId, taskData) => {
    return execute(
      () => createTask(user.uid, companyId, taskData),
      () => {
        onDataChange?.()
        showModal?.('success', 'Task created successfully!')
      },
      (error) => showModal?.('error', error)
    )
  }

  const editTask = async (taskId, companyId, taskData) => {
    return execute(
      () => updateTask(user.uid, companyId, taskId, taskData),
      () => {
        onDataChange?.()
        showModal?.('success', 'Task updated successfully!')
      },
      (error) => showModal?.('error', error)
    )
  }

  const removeTask = async (taskId, companyId) => {
    return execute(
      () => deleteTask(user.uid, companyId, taskId),
      () => {
        onDataChange?.()
        showModal?.('success', 'Task deleted successfully!')
      },
      (error) => showModal?.('error', error)
    )
  }

  return { addTask, editTask, removeTask, loading, error }
}