import { useAuth } from '../contexts/AuthContext'
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../services/firebaseService'
import { useApi } from './useApi'

export const useCompanies = (onDataChange, showModal) => {
  const { user } = useAuth()
  const { loading, error, execute } = useApi()

  const addCompany = async (companyData) => {
    return execute(
      () => createCompany(user.uid, companyData),
      () => {
        onDataChange?.()
        showModal?.('success', 'Company added successfully!')
      },
      (error) => showModal?.('error', error)
    )
  }

  const editCompany = async (id, companyData) => {
    return execute(
      () => updateCompany(user.uid, id, companyData),
      () => {
        onDataChange?.()
        showModal?.('success', 'Company updated successfully!')
      },
      (error) => showModal?.('error', error)
    )
  }

  const removeCompany = async (id) => {
    return execute(
      () => deleteCompany(user.uid, id),
      () => {
        onDataChange?.()
        showModal?.('success', 'Company deleted successfully!')
      },
      (error) => showModal?.('error', error)
    )
  }

  return { addCompany, editCompany, removeCompany, loading, error }
}