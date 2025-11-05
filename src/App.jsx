import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CompanyList from './pages/CompanyList'
import CompanyPage from './pages/CompanyPage'
import TaskTemplates from './pages/TaskTemplates'
import UserProfile from './pages/UserProfile'
import Layout from './components/Layout'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { logoutUser } from './firebase/config'
import {
  getCompanies,
  createCompany,
  updateCompany as apiUpdateCompany,
  deleteCompany as apiDeleteCompany,
  getTasks,
  createTask,
  createTaskTemplate,
  getTaskTemplates,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  deleteTaskTemplate as apiDeleteTemplate,
  assignTemplate as apiAssignTemplate,
  getCurrentUser
} from './services/firebaseService'

function AppContent() {
  const { user, userProfile, loading, updateUserProfile } = useAuth()
  const [companies, setCompanies] = useState([])
  const [tasks, setTasks] = useState([])
  const [taskTemplates, setTaskTemplates] = useState([])
  const [modal, setModal] = useState({ show: false, type: '', message: '' })
  const [dataLoading, setDataLoading] = useState(false)

  // Load data when user logs in
  useEffect(() => {
    if (user && userProfile) {
      loadData()
    } else {
      // Clear data when user logs out
      setCompanies([])
      setTasks([])
      setTaskTemplates([])
    }
  }, [user, userProfile])

  const loadData = async () => {
    if (!user) return

    setDataLoading(true)
    try {
      console.log('Loading data for user:', user.uid)

      // Load all data in parallel
      const [companiesResult, tasksResult, templatesResult] = await Promise.all([
        getCompanies(user.uid),
        getTasks(user.uid),
        getTaskTemplates(user.uid)
      ])

      console.log('Companies result:', companiesResult)
      console.log('Tasks result:', tasksResult)
      console.log('Templates result:', templatesResult)

      if (companiesResult.success) {
        setCompanies(companiesResult.data || [])
        console.log('Companies loaded:', companiesResult.data?.length || 0)
      } else {
        console.error('Failed to load companies:', companiesResult.error)
        setModal({ show: true, type: 'error', message: `Failed to load companies: ${companiesResult.error}` })
      }

      if (tasksResult.success) {
        setTasks(tasksResult.data || [])
        console.log('Tasks loaded:', tasksResult.data?.length || 0)
      } else {
        console.error('Failed to load tasks:', tasksResult.error)
      }

      if (templatesResult.success) {
        setTaskTemplates(templatesResult.data || [])
        console.log('Templates loaded:', templatesResult.data?.length || 0)
      } else {
        console.error('Failed to load templates:', templatesResult.error)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setModal({ show: true, type: 'error', message: `Failed to load data: ${error.message}` })
    } finally {
      setDataLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      // Data will be cleared automatically by the useEffect
    } catch (error) {
      console.error('Error logging out:', error)
      setModal({ show: true, type: 'error', message: 'Failed to logout' })
    }
  }

  // Company operations
  const addCompany = async (company) => {
    try {
      const result = await createCompany(user.uid, company)

      if (result.success) {
        await loadData() // Reload data to get the new company
        setModal({ show: true, type: 'success', message: 'Company added successfully!' })
        return { success: true, id: result.id }
      } else {
        setModal({ show: true, type: 'error', message: result.error || 'Failed to add company' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error creating company:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to add company' })
      return { success: false }
    }
  }

  const updateCompany = async (id, updatedCompany) => {
    try {
      const result = await apiUpdateCompany(user.uid, id, updatedCompany)

      if (result.success) {
        await loadData() // Reload data to get updated company
        setModal({ show: true, type: 'success', message: 'Company updated successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: result.error || 'Failed to update company' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error updating company:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to update company' })
      return { success: false }
    }
  }

  const deleteCompany = async (id) => {
    try {
      const result = await apiDeleteCompany(user.uid, id)

      if (result.success) {
        await loadData() // Reload data to reflect deletion
        setModal({ show: true, type: 'success', message: 'Company deleted successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: result.error || 'Failed to delete company' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to delete company' })
      return { success: false }
    }
  }

  // Task operations
  const addTask = async (companyId, task) => {
    try {
      const result = await createTask(user.uid, companyId, task)

      if (result.success) {
        await loadData() // Reload data to get the new task
        setModal({ show: true, type: 'success', message: 'Task created successfully!' })
        return { success: true, id: result.id }
      } else {
        setModal({ show: true, type: 'error', message: result.error || 'Failed to create task' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error creating task:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to create task' })
      return { success: false }
    }
  }

  const updateTask = async (id, companyId, updatedTask) => {
    try {
      const result = await apiUpdateTask(user.uid, companyId, id, updatedTask)

      if (result.success) {
        await loadData() // Reload data to get updated task
        setModal({ show: true, type: 'success', message: 'Task updated successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: result.error || 'Failed to update task' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error updating task:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to update task' })
      return { success: false }
    }
  }

  const deleteTask = async (id, companyId) => {
    try {
      const result = await apiDeleteTask(user.uid, companyId, id)

      if (result.success) {
        await loadData() // Reload data to reflect deletion
        setModal({ show: true, type: 'success', message: 'Task deleted successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: result.error || 'Failed to delete task' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to delete task' })
      return { success: false }
    }
  }

  // Template operations
  const addTaskTemplate = async (template) => {
    try {
      const result = await createTaskTemplate(user.uid, template)

      if (result.success) {
        await loadData() // Reload data to get the new template
        setModal({ show: true, type: 'success', message: 'Template created successfully!' })
        return { success: true, id: result.id }
      } else {
        setModal({ show: true, type: 'error', message: result.error || 'Failed to create template' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error creating template:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to create template' })
      return { success: false }
    }
  }

  const assignTemplate = async (templateId, assignData) => {
    try {
      const result = await apiAssignTemplate(user.uid, templateId, assignData)

      if (result.success) {
        await loadData() // Reload data to get new tasks from template assignment
        setModal({
          show: true,
          type: 'success',
          message: `Template assigned successfully! ${result.tasksCreated || 0} tasks created.`
        })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: result.error || 'Failed to assign template' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error assigning template:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to assign template' })
      return { success: false }
    }
  }

  const deleteTemplate = async (id) => {
    try {
      const result = await apiDeleteTemplate(user.uid, id)

      if (result.success) {
        await loadData() // Reload data to reflect deletion
        setModal({ show: true, type: 'success', message: 'Template deleted successfully!' })
        return { success: true }
      } else {
        setModal({ show: true, type: 'error', message: result.error || 'Failed to delete template' })
        return { success: false }
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      setModal({ show: true, type: 'error', message: 'Error: Failed to delete template' })
      return { success: false }
    }
  }

  const updateProfile = async (profileData) => {
    const result = await updateUserProfile(profileData)

    if (result.success) {
      setModal({ show: true, type: 'success', message: 'Profile updated successfully!' })
    } else {
      setModal({ show: true, type: 'error', message: result.error || 'Failed to update profile' })
    }

    return result
  }

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show data loading screen
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        <Route path="/dashboard" element={
          user ? (
            <Layout user={userProfile || user} onLogout={logout}>
              <Dashboard tasks={tasks} companies={companies} />
            </Layout>
          ) : <Navigate to="/login" />
        } />
        <Route path="/companies" element={
          user ? (
            <Layout user={userProfile || user} onLogout={logout}>
              <CompanyList
                companies={companies}
                onAddCompany={addCompany}
                onDeleteCompany={deleteCompany}
              />
            </Layout>
          ) : <Navigate to="/login" />
        } />
        <Route path="/company/:id" element={
          user ? (
            <Layout user={userProfile || user} onLogout={logout}>
              <CompanyPage
                companies={companies}
                tasks={tasks}
                onUpdateCompany={updateCompany}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                taskTemplates={taskTemplates}
                onAssignTemplate={assignTemplate}
              />
            </Layout>
          ) : <Navigate to="/login" />
        } />
        <Route path="/task-templates" element={
          user ? (
            <Layout user={userProfile || user} onLogout={logout}>
              <TaskTemplates
                taskTemplates={taskTemplates}
                onAddTemplate={addTaskTemplate}
                onAssignTemplate={assignTemplate}
                onDeleteTemplate={deleteTemplate}
                companies={companies}
              />
            </Layout>
          ) : <Navigate to="/login" />
        } />
        <Route path="/profile" element={
          user ? (
            <Layout user={userProfile || user} onLogout={logout}>
              <UserProfile
                user={userProfile || user}
                onUpdateProfile={updateProfile}
              />
            </Layout>
          ) : <Navigate to="/login" />
        } />
      </Routes>

      {/* Global Modal */}
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
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App