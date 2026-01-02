import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Plus, Copy, Trash2, Search } from 'lucide-react'
import { ConfirmModal } from '../components/common'

export default function TaskTemplates({ taskTemplates, onAddTemplate, onAssignTemplate, onDeleteTemplate, companies, tasks }) {
  const [showForm, setShowForm] = useState(false)
  const [showAssignForm, setShowAssignForm] = useState(null)
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
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">Task Templates</h1>
          <p className="text-gray-600 text-base lg:text-lg">Create reusable task templates and assign to multiple companies</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Template'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Task Template</CardTitle>
            <CardDescription>Create a reusable task template</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="name">Template Name</Label>
                <Input 
                  id="name" 
                  value={templateData.name} 
                  onChange={(e) => setTemplateData({...templateData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="estimatedDays">Estimated Days</Label>
                <Input 
                  id="estimatedDays" 
                  type="number" 
                  value={templateData.estimatedDays} 
                  onChange={(e) => setTemplateData({...templateData, estimatedDays: e.target.value})} 
                  required 
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={templateData.description} 
                  onChange={(e) => setTemplateData({...templateData, description: e.target.value})} 
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Template
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {showAssignForm && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Template to Companies</CardTitle>
            <CardDescription>Select companies and set dates for "{taskTemplates.find(t => t.id === showAssignForm)?.name}"</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <Label>Select Companies</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  {companies.map(company => (
                    <label key={company.id} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={assignData.companyIds.includes(company.id)}
                        onChange={() => toggleCompany(company.id)}
                        className="rounded"
                      />
                      <span className="text-xs sm:text-sm truncate">{company.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date" 
                    value={assignData.startDate} 
                    onChange={(e) => handleDateChange('startDate', e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input 
                    id="dueDate" 
                    type="date" 
                    value={assignData.dueDate} 
                    onChange={(e) => handleDateChange('dueDate', e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              {dateError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">{dateError}</p>
                </div>
              )}
              
              {duplicateError && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-600 text-sm font-medium">{duplicateError}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 order-1" 
                  disabled={assignData.companyIds.length === 0 || !!dateError || !!duplicateError}
                >
                  Assign to {assignData.companyIds.length} Companies
                </Button>
                <Button type="button" variant="outline" className="order-2" onClick={() => {
                  setShowAssignForm(null)
                  setDateError('')
                  setDuplicateError('')
                  setAssignData({ companyIds: [], startDate: '', dueDate: '' })
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Available Templates ({filteredTemplates.length})
          </CardTitle>
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
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, template: null })}
        onConfirm={handleDeleteTemplate}
        title="Delete Template"
        message={`Are you sure you want to delete the template "${deleteModal.template?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}