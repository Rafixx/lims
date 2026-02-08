# Sistema de Plantillas Dinámicas JSONB

## Resumen

Sistema completo de renderizado y persistencia de plantillas dinámicas basadas en JSONB para gestionar configuraciones variables de técnicas de procesamiento en worklists.

## Arquitectura

### Origen de datos
- **Plantilla (estructura)**: `dim_tecnicas_proc.json_data` → No se modifica, es la definición
- **Valores (inputs)**: `worklist.json_data.template_values` → Se persisten solo los inputs editables

### Flujo de datos

```
1. dim_tecnicas_proc.json_data (Template)
   ↓
2. Frontend: DynamicTemplateRenderer
   - Renderiza: procedure, input, calc, group
   - Valida en tiempo real
   - Calcula campos calc automáticamente
   ↓
3. Usuario edita inputs
   ↓
4. Al guardar: POST/PUT worklist.template_values
   - Solo se persisten inputs (no calcs, no structure)
   ↓
5. Al reabrir: GET worklist.template_values
   - Hidrata inputs
   - Recalcula calcs al vuelo
```

## Estructura de la Plantilla (JSON)

### Schema raíz

```typescript
{
  "schemaVersion": "1.0",
  "scope": "PLANTILLA" | "TECNICA",
  "title": "Nombre descriptivo",
  "nodes": [ /* Nodos */ ]
}
```

### Tipos de Nodos (Unión discriminada)

#### 1. **procedure** - Pasos de solo lectura

```json
{
  "type": "procedure",
  "key": "proc_cuqub",
  "label": "Procedimiento de Cuantificación",
  "steps": [
    {
      "label": "Paso 1",
      "text": "Descripción detallada del paso"
    }
  ]
}
```

**Renderizado**: Card azul con lista numerada de pasos.

#### 2. **input** - Campo editable (SE PERSISTE)

```json
{
  "type": "input",
  "key": "num_tubos",
  "label": "Número de tubos",
  "valueType": "number",
  "unit": "tubos",
  "required": true,
  "default": 8
}
```

**Tipos soportados**:
- `number`: Input numérico con step="any"
- `string`: Input de texto
- `boolean`: Checkbox
- `date`: Input de fecha

**Renderizado**: FormField con validación en tiempo real.

#### 3. **calc** - Campo calculado (NO SE PERSISTE)

```json
{
  "type": "calc",
  "key": "buffer_ul",
  "label": "Volumen de buffer",
  "valueType": "number",
  "unit": "µL",
  "expr": {
    "lang": "expr",
    "value": "199 * num_tubos * error_factor"
  }
}
```

**Expresiones soportadas**:
- Operadores: `+`, `-`, `*`, `/`, `()`
- Funciones: `min(a,b)`, `max(a,b)`, `round(x,n)`
- Variables: Nombres de keys de otros inputs/calcs

**Manejo de edge cases**:
- Si falta una variable → retorna `undefined` (muestra "—")
- Si el resultado es `NaN` → retorna `undefined`
- Si el resultado es `Infinity` → retorna `undefined`
- División por cero → retorna `undefined`

**Resolución de dependencias**:
- Hasta 3 pasadas para resolver dependencias entre calcs
- Los calcs se recalculan automáticamente cuando cambian los inputs

**Renderizado**: Campo de solo lectura púrpura con valor calculado.

#### 4. **group** - Contenedor visual

```json
{
  "type": "group",
  "key": "group_calculos",
  "label": "Cálculos de Volúmenes",
  "children": [ /* Nodos anidados */ ]
}
```

**Renderizado**: Card gris con children recursivos.

## Archivos Implementados

### 1. Tipos TypeScript

**`src/features/plantillaTecnica/interfaces/template.types.ts`**
- `Template`: Estructura raíz
- `TemplateNode`: Unión discriminada (procedure | input | calc | group)
- `TemplateValues`: Record<string, valor>
- `ValidationResult`: Resultado de validación

### 2. Motor de Expresiones

**`src/features/plantillaTecnica/utils/expressionEvaluator.ts`**
- `evaluateExpression(expr, values)`: Evalúa sin `eval()`
- `extractVariables(expr)`: Extrae dependencias
- Parser recursivo con precedencia de operadores
- Soporte para funciones: min, max, round

