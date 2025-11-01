import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CompanyList from './pages/CompanyList'
import CompanyPage from './pages/CompanyPage'
import TaskTemplates from './pages/TaskTemplates'
import UserProfile from './pages/UserProfile'
import Layout from './components/Layout'
import { fetchCompanies, createCompany, updateCompany as apiUpdateCompany, deleteCompany as apiDeleteCompany, fetchTasks, createTask, createTemplate, fetchTemplates, updateTask as apiUpdateTask, deleteTask as apiDeleteTask, deleteTemplate as apiDeleteTemplate, assignTemplate as apiAssignTemplate } from './services/api'

function App() {
  const [user, setUser] = useState(null)
  const [companies, setCompanies] = useState([])
  const [tasks, setTasks] = useState([])
  const [taskTemplates, setTaskTemplates] = useState([])
  const [modal, setModal] = useState({ show: false, type: '', message: '' })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedCompanies = localStorage.getItem('companies')
    const savedTasks = localStorage.getItem('tasks')
    const savedTemplates = localStorage.getItem('taskTemplates')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      loadTemplates()
    }
    if (savedCompanies) setCompanies(JSON.parse(savedCompanies))
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedTemplates) setTaskTemplates(JSON.parse(savedTemplates))
  }, [])

  // API: Fetch companies from server - Used in login to populate companies list
  const loadCompanies = async () => {
    try {
      const data = await fetchCompanies()
      if (data.companies) {
        const companiesWithIds = data.companies.map((company, index) => ({
          ...company,
          id: index + 1,
          stateIncorporated: company.stateIncorp,
          zipCode: company.zip
        }))
        setCompanies(companiesWithIds)
        localStorage.setItem('companies', JSON.stringify(companiesWithIds))
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    }
  }

  // API: Fetch tasks from server - Used in login to populate tasks list
  const loadTasks = async () => {
    try {
      const data = await fetchTasks()
      if (data.tasks) {
        setTasks(data.tasks)
        localStorage.setItem('tasks', JSON.stringify(data.tasks))
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  // API: Fetch templates from server - Used in TaskTemplates page
  const loadTemplates = async () => {
    try {
      const data = await fetchTemplates()
      if (data.templates) {
        setTaskTemplates(data.templates)
        localStorage.setItem('taskTemplates', JSON.stringify(data.templates))
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    }
  }

  const login = async (email) => {
    const userData = { email }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    await loadCompanies()
    await loadTasks()
    await loadTemplates()
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  // API: Create new company - Used in CompanyList page
  const addCompany = async (company) => {
    try {
      const result = await createCompany(company)
      
      if (result.status === 'success') {
        const newCompany = { ...company, id: result.id || Date.now() }
        const updatedCompanies = [...companies, newCompany]
        setCompanies(updatedCompanies)
        localStorage.setItem('companies', JSON.stringify(updatedCompanies))
        setModal({ show: true, type: 'success', message: 'Company added successfully!' })
        return { success: true, id: newCompany.id }
      } else {
        setModal({ show: true, type: 'error', message: 'Error: Failed to add company' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error creating company:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to add company' })
      return { success: false }
    }
  }

  // API: Update existing company - Used in CompanyPage when editing company details
  const updateCompany = async (id, updatedCompany) => {
    try {
      const result = await apiUpdateCompany(id, updatedCompany)
      
      if (result.status === 'success') {
        const updatedCompanies = companies.map(c => c.id === id ? { ...c, ...updatedCompany } : c)
        setCompanies(updatedCompanies)
        localStorage.setItem('companies', JSON.stringify(updatedCompanies))
        setModal({ show: true, type: 'success', message: 'Company updated successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: 'Error: Failed to update company' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error updating company:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to update company' })
      return { success: false }
    }
  }

  // API: Create new task - Used in CompanyPage when adding tasks
  const addTask = async (companyId, task) => {
    try {
      const taskData = { ...task, companyId }
      const result = await createTask(taskData)
      
      if (result.status === 'success') {
        const newTask = { ...task, id: result.id || Date.now(), companyId }
        const updatedTasks = [...tasks, newTask]
        setTasks(updatedTasks)
        localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        setModal({ show: true, type: 'success', message: 'Task created successfully!' })
        return { success: true, id: newTask.id }
      } else {
        setModal({ show: true, type: 'error', message: 'Error: Failed to create task' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error creating task:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to create task' })
      return { success: false }
    }
  }

  // API: Update existing task - Used in CompanyPage when editing tasks
  const updateTask = async (id, updatedTask) => {
    try {
      const result = await apiUpdateTask(id, updatedTask)
      
      if (result.status === 'success') {
        const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t)
        setTasks(updatedTasks)
        localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        setModal({ show: true, type: 'success', message: 'Task updated successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: 'Error: Failed to update task' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error updating task:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to update task' })
      return { success: false }
    }
  }

  // API: Create new template - Used in TaskTemplates page
  const addTaskTemplate = async (template) => {
    try {
      const result = await createTemplate(template)
      
      if (result.status === 'success') {
        const newTemplate = { ...template, id: result.id || Date.now() }
        const updatedTemplates = [...taskTemplates, newTemplate]
        setTaskTemplates(updatedTemplates)
        localStorage.setItem('taskTemplates', JSON.stringify(updatedTemplates))
        setModal({ show: true, type: 'success', message: 'Template created successfully!' })
        return { success: true, id: newTemplate.id }
      } else {
        setModal({ show: true, type: 'error', message: 'Error: Failed to create template' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error creating template:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to create template' })
      return { success: false }
    }
  }

  // API: Assign template to companies - Used in TaskTemplates page
  const assignTemplate = async (templateId, assignData) => {
    try {
      const result = await apiAssignTemplate(templateId, assignData)
      
      if (result.status === 'success') {
        const template = taskTemplates.find(t => t.id === templateId)
        if (template) {
          const newTasks = assignData.companyIds.map(companyId => ({
            id: Date.now() + Math.random(),
            companyId,
            name: template.name,
            startDate: assignData.startDate,
            dueDate: assignData.dueDate,
            status: 'Pending',
            completionDate: ''
          }))
          const updatedTasks = [...tasks, ...newTasks]
          setTasks(updatedTasks)
          localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        }
        setModal({ show: true, type: 'success', message: 'Template assigned successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: 'Error: Failed to assign template' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error assigning template:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to assign template' })
      return { success: false }
    }
  }

  // API: Delete company - Used in CompanyList when deleting company
  const deleteCompany = async (id) => {
    try {
      const result = await apiDeleteCompany(id)
      
      if (result.status === 'success') {
        const updatedCompanies = companies.filter(c => c.id != id)
        const updatedTasks = tasks.filter(t => t.companyId != id)
        setCompanies(updatedCompanies)
        setTasks(updatedTasks)
        localStorage.setItem('companies', JSON.stringify(updatedCompanies))
        localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        setModal({ show: true, type: 'success', message: 'Company deleted successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: 'Error: Failed to delete company' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to delete company' })
      return { success: false }
    }
  }

  // API: Delete task - Used in CompanyPage when deleting tasks
  const deleteTask = async (id) => {
    try {
      const result = await apiDeleteTask(id)
      
      if (result.status === 'success') {
        const updatedTasks = tasks.filter(t => t.id !== id)
        setTasks(updatedTasks)
        localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        setModal({ show: true, type: 'success', message: 'Task deleted successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: 'Error: Failed to delete task' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to delete task' })
      return { success: false }
    }
  }

  // API: Delete template - Used in TaskTemplates page when deleting templates
  const deleteTemplate = async (id) => {
    try {
      const result = await apiDeleteTemplate(id)
      
      if (result.status === 'success') {
        const updatedTemplates = taskTemplates.filter(t => t.id !== id)
        setTaskTemplates(updatedTemplates)
        localStorage.setItem('taskTemplates', JSON.stringify(updatedTemplates))
        setModal({ show: true, type: 'success', message: 'Template deleted successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: 'Error: Failed to delete template' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to delete template' })
      return { success: false }
    }
  }

  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }



  if (!user) {
    return <Login onLogin={login} />
  }

  return (
    <Router>
      <Layout user={user} onLogout={logout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard tasks={tasks} companies={companies} />} />
          <Route path="/companies" element={<CompanyList companies={companies} onAddCompany={addCompany} onDeleteCompany={deleteCompany} />} />
          <Route path="/company/:id" element={<CompanyPage companies={companies} tasks={tasks} onUpdateCompany={updateCompany} onAddTask={addTask} onUpdateTask={updateTask} onDeleteTask={deleteTask} taskTemplates={taskTemplates} onAssignTemplate={assignTemplate} />} />
          <Route path="/task-templates" element={<TaskTemplates taskTemplates={taskTemplates} onAddTemplate={addTaskTemplate} onAssignTemplate={assignTemplate} onDeleteTemplate={deleteTemplate} companies={companies} />} />
          <Route path="/profile" element={<UserProfile user={user} onUpdateProfile={updateProfile} />} />
        </Routes>
        
        {/* Modal */}
        {modal.show && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  modal.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className={`text-sm font-bold ${
                    modal.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {modal.type === 'success' ? '✓' : '✕'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {modal.type === 'success' ? 'Success' : 'Error'}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">{modal.message}</p>
              <button
                onClick={() => setModal({ show: false, type: '', message: '' })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </Layout>
    </Router>
  )
}

export default App
