# CRUD de Máquinas - Documentación Completa

## Descripción General

Implementación completa del CRUD (Create, Read, Update, Delete) para el módulo de **Máquinas** en el sistema LIMS. Permite la gestión integral de máquinas utilizadas en el laboratorio, incluyendo su identificación, descripción y perfil térmico.

---

## 1. Modelo de Datos

### Interfaz TypeScript

```typescript
interface Maquina {
  id: number
  codigo: string // Código único de la máquina (obligatorio)
  maquina?: string // Nombre o descripción (opcional)
  perfil_termico?: string // Configuración térmica (opcional)
}
```

### Validación con Zod

```typescript
const maquinaSchema = z.object({
  codigo: z.string().min(1, 'El código es obligatorio'),
  maquina: z.string().optional(),
  perfil_termico: z.string().optional()
})
```

**Reglas de validación:**

- ✅ `codigo`: Campo obligatorio, mínimo 1 carácter
- ✅ `maquina`: Campo opcional, texto libre
- ✅ `perfil_termico`: Campo opcional, texto libre (textarea para mayor espacio)

---

## 2. Capa de Servicios

**Archivo:** `src/shared/services/dim_tables.services.ts`

### Métodos CRUD

```typescript
// Crear nueva máquina
createMaquina: async (maquina: Omit<Maquina, 'id'>) => {
  const response = await apiClient.post<Maquina>('/dim_maquinas', maquina)
  return response.data
}

// Actualizar máquina existente
updateMaquina: async (id: number, maquina: Partial<Maquina>) => {
  const response = await apiClient.put<Maquina>(`/dim_maquinas/${id}`, maquina)
  return response.data
}

// Eliminar máquina
deleteMaquina: async (id: number) => {
  await apiClient.delete(`/dim_maquinas/${id}`)
}
```

**Endpoints API:**

- `POST /dim_maquinas` - Crear máquina
- `PUT /dim_maquinas/:id` - Actualizar máquina
- `DELETE /dim_maquinas/:id` - Eliminar máquina

---

## 3. Hooks de React Query

**Archivo:** `src/shared/hooks/useDim_tables.ts`

### Hook de Creación

```typescript
export const useCreateMaquina = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dimTablesService.createMaquina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maquinas'] })
    }
  })
}
```

### Hook de Actualización

```typescript
export const useUpdateMaquina = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Maquina> }) =>
      dimTablesService.updateMaquina(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maquinas'] })
    }
  })
}
```

### Hook de Eliminación

```typescript
export const useDeleteMaquina = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dimTablesService.deleteMaquina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maquinas'] })
    }
  })
}
```

**Características:**

- ✅ Invalidación automática de caché tras operaciones exitosas
- ✅ Manejo de estados de carga (`isPending`)
- ✅ Propagación de errores para manejo en componentes

---

## 4. Componente de Formulario

**Archivo:** `src/features/dim_tables/maquinas/components/MaquinaForm.tsx`

### Estructura del Formulario

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* Campo: Código (obligatorio) */}
  <input id="codigo" type="text" {...register('codigo')} className="..." />

  {/* Campo: Máquina (opcional) */}
  <input id="maquina" type="text" {...register('maquina')} className="..." />

  {/* Campo: Perfil Térmico (opcional, textarea) */}
  <textarea id="perfil_termico" {...register('perfil_termico')} rows={3} className="..." />

  {/* Botones de acción */}
  <button type="button" onClick={() => navigate('/maquinas')}>
    Cancelar
  </button>
  <button type="submit" disabled={isLoading || !isDirty}>
    {isEditMode ? 'Actualizar' : 'Crear'}
  </button>
