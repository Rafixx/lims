# CRUD de Pacientes - Documentación Completa

## Descripción General

Implementación completa del CRUD (Create, Read, Update, Delete) para el módulo de **Pacientes** en el sistema LIMS. Permite la gestión integral de pacientes, incluyendo su identificación por nombre, número SIP (Sistema de Información Poblacional) y datos de contacto.

---

## 1. Modelo de Datos

### Interfaz TypeScript

```typescript
interface Paciente {
  id: number
  nombre: string // Nombre del paciente (obligatorio)
  sip?: string // Sistema de Información Poblacional (opcional)
  direccion?: string // Dirección de contacto (opcional)
}
```

### Validación con Zod

```typescript
const pacienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  sip: z.string().optional(),
  direccion: z.string().optional()
})
```

**Reglas de validación:**

- ✅ `nombre`: Campo obligatorio, mínimo 1 carácter
- ✅ `sip`: Campo opcional, texto libre para número SIP
- ✅ `direccion`: Campo opcional, texto libre (textarea para mayor espacio)

---

## 2. Capa de Servicios

**Archivo:** `src/shared/services/dim_tables.services.ts`

### Métodos CRUD

```typescript
// Crear nuevo paciente
createPaciente: async (paciente: Omit<Paciente, 'id'>) => {
  const response = await apiClient.post<Paciente>('/pacientes', paciente)
  return response.data
}

// Actualizar paciente existente
updatePaciente: async (id: number, paciente: Partial<Omit<Paciente, 'id'>>) => {
  const response = await apiClient.put<Paciente>(`/pacientes/${id}`, paciente)
  return response.data
}

// Eliminar paciente
deletePaciente: async (id: number) => {
  const response = await apiClient.delete(`/pacientes/${id}`)
  return response.data
}
```

**Endpoints API:**

- `POST /pacientes` - Crear paciente
- `PUT /pacientes/:id` - Actualizar paciente
- `DELETE /pacientes/:id` - Eliminar paciente

---

## 3. Hooks de React Query

**Archivo:** `src/shared/hooks/useDim_tables.ts`

### Hook de Creación

```typescript
export const useCreatePaciente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dimTablesService.createPaciente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pacientes'] })
    }
  })
}
```

### Hook de Actualización

```typescript
export const useUpdatePaciente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Paciente> }) =>
      dimTablesService.updatePaciente(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'paciente', id] })
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pacientes'] })
    }
  })
}
```

### Hook de Eliminación

```typescript
export const useDeletePaciente = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dimTablesService.deletePaciente,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'pacientes'] })
      queryClient.invalidateQueries({ queryKey: ['dim-tables', 'paciente', id] })
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

**Archivo:** `src/features/dim_tables/pacientes/components/PacienteForm.tsx`

### Estructura del Formulario

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* Campo: Nombre (obligatorio) */}
  <input id="nombre" type="text" {...register('nombre')} className="..." />

  {/* Campo: SIP (opcional) */}
  <input id="sip" type="text" {...register('sip')} className="..." />

  {/* Campo: Dirección (opcional, textarea) */}
  <textarea id="direccion" {...register('direccion')} rows={3} className="..." />

  {/* Botones de acción */}
  <button type="button" onClick={() => navigate('/pacientes')}>
    <X /> Cancelar
  </button>
  <button type="submit" disabled={isLoading || !isDirty}>
    <Save /> {isEditMode ? 'Actualizar' : 'Crear'}
  </button>
</form>
```

### Props del Componente

```typescript
interface PacienteFormProps {
  initialData?: Paciente // Para modo edición
}
```

### Funcionalidades

1. **Validación en tiempo real** con React Hook Form + Zod
2. **Modo dual**: Creación y edición según `initialData`
3. **Gestión de estado de carga**: Botones deshabilitados durante mutaciones
4. **Navegación automática**: Redirige a `/pacientes` tras éxito
5. **Notificaciones**: Mensajes de éxito/error integrados
6. **Detección de cambios**: Botón Submit deshabilitado si no hay cambios (`isDirty`)
7. **Iconos Lucide**: `Save` y `X` para mejor UX

---

## 5. Páginas de Gestión

### Página de Creación

**Archivo:** `src/features/dim_tables/pacientes/pages/CreatePacientePage.tsx`

```tsx
export const CreatePacientePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/pacientes">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Nuevo Paciente</h1>
          <p>Completa el formulario para crear un nuevo paciente</p>
        </div>
      </div>

      <div className="bg-background-secondary rounded-lg shadow-sm border p-6">
        <PacienteForm />
      </div>
    </div>
  )
}
```

**Características:**

- Botón de retorno a listado
- Título y descripción claros
- Renderiza `PacienteForm` sin `initialData` (modo creación)

---

### Página de Edición

**Archivo:** `src/features/dim_tables/pacientes/pages/EditPacientePage.tsx`

