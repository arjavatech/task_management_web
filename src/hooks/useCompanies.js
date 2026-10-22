/**
 * useCompanies — CRUD actions for companies with automatic feedback.
 *
 * Each action calls onDataChange() on success so the parent can reload
 * the company list, and showModal() to display a toast or error dialog.
 *
 * @param {() => void}               onDataChange - Refresh callback (e.g. loadData in App.jsx).
 * @param {(type, message) => void}  showModal    - Display feedback modal.
 */
import { createCompany, updateCompany, deleteCompany } from "../services/api"
import { useApi } from "./useApi"

export const useCompanies = (onDataChange, showModal) => {
  const { loading, error, execute } = useApi()

  /**
   * Create a new company.
   * @param {object} companyData - Company fields (name, ein, address, etc.)
   */
  const addCompany = async (companyData) => {
    return execute(
      () => createCompany(companyData),
      () => {
        onDataChange?.()
        showModal?.("success", "Company added successfully!")
      },
      (error) => showModal?.("error", error)
    )
  }

  /**
   * Update an existing company.
   * @param {string} id          - Firestore document ID of the company.
   * @param {object} companyData - Updated company fields.
   */
  const editCompany = async (id, companyData) => {
    return execute(
      () => updateCompany(id, companyData),
      () => {
        onDataChange?.()
        showModal?.("success", "Company updated successfully!")
      },
      (error) => showModal?.("error", error)
    )
  }

  /**
   * Delete a company by its document ID.
   * @param {string} id - Firestore document ID of the company.
   */
  const removeCompany = async (id) => {
    return execute(
      () => deleteCompany(id),
      () => {
        onDataChange?.()
        showModal?.("success", "Company deleted successfully!")
      },
      (error) => showModal?.("error", error)
    )
  }

  return { addCompany, editCompany, removeCompany, loading, error }
}
