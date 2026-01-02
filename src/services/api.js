/**
 * API Service for Company Task Management
 * Handles all HTTP requests to the backend API endpoints
 */

const BASE_URL = import.meta.env.VITE_TEST_BASE_URL

/**
 * Generic API request handler
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options (method, headers, body)
 * @returns {Promise<object>} API response
 */
const apiRequest = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('authToken')
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    })
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// ===== COMPANY API CALLS =====

/**
 * Fetch all schools from the server
 * Used in: Login function to populate schools list
 */
export const fetchCompanies = async () => {
  return await apiRequest(`${BASE_URL}/getall_companies`)
}

/**
 * Create a new company
 * Used in: CompanyList page when adding new company
 * @param {object} companyData - Company information
 */
export const createCompany = async (companyData) => {
  const payload = {
    name: companyData.name || '',
    EIN: companyData.ein || '',
    startDate: companyData.startDate || '',
    stateIncorporated: companyData.stateIncorporated || '',
    contactPersonName: companyData.contactName || '',
    contactPersonPhNumber: companyData.contactPhone || '',
    address1: companyData.address1 || '',
    address2: companyData.address2 || '',
    city: companyData.city || '',
    state: companyData.state || '',
    zip: companyData.zipCode || ''
  }
  
  return await apiRequest(`${BASE_URL}/create_company`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

/**
 * Update an existing company
 * Used in: CompanyPage when editing company details
 * @param {string} id - Company ID
 * @param {object} companyData - Updated company information
 */
export const updateCompany = async (id, companyData) => {
  const payload = {
    name: companyData.name || '',
    EIN: companyData.EIN || companyData.ein || '',
    startDate: companyData.startDate || '',
    stateIncorporated: companyData.stateIncorporated || '',
    contactPersonName: companyData.contactPersonName || companyData.contactName || '',
    contactPersonPhNumber: companyData.contactPersonPhNumber || companyData.contactPhone || '',
    address1: companyData.address1 || '',
    address2: companyData.address2 || '',
    city: companyData.city || '',
    state: companyData.state || '',
    zip: companyData.zip || companyData.zipCode || ''
  }
  
  return await apiRequest(`${BASE_URL}/update_company/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

/**
 * Delete a company
 * Used in: CompanyList when deleting company
 * @param {number} id - Company ID
 */
export const deleteCompany = async (id) => {
  return await apiRequest(`${BASE_URL}/deletecompany/${id}`, {
    method: 'DELETE'
  })
}

// ===== TASK API CALLS =====

/**
 * Fetch all tasks from the server
 * Used in: App initialization to load all tasks
 */
export const fetchTasks = async () => {
  return await apiRequest(`${BASE_URL}/tasks`)
}

/**
 * Create a new task
 * Used in: CompanyPage when adding new task
 * @param {object} taskData - Task information
 */
export const createTask = async (taskData) => {
  const payload = {
    companyId: taskData.companyId,
    name: taskData.name || '',
    description: taskData.description || '',
    dueDate: taskData.dueDate || '',
    status: taskData.status || 'Pending'
  }
  
  return await apiRequest(`${BASE_URL}/tasks`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

/**
 * Update an existing task
 * Used in: CompanyPage when editing task details
 * @param {number} id - Task ID
 * @param {object} taskData - Updated task information
 */
export const updateTask = async (id, taskData) => {
  const payload = {
    name: taskData.name || '',
    description: taskData.description || '',
    dueDate: taskData.dueDate || '',
    status: taskData.status || 'Pending',
    completionDate: taskData.completionDate || ''
  }
  
  return await apiRequest(`${BASE_URL}/updatetasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

/**
 * Delete a task
 * Used in: CompanyPage when deleting task
 * @param {number} id - Task ID
 */
export const deleteTask = async (id) => {
  return await apiRequest(`${BASE_URL}/deletetasks/${id}`, {
    method: 'DELETE'
  })
}

// ===== TEMPLATE API CALLS =====

/**
 * Fetch all templates from the server
 * Used in: TaskTemplates page for initial template loading
 */
export const fetchTemplates = async () => {
  return await apiRequest(`${BASE_URL}/templates`)
}

/**
 * Create a new task template
 * Used in: TaskTemplates page when adding new template
 * @param {object} templateData - Template information
 */
export const createTemplate = async (templateData) => {
  const payload = {
    name: templateData.name || '',
    description: templateData.description || '',
    estimatedDays: templateData.estimatedDays || 0
  }
  
  return await apiRequest(`${BASE_URL}/templates`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

/**
 * Delete a template
 * Used in: TaskTemplates page when deleting template
 * @param {number} id - Template ID
 */
export const deleteTemplate = async (id) => {
  return await apiRequest(`${BASE_URL}/deletetemplate/${id}`, {
    method: 'DELETE'
  })
}

/**
 * Assign template to companies
 * Used in: TaskTemplates page when assigning template to companies
 * @param {number} id - Template ID
 * @param {object} assignData - Assignment data with companyIds, startDate, dueDate
 */
export const assignTemplate = async (id, assignData) => {
  const payload = {
    companyIds: assignData.companyIds || [],
    startDate: assignData.startDate || '',
    dueDate: assignData.dueDate || ''
  }
  
  return await apiRequest(`${BASE_URL}/templates/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}