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
    name: initialData.name || '',
    description: initialData.description || '',
    dueDate: initialData.dueDate || '',
    status: initialData.status || 'Pending',
    completionDate: initialData.completionDate || ''
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Task Name"
        id="name"
        value={formData.name}
        onChange={(value) => handleChange('name', value)}
        required
      />
      <FormField
        label="Description"
        id="description"
        value={formData.description}
        onChange={(value) => handleChange('description', value)}
      />
      <FormField
        label="Due Date"
        id="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={(value) => handleChange('dueDate', value)}
      />
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
        <Button type="submit" style={{backgroundColor: '#fcd500', color: 'black'}} className="flex-1 hover:bg-orange-600 text-white">
          {submitText}
        </Button>
      </div>
    </form>
  )
}