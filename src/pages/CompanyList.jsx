import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Building2, MapPin, User, Phone, Eye, Edit } from 'lucide-react'
import { Modal, ConfirmModal, SearchBar, LoadingSpinner } from '../components/common'
import { CompanyForm } from '../components/forms'

export default function CompanyList({ companies, onAddCompany, onDeleteCompany, onUpdateCompany, loading }) {
  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ show: false, company: null })
  const [editModal, setEditModal] = useState({ show: false, company: null })
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddCompany = (formData) => {
    onAddCompany(formData)
    setAddModal(false)
  }

  const handleEditCompany = (formData) => {
    onUpdateCompany(editModal.company.id, formData)
    setEditModal({ show: false, company: null })
  }

  const handleDeleteCompany = () => {
    onDeleteCompany(deleteModal.company.id)
    setDeleteModal({ show: false, company: null })
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.ein.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      {loading && <LoadingSpinner />}
      {/* Mobile Header */}
      <div className="xl:hidden bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Companies</h1>
            <p className="text-sm text-gray-600">Manage profiles</p>
          </div>
          <Button onClick={() => setAddModal(true)} size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
            + Add
          </Button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden xl:block bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies</h1>
            <p className="text-gray-600">Manage your company profiles and information</p>
          </div>
          <Button onClick={() => setAddModal(true)} className="bg-gray-900 hover:bg-gray-800 text-white">
            + Add Company
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search companies..."
          />
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredCompanies.map(company => (
            <div key={company.id} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow relative">
              {/* Action buttons */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditModal({ show: true, company })}
                  className="text-gray-600 hover:text-gray-900 border-gray-200 h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDeleteModal({ show: true, company })}
                  className="text-red-600 hover:text-red-700 border-gray-200 h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Company info */}
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 pr-16 sm:pr-20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{company.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">EIN: {company.ein}</p>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <span className="truncate">{company.city}, {company.state}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <span className="truncate">{company.contactName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <span>{company.contactPhone}</span>
                </div>
              </div>
              
              <Link to={`/company/${company.id}`} className="block">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm sm:text-base py-2">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">View</span>
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            {searchTerm ? (
              <>
                <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-sm sm:text-base text-gray-500">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-6">Add your first company to get started</p>
                <Button onClick={() => setAddModal(true)} className="bg-gray-900 hover:bg-gray-800 text-white">
                  <span className="hidden sm:inline">Add Your First Company</span>
                  <span className="sm:hidden">Add Company</span>
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, company: null })}
        onConfirm={handleDeleteCompany}
        title="Delete Company"
        message={`Are you sure you want to delete "${deleteModal.company?.name}"? This will permanently delete the company and all associated tasks. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Add Company Modal */}
      <Modal
        show={addModal}
        onClose={() => setAddModal(false)}
        title="Add New Company"
        description="Fill in the company details below"
      >
        <CompanyForm
          onSubmit={handleAddCompany}
          onCancel={() => setAddModal(false)}
          submitText="Add Company"
        />
      </Modal>

      {/* Edit Company Modal */}
      <Modal
        show={editModal.show}
        onClose={() => setEditModal({ show: false, company: null })}
        title="Edit Company"
        description="Update company details"
      >
        <CompanyForm
          initialData={editModal.company}
          onSubmit={handleEditCompany}
          onCancel={() => setEditModal({ show: false, company: null })}
          submitText="Save Changes"
        />
      </Modal>
    </>
  )
}