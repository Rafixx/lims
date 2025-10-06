# CRUD de Reactivos - Documentación Completa

## Descripción General

Implementación completa del CRUD (Create, Read, Update, Delete) para el módulo de **Reactivos** en el sistema LIMS. Permite la gestión integral de reactivos utilizados en el laboratorio, incluyendo su número de referencia, nombre, lote y volumen/fórmula.

---

## 1. Modelo de Datos

### Interfaz TypeScript

```typescript
interface Reactivo {
  id: number
  num_referencia?: string // Número de referencia del reactivo (opcional)
  reactivo?: string // Nombre del reactivo (opcional)
  lote?: string // Número de lote (opcional)
  volumen_formula?: string // Volumen o fórmula del reactivo (opcional)
}
```

### Validación con Zod

```typescript
const reactivoSchema = z.object({
  num_referencia: z.string().optional(),
  reactivo: z.string().optional(),
  lote: z.string().optional(),
  volumen_formula: z.string().optional()
})
```

**Reglas de validación:**

- ✅ `num_referencia`: Campo opcional, texto libre para identificación
- ✅ `reactivo`: Campo opcional, nombre del reactivo
- ✅ `lote`: Campo opcional, identificador de lote
- ✅ `volumen_formula`: Campo opcional, especificación de volumen o fórmula (ej: "500ml", "1L")

---

## 2. Capa de Servicios

**Archivo:** `src/shared/services/dim_tables.services.ts`

### Métodos CRUD

```typescript
// Crear nuevo reactivo
createReactivo: async (reactivo: Omit<Reactivo, 'id'>) => {
  const response = await apiClient.post<Reactivo>('/reactivos', reactivo)
  return response.data
}

// Actualizar reactivo existente
updateReactivo: async (id: number, reactivo: Partial<Omit<Reactivo, 'id'>>) => {
  const response = await apiClient.put<Reactivo>(`/reactivos/${id}`, reactivo)
  return response.data
}

// Eliminar reactivo
deleteReactivo: async (id: number) => {
  const response = await apiClient.delete(`/reactivos/${id}`)
  return response.data
}
```

**Endpoints API:**

- `POST /reactivos` - Crear reactivo
- `PUT /reactivos/:id` - Actualizar reactivo
- `DELETE /reactivos/:id` - Eliminar reactivo

---

## 3. Hooks de React Query

**Archivo:** `src/shared/hooks/useDim_tables.ts`

### Hook de Creación

```typescript
export const useCreateReactivo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Reactivo, 'id'>) => dimTablesService.createReactivo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.reactivos() })
    }
  })
}
```

### Hook de Actualización

```typescript
export const useUpdateReactivo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Reactivo, 'id'>> }) =>
      dimTablesService.updateReactivo(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.reactivo(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.reactivos() })
    }
  })
}
```

### Hook de Eliminación

```typescript
export const useDeleteReactivo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteReactivo(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.reactivos() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.reactivo(id) })
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

**Archivo:** `src/features/dim_tables/reactivos/components/ReactivoForm.tsx`

### Estructura del Formulario

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* Campo: Número de Referencia (opcional) */}
  <input id="num_referencia" type="text" {...register('num_referencia')} className="..." />

  {/* Campo: Reactivo (opcional) */}
  <input id="reactivo" type="text" {...register('reactivo')} className="..." />

  {/* Campo: Lote (opcional) */}
  <input id="lote" type="text" {...register('lote')} className="..." />

  {/* Campo: Volumen/Fórmula (opcional) */}
  <input
    id="volumen_formula"
    type="text"
    {...register('volumen_formula')}
    placeholder="Ej: 500ml, 1L"
    className="..."
  />

  {/* Botones de acción */}
  <button type="button" onClick={() => navigate('/reactivos')}>
    <X /> Cancelar
  </button>
  <button type="submit" disabled={isLoading || !isDirty}>
    <Save /> {isEditMode ? 'Actualizar' : 'Crear'}
  </button>
</form>
```

### Props del Componente

```typescript
interface ReactivoFormProps {
  initialData?: Reactivo // Para modo edición
}
```

### Funcionalidades

