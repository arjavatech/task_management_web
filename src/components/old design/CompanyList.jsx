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
      <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">Companies</h1>
          <p className="text-gray-600">Manage your company profiles and information</p>
        </div>
        <Button onClick={() => setAddModal(true)} style={{backgroundColor: '#fcd500', color: 'black'}} className="hover:bg-orange-600 w-full sm:w-auto">
          + Add Company
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



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredCompanies.map(company => (
          <Card key={company.id} className="group relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
            {/* Decorative top border */}
          
            
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
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(to bottom right, #fcd500, #f97316)'}}>
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base lg:text-lg font-bold text-gray-900 transition-colors break-words" style={{'--hover-color': '#fcd500'}}>
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
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>{company.city}, {company.state}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4 text-blue-500" />
                  <span>{company.contactName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span>{company.contactPhone}</span>
                </div>
              </div>
              
              <Link to={`/company/${company.id}`} className="block">
                <Button style={{backgroundColor: '#fcd500', color: 'black'}} className="w-full hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </CardContent>
            
            {/* Subtle background pattern */}
            {/* <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <Building2 className="w-full h-full" style={{color: '#fcd500'}} />
            </div> */}
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
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


      </div>
    </>
  )
}