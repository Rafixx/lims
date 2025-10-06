# CRUD de Pipetas - Documentación Completa

## Descripción General

Implementación completa del CRUD (Create, Read, Update, Delete) para el módulo de **Pipetas** en el sistema LIMS. Permite la gestión integral de pipetas utilizadas en el laboratorio, incluyendo su identificación por código, modelo y zona de ubicación.

---

## 1. Modelo de Datos

### Interfaz TypeScript

```typescript
interface Pipeta {
  id: number
  codigo: string // Código identificador de la pipeta (obligatorio)
  modelo?: string // Modelo de la pipeta (opcional)
  zona?: string // Zona de ubicación en el laboratorio (opcional)
}
```

### Validación con Zod

```typescript
const pipetaSchema = z.object({
  codigo: z.string().min(1, 'El código es obligatorio'),
  modelo: z.string().optional(),
  zona: z.string().optional()
})
```

**Reglas de validación:**

- ✅ `codigo`: Campo obligatorio, mínimo 1 carácter
- ✅ `modelo`: Campo opcional, texto libre
- ✅ `zona`: Campo opcional, texto libre para ubicación en laboratorio

---

## 2. Capa de Servicios

**Archivo:** `src/shared/services/dim_tables.services.ts`

### Métodos CRUD

```typescript
// Crear nueva pipeta
createPipeta: async (pipeta: Omit<Pipeta, 'id'>) => {
  const response = await apiClient.post<Pipeta>('/pipetas', pipeta)
  return response.data
}

// Actualizar pipeta existente
updatePipeta: async (id: number, pipeta: Partial<Omit<Pipeta, 'id'>>) => {
  const response = await apiClient.put<Pipeta>(`/pipetas/${id}`, pipeta)
  return response.data
}

// Eliminar pipeta
deletePipeta: async (id: number) => {
  const response = await apiClient.delete(`/pipetas/${id}`)
  return response.data
}
```

**Endpoints API:**

- `POST /pipetas` - Crear pipeta
- `PUT /pipetas/:id` - Actualizar pipeta
- `DELETE /pipetas/:id` - Eliminar pipeta

---

## 3. Hooks de React Query

**Archivo:** `src/shared/hooks/useDim_tables.ts`

### Hook de Creación

```typescript
export const useCreatePipeta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dimTablesService.createPipeta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pipetas'] })
    }
  })
}
```

### Hook de Actualización

```typescript
export const useUpdatePipeta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Pipeta> }) =>
      dimTablesService.updatePipeta(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pipeta', id] })
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pipetas'] })
    }
  })
}
```

### Hook de Eliminación

```typescript
export const useDeletePipeta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dimTablesService.deletePipeta,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pipetas'] })
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pipeta', id] })
    }
  })
}
```

**Características:**

- ✅ Invalidación automática de caché tras operaciones exitosas
- ✅ Manejo de estados de carga (`isPending`)
- ✅ Propagación de errores para manejo en componentes
- ✅ Query keys centralizadas con `dimTablesQueryKeys`

---

## 4. Componente de Formulario

**Archivo:** `src/features/dim_tables/pipetas/components/PipetaForm.tsx`

### Estructura del Formulario

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* Campo: Código (obligatorio) */}
  <input id="codigo" type="text" {...register('codigo')} className="..." />

  {/* Campo: Modelo (opcional) */}
  <input id="modelo" type="text" {...register('modelo')} className="..." />

  {/* Campo: Zona (opcional) */}
  <input id="zona" type="text" {...register('zona')} className="..." />

  {/* Botones de acción */}
  <button type="button" onClick={() => navigate('/pipetas')}>
    <X /> Cancelar
  </button>
  <button type="submit" disabled={isLoading || !isDirty}>
    <Save /> {isEditMode ? 'Actualizar' : 'Crear'}
  </button>
