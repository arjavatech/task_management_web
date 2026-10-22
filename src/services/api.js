/**
 * api.js — REST client for the FastAPI backend.
 *
 * Every request automatically attaches the current user's Firebase ID token
 * as an Authorization: Bearer header. Responses are always normalized to
 * { success: boolean, data?, error? } so hooks (useApi) work without changes.
 *
 * Base URL is read from the VITE_API_BASE_URL env variable (set in .env.local).
 */
import { auth } from "../firebase/config"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

// ── Auth token ────────────────────────────────────────────────────────────────

/** Get the current user's Firebase ID token (JWT) for the Authorization header. */
const getToken = async () => {
  const user = auth.currentUser
  if (!user) throw new Error("No authenticated user")
  return user.getIdToken()
}

// ── Generic request helper ────────────────────────────────────────────────────

/**
 * Make an authenticated fetch request and normalize the response.
 * @param {string} path - Path relative to API_BASE_URL (e.g. "/getall_companies")
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {{ success: boolean, data?: any, error?: string }}
 */
const apiRequest = async (path, options = {}) => {
  try {
    const token = await getToken()
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      let errorMessage = `Request failed (${response.status})`
      try {
        const errorBody = await response.json()
        errorMessage = errorBody.detail || errorBody.message || errorMessage
      } catch {
        // ignore JSON parse failure on error body
      }
      return { success: false, error: errorMessage }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// ── Field-name mapping for Company ───────────────────────────────────────────
// The form/UI uses: ein, contactName, contactPhone, zipCode
// The backend model uses: EIN, contactPersonName, contactPersonPhNumber, zip

const toBackendCompany = (d) => ({
  name: d.name || "",
  EIN: d.ein || "",
  startDate: d.startDate || "",
  stateIncorporated: d.stateIncorporated || "",
  contactPersonName: d.contactName || "",
  contactPersonPhNumber: d.contactPhone || "",
  address1: d.address1 || "",
  address2: d.address2 || "",
  city: d.city || "",
  state: d.state || "",
  zip: d.zipCode || "",
})

const fromBackendCompany = (c) => ({
  id: c.id,
  name: c.name,
  ein: c.EIN,
  startDate: c.startDate,
  stateIncorporated: c.stateIncorporated,
  contactName: c.contactPersonName,
  contactPhone: c.contactPersonPhNumber,
  address1: c.address1,
  address2: c.address2,
  city: c.city,
  state: c.state,
  zipCode: c.zip,
})

// ── Company API ───────────────────────────────────────────────────────────────

/**
 * Fetch all companies for the authenticated user.
 * @returns {{ success: boolean, data?: object[], error?: string }}
 */
export const getCompanies = async () => {
  const result = await apiRequest("/getall_companies")
  if (!result.success) return result
  const companies = Array.isArray(result.data) ? result.data.map(fromBackendCompany) : []
  return { success: true, data: companies }
}

/**
 * Create a new company.
 * @param {object} companyData - Form data (ein, contactName, contactPhone, zipCode, etc.)
 * @returns {{ success: boolean, error?: string }}
 */
export const createCompany = async (companyData) => {
  const result = await apiRequest("/create_company", {
    method: "POST",
    body: JSON.stringify(toBackendCompany(companyData)),
  })
  return result.success ? { success: true } : result
}

/**
 * Update an existing company.
 * @param {string} id - Company document ID.
 * @param {object} companyData - Updated form data.
 * @returns {{ success: boolean, error?: string }}
 */
export const updateCompany = async (id, companyData) => {
  const result = await apiRequest(`/update_company/${id}`, {
    method: "PUT",
    body: JSON.stringify(toBackendCompany(companyData)),
  })
  return result.success ? { success: true } : result
}

/**
 * Delete a company by ID.
 * @param {string} id - Company document ID.
 * @returns {{ success: boolean, error?: string }}
 */
export const deleteCompany = async (id) => {
  const result = await apiRequest(`/delete_company/${id}`, { method: "DELETE" })
  return result.success ? { success: true } : result
}

// ── Task API ──────────────────────────────────────────────────────────────────

/**
 * Fetch all tasks across all companies for the authenticated user.
 * @returns {{ success: boolean, data?: object[], error?: string }}
 */
export const getTasks = async () => {
  const result = await apiRequest("/getall_tasks")
  if (!result.success) return result
  const tasks = Array.isArray(result.data) ? result.data : []
  return { success: true, data: tasks }
}

/**
 * Create a new task under a company.
 * @param {object} taskData - Must include companyId, name, description, dueDate, status.
 * @returns {{ success: boolean, error?: string }}
 */
export const createTask = async (taskData) => {
  const result = await apiRequest("/create_task", {
    method: "POST",
    body: JSON.stringify(taskData),
  })
  return result.success ? { success: true } : result
}

/**
 * Update an existing task.
 * @param {string} id - Task document ID.
 * @param {object} taskData - Must include companyId so the backend can locate the document.
 * @returns {{ success: boolean, error?: string }}
 */
export const updateTask = async (id, taskData) => {
  const result = await apiRequest(`/update_task/${id}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  })
  return result.success ? { success: true } : result
}

/**
 * Delete a task by ID.
 * @param {string} id - Task document ID.
 * @returns {{ success: boolean, error?: string }}
 */
export const deleteTask = async (id) => {
  const result = await apiRequest(`/delete_task/${id}`, { method: "DELETE" })
  return result.success ? { success: true } : result
}

// ── Template API ──────────────────────────────────────────────────────────────

/**
 * Fetch all task templates for the authenticated user.
 * @returns {{ success: boolean, data?: object[], error?: string }}
 */
export const getTaskTemplates = async () => {
  const result = await apiRequest("/getall_templates")
  if (!result.success) return result
  const templates = Array.isArray(result.data) ? result.data : []
  return { success: true, data: templates }
}

/**
 * Create a new task template.
 * @param {object} templateData - { name, description, estimatedDays, companyIds }
 * @returns {{ success: boolean, error?: string }}
 */
export const createTemplate = async (templateData) => {
  const payload = {
    companyIds: templateData.companyIds || [],
    name: templateData.name || "",
    description: templateData.description || "",
    estimatedDays: templateData.estimatedDays || 0,
    status: "Pending",
  }
  const result = await apiRequest("/create_template", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return result.success ? { success: true } : result
}

/**
 * Delete a template by ID.
 * @param {string} id - Template document ID.
 * @returns {{ success: boolean, error?: string }}
 */
export const deleteTemplate = async (id) => {
  const result = await apiRequest(`/delete_template/${id}`, { method: "DELETE" })
  return result.success ? { success: true } : result
}

/**
 * Assign a template to companies, creating one task per company.
 * @param {string} id - Template document ID.
 * @param {object} assignData - { companyIds: string[], startDate: string, dueDate: string }
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export const assignTemplate = async (id, assignData) => {
  const result = await apiRequest(`/assign_template/${id}`, {
    method: "POST",
    body: JSON.stringify({
      companyIds: assignData.companyIds || [],
      startDate: assignData.startDate || "",
      dueDate: assignData.dueDate || "",
    }),
  })
  if (!result.success) return result
  return { success: true, data: result.data, tasksCreated: result.data?.tasksCreated }
}
