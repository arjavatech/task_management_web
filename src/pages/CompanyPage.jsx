import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2, MapPin, Phone, Mail, Calendar, Edit, Plus, FileText, ArrowLeft, CheckCircle, Clock, AlertCircle, Trash2, BarChart3, Search } from 'lucide-react'

export default function CompanyPage({ companies, tasks, onUpdateCompany, onAddTask, onUpdateTask, onDeleteTask, taskTemplates, onAssignTemplate }) {
  const { id } = useParams()
  const company = companies.find(c => c.id === id)
  const companyTasks = tasks.filter(t => t.companyId === id)
  
  const [editingCompany, setEditingCompany] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  
  const [companyData, setCompanyData] = useState(company || {})
  const [taskData, setTaskData] = useState({
    name: '', description: '', dueDate: '', status: 'Pending', completionDate: ''
  })
  const [filterYear, setFilterYear] = useState(0) // 0 means show all years
  const [filterMonth, setFilterMonth] = useState(0) // 0 means show all months

  if (!company) {
    return <div className="px-4">Company not found</div>
  }

  const handleCompanySubmit = (e) => {
    e.preventDefault()
    onUpdateCompany(company.id, companyData)
    setShowEditModal(false)
  }

  const handleTaskSubmit = (e) => {
    e.preventDefault()
    if (editingTask) {
      onUpdateTask(editingTask.id, company.id, taskData)
      setEditingTask(null)
    } else {
      onAddTask(company.id, taskData)
    }
    setTaskData({ name: '', description: '', dueDate: '', status: 'Pending', completionDate: '' })
    setShowTaskForm(false)
  }

  const startEditTask = (task) => {
    setTaskData(task)
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const filteredTasks = companyTasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/companies">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="h-6 lg:h-8 w-6 lg:w-8 text-blue-600" />
              <span className="break-words">{company.name}</span>
            </h1>
            <p className="text-gray-600 text-base lg:text-lg mt-1">Company Profile & Task Management</p>
          </div>
        </div>
      </div>

      {/* Company Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{companyTasks.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{companyTasks.filter(t => t.status === 'Done').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{companyTasks.filter(t => t.status === 'In Progress').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {companyTasks.filter(t => {
                    if (!t.dueDate || t.status === 'Done') return false
                    return new Date(t.dueDate) < new Date()
                  }).length || 0}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chart Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div>
              <Label htmlFor="filterYear">Year</Label>
              <Select value={filterYear.toString()} onValueChange={(value) => setFilterYear(parseInt(value))}>
                <SelectTrigger className="w-32">
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
            <div>
              <Label htmlFor="filterMonth">Month</Label>
              <Select value={filterMonth.toString()} onValueChange={(value) => setFilterMonth(parseInt(value))}>
                <SelectTrigger className="w-40">
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
            <div className="text-sm text-gray-600">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Weekly Task Trend Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Weekly Task Trend
            </CardTitle>
            <CardDescription>Weekly task completion progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-64">
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-2">
                <span>10</span>
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
                <span>0</span>
              </div>
              
              <div className="ml-8 h-full flex items-end justify-between px-4">
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
                      <div key={day} className="flex flex-col items-center space-y-2">
                        <div className="flex flex-col items-center w-8">
                          <div 
                            className="w-full rounded" 
                            style={{ 
                              height: `${Math.max((completed / maxHeight) * 200, 5)}px`,
                              background: 'linear-gradient(to top, #3b82f6, #60a5fa)'
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{day}</span>
                        <span className="text-xs text-gray-400">{completed}</span>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-600">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span>Completed Tasks</span>
            </div>
          </CardContent>
        </Card>

        {/* Task Status Line Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Task Status Trend
            </CardTitle>
            <CardDescription>Cumulative completed tasks over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-64">
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-2">
                <span>20</span>
                <span>15</span>
                <span>10</span>
                <span>5</span>
                <span>0</span>
              </div>
              
              <div className="ml-8 h-full relative">
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
                      x: 20 + (i * 40),
                      y: 200 - ((cumulative / maxCompleted) * 180)
                    })
                  }
                  
                  const pathData = `M ${cumulativePoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
                  const areaData = `${pathData} L ${cumulativePoints[cumulativePoints.length - 1].x} 220 L 20 220 Z`
                  
                  return (
                    <svg className="absolute inset-0 w-full h-full">
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      <path d={areaData} fill="url(#areaGradient)" />
                      <path d={pathData} stroke="#3b82f6" strokeWidth="3" fill="none" />
                      <line 
                        x1={20 + (3 * 40)} 
                        y1="0" 
                        x2={20 + (3 * 40)} 
                        y2="220" 
                        stroke="#ef4444" 
                        strokeWidth="2" 
                        strokeDasharray="5,5"
                      />
                    </svg>
                  )
                })()}
                
                <div className="absolute bottom-0 w-full flex justify-between px-4 text-xs text-gray-600">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <span key={day} className={index === 3 ? 'text-red-500 font-semibold' : ''}>
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>Cumulative Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500" style={{ borderStyle: 'dashed' }} />
                <span>Current Day</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Company Information */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Company Information
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    console.log('Edit button clicked', company)
                    console.log('Current showEditModal state:', showEditModal)
                    setCompanyData(company)
                    setShowEditModal(true)
                    console.log('After setting showEditModal to true')
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">EIN</p>
                    <p className="text-gray-600">{company.ein}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Start Date</p>
                    <p className="text-gray-600">{new Date(company.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">State Incorporated</p>
                    <p className="text-gray-600">{company.stateIncorporated}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Contact Person</p>
                    <p className="text-gray-600">{company.contactName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">{company.contactPhone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Tasks ({filteredTasks.length})
                </CardTitle>
                <Button onClick={() => setShowTaskForm(!showTaskForm)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  {showTaskForm ? 'Cancel' : 'Add Task'}
                </Button>
              </div>
              {/* Search Bar */}
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tasks by name, description, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showTaskForm && (
                <form onSubmit={handleTaskSubmit} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="taskName">Task Name</Label>
                    <Input 
                      id="taskName" 
                      value={taskData.name} 
                      onChange={(e) => setTaskData({...taskData, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskDescription">Description</Label>
                    <Input 
                      id="taskDescription" 
                      value={taskData.description} 
                      onChange={(e) => setTaskData({...taskData, description: e.target.value})} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskDueDate">Due Date</Label>
                    <Input 
                      id="taskDueDate" 
                      type="date" 
                      value={taskData.dueDate} 
                      onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskStatus">Status</Label>
                    <Select value={taskData.status} onValueChange={(value) => setTaskData({...taskData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {editingTask ? 'Update Task' : 'Add Task'}
                  </Button>
                </form>
              )}

              {filteredTasks.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  {searchTerm ? (
                    <>
                      <p className="text-gray-500">No tasks found matching your search.</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search terms</p>
                    </>
                  ) : (
                    <p className="text-gray-500">No tasks assigned to this company yet.</p>
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
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === 'Done' ? 'bg-green-100 text-green-800' :
                                task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {task.status}
                              </span>
                              <p className="text-xs text-gray-500 md:hidden">{task.dueDate}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === 'Done' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{task.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEditTask(task)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onDeleteTask(task.id, company.id)}>
                              <Trash2 className="h-4 w-4" />
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

      {/* Edit Company Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Edit company details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input 
                    id="name" 
                    value={companyData.name || ''} 
                    onChange={(e) => setCompanyData({...companyData, name: e.target.value})} 
                  />
                </div>
                <div>
                  <Label htmlFor="ein">EIN</Label>
                  <Input 
                    id="ein" 
                    value={companyData.ein || ''} 
                    onChange={(e) => setCompanyData({...companyData, ein: e.target.value})} 
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input 
                    id="contactName" 
                    value={companyData.contactName || ''} 
                    onChange={(e) => setCompanyData({...companyData, contactName: e.target.value})} 
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input 
                    id="contactPhone" 
                    value={companyData.contactPhone || ''} 
                    onChange={(e) => setCompanyData({...companyData, contactPhone: e.target.value})} 
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowEditModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}