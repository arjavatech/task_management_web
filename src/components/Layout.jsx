import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Building2, User, LogOut, FileText, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children, user, onLogout }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-slate-900 hover:bg-slate-800 text-white p-2"
          size="sm"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 w-72 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl flex flex-col z-40 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">TF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TaskFlow</h1>
              <p className="text-xs text-slate-400">Task Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-4">
          <div className="space-y-2">
            <Link 
              to="/dashboard" 
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === '/dashboard' 
                  ? 'bg-yellow-600 text-white shadow-lg transform scale-105' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-105'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
              {location.pathname === '/dashboard' && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
            <Link 
              to="/companies" 
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === '/companies' 
                  ? 'bg-yellow-600 text-white shadow-lg transform scale-105' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-105'
              }`}
            >
              <Building2 className="h-5 w-5" />
              <span>Companies</span>
              {location.pathname === '/companies' && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
            <Link 
              to="/task-templates" 
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === '/task-templates' 
                  ? 'bg-yellow-600 text-white shadow-lg transform scale-105' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-105'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Task Templates</span>
              {location.pathname === '/task-templates' && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
            <Link 
              to="/profile" 
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === '/profile' 
                  ? 'bg-yellow-600 text-white shadow-lg transform scale-105' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:transform hover:scale-105'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
              {location.pathname === '/profile' && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 mt-auto">
          <div className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
            <Button 
              onClick={onLogout} 
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-400/50 transition-all duration-200"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-72">
        <main className="p-4 lg:p-6 pt-16 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}