### 3. Validador

**`src/features/plantillaTecnica/utils/templateValidator.ts`**
- `validateTemplate(json)`: Type guard
- `validateValues(template, values)`: Valida inputs
- `extractInputNodes(nodes)`: Extrae inputs recursivamente
- `initializeValues(template)`: Inicializa con defaults
- `mergeValues(template, saved)`: Combina defaults + guardados

### 4. Componentes de Renderizado

#### `src/features/plantillaTecnica/components/TemplateRenderer/`

- **`DynamicTemplateRenderer.tsx`** (Principal)
  - Gestiona estado de valores
  - Calcula calcs en tiempo real
  - Valida en tiempo real
  - Handler de guardado

- **`TemplateNodeRenderer.tsx`** (Recursivo)
  - Switch sobre `node.type`
  - Delega a renderers específicos

- **`ProcedureNodeRenderer.tsx`**
  - Card azul con pasos numerados

- **`InputNodeRenderer.tsx`**
  - Renderiza según `valueType`
  - Muestra errores de validación
  - Incluye unidades si existen

- **`CalcNodeRenderer.tsx`**
  - Campo de solo lectura púrpura
  - Muestra valor calculado o "—"
  - Muestra expresión como referencia

- **`GroupNodeRenderer.tsx`**
  - Card gris contenedor
  - Renderiza children recursivamente

### 5. Servicio API

**`src/features/plantillaTecnica/services/templateService.ts`**

```typescript
class TemplateService {
  // Obtener plantilla de dim_tecnicas_proc
  async getTemplateByTecnicaProc(idTecnicaProc: number): Promise<Template | null>

  // Guardar valores en worklist
  async saveWorklistTemplateValues(worklistId: number, values: TemplateValues): Promise<void>

  // Obtener valores guardados de worklist
  async getWorklistTemplateValues(worklistId: number): Promise<TemplateValues>
}
```

### 6. Hooks React Query

**`src/features/plantillaTecnica/hooks/useTemplate.ts`**

```typescript
// Hook para obtener plantilla
const { data: template } = useTemplate(idTecnicaProc)

// Hook para obtener valores guardados
const { data: savedValues } = useWorklistTemplateValues(worklistId)

// Hook para guardar valores
const saveMutation = useSaveWorklistTemplateValues()
await saveMutation.mutateAsync({ worklistId, values })
```

### 7. Integración en PlantillaTecnicaPage

**`src/features/plantillaTecnica/pages/PlantillaTecnicaPage.tsx`**

```typescript
// Cargar plantilla dinámica
const { data: template } = useTemplate(idTecnicaProc)
const { data: savedValues } = useWorklistTemplateValues(worklistId)
const saveMutation = useSaveWorklistTemplateValues()

// Renderizar si existe plantilla válida
{hasValidTemplate && (
  <DynamicTemplateRenderer
    template={template}
    initialValues={savedValues}
    onSave={handleSaveTemplateValues}
    isSaving={saveMutation.isPending}
  />
)}
```

## Contratos de API Backend

### 1. Obtener Plantilla (EXISTENTE, verificar)

```
GET /api/tecnicasProc/:id

Response:
{
  "id": 1,
  "tecnica_proc": "Cuantificación Qubit",
  "json_data": { /* Template */ },
  ...
}
```

**Estado**: ✅ Endpoint existe, verificar que `json_data` esté incluido

### 2. Guardar Valores (IMPLEMENTADO)

```
PUT /api/worklists/:id/template-values

Body:
{
  "template_values": {
    "num_tubos": 8,
    "error_factor": 1.1
  }
}

Response:
{
  "success": true,
  "message": "Template values actualizados correctamente"
}
```

**Estado**: ✅ IMPLEMENTADO

**Detalles de implementación**:
- Los valores se guardan en `worklist.json_data.template_values`
- Si ya existen otros datos en `json_data`, se preservan
- Solo se actualiza la propiedad `template_values`
- El campo es JSONB en PostgreSQL para consultas eficientes

### 3. Obtener Valores (IMPLEMENTADO)

