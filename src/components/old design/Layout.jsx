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
    <div className="min-h-screen bg-blue-25">
      {/* Header for mobile and tablet */}
      <div className="xl:hidden fixed top-0 left-0 right-0 shadow-md z-30 h-14 sm:h-16" style={{background: 'linear-gradient(to right, #002645, #005dab)'}}>
        <div className="flex items-center justify-between h-full px-3 sm:px-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#fcd500'}}>
              <span className="text-black font-bold text-xs sm:text-sm">TF</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white">TaskFlow</h1>
          </div>
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-slate-900 hover:bg-slate-800 text-white p-1.5 sm:p-2"
            size="sm"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu button - removed since it's now in header */}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full shadow-2xl flex flex-col z-40 transform transition-all duration-300 ease-in-out xl:translate-x-0
        w-[85%] sm:w-[75%] md:w-[60%] lg:w-80 xl:w-80
        max-w-[320px] min-w-[260px] sm:min-w-[280px] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`} style={{background: 'linear-gradient(to bottom, #005dab, #002645)'}}>
        {/* Logo and Close Button */}
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-lg" style={{backgroundColor: '#fcd500'}}>
                <span className="text-black font-bold text-base sm:text-lg lg:text-xl">TF</span>
              </div>
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white">TaskFlow</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Task Management</p>
              </div>
            </div>
            <Button
              onClick={() => setSidebarOpen(false)}
              className="xl:hidden bg-slate-700 hover:bg-slate-600 text-white p-1.5 sm:p-2"
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
              className={`group flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                location.pathname === '/dashboard' 
                  ? 'text-black shadow-xl' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60 hover:shadow-lg'
              }`}
              style={location.pathname === '/dashboard' ? {background: '#fcd500'} : {}}
            >
              <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 flex-shrink-0" />
              <span className="relative z-10">Dashboard</span>
            </Link>
            <Link 
              to="/companies" 
              className={`group flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                location.pathname === '/companies' 
                  ? 'text-black shadow-xl' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60 hover:shadow-lg'
              }`}
              style={location.pathname === '/companies' ? {background: '#fcd500'} : {}}
            >
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 flex-shrink-0" />
              <span className="relative z-10">Companies</span>
            </Link>
            <Link 
              to="/task-templates" 
              className={`group flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                location.pathname === '/task-templates' 
                  ? 'text-black shadow-xl' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60 hover:shadow-lg'
              }`}
              style={location.pathname === '/task-templates' ? {background: '#fcd500'} : {}}
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 flex-shrink-0" />
              <span className="relative z-10">Task Templates</span>
            </Link>
            <Link 
              to="/profile" 
              className={`group flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2.5 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                location.pathname === '/profile' 
                  ? 'text-black shadow-xl' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60 hover:shadow-lg'
              }`}
              style={location.pathname === '/profile' ? {background: '#fcd500'} : {}}
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 flex-shrink-0" />
              <span className="relative z-10">Profile</span>
            </Link>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-2 sm:p-3 lg:p-4 mt-auto">
          <div className="bg-slate-800/50 rounded-xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#fcd500'}}>
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">{user.email}</p>
                <p className="text-xs text-slate-400 hidden sm:block">Administrator</p>
              </div>
            </div>
            <Button 
              onClick={onLogout} 
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-400/50 transition-all duration-200 text-xs sm:text-sm"
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
        <main className="p-3 sm:p-4 lg:p-6 pt-14 sm:pt-16 xl:pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}