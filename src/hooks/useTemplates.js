/**
 * useTemplates — CRUD and assignment actions for task templates.
 *
 * Templates are stored at users/{userId}/taskTemplates/{templateId}.
 * Assigning a template creates one task per selected company.
 *
 * @param {() => void}               onDataChange - Refresh callback.
 * @param {(type, message) => void}  showModal    - Display feedback modal.
 */
import { createTemplate, deleteTemplate, assignTemplate } from "../services/api"
import { useApi } from "./useApi"

export const useTemplates = (onDataChange, showModal) => {
  const { loading, error, execute } = useApi()

  /**
   * Create a new task template.
   * @param {object} templateData - Template fields (name, description, estimatedDays).
   */
  const addTemplate = async (templateData) => {
    return execute(
      () => createTemplate(templateData),
      () => {
        onDataChange?.()
        showModal?.("success", "Template created successfully!")
      },
      (error) => showModal?.("error", error)
    )
  }

  /**
   * Delete a template by its document ID.
   * @param {string} templateId - Firestore ID of the template.
   */
  const removeTemplate = async (templateId) => {
    return execute(
      () => deleteTemplate(templateId),
      () => {
        onDataChange?.()
        showModal?.("success", "Template deleted successfully!")
      },
      (error) => showModal?.("error", error)
    )
  }

  /**
   * Assign a template to one or more companies, creating a task for each.
   * @param {string} templateId  - Firestore ID of the template.
   * @param {object} assignData  - { companyIds: string[], startDate: string, dueDate: string }
   */
  const assignTemplateToCompanies = async (templateId, assignData) => {
    return execute(
      () => assignTemplate(templateId, assignData),
      (result) => {
        onDataChange?.()
        showModal?.("success", `Template assigned successfully! ${result.tasksCreated || 0} tasks created.`)
      },
      (error) => showModal?.("error", error)
    )
  }

  return { addTemplate, removeTemplate, assignTemplateToCompanies, loading, error }
}