</form>
```

### Props del Componente

```typescript
interface PipetaFormProps {
  initialData?: Pipeta // Para modo edición
}
```

### Funcionalidades

1. **Validación en tiempo real** con React Hook Form + Zod
2. **Modo dual**: Creación y edición según `initialData`
3. **Gestión de estado de carga**: Botones deshabilitados durante mutaciones
4. **Navegación automática**: Redirige a `/pipetas` tras éxito
5. **Notificaciones**: Mensajes de éxito/error integrados
6. **Detección de cambios**: Botón Submit deshabilitado si no hay cambios (`isDirty`)
7. **Iconos Lucide**: `Save` y `X` para mejor UX

---

## 5. Páginas de Gestión

### Página de Creación

**Archivo:** `src/features/dim_tables/pipetas/pages/CreatePipetaPage.tsx`

```tsx
export const CreatePipetaPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/pipetas">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Nueva Pipeta</h1>
          <p>Completa el formulario para crear una nueva pipeta</p>
        </div>
      </div>

      <div className="bg-background-secondary rounded-lg shadow-sm border p-6">
        <PipetaForm />
      </div>
    </div>
  )
}
```

**Características:**

- Botón de retorno a listado
- Título y descripción claros
- Renderiza `PipetaForm` sin `initialData` (modo creación)

---

### Página de Edición

**Archivo:** `src/features/dim_tables/pipetas/pages/EditPipetaPage.tsx`

```tsx
export const EditPipetaPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: pipeta, isLoading, error } = usePipeta(Number(id))

  if (isLoading) {
    return <Loader2 className="animate-spin" />
  }

  if (error || !pipeta) {
    return (
      <div className="bg-estado-error/10 border border-estado-error rounded-lg p-4">
        <p className="text-estado-error">
          {error instanceof Error ? error.message : 'No se pudo cargar la pipeta'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/pipetas">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Editar Pipeta</h1>
          <p>
            Modificando: <span>{pipeta.codigo}</span>
          </p>
        </div>
      </div>

      <div className="bg-background-secondary rounded-lg shadow-sm border p-6">
        <PipetaForm initialData={pipeta} />
      </div>
    </div>
  )
}
```

**Características:**

- Obtiene ID desde parámetros de ruta
- Estados de carga y error manejados elegantemente
- Muestra código de la pipeta en el título
- Pasa `initialData` a `PipetaForm` para modo edición

---

### Página de Listado

**Archivo:** `src/features/dim_tables/pipetas/pages/PipetasPage.tsx`

#### Handler de Eliminación

```typescript
const handleDelete = async (pipeta: Pipeta) => {
  try {
    const confirmed = await confirm({
      title: '¿Eliminar pipeta?',
      message: `¿Estás seguro de que deseas eliminar la pipeta "${pipeta.codigo}"? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })

    if (confirmed) {
      await deleteMutation.mutateAsync(pipeta.id)
      notify('Pipeta eliminada correctamente', 'success')
    }
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Error al eliminar la pipeta', 'error')
  }
}
```

#### Renderizado de Cards

```tsx
<div className="grid gap-1">
  {pipetasFiltradas.map((pipeta: Pipeta) => (
    <PipetaCard
      key={pipeta.id}
      pipeta={pipeta}
      onEdit={() => navigate(`/pipetas/${pipeta.id}/editar`)}
      onDelete={() => handleDelete(pipeta)}
    />
  ))}
</div>
```

**Características:**

- **Confirmación visual**: Diálogo tipo "danger" antes de eliminar
- **Feedback inmediato**: Notificaciones de éxito/error
- **Navegación**: Botones de edición redirigen a página de edición
- **Filtros**: Búsqueda por código, modelo, zona

---

## 6. Configuración de Rutas

**Archivo:** `src/shared/routes/routes.tsx`

```typescript
// Importaciones
import { PipetasPage } from '@/features/dim_tables/pipetas/pages/PipetasPage'
import { CreatePipetaPage } from '@/features/dim_tables/pipetas/pages/CreatePipetaPage'
import { EditPipetaPage } from '@/features/dim_tables/pipetas/pages/EditPipetaPage'

// Configuración de rutas
children: [
  { path: 'pipetas', element: <PipetasPage /> },
  { path: 'pipetas/nueva', element: <CreatePipetaPage /> },
  { path: 'pipetas/:id/editar', element: <EditPipetaPage /> }
]
```

**Rutas configuradas:**

- `/pipetas` - Listado de pipetas
- `/pipetas/nueva` - Crear nueva pipeta
- `/pipetas/:id/editar` - Editar pipeta existente

---

## 7. Exports del Módulo

**Archivo:** `src/features/dim_tables/pipetas/index.ts`

```typescript
export { PipetaCard } from './components/PipetaCard'
export { PipetaForm } from './components/PipetaForm'
export { PipetasPage } from './pages/PipetasPage'
export { CreatePipetaPage } from './pages/CreatePipetaPage'
export { EditPipetaPage } from './pages/EditPipetaPage'
```

---

## 8. Flujo de Usuario

### Crear Pipeta

1. Usuario navega a `/pipetas`
2. Hace clic en "Nueva pipeta"
3. Redirige a `/pipetas/nueva`
4. Completa formulario (código obligatorio)
5. Click en "Crear"
6. **Sistema:**
   - Valida formulario con Zod
   - Envía POST a `/pipetas`
   - Muestra notificación de éxito
   - Invalida caché de React Query
   - Redirige a `/pipetas`

### Editar Pipeta

1. Usuario en `/pipetas`
2. Click en botón "Editar" de una pipeta
3. Redirige a `/pipetas/:id/editar`
4. **Sistema carga datos:**
   - Obtiene pipeta con `usePipeta(id)`
   - Muestra loader mientras carga
   - Pre-rellena formulario con `initialData`
5. Usuario modifica campos
6. Click en "Actualizar"
7. **Sistema:**
   - Envía PUT a `/pipetas/:id`
   - Muestra notificación de éxito
   - Redirige a `/pipetas`

### Eliminar Pipeta

1. Usuario en `/pipetas`
2. Click en botón "Eliminar" de una pipeta
3. **Sistema muestra diálogo de confirmación:**
   - Tipo: "danger" (rojo)
   - Mensaje: "¿Eliminar pipeta [código]?"
4. Usuario confirma
5. **Sistema:**
   - Envía DELETE a `/pipetas/:id`
   - Muestra notificación de éxito
   - Lista se actualiza automáticamente (invalidación de caché)

---

## 9. Integración de Sistemas

### Sistema de Confirmación

```typescript
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'

const { confirm } = useConfirmation()

const confirmed = await confirm({
  title: '¿Eliminar pipeta?',
  message: `¿Estás seguro de que deseas eliminar la pipeta "${pipeta.codigo}"?`,
  type: 'danger',
  confirmText: 'Eliminar',
  cancelText: 'Cancelar'
})
```

### Sistema de Notificaciones

```typescript
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const { notify } = useNotification()

// Éxito
notify('Pipeta creada correctamente', 'success')

// Error
notify('Error al eliminar la pipeta', 'error')
```

---

## 10. Consideraciones Técnicas

### Gestión de Caché

React Query invalida automáticamente la caché de `pipetas` tras cada mutación, asegurando que el listado siempre muestre datos actualizados.

### Manejo de Errores

Todos los errores de API se capturan y muestran al usuario mediante notificaciones:

- Errores de validación
- Errores de red
- Errores del servidor

### Optimización

- **React Hook Form**: Minimiza re-renders innecesarios
- **isDirty**: Desactiva submit si no hay cambios
- **Validación cliente**: Reduce llamadas al servidor
- **Lazy loading**: Datos se cargan solo cuando se necesitan
- **Query keys centralizadas**: Facilita invalidación de caché

---

## 11. Estilos y UI

### Clases Tailwind Principales

```css
/* Inputs */
.w-full.px-3.py-2.border.border-border.rounded-md.bg-background

/* Botones primarios */
.px-4.py-2.bg-blue-600.text-white.rounded-md.hover:bg-blue-700

/* Botones secundarios */
.px-4.py-2.border.border-border.rounded-md.hover:bg-background-hover

/* Mensajes de error */
.text-sm.text-estado-error
```

### Iconos (Lucide React)

- `Save` - Guardar cambios
- `X` - Cancelar
- `ArrowLeft` - Volver al listado
- `Loader2` - Estado de carga

---

## 12. Testing (Recomendaciones)

### Tests Unitarios

```typescript
// PipetaForm.test.tsx
describe('PipetaForm', () => {
  it('debe validar campo codigo como obligatorio', async () => {
    // Test de validación Zod
  })

  it('debe enviar datos correctos al crear', async () => {
    // Test de mutación createPipeta
  })

  it('debe pre-rellenar formulario en modo edición', () => {
    // Test de initialData
  })
})
```

### Tests de Integración

```typescript
// PipetasPage.test.tsx
describe('PipetasPage', () => {
  it('debe mostrar diálogo de confirmación al eliminar', async () => {
    // Test de confirm()
  })

  it('debe mostrar notificación tras eliminación exitosa', async () => {
    // Test de notify()
  })
})
```

---

## 13. Resumen de Archivos Modificados/Creados

### Archivos Creados

1. ✅ `src/features/dim_tables/pipetas/components/PipetaForm.tsx`
2. ✅ `src/features/dim_tables/pipetas/pages/CreatePipetaPage.tsx`
3. ✅ `src/features/dim_tables/pipetas/pages/EditPipetaPage.tsx`
4. ✅ `src/_md/CRUD_PIPETAS.md`

### Archivos Modificados

1. ✅ `src/shared/services/dim_tables.services.ts` - Métodos CRUD
2. ✅ `src/shared/hooks/useDim_tables.ts` - Hooks de mutación
3. ✅ `src/features/dim_tables/pipetas/pages/PipetasPage.tsx` - Handler de eliminación
4. ✅ `src/shared/routes/routes.tsx` - Rutas de navegación
5. ✅ `src/features/dim_tables/pipetas/index.ts` - Exports del módulo

---

## 14. Patrón Arquitectónico

```
┌─────────────────────────────────────────────────┐
│              Capa de Presentación               │
│  (PipetasPage, CreatePipetaPage, EditPipetaPage)│
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│            Capa de Componentes                  │
│             (PipetaForm, PipetaCard)            │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│              Capa de Hooks                      │
│  (useCreatePipeta, useUpdatePipeta, useDeletePipeta) │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│            Capa de Servicios                    │
│  (createPipeta, updatePipeta, deletePipeta)     │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                 API REST                        │
│          (POST/PUT/DELETE /pipetas)             │
└─────────────────────────────────────────────────┘
```

---

## 15. Casos de Uso Específicos

### Gestión de Pipetas en Laboratorio

El módulo de pipetas permite:

- **Código único**: Identificador para cada pipeta (código de inventario)
- **Modelo**: Información del fabricante y tipo (ej: "Gilson P1000", "Eppendorf 100-1000µL")
- **Zona**: Ubicación física en el laboratorio (ej: "Sala A - Estante 3", "Área PCR")

### Control de Calibración

**Recomendaciones para extensión:**

- Campo de fecha de última calibración
- Campo de fecha de próxima calibración
- Estado de calibración (vigente/vencido)
- Alertas automáticas de calibración vencida

---

## 16. Próximos Pasos

Para extender esta funcionalidad:

1. **Calibración y Mantenimiento**:
   - Fechas de calibración
   - Historial de mantenimiento
   - Alertas de vencimiento

2. **Validación avanzada**:
   - Formato específico para códigos de inventario
   - Prevenir duplicados por código
   - Validación de modelo según catálogo

3. **Asociaciones**:
   - Vincular pipetas con técnicos responsables
   - Historial de uso por worklist
   - Registro de incidencias

4. **Búsqueda avanzada**:
   - Filtros por modelo
   - Filtros por zona
   - Búsqueda por rango de volumen

5. **Exportación**:
   - Descargar inventario en CSV/Excel
   - Generar etiquetas QR para identificación

6. **Control de Estado**:
   - Estados: Disponible, En uso, En mantenimiento, Fuera de servicio
   - Reserva de pipetas para experimentos

---

## 17. Comparación con Otros Módulos

| Característica      | Centros     | Clientes | Criterios   | Máquinas | Pacientes      | **Pipetas**      |
| ------------------- | ----------- | -------- | ----------- | -------- | -------------- | ---------------- |
| Campo obligatorio   | codigo      | nombre   | codigo      | codigo   | nombre         | **codigo**       |
| Campos opcionales   | descripcion | 3 campos | descripcion | 2 campos | sip, direccion | **modelo, zona** |
| Textarea            | ❌          | ✅       | ❌          | ✅       | ✅             | **❌**           |
| Identificador único | codigo      | -        | codigo      | codigo   | sip            | **codigo**       |
| Asociación física   | ❌          | ❌       | ❌          | ❌       | ❌             | **✅ (zona)**    |

---

## 18. Mejores Prácticas de Laboratorio

### Gestión de Pipetas

1. **Código de Inventario**: Use códigos únicos y secuenciales (ej: PIP-001, PIP-002)
2. **Modelo Completo**: Incluya marca, modelo y rango de volumen (ej: "Gilson P1000 (100-1000µL)")
3. **Zona Descriptiva**: Sea específico con la ubicación (ej: "Sala PCR - Gabinete A2")
4. **Trazabilidad**: Mantenga actualizada la información para auditorías

### Control de Calidad

- Verificar calibración periódica
- Documentar cualquier anomalía
- Mantener registro de mantenimientos
- Asignar responsables por zona

---

**Última actualización:** 6 de octubre de 2025  
**Patrón aplicado:** Idéntico a Centros, Clientes, Criterios de Validación, Máquinas y Pacientes  
**Estado:** ✅ Implementación completa y funcional  
**Consideraciones especiales:** Control de inventario y calibración de equipos de laboratorio
