import { Label } from '@/shared/components/atoms/Label'
import { Input } from '@/shared/components/molecules/Input'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export const FormField = ({ id, label, error, inputProps }: FormFieldProps) => {
  return (
    <div className="mb-4">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...inputProps} />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
