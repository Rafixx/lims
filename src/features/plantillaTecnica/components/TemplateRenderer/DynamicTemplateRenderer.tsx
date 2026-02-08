// src/features/plantillaTecnica/components/TemplateRenderer/DynamicTemplateRenderer.tsx

import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/shared/components/molecules/Card'
import { Button } from '@/shared/components/molecules/Button'
import { Save } from 'lucide-react'
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
  // Estado de valores (solo inputs)
  const [values, setValues] = useState<TemplateValues>(() => mergeValues(template, initialValues))

  // Sincronizar cuando cambian los initialValues (al recargar worklist)
  useEffect(() => {
    setValues(mergeValues(template, initialValues))
  }, [template, initialValues])

  // Validación en tiempo real
  const validation = useMemo(() => validateValues(template, values), [template, values])

  // Calcular todos los nodos calc en tiempo real
  const calculatedValues = useMemo(() => {
    return calculateAllCalcs(template.nodes, values)
  }, [template.nodes, values])

  // Handler para cambiar valores
  const handleChange = (key: string, value: number | string | boolean | undefined) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  // Handler para guardar
  const handleSave = async () => {
    if (!validation.isValid) {
      return
    }

    // Filtrar solo inputs (no guardar calcs ni otros)
    const inputValues = filterInputValues(template.nodes, values)
    await onSave(inputValues)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <Card className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <h2 className="text-2xl font-bold text-primary-900">{template.title}</h2>
        <p className="text-sm text-primary-600 mt-1">
          Versión: {template.schemaVersion} | Alcance: {template.scope}
        </p>
      </Card> */}

      {/* Nodos de la plantilla */}
      {/* <div className="space-y-6"> */}
      <div className="grid grid-cols-2 gap-6">
        {template.nodes.map(node => (
          <TemplateNodeRenderer
            key={node.key}
            node={node}
            values={values}
            calculatedValues={calculatedValues}
            validation={validation}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Botón guardar */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!validation.isValid || isSaving}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Guardando...' : 'Guardar Plantilla'}
        </Button>
      </div>

      {/* Errores de validación */}
      {!validation.isValid && (
        <Card className="p-4 bg-red-50 border-red-200">
          <h3 className="text-sm font-semibold text-red-900 mb-2">Hay campos con errores:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(validation.errors).map(([key, error]) => (
              <li key={key}>• {error}</li>
            ))}
          </ul>
        </Card>
      )}
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

  // Recopilar todos los calcs
  const calcNodes: CalcNode[] = []
  collectCalcNodes(nodes, calcNodes)

  // Resolver dependencias mediante múltiples pasadas (máximo 3)
  const MAX_PASSES = 3
  let pass = 0
  let hasChanges = true

  while (pass < MAX_PASSES && hasChanges) {
    hasChanges = false
    pass++

    // Valores disponibles = inputs + calcs ya calculados
    const allValues = { ...values, ...calculated }

    for (const calcNode of calcNodes) {
      // Si ya tiene un valor válido, skip (ya resuelto)
      if (calculated[calcNode.key] !== undefined) {
        continue
      }

      // Intentar calcular
      const result = evaluateExpression(calcNode.expr.value, allValues)

      // Si se obtuvo un resultado válido, guardarlo
      if (result !== undefined) {
        calculated[calcNode.key] = result
        hasChanges = true
      }
    }
  }

  return calculated
}

/**
 * Recopila recursivamente todos los nodos calc
 */
function collectCalcNodes(nodes: TemplateNode[], acc: CalcNode[]): void {
  for (const node of nodes) {
    if (node.type === 'calc') {
      acc.push(node)
    } else if (node.type === 'group') {
      collectCalcNodes(node.children, acc)
    }
  }
}

/**
 * Filtra solo valores de inputs (excluye calcs)
 */
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

/**
 * Recopila recursivamente todas las keys de inputs
 */
function collectInputKeys(nodes: TemplateNode[], acc: Set<string>): void {
  for (const node of nodes) {
    if (node.type === 'input') {
      acc.add(node.key)
    } else if (node.type === 'group') {
      collectInputKeys(node.children, acc)
    }
  }
}
