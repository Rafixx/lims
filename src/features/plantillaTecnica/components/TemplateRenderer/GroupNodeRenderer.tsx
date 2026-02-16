// src/features/plantillaTecnica/components/TemplateRenderer/GroupNodeRenderer.tsx

import { GroupNode, TemplateNode, TemplateValues, ValidationResult } from '../../interfaces/template.types'
import { TemplateNodeRenderer } from './TemplateNodeRenderer'

interface Props {
  node: GroupNode
  values: TemplateValues
  calculatedValues: TemplateValues
  validation: ValidationResult
  onChange: (key: string, value: number | string | boolean | undefined) => void
}

export const GroupNodeRenderer = ({
  node,
  values,
  calculatedValues,
  validation,
  onChange
}: Props) => {
  // Separar hijos por tipo para un layout inteligente
  const inputChildren = node.children.filter(c => c.type === 'input')
  const calcChildren = node.children.filter(c => c.type === 'calc')
  const otherChildren = node.children.filter(c => c.type !== 'input' && c.type !== 'calc')

  const hasInputs = inputChildren.length > 0
  const hasCalcs = calcChildren.length > 0
  const hasBoth = hasInputs && hasCalcs

  const renderChildren = (children: TemplateNode[]) =>
    children.map(child => (
      <TemplateNodeRenderer
        key={child.key}
        node={child}
        values={values}
        calculatedValues={calculatedValues}
        validation={validation}
        onChange={onChange}
      />
    ))

  return (
    <div className="rounded-lg border border-surface-200 bg-white shadow-soft overflow-hidden">
      {/* Header del grupo */}
      <div className="flex items-center gap-2.5 px-4 py-2 bg-surface-50 border-b border-surface-200">
        <div className="w-0.5 h-3.5 rounded-full bg-primary-400 flex-shrink-0" />
        <h3 className="text-xs font-semibold text-surface-600 uppercase tracking-wider">
          {node.label}
        </h3>
      </div>

      {/* Contenido del grupo */}
      <div className="p-4">
        {/* Grupos anidados y procedimientos: siempre ancho completo */}
        {otherChildren.length > 0 && (
          <div className={`space-y-3 ${hasInputs || hasCalcs ? 'mb-4' : ''}`}>
            {renderChildren(otherChildren)}
          </div>
        )}

        {/* Layout según combinación de hijos */}
        {hasBoth ? (
          // Inputs (2/5) + Calcs (3/5) en la misma fila
          <div className="grid grid-cols-5 gap-0">
            <div className="col-span-2 space-y-2 pr-5">
              {renderChildren(inputChildren)}
            </div>
            <div className="col-span-3 border-l border-surface-200 pl-5 space-y-2">
              {renderChildren(calcChildren)}
            </div>
          </div>
        ) : hasInputs ? (
          // Solo inputs: cuadrícula de 2 columnas
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            {renderChildren(inputChildren)}
          </div>
        ) : hasCalcs ? (
          // Solo calcs: columna completa
          <div className="space-y-2">
            {renderChildren(calcChildren)}
          </div>
        ) : null}
      </div>
    </div>
  )
}
