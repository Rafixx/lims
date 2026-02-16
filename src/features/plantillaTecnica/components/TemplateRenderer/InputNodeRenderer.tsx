// src/features/plantillaTecnica/components/TemplateRenderer/InputNodeRenderer.tsx

import { Input } from '@/shared/components/molecules/Input'
import { Label } from '@/shared/components/atoms/Label'
import { InputNode } from '../../interfaces/template.types'

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

  const errorClass = error
    ? 'border-danger-400 focus:ring-danger-400 focus:border-danger-400'
    : ''

  const renderInput = () => {
    switch (node.valueType) {
      case 'number':
        return (
          // Número con unidad superpuesta a la derecha, valor alineado a la derecha
          <div className="relative">
            <Input
              type="number"
              step="any"
              value={(value as number | string | undefined) ?? ''}
              onChange={handleChange}
              className={`text-right tabular-nums ${node.unit ? 'pr-11' : ''} ${errorClass}`}
              placeholder={node.default !== undefined ? String(node.default) : ''}
            />
            {node.unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-surface-400 pointer-events-none select-none">
                {node.unit}
              </span>
            )}
          </div>
        )

      case 'boolean':
        return (
          <div className="h-9 flex items-center">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={handleChange}
              className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
        )

      case 'date':
        return (
          <Input
            type="date"
            value={value ? String(value) : ''}
            onChange={handleChange}
            className={errorClass}
          />
        )

      case 'string':
      default:
        return (
          <Input
            type="text"
            value={value ? String(value) : ''}
            onChange={handleChange}
            className={errorClass}
            placeholder={node.default !== undefined ? String(node.default) : ''}
          />
        )
    }
  }

  return (
    <div className="space-y-1">
      <Label htmlFor={node.key} className="text-xs">
        {node.label}
        {node.required && <span className="text-danger-500 ml-0.5">*</span>}
      </Label>
      {renderInput()}
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  )
}