```
GET /api/worklists/:id

Response:
{
  "id_worklist": 123,
  "nombre": "L26.00034",
  "tecnicas": [...],
  "json_data": {
    "template_values": {
      "num_tubos": 8,
      "error_factor": 1.1
    }
  }
}
```

**Estado**: ✅ IMPLEMENTADO

**Nota importante**: Siempre verificar existencia antes de usar:
```typescript
const templateValues = worklist.json_data?.template_values || {}
```

## Ejemplo Completo: CuQub

### Plantilla (en `dim_tecnicas_proc.json_data`)

Ver archivo: `src/features/plantillaTecnica/examples/cuqub-template.json`

```json
{
  "schemaVersion": "1.0",
  "scope": "PLANTILLA",
  "title": "Cuantificación Qubit",
  "nodes": [
    {
      "type": "procedure",
      "key": "proc_cuqub",
      "label": "Procedimiento de Cuantificación Qubit",
      "steps": [...]
    },
    {
      "type": "group",
      "key": "group_calculos",
      "label": "Cálculos de Volúmenes",
      "children": [
        {
          "type": "input",
          "key": "num_tubos",
          "label": "Número de tubos",
          "valueType": "number",
          "required": true,
          "default": 8
        },
        {
          "type": "input",
          "key": "error_factor",
          "label": "Factor de error",
          "valueType": "number",
          "required": true,
          "default": 1.1
        },
        {
          "type": "calc",
          "key": "buffer_ul",
          "label": "Volumen de buffer",
          "valueType": "number",
          "unit": "µL",
          "expr": {
            "lang": "expr",
            "value": "199 * num_tubos * error_factor"
          }
        },
        {
          "type": "calc",
          "key": "reagent_ul",
          "label": "Volumen de reactivo",
          "valueType": "number",
          "unit": "µL",
          "expr": {
            "lang": "expr",
            "value": "num_tubos * error_factor"
          }
        },
        {
          "type": "calc",
          "key": "total_ul",
          "label": "Volumen total",
          "valueType": "number",
          "unit": "µL",
          "expr": {
            "lang": "expr",
            "value": "buffer_ul + reagent_ul"
          }
        }
      ]
    }
  ]
}
```

### Valores Guardados (en `worklist.json_data.template_values`)

```json
{
  "json_data": {
    "template_values": {
      "num_tubos": 8,
      "error_factor": 1.1
    }
  }
}
```

**Los calcs NO se guardan**, se recalculan al renderizar:
- `buffer_ul = 199 * 8 * 1.1 = 1751.2`
- `reagent_ul = 8 * 1.1 = 8.8`
- `total_ul = 1751.2 + 8.8 = 1760`

## Verificación del Sistema

### Checklist Funcional

#### ✅ Renderizado
- [x] Se muestra el procedimiento con steps
- [x] Se muestran inputs: num_tubos, error_factor
- [x] Se muestran calcs: buffer_ul, reagent_ul, total_ul

#### ✅ Cálculo en Tiempo Real
- [x] Al cambiar num_tubos → buffer_ul y reagent_ul se actualizan
- [x] Al cambiar error_factor → buffer_ul y reagent_ul se actualizan
- [x] total_ul depende de otros calcs y se actualiza correctamente

#### ✅ Validación
- [x] Botón "Guardar" deshabilitado si faltan campos requeridos
- [x] Muestra errores debajo de inputs inválidos
- [x] No permite guardar si hay valores no numéricos en inputs numéricos

#### ✅ Persistencia (IMPLEMENTADO)
- [x] Al guardar: Se persiste solo `{ num_tubos, error_factor }` en `json_data.template_values`
- [x] Al recargar: Se restauran inputs desde `worklist.json_data.template_values`
- [x] Los calcs vuelven a calcularse correctamente sin leerlos de DB
- [x] Actualización incremental: Preserva otros datos en `json_data`

## Estado de Implementación Backend

### 1. Endpoint de Técnicas Proc
```
GET /api/tecnicasProc/:id
```
- ⏳ Verificar que incluye `json_data` en la respuesta

### 2. Endpoint para guardar valores (✅ IMPLEMENTADO)
```
PUT /api/worklists/:id/template-values
Body: { template_values: {...} }
```
- ✅ Endpoint implementado
- ✅ Almacena en `json_data.template_values` (campo JSONB)
- ✅ Preserva otros datos en `json_data`
- ✅ No requiere validación de esquema (flexible)

