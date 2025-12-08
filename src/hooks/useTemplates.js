import { useAuth } from '../contexts/AuthContext'
import { createTaskTemplate, deleteTaskTemplate, assignTemplate } from '../services/firebaseService'
import { useApi } from './useApi'

export const useTemplates = (onDataChange, showModal) => {
  const { user } = useAuth()
  const { loading, error, execute } = useApi()

  const addTemplate = async (templateData) => {
    return execute(
      () => createTaskTemplate(user.uid, templateData),
      () => {
        onDataChange?.()
        showModal?.('success', 'Template created successfully!')
      },
      (error) => showModal?.('error', error)
    )
  }

  const removeTemplate = async (templateId) => {
    return execute(
      () => deleteTaskTemplate(user.uid, templateId),
      () => {
        onDataChange?.()
        showModal?.('success', 'Template deleted successfully!')
      },
      (error) => showModal?.('error', error)
    )
  }

  const assignTemplateToCompanies = async (templateId, assignData) => {
    return execute(
      () => assignTemplate(user.uid, templateId, assignData),
      (result) => {
        onDataChange?.()
        showModal?.('success', `Template assigned successfully! ${result.tasksCreated || 0} tasks created.`)
      },
      (error) => showModal?.('error', error)
    )
  }

  return { addTemplate, removeTemplate, assignTemplateToCompanies, loading, error }
}