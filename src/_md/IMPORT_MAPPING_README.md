# Sistema de Importación de Resultados con Mapeo

## 📋 Descripción

Sistema completo para importar resultados desde archivos CSV con validación del número de filas y mapeo interactivo de cada resultado con su técnica correspondiente.

## 🔄 Flujo de Trabajo

```
1. Usuario sube archivo CSV
   ↓
2. Sistema parsea y valida el CSV
   ↓
3. Valida: N° filas CSV === N° técnicas worklist
   ↓
4. Si coincide → Muestra modal de mapeo
   ↓
5. Usuario asigna cada fila CSV a una técnica
   ↓
6. Sistema valida el mapeo (sin duplicados)
   ↓
7. Envía archivo + mapeo al backend
   ↓
8. Backend importa resultados según el mapeo
```

## 🏗️ Componentes Creados

### 1. `csvParser.ts`

**Ubicación**: `src/features/workList/utils/csvParser.ts`

**Funciones**:

- `parseCSV(file)`: Parsea archivo CSV y retorna array de objetos
- `countCSVRows(file)`: Cuenta número de filas de datos

**Ejemplo**:

```typescript
const rows = await parseCSV(file)
// rows = [
//   { codigo: 'EPI-001', muestra: 'S-001', resultado: 'POSITIVO' },
//   { codigo: 'EPI-002', muestra: 'S-002', resultado: 'NEGATIVO' }
// ]
```

### 2. `MapResultsModal.tsx`

**Ubicación**: `src/features/workList/components/MapResultsModal.tsx`

**Props**:

- `isOpen`: boolean - Controla visibilidad del modal
- `onClose`: () => void - Callback al cerrar
- `onConfirm`: (mapping) => void - Callback al confirmar mapeo
- `tecnicas`: Tecnica[] - Técnicas del worklist
- `csvRows`: CsvRow[] - Filas parseadas del CSV

**Features**:

- ✅ Mapeo automático inicial (1:1 por orden)
- ✅ Selectores dropdown para cada fila CSV
- ✅ Validación sin duplicados
- ✅ Validación de completitud
- ✅ Vista lado a lado: CSV ↔ Técnica
- ✅ Preview de datos antes de confirmar

### 3. Actualizaciones en `useWorklistActions.ts`

**Nuevos estados**:

```typescript
const [showMappingModal, setShowMappingModal] = useState(false)
const [csvRows, setCsvRows] = useState<CsvRow[]>([])
const [currentFile, setCurrentFile] = useState<File | null>(null)
```

**Nuevas funciones**:

- `handleImportDataResults`: Valida y parsea CSV, abre modal de mapeo
- `handleConfirmMapping`: Envía archivo + mapeo al backend
- `closeMappingModal`: Cierra modal y limpia estado

**Nueva prop requerida**:

```typescript
interface UseWorklistActionsProps {
  worklistId: number
  worklistName: string
  tecnicas: Tecnica[] // ← NUEVA
  refetchWorkList: () => void
}
```

### 4. Actualizaciones en `worklistService.ts`

**Método actualizado**:

```typescript
async importDataResults(
  id: number,
  file: File,
  mapping?: Record<number, number>  // ← NUEVO parámetro opcional
): Promise<void>
```

**Envío al backend**:

```typescript
// FormData incluye:
// - file: archivo CSV
// - mapping: JSON string del mapeo { rowIndex: tecnicaId }
```

## 📊 Formato del Mapeo

```typescript
// Estructura del mapping
type Mapping = Record<number, number>

// Ejemplo:
{
  0: 123,  // Fila 0 del CSV → Técnica ID 123
  1: 456,  // Fila 1 del CSV → Técnica ID 456
  2: 789   // Fila 2 del CSV → Técnica ID 789
}
```

## 🎨 UI del Modal de Mapeo

