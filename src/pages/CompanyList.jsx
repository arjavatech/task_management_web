import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Building2, MapPin, User, Phone, Eye, Edit } from 'lucide-react'
import { Modal, ConfirmModal, SearchBar } from '../components/common'
import { CompanyForm } from '../components/forms'

export default function CompanyList({ companies, onAddCompany, onDeleteCompany, onUpdateCompany }) {
  const [showForm, setShowForm] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ show: false, company: null })
  const [editModal, setEditModal] = useState({ show: false, company: null })
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAddingCompany, setIsAddingCompany] = useState(false)
  const [isEditingCompany, setIsEditingCompany] = useState(false)

  const handleAddCompany = async (formData) => {
    setIsAddingCompany(true)
    try {
      await onAddCompany(formData)
      setShowForm(false)
    } finally {
      setIsAddingCompany(false)
    }
  }

  const handleEditCompany = async (formData) => {
    setIsEditingCompany(true)
    try {
      await onUpdateCompany(editModal.company.id, formData)
      setEditModal({ show: false, company: null })
    } catch (error) {
      console.error('Error in handleEditCompany:', error)
    } finally {
      setIsEditingCompany(false)
    }
  }

  const handleDeleteCompany = async () => {
    setIsDeleting(true)
    try {
      await onDeleteCompany(deleteModal.company.id)
      setDeleteModal({ show: false, company: null })
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.EIN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactPersonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.state?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search companies by name, EIN, contact, or location..."
        />
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Add New Company</CardTitle>
            <CardDescription>Fill in the company details below</CardDescription>
          </CardHeader>
          <CardContent>
            {isAddingCompany && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-blue-800 font-medium">Adding company...</p>
                </div>
              </div>
            )}
            <CompanyForm
              onSubmit={handleAddCompany}
              onCancel={() => setShowForm(false)}
              submitText="Add Company"
              disabled={isAddingCompany}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredCompanies.map(company => {
          return (
          <Card key={company.id} className="group relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" />
            
            {/* Edit and Delete buttons - positioned absolutely */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setEditModal({ show: true, company })}
              className="absolute top-3 right-14 z-10 text-blue-500 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDeleteModal({ show: true, company })}
              className="absolute top-3 right-3 z-10 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            
            <CardHeader className="pb-4 pr-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors break-words">
                    {company.name}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-gray-500">
                    EIN: {company.EIN}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                  <span className="truncate">{company.city}, {company.state}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                  <span className="truncate">{company.contactPersonName}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                  <span className="truncate">{company.contactPersonPhNumber}</span>
                </div>
              </div>
              
              <Link to={`/company/${company.id}`} className="block">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </CardContent>
            
            {/* Subtle background pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-5">
              <Building2 className="w-full h-full text-yellow-500" />
            </div>
          </Card>
        )})}
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
      <ConfirmModal
        show={deleteModal.show}
        onClose={() => !isDeleting && setDeleteModal({ show: false, company: null })}
        onConfirm={handleDeleteCompany}
        title="Delete Company"
        message={`Are you sure you want to delete "${deleteModal.company?.name}"? This will permanently delete the company and all associated tasks. This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="danger"
        loading={isDeleting}
      />

      {/* Edit Company Modal */}
      <Modal
        show={editModal.show}
        onClose={() => !isEditingCompany && setEditModal({ show: false, company: null })}
        title="Edit Company"
        description="Update company details"
        className="max-w-4xl"
      >
        {isEditingCompany && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-blue-800 font-medium">Updating company...</p>
            </div>
          </div>
        )}
        <CompanyForm
          initialData={editModal.company}
          onSubmit={handleEditCompany}
          onCancel={() => !isEditingCompany && setEditModal({ show: false, company: null })}
          submitText="Save Changes"
          disabled={isEditingCompany}
        />
      </Modal>


    </div>
  )
}