import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormField } from '../common/FormField'

const statusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' }
]

export const TaskForm = ({ initialData = {}, onSubmit, onCancel, submitText = "Add Task" }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || '',
    status: initialData?.status || 'Pending',
    completionDate: initialData?.completionDate || ''
  })
  
  const [errors, setErrors] = useState({})

  const validateField = (field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Task name is required'
        } else if (value.trim().length < 2) {
          newErrors.name = 'Task name must be at least 2 characters'
        } else {
          delete newErrors.name
        }
        break
      case 'dueDate':
        if (value && new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          newErrors.dueDate = 'Due date cannot be in the past'
        } else {
          delete newErrors.dueDate
        }
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!validateField('name', formData.name)) {
      return
    }
    
    if (formData.dueDate && !validateField('dueDate', formData.dueDate)) {
      return
    }
    
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <FormField
          label="Task Name"
          id="name"
          value={formData.name}
          onChange={(value) => handleChange('name', value)}
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <FormField
        label="Description"
        id="description"
        value={formData.description}
        onChange={(value) => handleChange('description', value)}
      />
      
      <div>
        <FormField
          label="Due Date"
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(value) => handleChange('dueDate', value)}
        />
        {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
      </div>
      
      <FormField
        label="Status"
        id="status"
        value={formData.status}
        onChange={(value) => handleChange('status', value)}
        options={statusOptions}
      />
      
      <div className="flex gap-3">
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