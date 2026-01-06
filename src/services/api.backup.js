/**
 * UNUSED EXTERNAL API SERVICE
 * This file contains external API endpoints that are not currently being used.
 * The application uses Firebase/Firestore for all data operations.
 * Keeping this as backup in case external API integration is needed later.
 */

const API_BASE_URL = 'https://arjava.proxy.beeceptor.com'
const COMPANIES_GET_URL = 'https://taskflow.free.beeceptor.com/companies'

/**
 * Generic API request handler
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options (method, headers, body)
 * @returns {Promise<object>} API response
 */
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
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

// Company API calls
export const fetchCompanies = async () => {
  return await apiRequest(COMPANIES_GET_URL)
}

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
  
  return await apiRequest(`${API_BASE_URL}/company`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

// Additional API functions would go here...