### 3. Endpoint para obtener worklist (✅ IMPLEMENTADO)
```
GET /api/worklists/:id
```
- ✅ Incluye `json_data` con `template_values` en la respuesta
- ✅ Incluye todas las técnicas con scope `withRefs`
- ⚠️ La respuesta puede ser grande debido al scope completo

### Notas Importantes del Backend

1. **Template values flexible**: No hay validación de esquema, acepta cualquier estructura
2. **Campo JSONB**: PostgreSQL permite consultas eficientes y almacenamiento flexible
3. **Actualización incremental**: Preserva datos existentes en `json_data`
4. **Verificación de existencia**: Siempre usar `worklist.json_data?.template_values || {}`
5. **Scope withRefs**: GET incluye muestras, arrays y toda la información relacionada

## Extensibilidad

### Agregar nuevos tipos de nodos

1. Definir tipo en `template.types.ts`:
```typescript
export interface CustomNode extends BaseNode {
  type: 'custom'
  customProp: string
}
```

2. Agregar a union:
```typescript
export type TemplateNode = ... | CustomNode
```

3. Crear renderer:
```typescript
// CustomNodeRenderer.tsx
export const CustomNodeRenderer = ({ node }: { node: CustomNode }) => {
  return <div>...</div>
}
```

4. Agregar case en `TemplateNodeRenderer.tsx`:
```typescript
case 'custom':
  return <CustomNodeRenderer node={node} />
```

### Agregar nuevas funciones al evaluador

En `expressionEvaluator.ts`:

```typescript
function evaluateFunction(name: string, args: number[]): number | undefined {
  // ...
  case 'avg':
    return args.reduce((a, b) => a + b, 0) / args.length

  case 'sqrt':
    return Math.sqrt(args[0])
  // ...
}
```

## Testing

### Unit Tests Recomendados

```typescript
describe('expressionEvaluator', () => {
  it('evalúa expresiones aritméticas básicas', () => {
    expect(evaluateExpression('2 + 3', {})).toBe(5)
    expect(evaluateExpression('10 * (2 + 3)', {})).toBe(50)
  })

  it('maneja variables', () => {
    expect(evaluateExpression('a + b', { a: 5, b: 10 })).toBe(15)
  })

  it('retorna undefined si falta una variable', () => {
    expect(evaluateExpression('a + b', { a: 5 })).toBeUndefined()
  })
})

describe('templateValidator', () => {
  it('valida inputs requeridos', () => {
    const result = validateValues(template, {})
    expect(result.isValid).toBe(false)
    expect(result.errors.num_tubos).toBeDefined()
  })
})
```

## Resumen para el Equipo

### Frontend (✅ COMPLETO)
- ✅ Tipos TypeScript definidos
- ✅ Motor de expresiones sin `eval()`
- ✅ Validación en tiempo real
- ✅ Componentes de renderizado recursivo
- ✅ Integración en PlantillaTecnicaPage
- ✅ Hooks React Query
- ✅ Servicio actualizado para usar `json_data.template_values`
- ✅ Ejemplo de plantilla CuQub

### Backend (✅ COMPLETO)
- ✅ Endpoint `PUT /api/worklists/:id/template-values` implementado
- ✅ Endpoint `GET /api/worklists/:id` incluye `json_data.template_values`
- ✅ Almacenamiento en campo JSONB `worklist.json_data`
- ⏳ Verificar que `GET /api/tecnicasProc/:id` incluye `json_data`

### Base de Datos (✅ COMPLETO)
- ✅ Campo `json_data` tipo JSONB existe en tabla `worklist`
- ✅ `template_values` se almacena dentro de `json_data`
- ⏳ Poblar `dim_tecnicas_proc.json_data` con plantillas según necesidad

## Contacto y Soporte

Para dudas sobre la implementación:
- Revisar tipos en `template.types.ts`
- Ver ejemplo completo en `cuqub-template.json`
- Probar expresiones en `expressionEvaluator.ts`
- Seguir patrón de `DynamicTemplateRenderer.tsx`
