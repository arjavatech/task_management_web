import { useAuth } from '../contexts/AuthContext'
import { getCompanies, deleteCompany } from '../services/firebaseService'
import { createCompany, updateCompany } from '../services/api'
import { useApi } from './useApi'

export const useCompanies = (onDataChange, showModal) => {
  const { user } = useAuth()
  const { loading, error, execute } = useApi()

  const addCompany = async (companyData) => {
    const result = await execute(
      () => createCompany(companyData),
      () => {
        // Reload data after successful add
        onDataChange?.()
        // Success message will be shown after loading completes
        showModal?.('success', 'Company added successfully!')
      },
      (error) => showModal?.('error', error)
    )
    return result
  }

  const editCompany = async (id, companyData) => {
    const result = await execute(
      () => updateCompany(id, companyData),
      () => {
        // Reload data after successful edit
        onDataChange?.()
        // Success message will be shown after loading completes
        showModal?.('success', 'Company updated successfully!')
      },
      (error) => showModal?.('error', error)
    )
    return result
  }

  const removeCompany = async (id) => {
    const result = await execute(
      () => deleteCompany(user.uid, id),
      () => {
        // Reload data after successful delete
        onDataChange?.()
        // Success message will be shown after loading completes
        showModal?.('success', 'Company deleted successfully!')
      },
      (error) => showModal?.('error', error)
    )
    return result
  }

  return { addCompany, editCompany, removeCompany, loading, error }
}