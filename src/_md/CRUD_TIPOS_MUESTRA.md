# CRUD de Tipos de Muestra - Documentación Completa

## Descripción General

Implementación completa del CRUD (Create, Read, Update, Delete) para el módulo de **Tipos de Muestra** en el sistema LIMS. Permite la gestión integral de los diferentes tipos de muestras biológicas utilizadas en el laboratorio, como sangre, suero, orina, tejidos, etc., incluyendo su código identificador y descripción.

---

## 1. Modelo de Datos

### Interfaz TypeScript

```typescript
interface TipoMuestra {
  id: number
  cod_tipo_muestra: string // Código identificador del tipo de muestra (obligatorio)
  tipo_muestra?: string // Descripción del tipo de muestra (opcional)
}
```

### Validación con Zod

```typescript
const tipoMuestraSchema = z.object({
  cod_tipo_muestra: z.string().min(1, 'El código de tipo de muestra es obligatorio'),
  tipo_muestra: z.string().optional()
})
```

**Reglas de validación:**

- ✅ `cod_tipo_muestra`: Campo obligatorio, mínimo 1 carácter
- ✅ `tipo_muestra`: Campo opcional, descripción detallada del tipo de muestra

---

## 2. Capa de Servicios

**Archivo:** `src/shared/services/dim_tables.services.ts`

### Métodos CRUD

```typescript
// Crear nuevo tipo de muestra
createTipoMuestra: async (tipoMuestra: Omit<TipoMuestra, 'id'>) => {
  const response = await apiClient.post<TipoMuestra>('/tiposMuestra', tipoMuestra)
  return response.data
}

// Actualizar tipo de muestra existente
updateTipoMuestra: async (id: number, tipoMuestra: Partial<Omit<TipoMuestra, 'id'>>) => {
  const response = await apiClient.put<TipoMuestra>(`/tiposMuestra/${id}`, tipoMuestra)
  return response.data
}

// Eliminar tipo de muestra
deleteTipoMuestra: async (id: number) => {
  const response = await apiClient.delete(`/tiposMuestra/${id}`)
  return response.data
}
```

**Endpoints API:**

- `POST /tiposMuestra` - Crear tipo de muestra
- `PUT /tiposMuestra/:id` - Actualizar tipo de muestra
- `DELETE /tiposMuestra/:id` - Eliminar tipo de muestra

---

## 3. Hooks de React Query

**Archivo:** `src/shared/hooks/useDim_tables.ts`

### Hook de Creación

```typescript
export const useCreateTipoMuestra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<TipoMuestra, 'id'>) => dimTablesService.createTipoMuestra(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tiposMuestra() })
    }
  })
}
```

### Hook de Actualización

```typescript
export const useUpdateTipoMuestra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<TipoMuestra, 'id'>> }) =>
      dimTablesService.updateTipoMuestra(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tipoMuestra(id) })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tiposMuestra() })
    }
  })
}
```

### Hook de Eliminación

```typescript
export const useDeleteTipoMuestra = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteTipoMuestra(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tiposMuestra() })
      queryClient.invalidateQueries({ queryKey: dimTablesQueryKeys.tipoMuestra(id) })
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

**Archivo:** `src/features/dim_tables/tipos_muestra/components/TipoMuestraForm.tsx`

### Estructura del Formulario

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* Campo: Código de Tipo de Muestra (obligatorio) */}
  <input id="cod_tipo_muestra" type="text" {...register('cod_tipo_muestra')} className="..." />

  {/* Campo: Descripción (opcional, textarea) */}
  <textarea
    id="tipo_muestra"
    {...register('tipo_muestra')}
    rows={3}
    placeholder="Descripción detallada del tipo de muestra (ej: Sangre total, Suero, etc.)"
    className="..."
  />

  {/* Botones de acción */}
  <button type="button" onClick={() => navigate('/tipos-muestra')}>
    <X /> Cancelar
  </button>
  <button type="submit" disabled={isLoading || !isDirty}>
    <Save /> {isEditMode ? 'Actualizar' : 'Crear'}
  </button>
</form>
```

### Props del Componente

```typescript
interface TipoMuestraFormProps {
  initialData?: TipoMuestra // Para modo edición
}
```

### Funcionalidades

