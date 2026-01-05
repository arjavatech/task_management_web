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

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Company name is required'
    
    if (!formData.ein.trim()) {
      newErrors.ein = 'EIN is required'
    } else if (!/^\d{2}-\d{7}$/.test(formData.ein)) {
      newErrors.ein = 'EIN must be in format XX-XXXXXXX'
    }
    
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    
    if (!formData.stateIncorporated.trim()) newErrors.stateIncorporated = 'State incorporated is required'
    
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required'
    
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required'
    } else if (!/^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Invalid phone number format'
    }
    
    if (!formData.address1.trim()) newErrors.address1 = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required'
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid zip code format'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    let formattedValue = value
    
    // Format EIN: automatically add dash after 2 digits, limit to 9 digits total
    if (field === 'ein') {
      const digits = value.replace(/\D/g, '').slice(0, 9)
      if (digits.length >= 3) {
        formattedValue = `${digits.slice(0, 2)}-${digits.slice(2)}`
      } else {
        formattedValue = digits
      }
    }
    
    // Format ZIP: limit to 5 digits only
    if (field === 'zipCode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 5)
    }
    
    // Format Phone: (XXX) XXX-XXXX, limit to 10 digits
    if (field === 'contactPhone') {
      const digits = value.replace(/\D/g, '').slice(0, 10)
      if (digits.length >= 7) {
        formattedValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
      } else if (digits.length >= 4) {
        formattedValue = `(${digits.slice(0, 3)}) ${digits.slice(3)}`
      } else if (digits.length >= 1) {
        formattedValue = `(${digits}`
      } else {
        formattedValue = digits
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        label="Company Name"
        id="name"
        value={formData.name}
        onChange={(value) => handleChange('name', value)}
        placeholder="Enter company name"
        error={errors.name}
        required
      />
      <FormField
        label="EIN"
        id="ein"
        value={formData.ein}
        onChange={(value) => handleChange('ein', value)}
        placeholder="XX-XXXXXXX"
        error={errors.ein}
        required
      />
      <FormField
        label="Start Date"
        id="startDate"
        type="date"
        value={formData.startDate}
        onChange={(value) => handleChange('startDate', value)}
        error={errors.startDate}
        required
      />
      <FormField
        label="State Incorporated"
        id="stateIncorporated"
        value={formData.stateIncorporated}
        onChange={(value) => handleChange('stateIncorporated', value)}
        placeholder="e.g., Delaware, California"
        error={errors.stateIncorporated}
        required
      />
      <FormField
        label="Contact Person Name"
        id="contactName"
        value={formData.contactName}
        onChange={(value) => handleChange('contactName', value)}
        placeholder="Enter contact person's full name"
        error={errors.contactName}
        required
      />
      <FormField
        label="Contact Person Phone"
        id="contactPhone"
        value={formData.contactPhone}
        onChange={(value) => handleChange('contactPhone', value)}
        placeholder="(555) 123-4567"
        error={errors.contactPhone}
        required
      />
      <FormField
        label="Address 1"
        id="address1"
        value={formData.address1}
        onChange={(value) => handleChange('address1', value)}
        placeholder="Street address"
        error={errors.address1}
        required
      />
      <FormField
        label="Address 2"
        id="address2"
        value={formData.address2}
        onChange={(value) => handleChange('address2', value)}
        placeholder="Apartment, suite, etc. (optional)"
      />
      <FormField
        label="City"
        id="city"
        value={formData.city}
        onChange={(value) => handleChange('city', value)}
        placeholder="Enter city"
        error={errors.city}
        required
      />
      <FormField
        label="State"
        id="state"
        value={formData.state}
        onChange={(value) => handleChange('state', value)}
        placeholder="Enter state"
        error={errors.state}
        required
      />
      <FormField
        label="Zip Code"
        id="zipCode"
        value={formData.zipCode}
        onChange={(value) => handleChange('zipCode', value)}
        placeholder="12345"
        error={errors.zipCode}
        required
      />
      <div className="sm:col-span-2 flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white">
          {submitText}
        </Button>
      </div>
    </form>
  )
}