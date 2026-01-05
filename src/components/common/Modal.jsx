import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Modal = ({ show, onClose, title, description, children, className = "" }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
          {description && <CardDescription className="text-sm sm:text-base">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

export const ConfirmModal = ({ show, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", variant = "default" }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-slate-700">?</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}