1. **Validación en tiempo real** con React Hook Form + Zod
2. **Modo dual**: Creación y edición según `initialData`
3. **Campo textarea**: Para descripciones extensas de tipos de muestra
4. **Gestión de estado de carga**: Botones deshabilitados durante mutaciones
5. **Navegación automática**: Redirige a `/tipos-muestra` tras éxito
6. **Notificaciones**: Mensajes de éxito/error integrados
7. **Detección de cambios**: Botón Submit deshabilitado si no hay cambios (`isDirty`)
8. **Iconos Lucide**: `Save` y `X` para mejor UX
9. **Placeholder informativo**: Guía sobre qué información incluir

---

## 5. Páginas de Gestión

### Página de Creación

**Archivo:** `src/features/dim_tables/tipos_muestra/pages/CreateTipoMuestraPage.tsx`

```tsx
export const CreateTipoMuestraPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/tipos-muestra"
          className="p-2 hover:bg-background-hover rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground-primary">Nuevo Tipo de Muestra</h1>
      </div>

      <div className="bg-background border border-border rounded-lg p-6">
        <TipoMuestraForm />
      </div>
    </div>
  )
}
```

**Características:**

- Botón de retorno a listado con icono `ArrowLeft`
- Título claro "Nuevo Tipo de Muestra"
- Renderiza `TipoMuestraForm` sin `initialData` (modo creación)
- Diseño consistente con otros módulos LIMS

---

### Página de Edición

**Archivo:** `src/features/dim_tables/tipos_muestra/pages/EditTipoMuestraPage.tsx`

```tsx
export const EditTipoMuestraPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: tipoMuestra, isLoading, error } = useTipoMuestra(Number(id))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !tipoMuestra) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/tipos-muestra"
            className="p-2 hover:bg-background-hover rounded-md transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground-primary">Editar Tipo de Muestra</h1>
        </div>
        <div className="bg-estado-error-light border border-estado-error rounded-lg p-4">
          <p className="text-estado-error">
            {error?.message || 'No se pudo cargar el tipo de muestra'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/tipos-muestra"
          className="p-2 hover:bg-background-hover rounded-md transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-foreground-primary">Editar Tipo de Muestra</h1>
      </div>

      <div className="bg-background border border-border rounded-lg p-6">
        <TipoMuestraForm initialData={tipoMuestra} />
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
- Pasa `initialData` a `TipoMuestraForm` para modo edición

---

### Página de Listado

**Archivo:** `src/features/dim_tables/tipos_muestra/pages/TiposMuestraPage.tsx`

#### Handler de Eliminación

```typescript
const handleDelete = async (tipoMuestra: TipoMuestra) => {
  try {
    const confirmed = await confirm({
      title: '¿Eliminar tipo de muestra?',
      message: `¿Estás seguro de que deseas eliminar el tipo de muestra "${tipoMuestra.cod_tipo_muestra}"? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    })

    if (confirmed) {
      await deleteMutation.mutateAsync(tipoMuestra.id)
      notify('Tipo de muestra eliminado correctamente', 'success')
    }
  } catch (error) {
    notify(error instanceof Error ? error.message : 'Error al eliminar el tipo de muestra', 'error')
  }
}
```

**Características del handler:**

- ✅ **Confirmación obligatoria**: Usa `useConfirmation` con tipo "danger"
- ✅ **Mensaje claro**: Muestra código del tipo de muestra
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
      filterFn: createMultiFieldSearchFilter<TipoMuestra>(tipoMuestra => [
        tipoMuestra.cod_tipo_muestra,
        tipoMuestra.tipo_muestra
      ])
    }
  }),
  []
)
```

**Campos buscables:**

- Código de tipo de muestra
- Descripción del tipo de muestra

#### Renderizado de Cards

```tsx
<div className="grid gap-1">
  {tiposMuestraFiltrados.map((tipoMuestra: TipoMuestra) => (
    <TipoMuestraCard
      key={tipoMuestra.id}
      tipoMuestra={tipoMuestra}
      onEdit={() => navigate(`/tipos-muestra/${tipoMuestra.id}/editar`)}
      onDelete={() => handleDelete(tipoMuestra)}
    />
  ))}
