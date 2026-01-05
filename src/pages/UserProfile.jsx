import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Mail, Bell, Settings, Plus, X } from 'lucide-react'
import { LoadingSpinner } from '../components/common'

export default function UserProfile({ user, onUpdateProfile, loading }) {
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

  const handleSave = () => {
    onUpdateProfile(profile)
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
    <>
      {loading && <LoadingSpinner />}
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <User className="h-8 w-8 text-gray-600" />
            User Profile
          </h1>
          <p className="text-gray-600">Manage your account settings and notification preferences</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 lg:p-8 space-y-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
              <User className="h-6 w-6 text-gray-600" />
              Profile Information
            </h2>
            <div className="space-y-4">
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
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
              <Bell className="h-6 w-6 text-gray-600" />
              Reminder Settings
            </h2>
            <div className="space-y-4">
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
                  className={profile.reminderSettings.enabled ? "bg-gray-900 hover:bg-gray-800 text-white" : ""}
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
            </div>
          </div>

          {/* CC Email Settings */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Mail className="h-6 w-6 text-gray-600" />
              CC Email Addresses
            </h2>
            <p className="text-sm text-gray-600 mb-6">Additional email addresses to receive task notifications</p>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newCcEmail}
                  onChange={(e) => setNewCcEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCcEmail()}
                  className="flex-1"
                />
                <Button onClick={addCcEmail} disabled={!newCcEmail} className="bg-slate-900 hover:bg-slate-800 text-white">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

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
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white">
            <Settings className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>

      </div>
    </>
  )
}