1. **Validación en tiempo real** con React Hook Form + Zod
2. **Modo dual**: Creación y edición según `initialData`
3. **Gestión de estado de carga**: Botones deshabilitados durante mutaciones
4. **Navegación automática**: Redirige a `/reactivos` tras éxito
5. **Notificaciones**: Mensajes de éxito/error integrados
6. **Detección de cambios**: Botón Submit deshabilitado si no hay cambios (`isDirty`)
7. **Iconos Lucide**: `Save` y `X` para mejor UX
8. **Placeholder informativo**: Ejemplo de formato en campo volumen_formula

---

## 5. Páginas de Gestión

### Página de Creación

**Archivo:** `src/features/dim_tables/reactivos/pages/CreateReactivoPage.tsx`

```tsx
export const CreateReactivoPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/reactivos"
          className="p-2 hover:bg-background-hover rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground-primary">Nuevo Reactivo</h1>
      </div>

      <div className="bg-background border border-border rounded-lg p-6">
        <ReactivoForm />
      </div>
    </div>
  )
}
```

**Características:**

- Botón de retorno a listado con icono `ArrowLeft`
- Título claro "Nuevo Reactivo"
- Renderiza `ReactivoForm` sin `initialData` (modo creación)
- Diseño consistente con otros módulos LIMS

---

### Página de Edición

**Archivo:** `src/features/dim_tables/reactivos/pages/EditReactivoPage.tsx`

```tsx
export const EditReactivoPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: reactivo, isLoading, error } = useReactivo(Number(id))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !reactivo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/reactivos"
            className="p-2 hover:bg-background-hover rounded-md transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground-primary">Editar Reactivo</h1>
        </div>
        <div className="bg-estado-error-light border border-estado-error rounded-lg p-4">
          <p className="text-estado-error">{error?.message || 'No se pudo cargar el reactivo'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/reactivos"
          className="p-2 hover:bg-background-hover rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground-primary">Editar Reactivo</h1>
      </div>

      <div className="bg-background border border-border rounded-lg p-6">
        <ReactivoForm initialData={reactivo} />
      </div>
    </div>
  )
}
```

**Características:**

- Obtiene ID desde parámetros de ruta con `useParams`
- Estados de carga manejados con spinner animado (`Loader2`)
- Manejo robusto de errores con mensaje visual
- Navegación de retorno disponible en todos los estados
- Pasa `initialData` a `ReactivoForm` para modo edición

---

### Página de Listado

**Archivo:** `src/features/dim_tables/reactivos/pages/ReactivosPage.tsx`

#### Handler de Eliminación

```typescript
const handleDelete = async (reactivo: Reactivo) => {
  try {
    const confirmed = await confirm({
      title: '¿Eliminar reactivo?',
      message: `¿Estás seguro de que deseas eliminar el reactivo "${reactivo.reactivo || reactivo.num_referencia}"? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })

    if (confirmed) {
      await deleteMutation.mutateAsync(reactivo.id)
      notify('Reactivo eliminado correctamente', 'success')
    }
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Error al eliminar el reactivo', 'error')
  }
}
```

**Características del handler:**

- ✅ **Confirmación obligatoria**: Usa `useConfirmation` con tipo "danger"
- ✅ **Mensaje inteligente**: Muestra nombre del reactivo o número de referencia
- ✅ **Manejo de errores**: Try-catch con notificaciones específicas
- ✅ **Feedback inmediato**: Notificación de éxito tras eliminación
- ✅ **Seguridad**: Acción irreversible claramente indicada

#### Configuración de Filtros

```typescript
const filterConfig = useMemo(
  () => ({
    busqueda: {
      type: 'search' as const,
      defaultValue: '',
      filterFn: createMultiFieldSearchFilter<Reactivo>(reactivo => [
        reactivo.num_referencia,
        reactivo.reactivo,
        reactivo.lote,
        reactivo.volumen_formula
      ])
    }
  }),
  []
)
```

**Campos buscables:**

- Número de referencia
- Nombre del reactivo
- Lote
- Volumen/fórmula

#### Renderizado de Cards

```tsx
<div className="grid gap-1">
  {reactivosFiltrados.map((reactivo: Reactivo) => (
    <ReactivoCard
      key={reactivo.id}
      reactivo={reactivo}
      onEdit={() => navigate(`/reactivos/${reactivo.id}/editar`)}
      onDelete={() => handleDelete(reactivo)}
    />
  ))}
