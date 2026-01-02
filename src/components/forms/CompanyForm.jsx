import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export const CompanyForm = ({ initialData = {}, onSubmit, onCancel, submitText = "Add Company", disabled = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    ein: initialData.EIN || initialData.ein || '',
    startDate: initialData.startDate || '',
    stateIncorporated: initialData.stateIncorporated || '',
    contactName: initialData.contactPersonName || initialData.contactName || '',
    contactPhone: initialData.contactPersonPhNumber || initialData.contactPhone || '',
    address1: initialData.address1 || '',
    address2: initialData.address2 || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zipCode: initialData.zip || initialData.zipCode || ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="md:col-span-1">
        <label htmlFor="ein" className="block text-sm font-medium text-gray-700 mb-1">EIN</label>
        <input
          type="text"
          id="ein"
          name="ein"
          value={formData.ein}
          onChange={handleChange}
          placeholder="XX-XXXXXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="md:col-span-1">
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="md:col-span-1">
        <label htmlFor="stateIncorporated" className="block text-sm font-medium text-gray-700 mb-1">State Incorporated</label>
        <input
          type="text"
          id="stateIncorporated"
          name="stateIncorporated"
          value={formData.stateIncorporated}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="md:col-span-1">
        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
        <input
          type="text"
          id="contactName"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="md:col-span-1">
        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">Contact Person Phone</label>
        <input
          type="text"
          id="contactPhone"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          placeholder="(XXX) XXX-XXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="md:col-span-1">
        <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">Address 1</label>
        <input
          type="text"
          id="address1"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="md:col-span-1">
        <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">Address 2</label>
        <input
          type="text"
          id="address2"
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="md:col-span-1">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="md:col-span-1">
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="md:col-span-1">
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          placeholder="XXXXX or XXXXX-XXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 order-2 sm:order-1" disabled={isSubmitting || disabled}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 order-1 sm:order-2" disabled={isSubmitting || disabled}>
          {isSubmitting || disabled ? 'Processing...' : submitText}
        </Button>
      </div>
    </form>
  )
}