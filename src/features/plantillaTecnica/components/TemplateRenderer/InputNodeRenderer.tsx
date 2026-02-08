// src/features/plantillaTecnica/components/TemplateRenderer/InputNodeRenderer.tsx

import { Input } from '@/shared/components/molecules/Input'
import { Label } from '@/shared/components/atoms/Label'
import { InputNode, TemplateValues } from '../../interfaces/template.types'

interface Props {
  node: InputNode
  value: number | string | boolean | undefined
  error?: string
  onChange: (key: string, value: number | string | boolean | undefined) => void
}

export const InputNodeRenderer = ({ node, value, error, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    switch (node.valueType) {
      case 'number':
        // Permitir campo vacío o número
        if (rawValue === '') {
          onChange(node.key, undefined)
        } else {
          const num = parseFloat(rawValue)
          onChange(node.key, isNaN(num) ? rawValue : num)
        }
        break

      case 'boolean':
        onChange(node.key, e.target.checked)
        break

      case 'string':
      case 'date':
      default:
        onChange(node.key, rawValue)
        break
    }
  }

  const renderInput = () => {
    switch (node.valueType) {
      case 'number':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="any"
              value={(value as number | string | undefined) ?? ''}
              onChange={handleChange}
              className={`flex-1 ${error ? 'border-red-500' : ''}`}
              placeholder={node.default !== undefined ? String(node.default) : ''}
            />
            {node.unit && (
              <span className="text-sm text-gray-600 font-medium">{node.unit}</span>
            )}
          </div>
        )

      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={handleChange}
            className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        )

      case 'date':
        return (
          <Input
            type="date"
            value={value ? String(value) : ''}
            onChange={handleChange}
            className={error ? 'border-red-500' : ''}
          />
        )

      case 'string':
      default:
        return (
          <Input
            type="text"
            value={value ? String(value) : ''}
            onChange={handleChange}
            className={error ? 'border-red-500' : ''}
            placeholder={node.default !== undefined ? String(node.default) : ''}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={node.key}>
        {node.label}
        {node.required && <span className="text-red-600 ml-1">*</span>}
      </Label>
      {renderInput()}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
