// src/features/plantillaTecnica/utils/templateValidator.ts

import {
  Template,
  TemplateNode,
  InputNode,
  TemplateValues,
  ValidationResult,
  InputMetadata
} from '../interfaces/template.types'

/**
 * Valida que una plantilla tenga la estructura correcta
 */
export function validateTemplate(json: unknown): json is Template {
  if (!json || typeof json !== 'object') {
    return false
  }

  const template = json as Partial<Template>

  if (!template.schemaVersion || typeof template.schemaVersion !== 'string') {
    return false
  }

  if (!template.scope || (template.scope !== 'PLANTILLA' && template.scope !== 'TECNICA')) {
    return false
  }

  if (!template.title || typeof template.title !== 'string') {
    return false
  }

  if (!Array.isArray(template.nodes)) {
    return false
  }

  return true
}

/**
 * Extrae todos los nodos de tipo input de una plantilla (recursivamente)
 */
export function extractInputNodes(nodes: TemplateNode[]): InputNode[] {
  const inputs: InputNode[] = []

  for (const node of nodes) {
    if (node.type === 'input') {
      inputs.push(node)
    } else if (node.type === 'group') {
      inputs.push(...extractInputNodes(node.children))
    }
  }

  return inputs
}

/**
 * Extrae metadata de todos los inputs para validación
 */
export function extractInputMetadata(nodes: TemplateNode[]): InputMetadata[] {
  const inputNodes = extractInputNodes(nodes)

  return inputNodes.map(node => ({
    key: node.key,
    label: node.label,
    valueType: node.valueType,
    required: node.required ?? false
  }))
}

/**
 * Valida que los valores cumplan con los requisitos de los inputs
 */
export function validateValues(
  template: Template,
  values: TemplateValues
): ValidationResult {
  const errors: Record<string, string> = {}
  const inputs = extractInputNodes(template.nodes)

  for (const input of inputs) {
    const value = values[input.key]

    // Validar required
    if (input.required && (value === undefined || value === null || value === '')) {
      errors[input.key] = `${input.label} es obligatorio`
      continue
    }

    // Si no hay valor y no es requerido, skip validación de tipo
    if (value === undefined || value === null || value === '') {
      continue
    }

    // Validar tipo
    switch (input.valueType) {
      case 'number':
        if (typeof value === 'string' && value.trim() !== '') {
          const num = parseFloat(value)
          if (isNaN(num)) {
            errors[input.key] = `${input.label} debe ser un número válido`
          }
        } else if (typeof value !== 'number') {
          errors[input.key] = `${input.label} debe ser un número`
        }
        break

      case 'string':
        if (typeof value !== 'string') {
          errors[input.key] = `${input.label} debe ser texto`
        }
        break

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors[input.key] = `${input.label} debe ser verdadero o falso`
        }
        break

      case 'date':
        // Aceptar strings que puedan parsearse como fecha
        if (typeof value === 'string') {
          const date = new Date(value)
          if (isNaN(date.getTime())) {
            errors[input.key] = `${input.label} debe ser una fecha válida`
          }
        } else {
          errors[input.key] = `${input.label} debe ser una fecha`
        }
        break
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Inicializa valores con defaults de la plantilla
 */
export function initializeValues(template: Template): TemplateValues {
  const values: TemplateValues = {}
  const inputs = extractInputNodes(template.nodes)

  for (const input of inputs) {
    if (input.default !== undefined) {
      values[input.key] = input.default
    }
  }

  return values
}

/**
 * Mezcla valores guardados con defaults
 * Los valores guardados tienen prioridad
 */
export function mergeValues(
  template: Template,
  savedValues: TemplateValues
): TemplateValues {
  const defaultValues = initializeValues(template)
  return { ...defaultValues, ...savedValues }
}
