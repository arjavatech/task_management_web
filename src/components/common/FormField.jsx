import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const FormField = ({ label, id, type = "text", value, onChange, required = false, options = null, placeholder = "", error = "" }) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {options ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={`mt-2 ${error ? "border-red-500" : ""}`}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input 
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={`mt-2 ${error ? "border-red-500" : ""}`}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}