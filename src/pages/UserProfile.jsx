import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Mail, Bell, Settings, Plus, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function UserProfile() {
  const { user, userProfile, updateUserProfile } = useAuth()
  
  const [profile, setProfile] = useState({
    email: '',
    name: '',
    phone: '',
    reminderSettings: {
      enabled: true,
      daysBefore: 3,
      timeOfDay: '09:00'
    },
    ccEmails: []
  })
  const [newCcEmail, setNewCcEmail] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  // Load user data when component mounts or user/userProfile changes
  useEffect(() => {
    if (user) {
      const profileState = {
        email: user.email || '',
        name: userProfile?.name || '',
        phone: userProfile?.phone || '',
        reminderSettings: {
          enabled: userProfile?.profile?.reminderSettings?.enabled ?? true,
          daysBefore: userProfile?.profile?.reminderSettings?.daysBefore || 3,
          timeOfDay: userProfile?.profile?.reminderSettings?.timeOfDay || '09:00'
        },
        ccEmails: userProfile?.profile?.ccEmails || []
      }
      
      setProfile(profileState)
    }
  }, [user, userProfile])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateProfile = () => {
    const errors = {}
    
    // Validate name
    if (!profile.name.trim()) {
      errors.name = 'Full name is required'
    } else if (profile.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s\-\.]+$/.test(profile.name.trim())) {
      errors.name = 'Full name can only contain letters, spaces, hyphens, and periods'
    }
    
    // Validate phone (if provided)
    if (profile.phone.trim() && !/^[\d\s\-\(\)\+\.]{10,}$/.test(profile.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }
    
    // Validate CC emails
    const invalidEmails = profile.ccEmails.filter(email => !validateEmail(email))
    if (invalidEmails.length > 0) {
      errors.ccEmails = 'Some CC email addresses are invalid'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    // Step 1: Validation
    if (!validateProfile()) {
      return // Stop if validation fails
    }
    
    // Step 2: Loading
    setIsSaving(true)
    
    try {
      // Structure the data to match Firebase schema
      const profileDataToSave = {
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        profile: {
          reminderSettings: profile.reminderSettings,
          ccEmails: profile.ccEmails
        }
      }
      
      const result = await updateUserProfile(profileDataToSave)
      
      if (result.success) {
        // Step 3: Success message (only after loading completes)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const addCcEmail = () => {
    if (!newCcEmail.trim()) {
      setEmailError('Please enter an email address')
      return
    }
    
    if (!validateEmail(newCcEmail)) {
      setEmailError('Please enter a valid email address')
      return
    }
    
    if (profile.ccEmails.includes(newCcEmail)) {
      setEmailError('This email is already in the list')
      return
    }
    
    setProfile({
      ...profile,
      ccEmails: [...profile.ccEmails, newCcEmail]
    })
    setNewCcEmail('')
    setEmailError('')
  }

  const removeCcEmail = (email) => {
    setProfile({
      ...profile,
      ccEmails: profile.ccEmails.filter(e => e !== email)
    })
  }

  if (!user) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show loading if user exists but userProfile is still being fetched
  if (user && userProfile === null) {
    return (
      <div className="p-4 lg:p-8">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading your profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 relative">
      {/* In-Page Loading Overlay */}
      {isSaving && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-900 font-medium">Saving your profile...</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <User className="h-6 lg:h-8 w-6 lg:w-8 text-blue-600" />
          User Profile
        </h1>
        <p className="text-gray-600 text-base lg:text-lg">Manage your account settings and notification preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="bg-gray-50"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => {
                  setProfile({...profile, name: e.target.value})
                  if (validationErrors.name) {
                    setValidationErrors({...validationErrors, name: ''})
                  }
                }}
                placeholder="Enter your full name"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => {
                  setProfile({...profile, phone: e.target.value})
                  if (validationErrors.phone) {
                    setValidationErrors({...validationErrors, phone: ''})
                  }
                }}
                placeholder="Enter your phone number"
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reminder Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Reminder Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Reminders</Label>
              <Button
                variant={profile.reminderSettings.enabled ? "default" : "outline"}
                size="sm"
                onClick={() => setProfile({
                  ...profile,
                  reminderSettings: {
                    ...profile.reminderSettings,
                    enabled: !profile.reminderSettings.enabled
                  }
                })}
              >
                {profile.reminderSettings.enabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            {profile.reminderSettings.enabled && (
              <>
                <div>
                  <Label htmlFor="daysBefore">Remind me before (days)</Label>
                  <Select 
                    value={profile.reminderSettings.daysBefore.toString()} 
                    onValueChange={(value) => setProfile({
                      ...profile,
                      reminderSettings: {
                        ...profile.reminderSettings,
                        daysBefore: parseInt(value)
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeOfDay">Reminder Time</Label>
                  <Input
                    id="timeOfDay"
                    type="time"
                    value={profile.reminderSettings.timeOfDay}
                    onChange={(e) => setProfile({
                      ...profile,
                      reminderSettings: {
                        ...profile.reminderSettings,
                        timeOfDay: e.target.value
                      }
                    })}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* CC Email Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              CC Email Addresses
            </CardTitle>
            <p className="text-sm text-gray-600">Additional email addresses to receive task notifications</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={newCcEmail}
                onChange={(e) => {
                  setNewCcEmail(e.target.value)
                  setEmailError('')
                }}
                onKeyPress={(e) => e.key === 'Enter' && addCcEmail()}
                className="flex-1"
              />
              <Button onClick={addCcEmail} disabled={!newCcEmail.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            {emailError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{emailError}</p>
              </div>
            )}
            
            {validationErrors.ccEmails && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{validationErrors.ccEmails}</p>
              </div>
            )}

            {profile.ccEmails.length > 0 && (
              <div className="space-y-2">
                <Label>CC Email List</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {profile.ccEmails.map((email, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-sm">{email}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCcEmail(email)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
          <Settings className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-green-800 font-medium">Profile updated successfully!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}