</form>
```

### Props del Componente

```typescript
interface MaquinaFormProps {
  initialData?: Maquina // Para modo edición
}
```

### Funcionalidades

1. **Validación en tiempo real** con React Hook Form + Zod
2. **Modo dual**: Creación y edición según `initialData`
3. **Gestión de estado de carga**: Botones deshabilitados durante mutaciones
4. **Navegación automática**: Redirige a `/maquinas` tras éxito
5. **Notificaciones**: Mensajes de éxito/error integrados
6. **Detección de cambios**: Botón Submit deshabilitado si no hay cambios (`isDirty`)

---

## 5. Páginas de Gestión

### Página de Creación

**Archivo:** `src/features/dim_tables/maquinas/pages/CreateMaquinaPage.tsx`

```tsx
export const CreateMaquinaPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/maquinas">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Nueva Máquina</h1>
          <p>Completa el formulario para crear una nueva máquina</p>
        </div>
      </div>

      <div className="bg-background-secondary rounded-lg shadow-sm border p-6">
        <MaquinaForm />
      </div>
    </div>
  )
}
```

**Características:**

- Botón de retorno a listado
- Título y descripción claros
- Renderiza `MaquinaForm` sin `initialData` (modo creación)

---

### Página de Edición

**Archivo:** `src/features/dim_tables/maquinas/pages/EditMaquinaPage.tsx`

```tsx
export const EditMaquinaPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: maquina, isLoading, error } = useMaquina(Number(id))

  if (isLoading) {
    return <Loader2 className="animate-spin" />
  }

  if (error || !maquina) {
    return (
      <div className="bg-estado-error/10 border border-estado-error rounded-lg p-4">
        <p className="text-estado-error">
          {error instanceof Error ? error.message : 'No se pudo cargar la máquina'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/maquinas">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Editar Máquina</h1>
          <p>
            Modificando: <span>{maquina.codigo}</span>
          </p>
        </div>
      </div>

      <div className="bg-background-secondary rounded-lg shadow-sm border p-6">
        <MaquinaForm initialData={maquina} />
      </div>
    </div>
  )
}
```

**Características:**

- Obtiene ID desde parámetros de ruta
- Estados de carga y error manejados
- Muestra código de la máquina en el título
- Pasa `initialData` a `MaquinaForm` para modo edición

---

### Página de Listado

**Archivo:** `src/features/dim_tables/maquinas/pages/MaquinasPage.tsx`

#### Handler de Eliminación

```typescript
const handleDelete = async (maquina: Maquina) => {
  try {
    const confirmed = await confirm({
      title: '¿Eliminar máquina?',
      message: `¿Estás seguro de que deseas eliminar la máquina "${maquina.codigo}"? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })

    if (confirmed) {
      await deleteMutation.mutateAsync(maquina.id)
      notify('Máquina eliminada correctamente', 'success')
    }
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Error al eliminar la máquina', 'error')
  }
}
```

#### Renderizado de Cards

```tsx
<div className="grid gap-1">
  {maquinasFiltradas.map((maquina: Maquina) => (
    <MaquinaCard
      key={maquina.id}
      maquina={maquina}
      onEdit={() => navigate(`/maquinas/${maquina.id}/editar`)}
      onDelete={() => handleDelete(maquina)}
    />
  ))}
</div>
```

**Características:**

- **Confirmación visual**: Diálogo tipo "danger" antes de eliminar
- **Feedback inmediato**: Notificaciones de éxito/error
- **Navegación**: Botones de edición redirigen a página de edición
- **Filtros**: Búsqueda por código, máquina, perfil térmico

---

## 6. Configuración de Rutas

**Archivo:** `src/shared/routes/routes.tsx`

```typescript
// Importaciones
import { MaquinasPage } from '@/features/dim_tables/maquinas/pages/MaquinasPage'
import { CreateMaquinaPage } from '@/features/dim_tables/maquinas/pages/CreateMaquinaPage'
import { EditMaquinaPage } from '@/features/dim_tables/maquinas/pages/EditMaquinaPage'

// Configuración de rutas
children: [
  { path: 'maquinas', element: <MaquinasPage /> },
  { path: 'maquinas/nueva', element: <CreateMaquinaPage /> },
  { path: 'maquinas/:id/editar', element: <EditMaquinaPage /> }
]
```

**Rutas configuradas:**

- `/maquinas` - Listado de máquinas
- `/maquinas/nueva` - Crear nueva máquina
- `/maquinas/:id/editar` - Editar máquina existente

---

## 7. Exports del Módulo

**Archivo:** `src/features/dim_tables/maquinas/index.ts`

```typescript
export { MaquinaCard } from './components/MaquinaCard'
export { MaquinaForm } from './components/MaquinaForm'
export { MaquinasPage } from './pages/MaquinasPage'
export { CreateMaquinaPage } from './pages/CreateMaquinaPage'
export { EditMaquinaPage } from './pages/EditMaquinaPage'
```

---

## 8. Flujo de Usuario

### Crear Máquina

1. Usuario navega a `/maquinas`
2. Hace clic en "Nueva máquina"
3. Redirige a `/maquinas/nueva`
4. Completa formulario (código obligatorio)
5. Click en "Crear"
6. **Sistema:**
   - Valida formulario con Zod
   - Envía POST a `/dim_maquinas`
   - Muestra notificación de éxito
   - Invalida caché de React Query
   - Redirige a `/maquinas`

### Editar Máquina

1. Usuario en `/maquinas`
2. Click en botón "Editar" de una máquina
3. Redirige a `/maquinas/:id/editar`
4. **Sistema carga datos:**
   - Obtiene máquina con `useMaquina(id)`
   - Muestra loader mientras carga
   - Pre-rellena formulario con `initialData`
5. Usuario modifica campos
6. Click en "Actualizar"
7. **Sistema:**
   - Envía PUT a `/dim_maquinas/:id`
   - Muestra notificación de éxito
   - Redirige a `/maquinas`

### Eliminar Máquina

1. Usuario en `/maquinas`
2. Click en botón "Eliminar" de una máquina
3. **Sistema muestra diálogo de confirmación:**
   - Tipo: "danger" (rojo)
   - Mensaje: "¿Eliminar máquina [código]?"
4. Usuario confirma
5. **Sistema:**
   - Envía DELETE a `/dim_maquinas/:id`
   - Muestra notificación de éxito
   - Lista se actualiza automáticamente (invalidación de caché)

---

## 9. Integración de Sistemas

### Sistema de Confirmación

```typescript
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'

const { confirm } = useConfirmation()

const confirmed = await confirm({
  title: '¿Eliminar máquina?',
  message: `¿Estás seguro de que deseas eliminar la máquina "${maquina.codigo}"?`,
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
notify('Máquina creada correctamente', 'success')

// Error
notify('Error al eliminar la máquina', 'error')
```

---

## 10. Consideraciones Técnicas

### Gestión de Caché

React Query invalida automáticamente la caché de `maquinas` tras cada mutación, asegurando que el listado siempre muestre datos actualizados.

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
// MaquinaForm.test.tsx
describe('MaquinaForm', () => {
  it('debe validar campo codigo como obligatorio', async () => {
    // Test de validación Zod
  })

  it('debe enviar datos correctos al crear', async () => {
    // Test de mutación createMaquina
  })

  it('debe pre-rellenar formulario en modo edición', () => {
    // Test de initialData
  })
})
```

### Tests de Integración

```typescript
// MaquinasPage.test.tsx
describe('MaquinasPage', () => {
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

1. ✅ `src/features/dim_tables/maquinas/components/MaquinaForm.tsx`
2. ✅ `src/features/dim_tables/maquinas/pages/CreateMaquinaPage.tsx`
3. ✅ `src/features/dim_tables/maquinas/pages/EditMaquinaPage.tsx`
4. ✅ `src/_md/CRUD_MAQUINAS.md`

### Archivos Modificados

1. ✅ `src/shared/services/dim_tables.services.ts` - Métodos CRUD
2. ✅ `src/shared/hooks/useDim_tables.ts` - Hooks de mutación
3. ✅ `src/features/dim_tables/maquinas/pages/MaquinasPage.tsx` - Handler de eliminación
4. ✅ `src/shared/routes/routes.tsx` - Rutas de navegación
5. ✅ `src/features/dim_tables/maquinas/index.ts` - Exports del módulo

---

## 14. Patrón Arquitectónico

```
┌─────────────────────────────────────────────────┐
│              Capa de Presentación               │
│  (MaquinasPage, CreateMaquinaPage, EditMaquinaPage) │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│            Capa de Componentes                  │
│             (MaquinaForm, MaquinaCard)          │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│              Capa de Hooks                      │
│  (useCreateMaquina, useUpdateMaquina, useDeleteMaquina) │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│            Capa de Servicios                    │
│  (createMaquina, updateMaquina, deleteMaquina)  │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                 API REST                        │
│          (POST/PUT/DELETE /dim_maquinas)        │
└─────────────────────────────────────────────────┘
```

---

## 15. Próximos Pasos

Para extender esta funcionalidad:

1. **Validación avanzada**: Agregar reglas de formato para `perfil_termico`
2. **Búsqueda avanzada**: Filtros adicionales por campos específicos
3. **Exportación**: Descargar listado de máquinas en CSV/Excel
4. **Historial**: Registro de cambios en máquinas
5. **Relaciones**: Vincular máquinas con pruebas o muestras

---

**Última actualización:** 2024  
**Patrón aplicado:** Idéntico a Centros, Clientes y Criterios de Validación  
**Estado:** ✅ Implementación completa y funcional