</div>
```

**Características:**

- **Búsqueda multi-campo**: Por código y descripción
- **Confirmación visual**: Diálogo tipo "danger" antes de eliminar
- **Feedback inmediato**: Notificaciones de éxito/error
- **Navegación**: Botones de edición redirigen correctamente

---

## 6. Configuración de Rutas

**Archivo:** `src/shared/routes/routes.tsx`

```typescript
// Importaciones
import { TiposMuestraPage } from '@/features/dim_tables/tipos_muestra/pages/TiposMuestraPage'
import { CreateTipoMuestraPage } from '@/features/dim_tables/tipos_muestra/pages/CreateTipoMuestraPage'
import { EditTipoMuestraPage } from '@/features/dim_tables/tipos_muestra/pages/EditTipoMuestraPage'

// Configuración de rutas
children: [
  { path: 'tipos-muestra', element: <TiposMuestraPage /> },
  { path: 'tipos-muestra/nuevo', element: <CreateTipoMuestraPage /> },
  { path: 'tipos-muestra/:id/editar', element: <EditTipoMuestraPage /> }
]
```

**Rutas configuradas:**

- `/tipos-muestra` - Listado de tipos de muestra
- `/tipos-muestra/nuevo` - Crear nuevo tipo de muestra
- `/tipos-muestra/:id/editar` - Editar tipo de muestra existente

---

## 7. Exports del Módulo

**Archivo:** `src/features/dim_tables/tipos_muestra/index.ts`

```typescript
export { TiposMuestraPage } from './pages/TiposMuestraPage'
export { CreateTipoMuestraPage } from './pages/CreateTipoMuestraPage'
export { EditTipoMuestraPage } from './pages/EditTipoMuestraPage'
export { TipoMuestraCard } from './components/TipoMuestraCard'
export { TipoMuestraForm } from './components/TipoMuestraForm'
```

**Componentes exportados:**

- `TiposMuestraPage` - Página de listado principal
- `CreateTipoMuestraPage` - Página de creación
- `EditTipoMuestraPage` - Página de edición
- `TipoMuestraCard` - Card para visualización en listado
- `TipoMuestraForm` - Formulario dual (crear/editar)

---

## 8. Flujos de Usuario

### Flujo de Creación

1. Usuario navega a `/tipos-muestra`
2. Click en botón "Nuevo Tipo de Muestra"
3. Sistema redirige a `/tipos-muestra/nuevo`
4. Usuario completa formulario:
   - Código: Campo obligatorio (ej: "SANG")
   - Descripción: Campo opcional (ej: "Sangre total con anticoagulante EDTA")
5. Click en botón "Crear"
6. Sistema valida datos con Zod schema
7. Si validación OK:
   - Llama a `createTipoMuestra` service
   - Invalida caché de React Query
   - Muestra notificación de éxito
   - Redirige a `/tipos-muestra`
8. Si validación falla:
   - Muestra errores bajo campos correspondientes
   - Usuario corrige y reintenta

### Flujo de Edición

1. Usuario en `/tipos-muestra` click en botón "Editar" de un tipo de muestra
2. Sistema redirige a `/tipos-muestra/:id/editar`
3. Componente carga datos con `useTipoMuestra(id)`
4. Mientras carga: Muestra spinner animado
5. Si datos OK:
   - Pre-rellena formulario con `initialData`
   - Usuario modifica campos necesarios
   - Click en "Actualizar"
   - Sistema valida y actualiza
   - Notificación de éxito
   - Redirige a `/tipos-muestra`
6. Si error de carga:
   - Muestra mensaje de error visual
   - Opción de volver al listado

### Flujo de Eliminación

1. Usuario en `/tipos-muestra` click en botón "Eliminar" de un tipo de muestra
2. Sistema muestra diálogo de confirmación:
   - Título: "¿Eliminar tipo de muestra?"
   - Mensaje con código del tipo de muestra
   - Tipo "danger" (rojo)
   - Botones: "Eliminar" / "Cancelar"
3. Si usuario confirma:
   - Llama a `deleteTipoMuestra` service
   - Invalida caché de React Query
   - Muestra notificación "Tipo de muestra eliminado correctamente"
   - Listado se actualiza automáticamente
4. Si usuario cancela:
   - Cierra diálogo sin acción
   - Tipo de muestra permanece en listado

---

## 9. Manejo de Errores

### Errores de Validación

```typescript
{
  errors.cod_tipo_muestra && (
    <p className="mt-1 text-sm text-estado-error">{errors.cod_tipo_muestra.message}</p>
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
  notify('Tipo de muestra creado correctamente', 'success')
} catch (error) {
  notify(error instanceof Error ? error.message : 'Error al guardar el tipo de muestra', 'error')
}
```

- Try-catch en todos los handlers
- Notificaciones con tipo `error`
- Mensajes específicos o genéricos según disponibilidad

### Errores de Carga

```typescript
if (error || !tipoMuestra) {
  return (
    <div className="bg-estado-error-light border border-estado-error rounded-lg p-4">
      <p className="text-estado-error">
        {error?.message || 'No se pudo cargar el tipo de muestra'}
      </p>
    </div>
  )
}
```

- Componente visual para errores de carga
- Mensaje específico del error o genérico
- Navegación de retorno siempre disponible

---

## 10. Integración con Sistema de Estados

El módulo de Tipos de Muestra se integra con el sistema global de estados LIMS:

### Notificaciones

```typescript
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const { notify } = useNotification()

// Éxito
notify('Tipo de muestra creado correctamente', 'success')

// Error
notify('Error al eliminar el tipo de muestra', 'error')
```

### Confirmaciones

```typescript
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'

const { confirm } = useConfirmation()

const confirmed = await confirm({
  title: '¿Eliminar tipo de muestra?',
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

### Registro de Nuevo Tipo de Muestra

**Escenario**: El laboratorio comienza a procesar un nuevo tipo de muestra

1. Técnico responsable accede a "Gestión de Tipos de Muestra"
2. Click en "Nuevo Tipo de Muestra"
3. Completa formulario:
   - Código: "PLAS"
   - Descripción: "Plasma sanguíneo obtenido por centrifugación con anticoagulante citrato"
4. Guarda el registro
5. Sistema confirma creación
6. Tipo de muestra disponible para asociar a muestras entrantes

### Actualización de Información

**Escenario**: Corrección o ampliación de descripción de tipo de muestra

1. Búsqueda del tipo de muestra por código
2. Click en "Editar"
3. Modifica campo descripción (ej: añadir especificaciones técnicas)
4. Sistema detecta cambios (`isDirty`)
5. Actualización exitosa con notificación
6. Información reflejada inmediatamente en sistema

### Retiro de Tipo de Muestra

**Escenario**: Tipo de muestra obsoleto debe eliminarse

1. Localización del tipo de muestra en listado
2. Click en "Eliminar"
3. Sistema muestra confirmación con código
4. Verificación de que no hay muestras asociadas (validación backend recomendada)
5. Confirmación de eliminación
6. Tipo de muestra removido del sistema
7. Caché actualizada automáticamente

---

## 12. Tipos de Muestra Comunes en Laboratorio

### Ejemplos de Tipos de Muestra

**Sangre y derivados:**

- SANG - Sangre total
- SUERO - Suero sanguíneo
- PLAS - Plasma
- SANG-EDTA - Sangre con anticoagulante EDTA
- SANG-CIT - Sangre con citrato

**Fluidos corporales:**

- ORINA - Orina
- LCR - Líquido cefalorraquídeo
- SALIVA - Saliva
- LAV - Lavado broncoalveolar

**Tejidos:**

- BIOP - Biopsia tisular
- HISP - Hisopo (nasofaríngeo, etc.)
- ESP - Esputo

**Otros:**

- AGUA - Agua (análisis ambiental)
- ALIM - Alimento
- CULT - Cultivo celular

---

## 13. Mejores Prácticas Implementadas

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
- Textarea con placeholder informativo
- Iconos con significado claro
- Colores del sistema de estados consistentes

### Performance

✅ **Optimización de caché**

- Invalidación selectiva de queries
- StaleTime y GcTime configurados
- Queries deshabilitadas cuando no hay ID

✅ **Lazy loading**

- Componentes cargados solo cuando necesarios
- Datos paginados en listado (si necesario)

---

## 14. Testing (Recomendaciones)

### Unit Tests

```typescript
describe('TipoMuestraForm', () => {
  it('should validate cod_tipo_muestra as required', () => {
    // Test validación campo obligatorio
  })

  it('should accept optional tipo_muestra field', () => {
    // Test campo opcional
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
describe('Tipos Muestra CRUD Flow', () => {
  it('should create, edit, and delete a tipo muestra', async () => {
    // Test flujo completo
  })

  it('should show confirmation dialog before delete', () => {
    // Test confirmación
  })

  it('should handle API errors gracefully', () => {
    // Test manejo de errores
  })

  it('should search by code and description', () => {
    // Test filtros
  })
})
```

---

## 15. Troubleshooting

### Problema: Formulario no se envía

**Causa**: `cod_tipo_muestra` vacío (campo obligatorio)

**Solución**: Completar el campo código antes de enviar

### Problema: Error 404 al editar

**Causa**: ID no válido en URL o tipo de muestra no existe

**Solución**: Verificar que `useParams` extrae ID correctamente y que el registro existe

### Problema: Caché no se actualiza tras eliminar

**Causa**: Query key incorrecta en invalidación

**Solución**: Usar `dimTablesQueryKeys.tiposMuestra()` consistentemente

### Problema: Textarea no se expande correctamente

**Causa**: CSS conflicts o falta de clase `resize-vertical`

**Solución**: Verificar clases Tailwind y CSS global

---

## 16. Roadmap Futuro

### Funcionalidades Planeadas

- [ ] **Validación de uso**: Verificar si tipo de muestra está asociado a muestras antes de eliminar
- [ ] **Categorización**: Agrupar tipos de muestra por categoría (sangre, tejido, fluido, etc.)
- [ ] **Tiempos de estabilidad**: Registrar tiempo de viabilidad de cada tipo
- [ ] **Condiciones de almacenamiento**: Temperatura, conservantes requeridos
- [ ] **Volúmenes requeridos**: Cantidad mínima necesaria para análisis
- [ ] **Códigos estándar**: Mapeo con códigos SNOMED, LOINC
- [ ] **Exportación a Excel**: Catálogo completo de tipos de muestra
- [ ] **Historial de cambios**: Auditoría de modificaciones

### Mejoras Técnicas

- [ ] **Paginación**: Para grandes catálogos de tipos de muestra
- [ ] **Ordenamiento**: Por código, descripción, fecha de creación
- [ ] **Búsqueda avanzada**: Filtros por categoría, estado activo/inactivo
- [ ] **Importación masiva**: Carga de tipos de muestra desde CSV/Excel
- [ ] **Versionado**: Control de versiones de definiciones

---

## 17. Integración con Otros Módulos

### Relación con Muestras

El módulo de Tipos de Muestra es fundamental para el módulo de Muestras:

```typescript
interface Muestra {
  id: number
  cod_muestra: string
  id_tipo_muestra: number // FK a TipoMuestra
  // ... otros campos
}
```

**Flujo de integración:**

1. Usuario crea nueva muestra
2. Selecciona tipo de muestra del catálogo
3. Sistema valida que el tipo existe
4. Muestra queda asociada al tipo
5. Informes y análisis agrupan por tipo de muestra

### Validaciones Cruzadas

- No permitir eliminar tipo de muestra si hay muestras asociadas
- Filtrar tipos de muestra por pruebas compatibles
- Sugerir tipos de muestra según protocolo seleccionado

---

## 18. Conclusión

El módulo de Tipos de Muestra implementa un CRUD completo y robusto siguiendo las mejores prácticas de desarrollo React moderno:

✅ **Arquitectura limpia** con separación clara de responsabilidades  
✅ **Validación exhaustiva** con Zod y React Hook Form  
✅ **UX excepcional** con feedback continuo y confirmaciones  
✅ **Performance optimizado** con React Query y cache inteligente  
✅ **Código mantenible** con TypeScript y documentación completa  
✅ **Integración perfecta** con sistema de estados LIMS  
✅ **Textarea para descripciones** extensas y detalladas

El módulo está listo para producción y sirve como base fundamental para la gestión de muestras en el sistema LIMS.

---

**Versión del documento**: 1.0  
**Fecha**: Octubre 2025  
**Autor**: Equipo de Desarrollo LIMS  
**Última actualización**: 6 de octubre de 2025
