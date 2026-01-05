import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Plus, Copy, Trash2, Search } from 'lucide-react'
import { LoadingSpinner, Modal, ConfirmModal } from '../components/common'

export default function TaskTemplates({ taskTemplates, onAddTemplate, onAssignTemplate, onDeleteTemplate, companies, loading }) {
  const [showForm, setShowForm] = useState(false)
  const [showAssignForm, setShowAssignForm] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ show: false, template: null })
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState({ show: false, template: null })
  const [templateData, setTemplateData] = useState({
    name: '', description: '', estimatedDays: ''
  })
  const [assignData, setAssignData] = useState({
    companyIds: [], startDate: '', dueDate: ''
  })
  const [dateError, setDateError] = useState('')
  const [duplicateError, setDuplicateError] = useState('')

  const validateDates = (startDate, dueDate) => {
    if (!startDate || !dueDate) {
      setDateError('')
      return true
    }
    
    const start = new Date(startDate)
    const due = new Date(dueDate)
    
    if (due < start) {
      setDateError('End date cannot be earlier than start date')
      return false
    }
    
    setDateError('')
    return true
  }

  const checkDuplicateAssignments = (templateId, companyIds) => {
    if (!tasks || !Array.isArray(tasks)) return true
    
    const template = taskTemplates.find(t => t.id === templateId)
    if (!template) return true
    
    const duplicateCompanies = []
    
    companyIds.forEach(companyId => {
      const existingTask = tasks.find(task => 
        task.companyId === companyId && 
        task.name === template.name
      )
      
      if (existingTask) {
        const company = companies.find(c => c.id === companyId)
        duplicateCompanies.push(company?.name || 'Unknown Company')
      }
    })
    
    if (duplicateCompanies.length > 0) {
      setDuplicateError(`Task already assigned to: ${duplicateCompanies.join(', ')}`)
      return false
    }
    
    setDuplicateError('')
    return true
  }

  const handleDateChange = (field, value) => {
    const newAssignData = { ...assignData, [field]: value }
    setAssignData(newAssignData)
    
    if (field === 'startDate' || field === 'dueDate') {
      validateDates(newAssignData.startDate, newAssignData.dueDate)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddTemplate(templateData)
    setTemplateData({ name: '', description: '', estimatedDays: '' })
    setShowForm(false)
  }

  const handleDeleteTemplate = () => {
    onDeleteTemplate(deleteModal.template.id)
    setDeleteModal({ show: false, template: null })
  }

  const handleAssign = (e) => {
    e.preventDefault()
    
    if (!validateDates(assignData.startDate, assignData.dueDate)) {
      return
    }
    
    if (!checkDuplicateAssignments(showAssignForm, assignData.companyIds)) {
      return
    }
    
    onAssignTemplate(showAssignForm, assignData)
    setAssignData({ companyIds: [], startDate: '', dueDate: '' })
    setDateError('')
    setDuplicateError('')
    setShowAssignForm(null)
  }

  const toggleCompany = (companyId) => {
    const newCompanyIds = assignData.companyIds.includes(companyId)
      ? assignData.companyIds.filter(id => id !== companyId)
      : [...assignData.companyIds, companyId]
    
    setAssignData(prev => ({
      ...prev,
      companyIds: newCompanyIds
    }))
    
    // Check for duplicates when companies are selected
    if (showAssignForm) {
      checkDuplicateAssignments(showAssignForm, newCompanyIds)
    }
  }

  const filteredTemplates = taskTemplates.filter(template =>
    (template.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (template.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      {loading && <LoadingSpinner />}
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Templates</h1>
            <p className="text-gray-600">Create reusable task templates and assign to multiple companies</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-gray-900 hover:bg-gray-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 lg:p-8 space-y-8">





        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-gray-600" />
              Available Templates ({filteredTemplates.length})
            </h2>
            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              {searchTerm ? (
                <>
                  <p className="text-gray-500 text-lg mb-2">No templates found</p>
                  <p className="text-gray-400">Try adjusting your search terms</p>
                </>
              ) : (
                <>
                  <p className="text-gray-500 text-lg mb-2">No templates yet</p>
                  <p className="text-gray-400">Create your first task template to get started</p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Template Name</TableHead>
                    <TableHead className="min-w-[250px]">Description</TableHead>
                    <TableHead className="min-w-[120px]">Estimated Days</TableHead>
                    <TableHead className="min-w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map(template => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        <p className="text-sm lg:text-base font-medium">{template.name}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{template.description}</p>
                      </TableCell>
                      <TableCell>{template.estimatedDays} days</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowAssignForm(template.id)}
                            className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap"
                          >
                            <Copy className="h-3 w-3" />
                            Assign
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setDeleteModal({ show: true, template })}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Add Template Modal */}
      <Modal
        show={showForm}
        onClose={() => setShowForm(false)}
        title="Create Task Template"
        description="Create a reusable task template"
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input 
              id="name" 
              placeholder="Enter template name"
              value={templateData.name} 
              onChange={(e) => setTemplateData({...templateData, name: e.target.value})} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="estimatedDays">Estimated Days</Label>
            <Input 
              id="estimatedDays" 
              type="number" 
              placeholder="Enter estimated days"
              value={templateData.estimatedDays} 
              onChange={(e) => setTemplateData({...templateData, estimatedDays: e.target.value})} 
              required 
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              placeholder="Enter template description (optional)"
              value={templateData.description} 
              onChange={(e) => setTemplateData({...templateData, description: e.target.value})} 
            />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white">
              Create Template
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Template Modal */}
      <Modal
        show={showAssignForm}
        onClose={() => setShowAssignForm(null)}
        title="Assign Template to Companies"
        description={`Select companies and set dates for "${taskTemplates.find(t => t.id === showAssignForm)?.name}"`}
        className="max-w-3xl"
      >
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <Label>Select Companies</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto">
              {companies.map(company => (
                <label key={company.id} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={assignData.companyIds.includes(company.id)}
                    onChange={() => toggleCompany(company.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{company.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                type="date" 
                value={assignData.startDate} 
                onChange={(e) => setAssignData({...assignData, startDate: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input 
                id="dueDate" 
                type="date" 
                value={assignData.dueDate} 
                onChange={(e) => setAssignData({...assignData, dueDate: e.target.value})} 
                required 
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setShowAssignForm(null)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white" disabled={assignData.companyIds.length === 0}>
              Assign to {assignData.companyIds.length} Companies
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, template: null })}
        onConfirm={() => {
          onDeleteTemplate(deleteModal.template.id)
          setDeleteModal({ show: false, template: null })
        }}
        title="Delete Template"
        message={`Are you sure you want to delete the template "${deleteModal.template?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  )
}