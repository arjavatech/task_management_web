import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormField } from '../common/FormField'

export const CompanyForm = ({ initialData = {}, onSubmit, onCancel, submitText = "Add Company" }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    ein: initialData.ein || '',
    startDate: initialData.startDate || '',
    stateIncorporated: initialData.stateIncorporated || '',
    contactName: initialData.contactName || '',
    contactPhone: initialData.contactPhone || '',
    address1: initialData.address1 || '',
    address2: initialData.address2 || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zipCode: initialData.zipCode || ''
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        label="Company Name"
        id="name"
        value={formData.name}
        onChange={(value) => handleChange('name', value)}
        required
      />
      <FormField
        label="EIN"
        id="ein"
        value={formData.ein}
        onChange={(value) => handleChange('ein', value)}
        required
      />
      <FormField
        label="Start Date"
        id="startDate"
        type="date"
        value={formData.startDate}
        onChange={(value) => handleChange('startDate', value)}
        required
      />
      <FormField
        label="State Incorporated"
        id="stateIncorporated"
        value={formData.stateIncorporated}
        onChange={(value) => handleChange('stateIncorporated', value)}
        required
      />
      <FormField
        label="Contact Person Name"
        id="contactName"
        value={formData.contactName}
        onChange={(value) => handleChange('contactName', value)}
        required
      />
      <FormField
        label="Contact Person Phone"
        id="contactPhone"
        value={formData.contactPhone}
        onChange={(value) => handleChange('contactPhone', value)}
        required
      />
      <FormField
        label="Address 1"
        id="address1"
        value={formData.address1}
        onChange={(value) => handleChange('address1', value)}
        required
      />
      <FormField
        label="Address 2"
        id="address2"
        value={formData.address2}
        onChange={(value) => handleChange('address2', value)}
      />
      <FormField
        label="City"
        id="city"
        value={formData.city}
        onChange={(value) => handleChange('city', value)}
        required
      />
      <FormField
        label="State"
        id="state"
        value={formData.state}
        onChange={(value) => handleChange('state', value)}
        required
      />
      <FormField
        label="Zip Code"
        id="zipCode"
        value={formData.zipCode}
        onChange={(value) => handleChange('zipCode', value)}
        required
      />
      <div className="sm:col-span-2 flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {submitText}
        </Button>
      </div>
    </form>
  )
}