import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Building2, User, LogOut, FileText, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Layout({ children, user, onLogout }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header for mobile and tablet */}
      <div className="xl:hidden fixed top-0 left-0 right-0 shadow-md z-30 h-14 sm:h-16 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-full px-3 sm:px-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-xs sm:text-sm">TF</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900">TaskFlow</h1>
          </div>
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-gray-900 hover:bg-gray-800 text-white p-1.5 sm:p-2"
            size="sm"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu button - removed since it's now in header */}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-slate-900 shadow-xl flex flex-col z-40 transform transition-all duration-300 ease-in-out xl:translate-x-0
        w-[85%] sm:w-[75%] md:w-[60%] lg:w-80 xl:w-80
        max-w-[320px] min-w-[260px] sm:min-w-[280px] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo and Close Button */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-base sm:text-lg lg:text-xl">TF</span>
              </div>
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white">TaskFlow</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Task Management</p>
              </div>
            </div>
            <Button
              onClick={() => setSidebarOpen(false)}
              className="xl:hidden bg-slate-700 hover:bg-slate-600 text-slate-300 p-1.5 sm:p-2"
              size="sm"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 lg:px-4 mt-2 sm:mt-4 lg:mt-6">
          <div className="space-y-1">
            <Link 
              to="/dashboard" 
              className={`group flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                location.pathname === '/dashboard' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-slate-300 hover:text-black hover:bg-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/companies" 
              className={`group flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                location.pathname === '/companies' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-slate-300 hover:text-black hover:bg-white'
              }`}
            >
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Companies</span>
            </Link>
            <Link 
              to="/task-templates" 
              className={`group flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                location.pathname === '/task-templates' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-slate-300 hover:text-black hover:bg-white'
              }`}
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Task Templates</span>
            </Link>
            <Link 
              to="/profile" 
              className={`group flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 lg:py-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                location.pathname === '/profile' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-slate-300 hover:text-black hover:bg-white'
              }`}
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Profile</span>
            </Link>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-2 sm:p-3 lg:p-4 mt-auto border-t border-slate-700">
          <div className="bg-slate-800 rounded-lg p-2 sm:p-3 lg:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">{user.email}</p>
                <p className="text-xs text-slate-400 hidden sm:block">Administrator</p>
              </div>
            </div>
            <Button 
              onClick={onLogout} 
              className="w-full bg-slate-700 hover:bg-slate-600 text-white border-0 transition-all duration-200 text-xs sm:text-sm"
              size="sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile and tablet */}
      {sidebarOpen && (
        <div 
          className="xl:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="xl:ml-80">
        <main className="p-3 sm:p-4 lg:p-6 pt-14 sm:pt-16 xl:pt-10 xl:mt-0 lg:mt-10 mt-6">
          {children}
        </main>
      </div>
    </div>
  )
}