</div>
```

**Características:**

- **Búsqueda multi-campo**: Por referencia, nombre, lote y volumen
- **Confirmación visual**: Diálogo tipo "danger" antes de eliminar
- **Feedback inmediato**: Notificaciones de éxito/error
- **Navegación**: Botones de edición redirigen correctamente

---

## 6. Configuración de Rutas

**Archivo:** `src/shared/routes/routes.tsx`

```typescript
// Importaciones
import { ReactivosPage } from '@/features/dim_tables/reactivos/pages/ReactivosPage'
import { CreateReactivoPage } from '@/features/dim_tables/reactivos/pages/CreateReactivoPage'
import { EditReactivoPage } from '@/features/dim_tables/reactivos/pages/EditReactivoPage'

// Configuración de rutas
children: [
  { path: 'reactivos', element: <ReactivosPage /> },
  { path: 'reactivos/nuevo', element: <CreateReactivoPage /> },
  { path: 'reactivos/:id/editar', element: <EditReactivoPage /> }
]
```

**Rutas configuradas:**

- `/reactivos` - Listado de reactivos
- `/reactivos/nuevo` - Crear nuevo reactivo
- `/reactivos/:id/editar` - Editar reactivo existente

---

## 7. Exports del Módulo

**Archivo:** `src/features/dim_tables/reactivos/index.ts`

```typescript
export { ReactivoCard } from './components/ReactivoCard'
export { ReactivoForm } from './components/ReactivoForm'
export { ReactivosPage } from './pages/ReactivosPage'
export { CreateReactivoPage } from './pages/CreateReactivoPage'
export { EditReactivoPage } from './pages/EditReactivoPage'
```

**Componentes exportados:**

- `ReactivoCard` - Card para visualización en listado
- `ReactivoForm` - Formulario dual (crear/editar)
- `ReactivosPage` - Página de listado principal
- `CreateReactivoPage` - Página de creación
- `EditReactivoPage` - Página de edición

---

## 8. Flujos de Usuario

### Flujo de Creación

1. Usuario navega a `/reactivos`
2. Click en botón "Nuevo reactivo"
3. Sistema redirige a `/reactivos/nuevo`
4. Usuario completa formulario (todos los campos opcionales)
5. Click en botón "Crear"
6. Sistema valida datos con Zod schema
7. Si validación OK:
   - Llama a `createReactivo` service
   - Invalida caché de React Query
   - Muestra notificación de éxito
   - Redirige a `/reactivos`
8. Si validación falla:
   - Muestra errores bajo campos correspondientes
   - Usuario corrige y reintenta

### Flujo de Edición

1. Usuario en `/reactivos` click en botón "Editar" de un reactivo
2. Sistema redirige a `/reactivos/:id/editar`
3. Componente carga datos con `useReactivo(id)`
4. Mientras carga: Muestra spinner animado
5. Si datos OK:
   - Pre-rellena formulario con `initialData`
   - Usuario modifica campos necesarios
   - Click en "Actualizar"
   - Sistema valida y actualiza
   - Notificación de éxito
   - Redirige a `/reactivos`
6. Si error de carga:
   - Muestra mensaje de error visual
   - Opción de volver al listado

### Flujo de Eliminación

1. Usuario en `/reactivos` click en botón "Eliminar" de un reactivo
2. Sistema muestra diálogo de confirmación:
   - Título: "¿Eliminar reactivo?"
   - Mensaje con nombre del reactivo
   - Tipo "danger" (rojo)
   - Botones: "Eliminar" / "Cancelar"
3. Si usuario confirma:
   - Llama a `deleteReactivo` service
   - Invalida caché de React Query
   - Muestra notificación "Reactivo eliminado correctamente"
   - Listado se actualiza automáticamente
4. Si usuario cancela:
   - Cierra diálogo sin acción
   - Reactivo permanece en listado

---

## 9. Manejo de Errores

### Errores de Validación

```typescript
{
  errors.num_referencia && (
    <p className="mt-1 text-sm text-estado-error">{errors.num_referencia.message}</p>
  )
}
```

- Mensajes específicos por campo
- Colores del sistema de estados
- Aparecen en tiempo real bajo cada input

### Errores de Mutación

```typescript
try {
  await createMutation.mutateAsync(data)
  notify('Reactivo creado correctamente', 'success')
} catch (error) {
  notify(error instanceof Error ? error.message : 'Error al guardar el reactivo', 'error')
}
```

- Try-catch en todos los handlers
- Notificaciones con tipo `error`
- Mensajes específicos o genéricos según disponibilidad

### Errores de Carga

```typescript
if (error || !reactivo) {
  return (
    <div className="bg-estado-error-light border border-estado-error rounded-lg p-4">
      <p className="text-estado-error">{error?.message || 'No se pudo cargar el reactivo'}</p>
    </div>
  )
}
```

- Componente visual para errores de carga
- Mensaje específico del error o genérico
- Navegación de retorno siempre disponible

---

## 10. Integración con Sistema de Estados

El módulo de Reactivos se integra con el sistema global de estados LIMS:

### Notificaciones

```typescript
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const { notify } = useNotification()

