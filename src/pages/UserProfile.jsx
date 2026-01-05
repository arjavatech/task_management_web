import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Mail, Bell, Plus, X, Edit } from 'lucide-react'
import { LoadingSpinner } from '../components/common'

export default function UserProfile({ user, onUpdateProfile, loading }) {
  const [profile, setProfile] = useState({
    email: user.email,
    name: user.name || '',
    phone: user.phone || '',
    reminderSettings: {
      enabled: true,
      daysBefore: 3,
      timeOfDay: '12:00'
    },
    ccEmails: user.ccEmails || []
  })
  const [newCcEmail, setNewCcEmail] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  
  const hasChanges = () => {
    return profile.name !== (user.name || '') ||
           profile.phone !== (user.phone || '') ||
           JSON.stringify(profile.ccEmails) !== JSON.stringify(user.ccEmails || [])
  }

  const handleSave = () => {
    onUpdateProfile(profile)
  }

  const addCcEmail = () => {
    if (newCcEmail && !profile.ccEmails.includes(newCcEmail)) {
      setProfile({
        ...profile,
        ccEmails: [...profile.ccEmails, newCcEmail]
      })
      setNewCcEmail('')
    }
  }

  const removeCcEmail = (email) => {
    setProfile({
      ...profile,
      ccEmails: profile.ccEmails.filter(e => e !== email)
    })
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {/* Mobile Header */}
      <div className="xl:hidden bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-gray-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Profile</h1>
              <p className="text-sm text-gray-600">Account settings</p>
            </div>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden xl:block bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <User className="h-8 w-8 text-gray-600" />
              User Profile
            </h1>
            <p className="text-gray-600">Manage your account settings and notification preferences</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="bg-slate-900 hover:bg-slate-800 text-white">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4 sm:mb-6">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              <span className="hidden sm:inline">Profile Information</span>
              <span className="sm:hidden">Profile</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="bg-gray-50 text-sm sm:text-base"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Enter your full name"
                  disabled={!isEditing}
                  className={`text-sm sm:text-base ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="Enter your phone number"
                  disabled={!isEditing}
                  className={`text-sm sm:text-base ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4 sm:mb-6">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              <span className="hidden sm:inline">Reminder Settings</span>
              <span className="sm:hidden">Reminders</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm sm:text-base">Enable Reminders</Label>
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
                  className={`text-xs sm:text-sm ${profile.reminderSettings.enabled ? "bg-gray-900 hover:bg-gray-800 text-white" : ""}`}
                  disabled={!isEditing}
                >
                  {profile.reminderSettings.enabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              {profile.reminderSettings.enabled && (
                <>
                  <div>
                    <Label htmlFor="daysBefore" className="text-sm sm:text-base">Remind me before (days)</Label>
                    <Select 
                      value={profile.reminderSettings.daysBefore.toString()} 
                      onValueChange={(value) => setProfile({
                        ...profile,
                        reminderSettings: {
                          ...profile.reminderSettings,
                          daysBefore: parseInt(value)
                        }
                      })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="text-sm sm:text-base">
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
                    <Label htmlFor="timeOfDay" className="text-sm sm:text-base">Reminder Time</Label>
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
                      disabled={!isEditing}
                      className={`text-sm sm:text-base ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CC Email Settings */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              <span className="hidden sm:inline">CC Email Addresses</span>
              <span className="sm:hidden">CC Emails</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Additional email addresses to receive notifications</p>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newCcEmail}
                  onChange={(e) => setNewCcEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCcEmail()}
                  className={`flex-1 text-sm sm:text-base ${!isEditing ? "bg-gray-50" : ""}`}
                  disabled={!isEditing}
                />
                <Button 
                  onClick={addCcEmail} 
                  disabled={!newCcEmail || !isEditing} 
                  className="bg-slate-900 hover:bg-slate-800 text-white text-sm sm:text-base"
                  size="sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-0" />
                  <span className="sm:hidden">Add</span>
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </div>

              {profile.ccEmails.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">CC Email List</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {profile.ccEmails.map((email, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 sm:p-3">
                        <span className="text-xs sm:text-sm truncate flex-1 mr-2">{email}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCcEmail(email)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 w-7 sm:h-8 sm:w-8 p-0"
                          disabled={!isEditing}
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        {isEditing && (
          <div className="sm:hidden flex gap-3 px-4 py-4 bg-white border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
              disabled={!hasChanges()}
            >
              Save
            </Button>
          </div>
        )}

        {/* Desktop Action Buttons */}
        {isEditing && (
          <div className="hidden sm:flex flex-row justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-slate-900 hover:bg-slate-800 text-white"
              disabled={!hasChanges()}
            >
              Save
            </Button>
          </div>
        )}

      </div>
    </>
  )
}