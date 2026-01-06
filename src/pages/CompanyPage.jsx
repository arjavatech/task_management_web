import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2, MapPin, Phone, Mail, Calendar, Edit, Plus, FileText, ArrowLeft, CheckCircle, Clock, AlertCircle, Trash2, BarChart3 } from 'lucide-react'
import { Modal, SearchBar, StatusBadge, LoadingSpinner, ConfirmModal } from '../components/common'
import { CompanyForm, TaskForm } from '../components/forms'

export default function CompanyPage({ companies, tasks, onUpdateCompany, onDeleteCompany, onAddTask, onUpdateTask, onDeleteTask, taskTemplates, onAssignTemplate, loading }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const company = companies.find(c => c.id === id)
  const companyTasks = tasks.filter(t => t.companyId === id)
  
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTaskModal, setDeleteTaskModal] = useState({ show: false, task: null })
  const [filterYear, setFilterYear] = useState(0)
  const [filterMonth, setFilterMonth] = useState(0)

  if (!company) {
    return <div className="px-4">Company not found</div>
  }

  const handleCompanySubmit = (formData) => {
    onUpdateCompany(company.id, formData)
    setShowEditModal(false)
  }

  const handleDeleteCompany = async () => {
    await onDeleteCompany(company.id)
    setShowDeleteModal(false)
    navigate('/companies')
  }

  const handleDeleteTask = () => {
    onDeleteTask(deleteTaskModal.task.id, company.id)
    setDeleteTaskModal({ show: false, task: null })
  }

  const handleTaskSubmit = (formData) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, company.id, formData)
      setEditingTask(null)
      setShowTaskForm(false)
    } else {
      onAddTask(company.id, formData)
      setShowAddTaskModal(false)
    }
  }

  const startEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const filteredTasks = companyTasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <Link to="/companies">
            <Button size="sm" className="p-2 bg-slate-900 hover:bg-slate-800 text-white">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-slate-600 flex-shrink-0" />
              <span className="truncate">{company.name}</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">Company Profile & Task Management</p>
          </div>
        </div>
      </div>

      {/* Company Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Total Tasks</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{companyTasks.length}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-900 rounded-lg flex items-center justify-center self-end sm:self-auto">
              <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Completed</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{companyTasks.filter(t => t.status === 'Done').length}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center self-end sm:self-auto">
              <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">In Progress</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{companyTasks.filter(t => t.status === 'In Progress').length}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center self-end sm:self-auto">
              <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Overdue</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">
                {companyTasks.filter(t => {
                  if (!t.dueDate || t.status === 'Done') return false
                  return new Date(t.dueDate) < new Date()
                }).length || 0}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-50 rounded-lg flex items-center justify-center self-end sm:self-auto">
              <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Filters */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Chart Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-end">
            <div className="w-full sm:w-auto">
              <Label htmlFor="filterYear" className="text-sm">Year</Label>
              <Select value={filterYear.toString()} onValueChange={(value) => setFilterYear(parseInt(value))}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Years</SelectItem>
                  {[2022, 2023, 2024, 2025].map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Label htmlFor="filterMonth" className="text-sm">Month</Label>
              <Select value={filterMonth.toString()} onValueChange={(value) => setFilterMonth(parseInt(value))}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Months</SelectItem>
                  {[
                    { value: 1, label: 'January' },
                    { value: 2, label: 'February' },
                    { value: 3, label: 'March' },
                    { value: 4, label: 'April' },
                    { value: 5, label: 'May' },
                    { value: 6, label: 'June' },
                    { value: 7, label: 'July' },
                    { value: 8, label: 'August' },
                    { value: 9, label: 'September' },
                    { value: 10, label: 'October' },
                    { value: 11, label: 'November' },
                    { value: 12, label: 'December' }
                  ].map(month => (
                    <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-0">
              Filtered: {companyTasks.filter(task => {
                if (!task.dueDate) return false
                const taskDate = new Date(task.dueDate)
                if (isNaN(taskDate.getTime())) return false
                const yearMatch = filterYear === 0 || taskDate.getFullYear() === filterYear
                const monthMatch = filterMonth === 0 || taskDate.getMonth() + 1 === filterMonth
                return yearMatch && monthMatch
              }).length} tasks
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Weekly Task Trend Chart */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
              Weekly Task Trend
            </CardTitle>
            <CardDescription className="text-sm">Weekly task completion progress</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="relative h-48 sm:h-64">
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-2">
                <span>10</span>
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
                <span>0</span>
              </div>
              
              <div className="ml-4 sm:ml-6 lg:ml-8 h-full flex items-end justify-between px-1 sm:px-2 lg:px-4">
                {(() => {
                  // Filter tasks by selected year and month
                  const filteredTasks = companyTasks.filter(task => {
                    if (!task.dueDate) return false
                    const taskDate = new Date(task.dueDate)
                    if (isNaN(taskDate.getTime())) return false
                    const yearMatch = filterYear === 0 || taskDate.getFullYear() === filterYear
                    const monthMatch = filterMonth === 0 || taskDate.getMonth() + 1 === filterMonth
                    return yearMatch && monthMatch
                  })
                  
                  // Get current week
                  const today = new Date()
                  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
                  
                  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                    const dayDate = new Date(startOfWeek)
                    dayDate.setDate(startOfWeek.getDate() + index)
                    const dayStr = dayDate.toISOString().split('T')[0]
                    
                    const dayTasks = filteredTasks.filter(task => task.dueDate === dayStr)
                    const completed = dayTasks.filter(t => t.status === 'Done').length
                    const maxHeight = 10
                    
                    return (
                      <div key={day} className="flex flex-col items-center space-y-1 sm:space-y-2">
                        <div className="flex flex-col items-center w-4 sm:w-6 lg:w-8">
                          <div 
                            className="w-full rounded" 
                            style={{ 
                              height: `${Math.max((completed / maxHeight) * 160, 4)}px`,
                              background: 'linear-gradient(to top, #475569, #64748b)'
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{day.slice(0, 1)}</span>
                        <span className="text-xs text-gray-400">{completed}</span>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-slate-500 rounded" />
              <span>Completed Tasks</span>
            </div>
          </CardContent>
        </Card>

        {/* Task Status Line Chart */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
              Task Status Trend
            </CardTitle>
            <CardDescription className="text-sm">Cumulative completed tasks over time</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="relative h-48 sm:h-64">
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-2">
                <span>20</span>
                <span>15</span>
                <span>10</span>
                <span>5</span>
                <span>0</span>
              </div>
              
              <div className="ml-4 sm:ml-6 lg:ml-8 h-full relative">
                {(() => {
                  // Filter tasks by selected year and month
                  const filteredTasks = companyTasks.filter(task => {
                    if (!task.dueDate) return false
                    const taskDate = new Date(task.dueDate)
                    if (isNaN(taskDate.getTime())) return false
                    const yearMatch = filterYear === 0 || taskDate.getFullYear() === filterYear
                    const monthMatch = filterMonth === 0 || taskDate.getMonth() + 1 === filterMonth
                    return yearMatch && monthMatch
                  })
                  
                  // Get current week
                  const today = new Date()
                  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
                  const completedTasks = filteredTasks.filter(t => t.status === 'Done').length
                  const maxCompleted = Math.max(completedTasks, 20)
                  
                  let cumulativePoints = []
                  let cumulative = 0
                  
                  for (let i = 0; i < 7; i++) {
                    const dayDate = new Date(startOfWeek)
                    dayDate.setDate(startOfWeek.getDate() + i)
                    const dayStr = dayDate.toISOString().split('T')[0]
                    const dayCompleted = filteredTasks.filter(task => 
                      task.dueDate === dayStr && task.status === 'Done'
                    ).length
                    cumulative += dayCompleted
                    cumulativePoints.push({
                      x: 15 + (i * 30),
                      y: 160 - ((cumulative / maxCompleted) * 140)
                    })
                  }
                  
                  const pathData = `M ${cumulativePoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
                  const areaData = `${pathData} L ${cumulativePoints[cumulativePoints.length - 1].x} 180 L 15 180 Z`
                  
                  return (
                    <svg className="absolute inset-0 w-full h-full">
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#475569" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#334155" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      <path d={areaData} fill="url(#areaGradient)" />
                      <path d={pathData} stroke="#475569" strokeWidth="2" fill="none" />
                      <line 
                        x1={15 + (3 * 30)} 
                        y1="0" 
                        x2={15 + (3 * 30)} 
                        y2="180" 
                        stroke="#ef4444" 
                        strokeWidth="1.5" 
                        strokeDasharray="4,4"
                      />
                    </svg>
                  )
                })()}
                
                <div className="absolute bottom-0 w-full flex justify-between px-2 sm:px-4 text-xs text-gray-600">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <span key={day} className={`${index === 3 ? 'text-red-500 font-semibold' : ''} hidden sm:inline`}>
                      {day}
                    </span>
                  ))}
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <span key={day} className={`${index === 3 ? 'text-red-500 font-semibold' : ''} sm:hidden`}>
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-slate-500 rounded" />
                <span>Cumulative Progress</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-0.5 sm:w-3 sm:h-0.5 bg-red-500" style={{ borderStyle: 'dashed' }} />
                <span>Current Day</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Company Information */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                  Company Information
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(true)} className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">EIN</p>
                    <p className="text-gray-600 text-sm break-all">{company.ein}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Start Date</p>
                    <p className="text-gray-600 text-sm">{new Date(company.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">State Incorporated</p>
                    <p className="text-gray-600 text-sm">{company.stateIncorporated}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Contact Person</p>
                    <p className="text-gray-600 text-sm break-words">{company.contactName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Phone</p>
                    <p className="text-gray-600 text-sm">{company.contactPhone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                  Tasks ({filteredTasks.length})
                </CardTitle>
                <Button onClick={() => setShowAddTaskModal(true)} size="sm" className="bg-slate-900 hover:bg-slate-800 text-white w-full sm:w-auto">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="text-sm">Add Task</span>
                </Button>
              </div>
              {/* Search Bar */}
              <div className="mt-3 sm:mt-4">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search tasks..."
                />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  {searchTerm ? (
                    <>
                      <p className="text-gray-500 text-sm sm:text-base">No tasks found matching your search.</p>
                      <p className="text-gray-400 text-xs sm:text-sm">Try adjusting your search terms</p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm sm:text-base">No tasks assigned to this company yet.</p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm lg:text-base">{task.name}</p>
                            <p className="text-xs lg:text-sm text-gray-500">{task.description}</p>
                            <div className="sm:hidden mt-2 space-y-1">
                              <StatusBadge status={task.status} />
                              <p className="text-xs text-gray-500 md:hidden">{task.dueDate}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <StatusBadge status={task.status} />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{task.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEditTask(task)} className="text-xs sm:text-sm">
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setDeleteTaskModal({ show: true, task })} className="text-xs sm:text-sm">
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        show={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        title="Add New Task"
        description="Create a new task for this company"
        className="max-w-xs sm:max-w-lg lg:max-w-2xl mx-4 sm:mx-0"
      >
        <TaskForm
          onSubmit={handleTaskSubmit}
          onCancel={() => setShowAddTaskModal(false)}
          submitText="Add Task"
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        show={showTaskForm}
        onClose={() => {
          setShowTaskForm(false)
          setEditingTask(null)
        }}
        title="Edit Task"
        description="Update task details"
        className="max-w-xs sm:max-w-lg lg:max-w-2xl mx-4 sm:mx-0"
      >
        <TaskForm
          initialData={editingTask || undefined}
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
          submitText="Update Task"
        />
      </Modal>

      {/* Edit Company Modal */}
      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Company"
        description="Update company details"
        className="max-w-xs sm:max-w-lg lg:max-w-2xl mx-4 sm:mx-0"
      >
        <CompanyForm
          initialData={company}
          onSubmit={handleCompanySubmit}
          onCancel={() => setShowEditModal(false)}
          submitText="Save Changes"
        />
      </Modal>

      {/* Delete Company Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCompany}
        title="Delete Company"
        message={`Are you sure you want to delete "${company.name}"? This will permanently delete the company and all associated tasks. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Delete Task Confirmation Modal */}
      <ConfirmModal
        show={deleteTaskModal.show}
        onClose={() => setDeleteTaskModal({ show: false, task: null })}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete the task "${deleteTaskModal.task?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
      </div>
    </>
  )
}