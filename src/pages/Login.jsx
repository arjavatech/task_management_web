import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginUser, registerUser } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import { Building2, Mail, Lock, LogIn, UserPlus, AlertCircle, ArrowRight, CheckCircle, Users, Target } from 'lucide-react'

export default function Login() {
  // ALL HOOKS MUST BE DECLARED FIRST
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('')
        setError('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message, error])

  // CONDITIONAL RENDERING AFTER ALL HOOKS
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isSignUp) {
        // Sign up
        const result = await registerUser(email, password)
        if (result.success) {
          setMessage('Account created successfully! You can now sign in.')
          setIsSignUp(false)
          setPassword('') // Clear password for security
        } else {
          setError(result.error)
        }
      } else {
        // Sign in
        const result = await loginUser(email, password)
        if (result.success) {
          navigate('/dashboard')
        } else {
          setError(result.error)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError('')
    setMessage('')
    setPassword('')
  }

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `
        radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0),
        radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2px, transparent 0),
        linear-gradient(135deg, #1e293b 0%, #0f172a 100%)
      `,
      backgroundSize: '100px 100px, 100px 100px, 100% 100%'
    }}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-7xl w-full flex">
          {/* LEFT SIDE */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-12">
            {/* Logo & App Name */}
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">TaskFlow</span>
            </div>

            <div className="max-w-lg">
              {/* Bold Title */}
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Streamline Your Task Management
              </h1>
              
              {/* Supporting Paragraph */}
              <p className="text-xl text-slate-300 mb-12 leading-relaxed">
                Powerful task management platform designed for modern teams. Organize, track, and complete projects with ease.
              </p>

              {/* Statistics Boxes */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-slate-300" />
                    <span className="text-2xl font-bold text-white">500+</span>
                  </div>
                  <p className="text-slate-300">Companies Managed</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-slate-300" />
                    <span className="text-2xl font-bold text-white">10K+</span>
                  </div>
                  <p className="text-slate-300">Tasks Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex items-center justify-center px-8">
            <div className="w-full max-w-md">
              <Card className="bg-slate-900 border-slate-800 shadow-2xl rounded-2xl">
                <CardHeader className="text-center pb-10 pt-10">
                  <CardTitle className="text-3xl font-bold text-white mb-3">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-lg">
                    Sign in to access your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-10 pb-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {isSignUp && (
                    <div className="space-y-2">
                      <div className="relative">
                        <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-900/50 border border-red-800 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  {message && (
                    <div className="flex items-center gap-2 p-3 bg-green-900/50 border border-green-800 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <p className="text-sm text-green-300">{message}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </div>
                    ) : (
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {isSignUp
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Sign up"}
                  </button>
                </div>

                <p className="text-xs text-slate-500 text-center mt-6">
                  Secure access to your task management portal
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}