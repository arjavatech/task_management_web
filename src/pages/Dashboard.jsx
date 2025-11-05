import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2, CheckCircle, Clock, AlertCircle, TrendingUp, Calendar, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

export default function Dashboard({ tasks, companies }) {
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
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-base lg:text-lg">Overview of your task management system</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
                <p className="text-xs text-green-600">{completionRate}% completion rate</p>
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
                <p className="text-3xl font-bold text-gray-900">{inProgressTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{overdueTasks}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Task Overview */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                <Building2 className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                <span className="text-base lg:text-xl">Company Task Overview</span>
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">Task distribution across all companies</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-48"
                />
              </div>
              <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                <SelectTrigger className="w-full sm:w-32">
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
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No companies yet</p>
              <p className="text-gray-400 text-sm">Add companies to see task distribution</p>
            </div>
          ) : (
            <div className="relative">
              {/* Carousel Navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="flex items-center gap-1 w-full sm:w-auto"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                <div className="flex space-x-2 order-first sm:order-none">
                  {Array.from({ length: Math.ceil(companies.length / itemsPerSlide) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentSlide === index ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlide(Math.min(Math.ceil(companies.length / itemsPerSlide) - 1, currentSlide + 1))}
                  disabled={currentSlide >= Math.ceil(companies.length / itemsPerSlide) - 1}
                  className="flex items-center gap-1 w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Carousel Content */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: Math.ceil(companies.length / itemsPerSlide) }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {companies
                          .filter(company => 
                            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            company.contactName.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                          .map(company => {
                            let companyTasks = tasks.filter(task => task.companyId === company.id)
                            
                            // Apply year filter
                            if (filters.year !== 'all') {
                              companyTasks = companyTasks.filter(task => {
                                const taskYear = new Date(task.dueDate).getFullYear().toString()
                                return taskYear === filters.year
                              })
                            }
                            
                            // Apply status filter
                            if (filters.status !== 'all') {
                              if (filters.status === 'completed') {
                                companyTasks = companyTasks.filter(task => task.status === 'Done')
                              } else if (filters.status === 'pending') {
                                companyTasks = companyTasks.filter(task => task.status === 'Pending')
                              } else if (filters.status === 'inprogress') {
                                companyTasks = companyTasks.filter(task => task.status === 'In Progress')
                              }
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
                              <Link key={company.id} to={`/company/${company.id}`}>
                                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-yellow-500 hover:border-l-yellow-600">
                                  <CardContent className="p-3 sm:p-4">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{company.name}</h3>
                                        <p className="text-xs text-gray-500">{totalTasks} total tasks</p>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 sm:space-y-2 sm:block">
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
                                        <span className="text-gray-600">Completed</span>
                                        <span className="font-medium text-green-600">{completedTasks}</span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
                                        <span className="text-gray-600">In Progress</span>
                                        <span className="font-medium text-yellow-600">{inProgressTasks}</span>
                                      </div>
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
                                        <span className="text-gray-600">Pending</span>
                                        <span className="font-medium text-gray-600">{pendingTasks}</span>
                                      </div>
                                      {overdueTasks >= 0 && (
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
                                          <span className="text-red-600">Overdue</span>
                                          <span className="font-medium text-red-600">{overdueTasks}</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t">
                                      <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-gray-500">Progress</span>
                                        <span className="text-gray-700 font-medium">{progressPercentage}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300" 
                                          style={{ width: `${progressPercentage}%` }}
                                        />
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            )
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Tasks This Week */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Tasks Due This Week
                </CardTitle>
                <CardDescription>
                  {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{tasksThisWeek.length}</p>
                <p className="text-xs text-gray-500">tasks</p>
              </div>
            </CardHeader>
            <CardContent>
              {tasksThisWeek.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No tasks due this week</p>
                  <p className="text-gray-400 text-sm">Enjoy your productive week!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tasksThisWeek.map(task => {
                    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done'
                    const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
                    
                    return (
                      <div key={task.id} className={`group relative overflow-hidden rounded-xl border-l-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
                        isOverdue ? 'border-l-red-500 bg-red-50' :
                        task.status === 'Done' ? 'border-l-green-500' :
                        task.status === 'In Progress' ? 'border-l-yellow-500' :
                        'border-l-blue-500'
                      }`}>
                        <div className="p-3 lg:p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900 truncate">{task.name}</h4>
                                {isOverdue && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Overdue
                                  </span>
                                )}
                              </div>
                              
                              {task.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                              )}
                              
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
                                <Link 
                                  to={`/company/${task.companyId}`}
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                  <Building2 className="w-4 h-4 mr-1" />
                                  {getCompanyName(task.companyId)}
                                </Link>
                                
                                <div className="flex items-center text-gray-500">
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
                            
                            <div className="flex flex-col items-end gap-2 ml-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                task.status === 'Done' ? 'bg-green-100 text-green-800' :
                                task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {task.status === 'Done' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                                 task.status === 'In Progress' ? <Clock className="w-3 h-3 mr-1" /> :
                                 <AlertCircle className="w-3 h-3 mr-1" />}
                                {task.status}
                              </span>
                              
                              <div className="text-xs text-gray-400">
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress indicator for overdue/urgent tasks */}
                          {(isOverdue || daysUntilDue <= 2) && task.status !== 'Done' && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between text-xs">
                                <span className={isOverdue ? 'text-red-600 font-medium' : 'text-yellow-600 font-medium'}>
                                  {isOverdue ? '⚠️ Requires immediate attention' : '🔔 Due soon'}
                                </span>
                                <Link 
                                  to={`/company/${task.companyId}`}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  View Details →
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          {/* Task Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Task Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Tasks</span>
                <span className="font-semibold">{totalTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-gray-600">{pendingTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-semibold text-yellow-600">{inProgressTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-blue-600">{completedTasks}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm font-bold text-blue-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/companies" className="block">
                <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Manage Companies</p>
                      <p className="text-xs text-gray-500">Add or edit company profiles</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              {companies.length > 0 && (
                <Link to={`/company/${companies[0].id}`} className="block">
                  <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Add New Task</p>
                        <p className="text-xs text-gray-500">Create tasks for your companies</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}