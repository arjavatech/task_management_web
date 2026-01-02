import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Modal = ({ show, onClose, title, description, children, className = "" }) => {
  if (!show) return null

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card 
        className={`w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
          {description && <CardDescription className="text-sm">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

export const ConfirmModal = ({ show, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", variant = "default", loading = false }) => {
  return (
    <Modal show={show} onClose={onClose} title={title}>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1 order-2 sm:order-1" disabled={loading}>
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          className={`flex-1 order-1 sm:order-2 ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {typeof confirmText === 'string' && confirmText.includes('...') ? confirmText : 'Processing...'}
            </div>
          ) : (
            confirmText
          )}
        </Button>
      </div>
    </Modal>
  )
}