```tsx
export const EditPacientePage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: paciente, isLoading, error } = usePaciente(Number(id))

  if (isLoading) {
    return <Loader2 className="animate-spin" />
  }

  if (error || !paciente) {
    return (
      <div className="bg-estado-error/10 border border-estado-error rounded-lg p-4">
        <p className="text-estado-error">
          {error instanceof Error ? error.message : 'No se pudo cargar el paciente'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/pacientes">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Editar Paciente</h1>
          <p>
            Modificando: <span>{paciente.nombre}</span>
          </p>
        </div>
      </div>

      <div className="bg-background-secondary rounded-lg shadow-sm border p-6">
        <PacienteForm initialData={paciente} />
      </div>
    </div>
  )
}
```

**Características:**

- Obtiene ID desde parámetros de ruta
- Estados de carga y error manejados elegantemente
- Muestra nombre del paciente en el título
- Pasa `initialData` a `PacienteForm` para modo edición

---

### Página de Listado

**Archivo:** `src/features/dim_tables/pacientes/pages/PacientesPage.tsx`

#### Handler de Eliminación

```typescript
const handleDelete = async (paciente: Paciente) => {
  try {
    const confirmed = await confirm({
      title: '¿Eliminar paciente?',
      message: `¿Estás seguro de que deseas eliminar el paciente "${paciente.nombre}"? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })

    if (confirmed) {
      await deleteMutation.mutateAsync(paciente.id)
      notify('Paciente eliminado correctamente', 'success')
    }
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Error al eliminar el paciente', 'error')
  }
}
```

#### Renderizado de Cards

```tsx
<div className="grid gap-1">
  {pacientesFiltrados.map((paciente: Paciente) => (
    <PacienteCard
      key={paciente.id}
      paciente={paciente}
      onEdit={() => navigate(`/pacientes/${paciente.id}/editar`)}
      onDelete={() => handleDelete(paciente)}
    />
  ))}
</div>
```

**Características:**

- **Confirmación visual**: Diálogo tipo "danger" antes de eliminar
- **Feedback inmediato**: Notificaciones de éxito/error
- **Navegación**: Botones de edición redirigen a página de edición
- **Filtros**: Búsqueda por nombre, SIP, dirección

---

## 6. Configuración de Rutas

**Archivo:** `src/shared/routes/routes.tsx`

```typescript
// Importaciones
import { PacientesPage } from '@/features/dim_tables/pacientes/pages/PacientesPage'
import { CreatePacientePage } from '@/features/dim_tables/pacientes/pages/CreatePacientePage'
import { EditPacientePage } from '@/features/dim_tables/pacientes/pages/EditPacientePage'

// Configuración de rutas
children: [
  { path: 'pacientes', element: <PacientesPage /> },
  { path: 'pacientes/nuevo', element: <CreatePacientePage /> },
  { path: 'pacientes/:id/editar', element: <EditPacientePage /> }
]
```

**Rutas configuradas:**

- `/pacientes` - Listado de pacientes
- `/pacientes/nuevo` - Crear nuevo paciente
- `/pacientes/:id/editar` - Editar paciente existente

---

## 7. Exports del Módulo

**Archivo:** `src/features/dim_tables/pacientes/index.ts`

```typescript
export { PacienteCard } from './components/PacienteCard'
export { PacienteForm } from './components/PacienteForm'
export { PacientesPage } from './pages/PacientesPage'
export { CreatePacientePage } from './pages/CreatePacientePage'
export { EditPacientePage } from './pages/EditPacientePage'
```

---

## 8. Flujo de Usuario

### Crear Paciente

1. Usuario navega a `/pacientes`
2. Hace clic en "Nuevo paciente"
3. Redirige a `/pacientes/nuevo`
4. Completa formulario (nombre obligatorio)
5. Click en "Crear"
6. **Sistema:**
   - Valida formulario con Zod
   - Envía POST a `/pacientes`
   - Muestra notificación de éxito
   - Invalida caché de React Query
   - Redirige a `/pacientes`

### Editar Paciente

1. Usuario en `/pacientes`
2. Click en botón "Editar" de un paciente
3. Redirige a `/pacientes/:id/editar`
4. **Sistema carga datos:**
   - Obtiene paciente con `usePaciente(id)`
   - Muestra loader mientras carga
   - Pre-rellena formulario con `initialData`
5. Usuario modifica campos
6. Click en "Actualizar"
7. **Sistema:**
   - Envía PUT a `/pacientes/:id`
   - Muestra notificación de éxito
   - Redirige a `/pacientes`

### Eliminar Paciente

1. Usuario en `/pacientes`
2. Click en botón "Eliminar" de un paciente
3. **Sistema muestra diálogo de confirmación:**
   - Tipo: "danger" (rojo)
   - Mensaje: "¿Eliminar paciente [nombre]?"
4. Usuario confirma
5. **Sistema:**
   - Envía DELETE a `/pacientes/:id`
   - Muestra notificación de éxito
   - Lista se actualiza automáticamente (invalidación de caché)

---

## 9. Integración de Sistemas

### Sistema de Confirmación

```typescript
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'

