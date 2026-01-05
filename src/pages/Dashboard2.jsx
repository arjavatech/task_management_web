import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2, CheckCircle, Clock, AlertCircle, TrendingUp, Calendar, ChevronLeft, ChevronRight, Search, BarChart3, Plus } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

export default function Dashboard2({ tasks, companies }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ year: 'all', status: 'all' })
  const itemsPerSlide = 3

  const getWeekStart = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek
    return new Date(now.setDate(diff))
  }

  const getWeekEnd = () => {
    const weekStart = getWeekStart()
    return new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
  }

  const weekStart = getWeekStart()
  const weekEnd = getWeekEnd()

  const tasksThisWeek = tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    return dueDate >= weekStart && dueDate <= weekEnd
  })

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId)
    return company ? company.name : 'Unknown Company'
  }

  // Statistics calculations
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'Done').length
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate)
    return dueDate < new Date() && task.status !== 'Done'
  }).length || 0

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-blue-50 xl:mt-0 mt-6">
      {/* Header Bar */}
      <div className="hidden xl:block bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Monitor your company tasks and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <BarChart3 className="h-5 w-5" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <Link to="/companies">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 lg:p-8 space-y-8">

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Total Companies</p>
                <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
              </div>
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Completed Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">{completionRate}% completion rate</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{inProgressTasks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Overdue Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{overdueTasks}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Company Overview Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                 
                  Company Overview
                </h2>
                <p className="text-gray-600 mt-1">Task distribution across all companies</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {companies.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
                <p className="text-gray-500 mb-6">Add companies to see task distribution</p>
                <Link to="/companies">
                  <Button>Add Your First Company</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Total Tasks</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Completed</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">In Progress</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Pending</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Overdue</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Progress</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies
                      .filter(company => 
                        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        company.contactName.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(company => {
                        let companyTasks = tasks.filter(task => task.companyId === company.id)
                        
                        if (filters.year !== 'all') {
                          companyTasks = companyTasks.filter(task => {
                            const taskYear = new Date(task.dueDate).getFullYear().toString()
                            return taskYear === filters.year
                          })
                        }
                        
                        const totalTasks = companyTasks.length
                        const completedTasks = companyTasks.filter(task => task.status === 'Done').length
                        const inProgressTasks = companyTasks.filter(task => task.status === 'In Progress').length
                        const pendingTasks = companyTasks.filter(task => task.status === 'Pending').length
                        const overdueTasks = companyTasks.filter(task => {
                          const dueDate = new Date(task.dueDate)
                          return dueDate < new Date() && task.status !== 'Done'
                        }).length
                        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
                        
                        return (
                          <tr key={company.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                                  <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{company.name}</p>
                                  <p className="text-sm text-gray-500">{company.contactName}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="font-semibold text-gray-900">{totalTasks}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="font-semibold text-green-600">{completedTasks}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="font-semibold text-blue-600">{inProgressTasks}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="font-semibold text-gray-600">{pendingTasks}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="font-semibold text-red-600">{overdueTasks}</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 bg-slate-900 rounded-full transition-all duration-300" 
                                    style={{ width: `${progressPercentage}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <Link to={`/company/${company.id}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Tasks This Week - List View */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-gray-600" />
                      Tasks Due This Week
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{tasksThisWeek.length}</p>
                    <p className="text-sm text-gray-500">tasks</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {tasksThisWeek.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks due this week</h3>
                    <p className="text-gray-500">Enjoy your productive week!</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {tasksThisWeek.map(task => {
                      const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done'
                      const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                      
                      return (
                        <div key={task.id} className={`flex items-center justify-between p-4 rounded-lg border-l-4 hover:bg-gray-50 transition-colors ${
                          isOverdue ? 'border-l-red-500 bg-red-50' :
                          task.status === 'Done' ? 'border-l-green-500 bg-green-50' :
                          task.status === 'In Progress' ? 'border-l-blue-500 bg-blue-50' :
                          'border-l-gray-300 bg-white'
                        }`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900 truncate">{task.name}</h4>
                              {isOverdue && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Overdue
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <Link 
                                to={`/company/${task.companyId}`}
                                className="inline-flex items-center hover:text-gray-900 transition-colors"
                              >
                                <Building2 className="w-4 h-4 mr-1" />
                                {getCompanyName(task.companyId)}
                              </Link>
                              
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                  {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` :
                                   daysUntilDue === 0 ? 'Due today' :
                                   daysUntilDue === 1 ? 'Due tomorrow' :
                                   `Due in ${daysUntilDue} days`}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              task.status === 'Done' ? 'bg-green-100 text-green-800' :
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {task.status === 'Done' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                               task.status === 'In Progress' ? <Clock className="w-3 h-3 mr-1" /> :
                               <AlertCircle className="w-3 h-3 mr-1" />}
                              {task.status}
                            </span>
                            
                            <span className="text-xs text-gray-500">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Stats Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                Task Overview
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-semibold text-gray-900">{totalTasks}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-gray-600">{pendingTasks}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">{inProgressTasks}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{completedTasks}</span>
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-600">Completion Rate</span>
                    <span className="font-bold text-gray-900">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 bg-slate-900 rounded-full transition-all duration-300" 
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link to="/companies" className="block">
                  <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Manage Companies</p>
                      <p className="text-sm text-gray-500">Add or edit company profiles</p>
                    </div>
                  </div>
                </Link>
                
                {companies.length > 0 && (
                  <Link to={`/company/${companies[0].id}`} className="block">
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Add New Task</p>
                        <p className="text-sm text-gray-500">Create tasks for your companies</p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}