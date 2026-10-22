/**
 * App.jsx — root component and application shell.
 *
 * Responsibilities:
 *  - Wraps everything in AuthProvider (Firebase Auth context)
 *  - Owns the top-level data state: companies, tasks, taskTemplates
 *  - Loads all data in parallel on user login; clears it on logout
 *  - Passes CRUD callbacks down to page components via props
 *  - Renders global UI: loading overlay, success toast, error modal, sign-out confirm
 */
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CompanyList from "./pages/CompanyList"
import CompanyPage from "./pages/CompanyPage"
import TaskTemplates from "./pages/TaskTemplates"
import UserProfile from "./pages/UserProfile"
import Layout from "./components/Layout"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { logoutUser } from "./firebase/config"
import { getCompanies, getTasks, getTaskTemplates } from "./services/api"
import { useCompanies, useTasks, useTemplates } from "./hooks"
import { LoadingSpinner, ErrorBoundary } from "./components/common"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

/**
 * Reset the ErrorBoundary whenever the user navigates to a different route,
 * so a crash on one page doesn't block the rest of the app.
 */
function BoundaryByRoute({ children }) {
  const location = useLocation()
  return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>
}

/** Inner app that can access AuthContext (must live inside <AuthProvider>). */
function AppContent() {
  const { user, userProfile, loading, updateUserProfile } = useAuth()

  // ── Top-level data state ───────────────────────────────────────────────
  const [companies, setCompanies] = useState([])
  const [tasks, setTasks] = useState([])
  const [taskTemplates, setTaskTemplates] = useState([])

  // ── UI state ───────────────────────────────────────────────────────────
  const [modal, setModal] = useState({ show: false, type: "", message: "" })
  const [dataLoading, setDataLoading] = useState(false)
  const [showConfirmSignout, setShowConfirmSignout] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)

  /**
   * Show a success toast (auto-dismissed after 3 s) or an error modal.
   * @param {'success'|'error'} type
   * @param {string} message
   */
  const showModal = (type, message) => {
    setModal({ show: true, type, message })
    // Auto-dismiss success toasts after 3 seconds
    if (type === "success") {
      setTimeout(() => setModal({ show: false, type: "", message: "" }), 3000)
    }
  }

  /**
   * Fetch companies, tasks, and templates in parallel from Firestore.
   * Called on login and after any CRUD mutation (via onDataChange callbacks).
   */
  const loadData = async () => {
    if (!user) return

    setDataLoading(true)
    try {
      const [companiesResult, tasksResult, templatesResult] = await Promise.all([
        getCompanies(),
        getTasks(),
        getTaskTemplates(),
      ])

      if (companiesResult.success) {
        setCompanies(companiesResult.data || [])
      } else {
        console.error("Failed to load companies:", companiesResult.error)
        setModal({ show: true, type: "error", message: `Failed to load companies: ${companiesResult.error}` })
      }

      if (tasksResult.success) {
        setTasks(tasksResult.data || [])
      } else {
        console.error("Failed to load tasks:", tasksResult.error)
      }

      if (templatesResult.success) {
        setTaskTemplates(templatesResult.data || [])
      } else {
        console.error("Failed to load templates:", templatesResult.error)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setModal({ show: true, type: "error", message: `Failed to load data: ${error.message}` })
    } finally {
      setDataLoading(false)
    }
  }

  // ── CRUD hooks (pass loadData as the refresh callback) ─────────────────
  const { addCompany, editCompany, removeCompany, loading: companiesLoading } = useCompanies(loadData, showModal)
  const { addTask, editTask, removeTask, loading: tasksLoading } = useTasks(loadData, showModal)
  const { addTemplate, removeTemplate, assignTemplateToCompanies, loading: templatesLoading } = useTemplates(loadData, showModal)

  // Load data when auth resolves and a profile is available; clear on logout
  useEffect(() => {
    if (user && userProfile) {
      loadData()
    } else {
      setCompanies([])
      setTasks([])
      setTaskTemplates([])
    }
  }, [user, userProfile])

  // ── Auth actions ───────────────────────────────────────────────────────

  /** Open the sign-out confirmation modal instead of logging out immediately. */
  const logout = async () => setShowConfirmSignout(true)

  const confirmLogout = async () => {
    try {
      await logoutUser()
      setShowConfirmSignout(false)
      // useEffect above will clear state once user becomes null
    } catch (error) {
      console.error("Error logging out:", error)
      setShowConfirmSignout(false)
      setModal({ show: true, type: "error", message: "Failed to logout" })
    }
  }

  /** Update the current user's Firestore profile and show feedback. */
  const updateProfile = async (profileData) => {
    setProfileLoading(true)
    const result = await updateUserProfile(profileData)
    setProfileLoading(false)

    if (result.success) {
      setModal({ show: true, type: "success", message: "Profile updated successfully!" })
    } else {
      setModal({ show: true, type: "error", message: result.error || "Failed to update profile" })
    }

    return result
  }

  // Block render until the initial Firebase auth check resolves
  if (loading) return <LoadingSpinner />

  return (
    <Router>
      <BoundaryByRoute>
        {/* ── Routes ──────────────────────────────────────────────────── */}
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Root redirects based on auth state */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

          <Route
            path="/dashboard"
            element={
              user ? (
                <Layout user={userProfile || user} onLogout={logout}>
                  <Dashboard tasks={tasks} companies={companies} />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/companies"
            element={
              user ? (
                <Layout user={userProfile || user} onLogout={logout}>
                  <CompanyList
                    companies={companies}
                    onAddCompany={addCompany}
                    onUpdateCompany={editCompany}
                    onDeleteCompany={removeCompany}
                    loading={companiesLoading}
                  />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/company/:id"
            element={
              user ? (
                <Layout user={userProfile || user} onLogout={logout}>
                  <CompanyPage
                    companies={companies}
                    tasks={tasks}
                    onUpdateCompany={editCompany}
                    onDeleteCompany={removeCompany}
                    onAddTask={addTask}
                    onUpdateTask={editTask}
                    onDeleteTask={removeTask}
                    taskTemplates={taskTemplates}
                    onAssignTemplate={assignTemplateToCompanies}
                    loading={companiesLoading || tasksLoading || templatesLoading}
                  />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/task-templates"
            element={
              user ? (
                <Layout user={userProfile || user} onLogout={logout}>
                  <TaskTemplates
                    taskTemplates={taskTemplates}
                    onAddTemplate={addTemplate}
                    onAssignTemplate={assignTemplateToCompanies}
                    onDeleteTemplate={removeTemplate}
                    companies={companies}
                    loading={templatesLoading}
                  />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/profile"
            element={
              user ? (
                <Layout user={userProfile || user} onLogout={logout}>
                  <UserProfile
                    user={userProfile || user}
                    onUpdateProfile={updateProfile}
                    loading={profileLoading}
                  />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>

        {/* ── Global overlays ─────────────────────────────────────────── */}

        {/* Data loading overlay — shown while fetching from Firestore */}
        {dataLoading && <LoadingSpinner />}

        {/* Success toast — auto-dismissed after 3 s */}
        {modal.show && modal.type === "success" && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p className="text-gray-900 font-medium text-sm">{modal.message}</p>
                <button
                  onClick={() => setModal({ show: false, type: "", message: "" })}
                  className="text-gray-400 hover:text-gray-600 ml-auto"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error modal — requires explicit dismissal */}
        {modal.show && modal.type === "error" && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                  <span className="text-sm font-bold text-red-600">✕</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Error</h3>
              </div>
              <p className="text-gray-600 mb-6">{modal.message}</p>
              <button
                onClick={() => setModal({ show: false, type: "", message: "" })}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Confirm sign-out modal */}
        {showConfirmSignout && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Sign Out</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to sign out of TaskFlow?</p>
                <div className="flex gap-3">
                  <Button onClick={() => setShowConfirmSignout(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={confirmLogout} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white">
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </BoundaryByRoute>
    </Router>
  )
}

/** Root component — provides Auth context to the entire app. */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
