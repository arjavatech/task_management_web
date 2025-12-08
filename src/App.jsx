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
import { getCompanies, getTasks, getTaskTemplates } from './services/firebaseService'
import { useCompanies, useTasks, useTemplates } from './hooks'
import { LoadingSpinner } from './components/common'

function AppContent() {
  const { user, userProfile, loading, updateUserProfile } = useAuth()
  const [companies, setCompanies] = useState([])
  const [tasks, setTasks] = useState([])
  const [taskTemplates, setTaskTemplates] = useState([])
  const [modal, setModal] = useState({ show: false, type: '', message: '' })
  const [dataLoading, setDataLoading] = useState(false)

  const showModal = (type, message) => {
    setModal({ show: true, type, message })
  }

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

  const { addCompany, editCompany, removeCompany } = useCompanies(loadData, showModal)
  const { addTask, editTask, removeTask } = useTasks(loadData, showModal)
  const { addTemplate, removeTemplate, assignTemplateToCompanies } = useTemplates(loadData, showModal)

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

  const logout = async () => {
    try {
      await logoutUser()
      // Data will be cleared automatically by the useEffect
    } catch (error) {
      console.error('Error logging out:', error)
      setModal({ show: true, type: 'error', message: 'Failed to logout' })
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

  if (loading) {
    return <LoadingSpinner />
  }

  if (dataLoading) {
    return <LoadingSpinner message="Loading your data..." />
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
                onUpdateCompany={editCompany}
                onDeleteCompany={removeCompany}
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
                onUpdateCompany={editCompany}
                onAddTask={addTask}
                onUpdateTask={editTask}
                onDeleteTask={removeTask}
                taskTemplates={taskTemplates}
                onAssignTemplate={assignTemplateToCompanies}
              />
            </Layout>
          ) : <Navigate to="/login" />
        } />
        <Route path="/task-templates" element={
          user ? (
            <Layout user={userProfile || user} onLogout={logout}>
              <TaskTemplates
                taskTemplates={taskTemplates}
                onAddTemplate={addTemplate}
                onAssignTemplate={assignTemplateToCompanies}
                onDeleteTemplate={removeTemplate}
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