```
┌─────────────────────────────────────────────────────────┐
│  🔄 Mapear Resultados                               [X] │
├─────────────────────────────────────────────────────────┤
│  📄 3 resultados en CSV  |  🧪 3 técnicas en worklist  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────┐  →  ┌─────────────────────────┐  │
│  │ Fila CSV #1    │  →  │ Técnica del Worklist     │  │
│  │ codigo: EPI-001│     │ [Dropdown: Seleccionar]  │  │
│  │ resultado: POS │     │                          │  │
│  └────────────────┘     └─────────────────────────┘  │
│                                                         │
│  ┌────────────────┐  →  ┌─────────────────────────┐  │
│  │ Fila CSV #2    │  →  │ Técnica del Worklist     │  │
│  │ codigo: EPI-002│     │ [Dropdown: Seleccionar]  │  │
│  │ resultado: NEG │     │                          │  │
│  └────────────────┘     └─────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                       [Cancelar] [Confirmar Importación]│
└─────────────────────────────────────────────────────────┘
```

## ✅ Validaciones

### 1. Validación de Cantidad

```typescript
if (csvRows.length !== tecnicas.length) {
  notify(
    `El archivo contiene ${rows.length} resultados 
     pero el worklist tiene ${tecnicas.length} técnicas. 
     Deben coincidir.`,
    'error'
  )
}
```

### 2. Validación de Completitud

```typescript
// Todas las filas deben tener técnica asignada
csvRows.forEach((_, index) => {
  if (!mapping[index]) {
    errors.push(`La fila ${index + 1} no tiene técnica asignada`)
  }
})
```

### 3. Validación sin Duplicados

```typescript
// No puede haber técnicas repetidas
const usedTecnicas = Object.values(mapping)
const uniqueTecnicas = new Set(usedTecnicas)
if (usedTecnicas.length !== uniqueTecnicas.size) {
  errors.push('No puede asignar la misma técnica a múltiples resultados')
}
```

## 🔧 Integración en WorklistDetailPage

```typescript
// 1. Importar el modal
import { MapResultsModal } from '../components/MapResultsModal'

// 2. Obtener estados y funciones del hook
const {
  showMappingModal,
  csvRows,
  tecnicas,
  closeMappingModal,
  handleConfirmMapping,
  ...
} = useWorklistActions({
  worklistId,
  worklistName,
  tecnicas: worklist?.tecnicas || [],  // ← Pasar técnicas
  refetchWorkList
})

// 3. Renderizar el modal
<MapResultsModal
  isOpen={showMappingModal}
  onClose={closeMappingModal}
  onConfirm={handleConfirmMapping}
  tecnicas={tecnicas}
  csvRows={csvRows}
/>
```

## 📝 Ejemplo de Uso Completo

```typescript
// 1. Usuario hace clic en "Importar Resultados"
// 2. Se abre ImportResultsModal
// 3. Usuario selecciona archivo CSV con 5 filas
// 4. Sistema valida: worklist tiene 5 técnicas ✓
// 5. Se cierra ImportResultsModal
// 6. Se abre MapResultsModal con mapeo 1:1 inicial
// 7. Usuario ajusta el mapeo si es necesario
// 8. Usuario confirma
// 9. Sistema envía: { file, mapping: { 0: 123, 1: 456, ... } }
// 10. Backend procesa y asigna resultados
// 11. Worklist se actualiza automáticamente
```

## 🎯 Ventajas del Sistema

1. **Flexibilidad**: Usuario decide qué resultado va a qué técnica
2. **Validación**: Previene errores de importación
3. **Transparencia**: Usuario ve exactamente qué se va a importar
4. **Control**: Puede corregir el orden antes de confirmar
5. **Usabilidad**: Mapeo inicial automático para casos simples
6. **Seguridad**: Validaciones múltiples antes de enviar al backend

## 🚀 Mejoras Futuras

- [ ] Guardar templates de mapeo para reutilizar
- [ ] Sugerencias inteligentes basadas en nombres/códigos
- [ ] Drag & drop para mapear técnicas
- [ ] Preview de resultados antes de importar
- [ ] Soporte para CSV con diferentes delimitadores
- [ ] Validación de formato de datos en CSV

## 📚 Archivos Modificados

- ✅ `src/features/workList/utils/csvParser.ts` (NUEVO)
- ✅ `src/features/workList/components/MapResultsModal.tsx` (NUEVO)
- ✅ `src/features/workList/hooks/useWorklistActions.ts` (ACTUALIZADO)
- ✅ `src/features/workList/services/worklistService.ts` (ACTUALIZADO)
- ✅ `src/features/workList/pages/WorklistDetailPage.tsx` (ACTUALIZADO)
