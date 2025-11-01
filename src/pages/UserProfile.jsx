import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Mail, Bell, Settings, Plus, X } from 'lucide-react'

export default function UserProfile({ user, onUpdateProfile }) {
  const [profile, setProfile] = useState({
    email: user.email,
    name: user.name || '',
    phone: user.phone || '',
    reminderSettings: {
      enabled: true,
      daysBefore: 3,
      timeOfDay: '09:00'
    },
    ccEmails: user.ccEmails || []
  })
  const [newCcEmail, setNewCcEmail] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    onUpdateProfile(profile)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
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
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
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
                onChange={(e) => setNewCcEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCcEmail()}
                className="flex-1"
              />
              <Button onClick={addCcEmail} disabled={!newCcEmail}>
                <Plus className="h-4 w-4 mr-2" />
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
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
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