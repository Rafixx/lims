// src/features/plantillaTecnica/components/TemplateRenderer/DynamicTemplateRenderer.tsx

import { useState, useEffect, useMemo } from 'react'
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/molecules/Button'
import { Template, TemplateValues, TemplateNode, CalcNode } from '../../interfaces/template.types'
import { validateValues, mergeValues } from '../../utils/templateValidator'
import { evaluateExpression } from '../../utils/expressionEvaluator'
import { TemplateNodeRenderer } from './TemplateNodeRenderer'

interface Props {
  template: Template
  initialValues?: TemplateValues
  onSave: (values: TemplateValues) => Promise<void>
  isSaving?: boolean
}

/**
 * Motor de renderizado de plantillas dinámicas
 * - Lee la plantilla desde dim_tecnicas_proc.json_data
 * - Renderiza inputs, calcs, groups, procedures
 * - Calcula valores en tiempo real
 * - Persiste solo inputs en worklist.json_data
 */
export const DynamicTemplateRenderer = ({
  template,
  initialValues = {},
  onSave,
  isSaving = false
}: Props) => {
  const [values, setValues] = useState<TemplateValues>(() => mergeValues(template, initialValues))

  useEffect(() => {
    setValues(mergeValues(template, initialValues))
  }, [template, initialValues])

  const validation = useMemo(() => validateValues(template, values), [template, values])

  const calculatedValues = useMemo(() => {
    return calculateAllCalcs(template.nodes, values)
  }, [template.nodes, values])

  const handleChange = (key: string, value: number | string | boolean | undefined) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!validation.isValid) return
    const inputValues = filterInputValues(template.nodes, values)
    await onSave(inputValues)
  }

  const errorCount = Object.keys(validation.errors).length

  return (
    <div className="space-y-3">
      {/* Nodos de la plantilla — groups y procedures ocupan ancho completo */}
      <div className="grid grid-cols-2 gap-3">
        {template.nodes.map(node => {
          const isFullWidth = node.type === 'group' || node.type === 'procedure'
          return (
            <div key={node.key} className={isFullWidth ? 'col-span-2' : 'col-span-1'}>
              <TemplateNodeRenderer
                node={node}
                values={values}
                calculatedValues={calculatedValues}
                validation={validation}
                onChange={handleChange}
              />
            </div>
          )
        })}
      </div>

      {/* Footer: estado de validación + guardar */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-200">
        <div className="flex items-center gap-2 text-sm">
          {validation.isValid ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-success-600" />
              <span className="text-success-700">Todos los campos completados</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-warning-500" />
              <span className="text-surface-500">
                {errorCount} {errorCount === 1 ? 'campo requerido' : 'campos requeridos'} sin completar
              </span>
            </>
          )}
        </div>

        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!validation.isValid || isSaving}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </div>
  )
}

/**
 * Calcula todos los nodos calc resolviendo dependencias mediante múltiples pasadas
 * Hace hasta 3 pasadas para resolver dependencias entre calcs
 * Si falta alguna variable → retorna undefined
 * Si el resultado es NaN o Infinity → retorna undefined
 */
function calculateAllCalcs(nodes: TemplateNode[], values: TemplateValues): TemplateValues {
  const calculated: TemplateValues = {}

  const calcNodes: CalcNode[] = []
  collectCalcNodes(nodes, calcNodes)

  const MAX_PASSES = 3
  let pass = 0
  let hasChanges = true

  while (pass < MAX_PASSES && hasChanges) {
    hasChanges = false
    pass++

    const allValues = { ...values, ...calculated }

    for (const calcNode of calcNodes) {
      if (calculated[calcNode.key] !== undefined) {
        continue
      }

      const result = evaluateExpression(calcNode.expr.value, allValues)

      if (result !== undefined) {
        calculated[calcNode.key] = result
        hasChanges = true
      }
    }
  }

  return calculated
}

function collectCalcNodes(nodes: TemplateNode[], acc: CalcNode[]): void {
  for (const node of nodes) {
    if (node.type === 'calc') {
      acc.push(node)
    } else if (node.type === 'group') {
      collectCalcNodes(node.children, acc)
    }
  }
}

function filterInputValues(nodes: TemplateNode[], values: TemplateValues): TemplateValues {
  const inputKeys = new Set<string>()
  collectInputKeys(nodes, inputKeys)

  const filtered: TemplateValues = {}
  for (const key of inputKeys) {
    if (values[key] !== undefined) {
      filtered[key] = values[key]
    }
  }

  return filtered
}

function collectInputKeys(nodes: TemplateNode[], acc: Set<string>): void {
  for (const node of nodes) {
    if (node.type === 'input') {
      acc.add(node.key)
    } else if (node.type === 'group') {
      collectInputKeys(node.children, acc)
    }
  }
}
