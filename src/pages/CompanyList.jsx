import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Building2, MapPin, User, Phone, Eye, Search } from 'lucide-react'

export default function CompanyList({ companies, onAddCompany, onDeleteCompany }) {
  const [showForm, setShowForm] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ show: false, company: null })
  const [showSuccess, setShowSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '', ein: '', startDate: '', stateIncorporated: '', contactName: '',
    contactPhone: '', address1: '', address2: '', city: '', state: '', zipCode: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddCompany(formData)
    setFormData({
      name: '', ein: '', startDate: '', stateIncorporated: '', contactName: '',
      contactPhone: '', address1: '', address2: '', city: '', state: '', zipCode: ''
    })
    setShowForm(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.ein.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">Companies</h1>
          <p className="text-gray-600">Manage your company profiles and information</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          {showForm ? 'Cancel' : '+ Add Company'}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search companies by name, EIN, contact, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Add New Company</CardTitle>
            <CardDescription>Fill in the company details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="ein">EIN</Label>
                <Input id="ein" value={formData.ein} onChange={(e) => handleChange('ein', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="stateIncorporated">State Incorporated</Label>
                <Input id="stateIncorporated" value={formData.stateIncorporated} onChange={(e) => handleChange('stateIncorporated', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="contactName">Contact Person Name</Label>
                <Input id="contactName" value={formData.contactName} onChange={(e) => handleChange('contactName', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Person Phone</Label>
                <Input id="contactPhone" value={formData.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="address1">Address 1</Label>
                <Input id="address1" value={formData.address1} onChange={(e) => handleChange('address1', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="address2">Address 2</Label>
                <Input id="address2" value={formData.address2} onChange={(e) => handleChange('address2', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={formData.state} onChange={(e) => handleChange('state', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" value={formData.zipCode} onChange={(e) => handleChange('zipCode', e.target.value)} required />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Add Company</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredCompanies.map(company => (
          <Card key={company.id} className="group relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" />
            
            {/* Delete button - positioned absolutely */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDeleteModal({ show: true, company })}
              className="absolute top-4 right-4 z-10 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <CardHeader className="pb-4 pr-12 sm:pr-16">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base lg:text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors truncate">
                    {company.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    EIN: {company.ein}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-yellow-500" />
                  <span>{company.city}, {company.state}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4 text-yellow-500" />
                  <span>{company.contactName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-yellow-500" />
                  <span>{company.contactPhone}</span>
                </div>
              </div>
              
              <Link to={`/company/${company.id}`} className="block">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </CardContent>
            
            {/* Subtle background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <Building2 className="w-full h-full text-yellow-500" />
            </div>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-16">
            {searchTerm ? (
              <>
                <p className="text-gray-500 text-lg mb-2">No companies found</p>
                <p className="text-gray-400">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-lg mb-2">No companies yet</p>
                <p className="text-gray-400">Add your first company to get started with task management</p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {companies.length === 0 && !showForm && searchTerm === '' && (
        <Card>
          <CardContent className="text-center py-16">
            <p className="text-gray-500 text-lg mb-2">No companies yet</p>
            <p className="text-gray-400">Add your first company to get started with task management</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Company</CardTitle>
              <CardDescription>
                Are you sure you want to delete "{deleteModal.company?.name}"?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                This will permanently delete the company and all associated tasks. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteModal({ show: false, company: null })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    onDeleteCompany(deleteModal.company.id)
                    setDeleteModal({ show: false, company: null })
                    setShowSuccess(true)
                    setTimeout(() => setShowSuccess(false), 3000)
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-green-800 font-medium">Company deleted successfully!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}