const { confirm } = useConfirmation()

const confirmed = await confirm({
  title: '¿Eliminar paciente?',
  message: `¿Estás seguro de que deseas eliminar el paciente "${paciente.nombre}"?`,
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
notify('Paciente creado correctamente', 'success')

// Error
notify('Error al eliminar el paciente', 'error')
```

---

## 10. Consideraciones Técnicas

### Gestión de Caché

React Query invalida automáticamente la caché de `pacientes` tras cada mutación, asegurando que el listado siempre muestre datos actualizados.

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
// PacienteForm.test.tsx
describe('PacienteForm', () => {
  it('debe validar campo nombre como obligatorio', async () => {
    // Test de validación Zod
  })

  it('debe enviar datos correctos al crear', async () => {
    // Test de mutación createPaciente
  })

  it('debe pre-rellenar formulario en modo edición', () => {
    // Test de initialData
  })
})
```

### Tests de Integración

```typescript
// PacientesPage.test.tsx
describe('PacientesPage', () => {
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

1. ✅ `src/features/dim_tables/pacientes/components/PacienteForm.tsx`
2. ✅ `src/features/dim_tables/pacientes/pages/CreatePacientePage.tsx`
3. ✅ `src/features/dim_tables/pacientes/pages/EditPacientePage.tsx`
4. ✅ `src/_md/CRUD_PACIENTES.md`

### Archivos Modificados

1. ✅ `src/shared/services/dim_tables.services.ts` - Métodos CRUD
2. ✅ `src/shared/hooks/useDim_tables.ts` - Hooks de mutación
3. ✅ `src/features/dim_tables/pacientes/pages/PacientesPage.tsx` - Handler de eliminación
4. ✅ `src/shared/routes/routes.tsx` - Rutas de navegación
5. ✅ `src/features/dim_tables/pacientes/index.ts` - Exports del módulo

---

## 14. Patrón Arquitectónico

```
┌─────────────────────────────────────────────────┐
│              Capa de Presentación               │
│  (PacientesPage, CreatePacientePage, EditPacientePage) │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│            Capa de Componentes                  │
│             (PacienteForm, PacienteCard)        │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│              Capa de Hooks                      │
│  (useCreatePaciente, useUpdatePaciente, useDeletePaciente) │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│            Capa de Servicios                    │
│  (createPaciente, updatePaciente, deletePaciente) │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                 API REST                        │
│          (POST/PUT/DELETE /pacientes)           │
└─────────────────────────────────────────────────┘
```

---

## 15. Casos de Uso Específicos

### Gestión de SIP (Sistema de Información Poblacional)

El campo `sip` permite almacenar el identificador único del paciente en el sistema sanitario:

- Es opcional para permitir flexibilidad
- Puede usarse para búsquedas rápidas
- Útil para integración con sistemas externos

### Privacidad y RGPD

**Consideraciones importantes:**

- Los datos de pacientes son sensibles (RGPD)
- Implementar auditoría de accesos (futuro)
- Considerar anonimización para reportes
- Backup cifrado recomendado

---

## 16. Próximos Pasos

Para extender esta funcionalidad:

1. **Validación avanzada**:
   - Formato de SIP específico
   - Validación de direcciones
   - Prevenir duplicados por SIP

2. **Búsqueda avanzada**:
   - Filtros por rango de fechas de registro
   - Búsqueda fonética de nombres

3. **Exportación**:
   - Descargar listado en CSV/Excel (anonimizado)

4. **Historial**:
   - Registro de cambios en datos de pacientes
   - Auditoría de accesos

5. **Relaciones**:
   - Vincular pacientes con muestras
   - Historial clínico integrado

6. **Seguridad**:
   - Permisos granulares por rol
   - Enmascaramiento de datos sensibles en UI

---

## 17. Comparación con Otros Módulos

| Característica      | Centros     | Clientes | Criterios   | Máquinas | **Pacientes**      |
| ------------------- | ----------- | -------- | ----------- | -------- | ------------------ |
| Campo obligatorio   | codigo      | nombre   | codigo      | codigo   | **nombre**         |
| Campos opcionales   | descripcion | 3 campos | descripcion | 2 campos | **sip, direccion** |
| Textarea            | ❌          | ✅       | ❌          | ✅       | **✅**             |
| Datos sensibles     | ❌          | ❌       | ❌          | ❌       | **✅ (RGPD)**      |
| Identificador único | codigo      | -        | codigo      | codigo   | **sip**            |

---

**Última actualización:** 6 de octubre de 2025  
**Patrón aplicado:** Idéntico a Centros, Clientes, Criterios de Validación y Máquinas  
**Estado:** ✅ Implementación completa y funcional  
**Consideraciones especiales:** Datos sensibles (RGPD) - manejo con precaución
