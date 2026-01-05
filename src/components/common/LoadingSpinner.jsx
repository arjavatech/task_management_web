export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 shadow-lg text-center">
        <div className="w-6 h-6 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>     
      </div>
    </div>
  )
}