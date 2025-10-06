# CRUD de Pruebas - Documentación Completa

## Descripción General

Implementación completa del CRUD (Create, Read, Update, Delete) para el módulo de **Pruebas** en el sistema LIMS. Permite la gestión integral de pruebas de laboratorio, incluyendo su identificación por código y descripción detallada.

---

## 1. Modelo de Datos

### Interfaz TypeScript

```typescript
interface Prueba {
  id: number
  cod_prueba: string // Código identificador de la prueba (obligatorio)
  prueba?: string // Descripción detallada de la prueba (opcional)
}
```

### Validación con Zod

```typescript
const pruebaSchema = z.object({
  cod_prueba: z.string().min(1, 'El código de prueba es obligatorio'),
  prueba: z.string().optional()
})
```

**Reglas de validación:**

- ✅ `cod_prueba`: Campo obligatorio, mínimo 1 carácter
- ✅ `prueba`: Campo opcional, texto libre para descripción detallada

---

## 2. Capa de Servicios

**Archivo:** `src/shared/services/dim_tables.services.ts`

### Métodos CRUD

```typescript
// Crear nueva prueba
createPrueba: async (prueba: Omit<Prueba, 'id'>) => {
  const response = await apiClient.post<Prueba>('/pruebas', prueba)
  return response.data
}

// Actualizar prueba existente
updatePrueba: async (id: number, prueba: Partial<Omit<Prueba, 'id'>>) => {
  const response = await apiClient.put<Prueba>(`/pruebas/${id}`, prueba)
  return response.data
}

// Eliminar prueba
deletePrueba: async (id: number) => {
  const response = await apiClient.delete(`/pruebas/${id}`)
  return response.data
}
```

**Endpoints API:**

- `POST /pruebas` - Crear prueba
- `PUT /pruebas/:id` - Actualizar prueba
- `DELETE /pruebas/:id` - Eliminar prueba

---

## 3. Hooks de React Query

**Archivo:** `src/shared/hooks/useDim_tables.ts`

### Hook de Creación

```typescript
export const useCreatePrueba = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dimTablesService.createPrueba,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pruebas'] })
    }
  })
}
```

### Hook de Actualización

```typescript
export const useUpdatePrueba = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Prueba> }) =>
      dimTablesService.updatePrueba(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'prueba', id] })
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pruebas'] })
    }
  })
}
```

### Hook de Eliminación

```typescript
export const useDeletePrueba = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dimTablesService.deletePrueba,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pruebas'] })
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'prueba', id] })
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

**Archivo:** `src/features/dim_tables/pruebas/components/PruebaForm.tsx`

### Estructura del Formulario

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* Campo: Código de prueba (obligatorio) */}
  <div>
    <label htmlFor="cod_prueba">Código de prueba *</label>
    <input
      id="cod_prueba"
      type="text"
      {...register('cod_prueba')}
      className="w-full rounded-md border border-gray-300 px-3 py-2"
    />
    {errors.cod_prueba && <p className="mt-1 text-sm text-red-600">{errors.cod_prueba.message}</p>}
  </div>

  {/* Campo: Descripción (opcional) */}
  <div>
    <label htmlFor="prueba">Descripción de la prueba</label>
    <textarea
      id="prueba"
      rows={4}
      {...register('prueba')}
      className="w-full rounded-md border border-gray-300 px-3 py-2"
    />
  </div>

  {/* Botones */}
  <div className="flex gap-2">
    <button type="button" onClick={onCancel}>
      Cancelar
    </button>
    <button type="submit" disabled={!isDirty || isSubmitting}>
      {isSubmitting ? 'Guardando...' : 'Guardar'}
    </button>
  </div>
</form>
```

### Props del Componente

```typescript
interface PruebaFormProps {
  initialData?: Prueba
  onSubmit: (data: PruebaFormData) => Promise<void>
  onCancel: () => void
}
```

**Características:**

- ✅ Modo dual: creación y edición con `initialData`
- ✅ Validación en tiempo real con Zod
- ✅ Indicador visual de campos obligatorios (\*)
- ✅ Deshabilitación del botón guardar cuando no hay cambios (`isDirty`)
- ✅ Área de texto (textarea) para descripción extensa
- ✅ Mensajes de error específicos por campo

---

## 5. Páginas de Gestión

### 5.1. Página de Listado

**Archivo:** `src/features/dim_tables/pruebas/pages/PruebasPage.tsx`