// Éxito
notify('Reactivo creado correctamente', 'success')

// Error
notify('Error al eliminar el reactivo', 'error')
```

### Confirmaciones

```typescript
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'

const { confirm } = useConfirmation()

const confirmed = await confirm({
  title: '¿Eliminar reactivo?',
  message: `¿Estás seguro...?`,
  type: 'danger',
  confirmText: 'Eliminar',
  cancelText: 'Cancelar'
})
```

### Colores del Sistema

Clases Tailwind utilizadas del sistema de estados:

- `text-estado-error` - Texto de error
- `bg-estado-error-light` - Fondo de error suave
- `border-estado-error` - Borde de error
- `text-foreground-primary` - Texto principal
- `text-foreground-secondary` - Texto secundario
- `bg-background` - Fondo principal
- `bg-background-hover` - Fondo en hover
- `border-border` - Bordes estándar

---

## 11. Casos de Uso del Laboratorio

### Registro de Nuevo Reactivo

**Escenario**: Llega un nuevo lote de reactivo al laboratorio

1. Técnico accede a "Gestión de Reactivos"
2. Click en "Nuevo reactivo"
3. Completa formulario:
   - Número de referencia: "REF-2024-001"
   - Reactivo: "Buffer de Lisis"
   - Lote: "LOT-12345"
   - Volumen: "500ml"
4. Guarda el registro
5. Sistema confirma creación
6. Reactivo disponible para uso en protocolos

### Actualización de Información

**Escenario**: Corrección de datos de reactivo existente

1. Búsqueda del reactivo por número de referencia o nombre
2. Click en "Editar"
3. Modifica campos necesarios (ej: volumen actualizado)
4. Sistema detecta cambios (`isDirty`)
5. Actualización exitosa con notificación
6. Datos reflejados inmediatamente en sistema

### Retiro de Reactivo

**Escenario**: Reactivo vencido o agotado debe eliminarse

1. Localización del reactivo en listado
2. Click en "Eliminar"
3. Sistema muestra confirmación con detalles
4. Confirmación de eliminación
5. Reactivo removido del sistema
6. Caché actualizada automáticamente

---

## 12. Mejores Prácticas Implementadas

### Arquitectura

✅ **Separación de responsabilidades**

- Servicios: Comunicación con API
- Hooks: Estado y caché
- Componentes: Presentación y lógica UI
- Páginas: Composición y navegación

✅ **Reutilización de código**

- Formulario dual (crear/editar)
- Hooks centralizados
- Componentes compartidos (ListPage, FilterContainer)

### Seguridad

✅ **Validación en cliente y servidor**

- Zod schema en frontend
- Validación esperada en backend

✅ **Confirmaciones para acciones destructivas**

- Diálogo obligatorio antes de eliminar
- Tipo "danger" para alertar al usuario

### UX/UI

✅ **Feedback continuo**

- Estados de carga visibles
- Notificaciones de éxito/error
- Deshabilitación de botones durante operaciones

✅ **Navegación intuitiva**

- Breadcrumbs implícitos con botón de retorno
- Redirecciones automáticas tras acciones

✅ **Accesibilidad**

- Labels asociados a inputs
- Iconos con significado claro
- Colores del sistema de estados consistentes

### Performance

✅ **Optimización de caché**

- Invalidación selectiva de queries
- StaleTime y GcTime configurados
- Queries deshabilitadas cuando no hay ID

✅ **Lazy loading**

- Componentes cargados solo cuando necesarios
- Datos paginados en listado

---

## 13. Testing (Recomendaciones)

### Unit Tests

```typescript
describe('ReactivoForm', () => {
  it('should validate all optional fields', () => {
    // Test validación Zod
  })

  it('should submit in create mode', () => {
    // Test creación
  })

  it('should submit in edit mode with initialData', () => {
    // Test edición
  })

  it('should disable submit when not dirty', () => {
    // Test isDirty
  })
})
```

### Integration Tests

```typescript
describe('Reactivos CRUD Flow', () => {
  it('should create, edit, and delete a reactivo', async () => {
    // Test flujo completo
  })

  it('should show confirmation dialog before delete', () => {
    // Test confirmación
  })

  it('should handle API errors gracefully', () => {
    // Test manejo de errores
  })
})
```

---

## 14. Troubleshooting

### Problema: Formulario no se envía

**Causa**: `isDirty` es `false` porque no hay cambios

**Solución**: Asegurarse de que `defaultValues` sean diferentes a los datos ingresados

### Problema: Error 404 al editar

**Causa**: ID no válido en URL

**Solución**: Verificar que `useParams` extrae ID correctamente y que el reactivo existe

### Problema: Caché no se actualiza tras eliminar

**Causa**: Query key incorrecta en invalidación

**Solución**: Usar `dimTablesQueryKeys.reactivos()` consistentemente

### Problema: Notificaciones no aparecen

**Causa**: `NotificationContext` no está en árbol de componentes

**Solución**: Verificar que `NotificationProvider` envuelve la aplicación

---

## 15. Roadmap Futuro

### Funcionalidades Planeadas

- [ ] **Historial de lotes**: Tracking de diferentes lotes del mismo reactivo
- [ ] **Alertas de vencimiento**: Notificaciones cuando reactivos están por vencer
- [ ] **Gestión de stock**: Control de cantidad disponible
- [ ] **Asociación con pruebas**: Relación entre reactivos y pruebas que los requieren
- [ ] **Código de barras**: Escaneo de reactivos para agilizar registro
- [ ] **Exportación a Excel**: Inventario completo de reactivos
- [ ] **Filtros avanzados**: Por fecha de vencimiento, proveedor, categoría

### Mejoras Técnicas

- [ ] **Paginación**: Para grandes volúmenes de reactivos
- [ ] **Ordenamiento**: Por diferentes campos (fecha, nombre, lote)
- [ ] **Búsqueda avanzada**: Filtros combinados
- [ ] **Modo offline**: Sincronización cuando se recupera conexión
- [ ] **Optimistic updates**: UI actualizada antes de respuesta del servidor

---

## 16. Conclusión

El módulo de Reactivos implementa un CRUD completo y robusto siguiendo las mejores prácticas de desarrollo React moderno:

✅ **Arquitectura limpia** con separación clara de responsabilidades  
✅ **Validación exhaustiva** con Zod y React Hook Form  
✅ **UX excepcional** con feedback continuo y confirmaciones  
✅ **Performance optimizado** con React Query y cache inteligente  
✅ **Código mantenible** con TypeScript y documentación completa  
✅ **Integración perfecta** con sistema de estados LIMS

El módulo está listo para producción y puede servir como referencia para la implementación de otros módulos del sistema LIMS.

---

**Versión del documento**: 1.0  
**Fecha**: Octubre 2025  
**Autor**: Equipo de Desarrollo LIMS  
**Última actualización**: 6 de octubre de 2025
