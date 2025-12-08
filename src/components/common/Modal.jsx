import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Modal = ({ show, onClose, title, description, children, className = "" }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
      <Card className={`w-full max-w-md mx-4 ${className}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

export const ConfirmModal = ({ show, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", variant = "default" }) => {
  return (
    <Modal show={show} onClose={onClose} title={title}>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          className={`flex-1 ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}