```tsx
export const PruebasPage = () => {
  const { data: pruebas, isLoading, error, refetch } = usePruebas()
  const deleteMutation = useDeletePrueba()
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const navigate = useNavigate()

  const handleDelete = async (prueba: Prueba) => {
    try {
      const confirmed = await confirm({
        title: '¿Eliminar prueba?',
        message: `¿Estás seguro de que deseas eliminar la prueba "${prueba.cod_prueba}"? Esta acción no se puede deshacer.`,
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      })

      if (confirmed) {
        await deleteMutation.mutateAsync(prueba.id)
        notify('Prueba eliminada correctamente', 'success')
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al eliminar la prueba', 'error')
    }
  }

  return (
    <ListPage
      title="Pruebas"
      state={{ data: pruebas, isLoading, error, refetch }}
      handlers={{ onNew: () => navigate('/pruebas/nueva') }}
      renderFilters={renderFilters}
      config={{
        newButtonText: 'Nueva prueba',
        emptyStateMessage: 'No hay pruebas disponibles'
      }}
    >
      {pruebasFiltradas.map(prueba => (
        <PruebaCard
          key={prueba.id}
          prueba={prueba}
          onEdit={() => navigate(`/pruebas/${prueba.id}/editar`)}
          onDelete={() => handleDelete(prueba)}
        />
      ))}
    </ListPage>
  )
}
```

**Características:**

- ✅ Filtro de búsqueda por `cod_prueba` y `prueba`
- ✅ Diálogo de confirmación antes de eliminar
- ✅ Notificaciones de éxito/error
- ✅ Navegación a formularios de creación/edición
- ✅ Estados de carga y error manejados por `ListPage`

### 5.2. Página de Creación

**Archivo:** `src/features/dim_tables/pruebas/pages/CreatePruebaPage.tsx`

```tsx
export const CreatePruebaPage = () => {
  const navigate = useNavigate()
  const createMutation = useCreatePrueba()
  const { notify } = useNotification()

  const handleSubmit = async (data: PruebaFormData) => {
    try {
      await createMutation.mutateAsync(data)
      notify('Prueba creada correctamente', 'success')
      navigate('/pruebas')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al crear la prueba', 'error')
      throw error
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/pruebas')}>
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Nueva Prueba</h1>
      </div>

      <PruebaForm onSubmit={handleSubmit} onCancel={() => navigate('/pruebas')} />
    </div>
  )
}
```

### 5.3. Página de Edición

**Archivo:** `src/features/dim_tables/pruebas/pages/EditPruebaPage.tsx`

```tsx
export const EditPruebaPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: prueba, isLoading, error } = usePrueba(Number(id))
  const updateMutation = useUpdatePrueba()
  const { notify } = useNotification()

  const handleSubmit = async (data: PruebaFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: Number(id),
        data
      })
      notify('Prueba actualizada correctamente', 'success')
      navigate('/pruebas')
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Error al actualizar la prueba', 'error')
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !prueba) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-red-800">Error al cargar la prueba</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/pruebas')}>
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Editar Prueba</h1>
      </div>

      <PruebaForm
        initialData={prueba}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/pruebas')}
      />
    </div>
  )
}
```

---

## 6. Rutas de Navegación

**Archivo:** `src/shared/routes/routes.tsx`

```typescript
{
  path: '/',
  element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
  children: [
    { path: 'pruebas', element: <PruebasPage /> },
    { path: 'pruebas/nueva', element: <CreatePruebaPage /> },
    { path: 'pruebas/:id/editar', element: <EditPruebaPage /> }
  ]
}
```

**Estructura de URLs:**

- `/pruebas` - Listado de pruebas
- `/pruebas/nueva` - Crear nueva prueba
- `/pruebas/:id/editar` - Editar prueba existente

---

## 7. Flujos de Usuario

### 7.1. Flujo de Creación

```
[Listado] → Click "Nueva prueba"
    ↓
[Formulario vacío]
    ↓
Usuario completa campos → Click "Guardar"
    ↓
Validación exitosa → POST /pruebas
    ↓
[Notificación éxito] → Redirige a [Listado]
```

### 7.2. Flujo de Edición

```
[Listado] → Click icono editar en card
    ↓
[Formulario pre-rellenado] ← GET /pruebas/:id
    ↓
Usuario modifica campos → Click "Guardar"
    ↓
Validación exitosa → PUT /pruebas/:id
    ↓
[Notificación éxito] → Redirige a [Listado]
```

### 7.3. Flujo de Eliminación

```
[Listado] → Click icono eliminar
    ↓
[Diálogo confirmación]
    ↓
Usuario confirma → DELETE /pruebas/:id
    ↓
[Notificación éxito] → Actualiza [Listado]
```

