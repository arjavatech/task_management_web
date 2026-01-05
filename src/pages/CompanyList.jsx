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
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
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
      <div className="p-6 lg:p-8 space-y-8">

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search companies by name, EIN, contact, or location..."
          />
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
            <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative">
              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditModal({ show: true, company })}
                  className="text-gray-600 hover:text-gray-900 border-gray-200"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDeleteModal({ show: true, company })}
                  className="text-red-600 hover:text-red-700 border-gray-200"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Company info */}
              <div className="flex items-center gap-4 mb-4 pr-20">
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base truncate">{company.name}</h3>
                  <p className="text-sm text-gray-500">EIN: {company.ein}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{company.city}, {company.state}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{company.contactName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{company.contactPhone}</span>
                </div>
              </div>
              
              <Link to={`/company/${company.id}`} className="block">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            {searchTerm ? (
              <>
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
                <p className="text-gray-500 mb-6">Add your first company to get started with task management</p>
                <Button onClick={() => setAddModal(true)} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Add Your First Company
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
        className="max-w-2xl"
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
        className="max-w-2xl"
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