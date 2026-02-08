// src/features/plantillaTecnica/interfaces/template.types.ts

/**
 * Tipos para el sistema de plantillas dinámicas basadas en JSONB
 * El JSON vive en dim_tecnicas_proc.json_data y los valores en worklist.json_data
 */

export type ValueType = 'number' | 'string' | 'boolean' | 'date'

export type Scope = 'PLANTILLA' | 'TECNICA'

/**
 * Step dentro de un procedimiento
 */
export interface ProcedureStep {
  label: string
  text: string
}

/**
 * Expresión calculada
 */
export interface CalcExpression {
  lang: 'expr'
  value: string // ej: "199 * num_tubos * error_factor"
}

/**
 * Nodo base con propiedades comunes
 */
interface BaseNode {
  key: string
  label: string
}

/**
 * Nodo de tipo "procedure" - Muestra pasos de texto (solo lectura)
 */
export interface ProcedureNode extends BaseNode {
  type: 'procedure'
  steps: ProcedureStep[]
}

/**
 * Nodo de tipo "group" - Contenedor visual con children
 */
export interface GroupNode extends BaseNode {
  type: 'group'
  children: TemplateNode[]
}

/**
 * Nodo de tipo "input" - Campo editable que se persiste
 */
export interface InputNode extends BaseNode {
  type: 'input'
  valueType: ValueType
  unit?: string
  required?: boolean
  default?: number | string | boolean
}

/**
 * Nodo de tipo "calc" - Campo calculado (solo lectura, no se persiste)
 */
export interface CalcNode extends BaseNode {
  type: 'calc'
  valueType: 'number' | 'string'
  unit?: string
  expr: CalcExpression
}

/**
 * Unión discriminada de todos los tipos de nodos
 */
export type TemplateNode = ProcedureNode | GroupNode | InputNode | CalcNode

/**
 * Estructura raíz de la plantilla
 */
export interface Template {
  schemaVersion: string
  scope: Scope
  title: string
  nodes: TemplateNode[]
}

/**
 * Valores de los inputs (key -> valor)
 * Solo se persisten los inputs, los calc se recalculan
 */
export type TemplateValues = Record<string, number | string | boolean | undefined>

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string> // key -> mensaje de error
}

/**
 * Metadata sobre un input para validación
 */
export interface InputMetadata {
  key: string
  label: string
  valueType: ValueType
  required: boolean
}