---

## 8. Manejo de Errores

### Tipos de Errores Manejados

1. **Errores de Validación**
   - Detectados por Zod en el formulario
   - Mostrados en rojo bajo cada campo
   - Previenen el envío del formulario

2. **Errores de Red**
   - Capturados en bloques try/catch
   - Notificaciones toast con mensaje de error
   - No redirigen al usuario

3. **Errores de Carga**
   - Manejados en `EditPruebaPage`
   - Mensaje visual en UI cuando falla `usePrueba`
   - Opción implícita de recargar con `refetch`

4. **Errores de Eliminación**
   - Confirmación previa con diálogo
   - Notificación de error si falla
   - No afecta el estado de la lista hasta éxito

---

## 9. Integración con Sistemas

### 9.1. Sistema de Confirmación

```typescript
const { confirm } = useConfirmation()

const confirmed = await confirm({
  title: '¿Eliminar prueba?',
  message: 'Esta acción no se puede deshacer.',
  type: 'danger',
  confirmText: 'Eliminar',
  cancelText: 'Cancelar'
})
```

### 9.2. Sistema de Notificaciones

```typescript
const { notify } = useNotification()

// Éxito
notify('Prueba creada correctamente', 'success')

// Error
notify('Error al crear la prueba', 'error')
```

### 9.3. Filtros y Búsqueda

```typescript
const filterConfig = useMemo(
  () => ({
    busqueda: {
      type: 'search' as const,
      defaultValue: '',
      filterFn: createMultiFieldSearchFilter<Prueba>(prueba => [prueba.cod_prueba, prueba.prueba])
    }
  }),
  []
)
```

---

## 10. Convenciones y Buenas Prácticas

### 10.1. Nomenclatura

- **Servicios:** `createPrueba`, `updatePrueba`, `deletePrueba`
- **Hooks:** `useCreatePrueba`, `useUpdatePrueba`, `useDeletePrueba`
- **Componentes:** `PruebaForm`, `PruebaCard`, `PruebasPage`
- **Páginas:** `CreatePruebaPage`, `EditPruebaPage`

### 10.2. Estructura de Archivos

```
src/features/dim_tables/pruebas/
├── components/
│   ├── PruebaCard.tsx
│   └── PruebaForm.tsx
├── pages/
│   ├── PruebasPage.tsx
│   ├── CreatePruebaPage.tsx
│   └── EditPruebaPage.tsx
└── index.ts
```

### 10.3. Invalidación de Caché

```typescript
// Después de crear
queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pruebas'] })

// Después de actualizar
queryClient.invalidateQueries({ queryKey: ['dim-tables', 'prueba', id] })
queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pruebas'] })

// Después de eliminar
queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pruebas'] })
queryClient.invalidateQueries({ queryKey: ['dim-tables', 'prueba', id] })
```

### 10.4. Tipado Estricto

- Interfaces exportadas desde `dim_tables.types.ts`
- Props de componentes completamente tipadas
- Uso de `Omit` y `Partial` para operaciones CRUD
- Validación con Zod en formularios

---

## 11. Testing (Recomendaciones)

### 11.1. Tests Unitarios

```typescript
describe('PruebaForm', () => {
  it('debe validar que cod_prueba es obligatorio', async () => {
    // Test de validación
  })

  it('debe permitir prueba opcional', async () => {
    // Test de campo opcional
  })

  it('debe deshabilitar botón guardar cuando no hay cambios', () => {
    // Test de isDirty
  })
})
```

### 11.2. Tests de Integración

```typescript
describe('Flujo completo CRUD Pruebas', () => {
  it('debe crear, editar y eliminar una prueba', async () => {
    // Test end-to-end del flujo
  })
})
```

---

## 12. Conclusión

El módulo CRUD de Pruebas está completamente implementado siguiendo los patrones establecidos en el sistema LIMS. Incluye:

✅ Servicios API centralizados
✅ Hooks de React Query con gestión de caché
✅ Formulario validado con Zod
✅ Páginas de creación, edición y listado
✅ Diálogos de confirmación
✅ Sistema de notificaciones
✅ Filtros de búsqueda multi-campo
✅ Manejo robusto de errores
✅ Rutas integradas en el sistema

**Características destacadas del módulo:**

- Campo `prueba` como textarea para descripciones extensas
- Búsqueda por código y descripción
- Validación estricta de código obligatorio
- Integración completa con el sistema de gestión de laboratorio
