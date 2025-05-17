import { Label } from '@/shared/components/atoms/Label'
import { Input } from '@/shared/components/molecules/Input'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  className?: string
}

export const FormField = ({ id, label, error, inputProps, className }: FormFieldProps) => {
  return (
    <div className="mb-4">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...inputProps} className={className} />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
