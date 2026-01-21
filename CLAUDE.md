# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Use LF in the end of the line

## Project Overview

LIMS (Laboratory Information Management System) - A React/TypeScript application for managing laboratory workflows, samples, worklists, and master data tables.

## Development Commands

```bash
npm run dev       # Start Vite dev server (HMR enabled)
npm run build     # TypeScript check + production build
npm test          # Run Jest tests
npm run test:watch # Run Jest in watch mode
npm run lint      # Run ESLint
```

## Architecture

### Tech Stack

- **React 19** + **TypeScript 5.7** + **Vite 6**
- **TanStack React Query** for server state (5 min stale time, 30 min GC)
- **React Hook Form** + **Zod** for forms/validation
- **Tailwind CSS** for styling
- **Axios** with JWT auth interceptor

### Folder Structure

```
src/
├── features/           # Domain modules (each has components/, pages/, services/, hooks/, interfaces/)
│   ├── auth/          # Login/Register
│   ├── muestras/      # Samples management
│   ├── workList/      # Worklist management (core workflow feature)
│   ├── plantillaTecnica/
│   ├── tecnicasReactivos/
│   └── dim_tables/    # Master tables (pruebas, pacientes, centros, reactivos, etc.)
├── shared/            # Reusable resources
│   ├── components/    # Atomic design: atoms/, molecules/, organisms/
│   ├── contexts/      # UserContext, NotificationContext, ConfirmationContext
│   ├── hooks/         # useDim_tables, useEstados, useListFilters
│   ├── services/      # apiClient, authService, dim_tables.services
│   ├── constants/     # BASE_URL, TOKEN_KEY, STALE_TIME
│   └── utils/         # filterUtils, helpers
└── layouts/           # DashboardLayout
```

### Key Patterns

**Feature Module Structure**: Each feature follows the pattern:

- `components/` - UI components (often with sub-folders like MuestraForm/, MuestraList/)
- `pages/` - Route pages
- `services/` - API calls
- `hooks/` - Custom hooks (data fetching, business logic)
- `interfaces/` - TypeScript types

**State Management**:

- React Context for auth/user state and UI notifications
- React Query for all server data (no Redux/MobX)

**API Client**: Single axios instance (`src/shared/services/apiClient.ts`) with auto-injected JWT from localStorage.

## Workflow System

The worklist feature implements a 4-state workflow documented in `WORKFLOW_SYSTEM_DOCUMENTATION.md`:

- CREATED → TECNICO_ASSIGNED → TECNICAS_STARTED → RESULTS_IMPORTED
- Centralized in `useWorklistWorkflow` hook
- Dynamic permissions based on workflow state

## Code Style

- **ESLint + Prettier**: Single quotes, no semicolons, 100 char width, 2-space indent
- **Naming**: Spanish for domain entities, English for code constructs
- **Components**: Atomic design (atoms → molecules → organisms)

## Environment Configuration

- `.env.development`: `VITE_BASE_URL=http://localhost:3002/api`
- `.env.production`: `VITE_BASE_URL=/lims/api`, `VITE_APP_BASE=/lims/`

Path alias: `@` maps to `./src` (configured in tsconfig.json and vite.config.ts)

---

## 🏗️ Estructura y Desarrollo de Features

### Anatomía de una Feature

Cada feature en `src/features/` sigue esta estructura modular:

```
src/features/{nombre-feature}/
├── components/          # Componentes específicos de la feature
│   ├── {Entity}Form/   # Formularios (pueden tener subcarpetas)
│   ├── {Entity}List/   # Componentes de listado
│   ├── {Entity}Filter.tsx
│   └── {Entity}Stats.tsx
├── hooks/              # Hooks personalizados
│   └── use{Entities}.ts
├── interfaces/         # TypeScript types/interfaces
│   ├── {entity}.types.ts
│   └── defaults.ts     # Valores por defecto
├── pages/              # Páginas/rutas
│   ├── {Entities}Page.tsx
│   ├── Create{Entity}Page.tsx
│   └── {Entity}DetailPage.tsx (opcional)
├── services/           # Llamadas API
│   └── {entity}.service.ts
├── utils/              # Utilidades específicas (opcional)
│   └── {entity}Utils.ts
└── index.ts            # Exportaciones públicas
```

### 📋 Checklist de Implementación de Nueva Feature

Cuando se solicite crear una nueva feature, seguir estos pasos en orden:

#### 1. **Interfaces TypeScript** (`interfaces/`)

Crear primero las definiciones de tipos:

```typescript
// {entity}.types.ts
import { /* Importar tipos relacionados de dim_tables */ } from '@/shared/interfaces/dim_tables.types'
import { DimEstado } from '@/shared/interfaces/estados.types'

export type {Entity} = {
  id_{entity}: number
  // Relaciones con tablas dimensionales
  {related_entity}?: {RelatedEntity} | null
  // Campos básicos
  campo_requerido: string
  campo_opcional?: string
  // Estado (si aplica)
  id_estado?: number
  estadoInfo?: DimEstado | null
}

// defaults.ts
export const DEFAULT_{ENTITY}: Partial<{Entity}> = {
  // valores iniciales para formularios
}
```

#### 2. **Servicios** (`services/`)

Implementar clase de servicio con métodos CRUD:

```typescript
// {entity}.service.ts
import { apiClient } from '@/shared/services/apiClient'
import { {Entity} } from '../interfaces/{entity}.types'

class {Entity}Service {
  private readonly basePath = '/{entities}'

  async get{Entities}(): Promise<{Entity}[]> {
    const response = await apiClient.get<{Entity}[]>(this.basePath)
    return response.data
  }

  async get{Entity}(id: number): Promise<{Entity}> {
    const response = await apiClient.get<{Entity}>(`${this.basePath}/${id}`)
    return response.data
  }

  async create{Entity}(data: Omit<{Entity}, 'id_{entity}'>): Promise<{Entity}> {
    const response = await apiClient.post<{Entity}>(this.basePath, data)
    return response.data
  }

  async update{Entity}(id: number, data: Partial<{Entity}>): Promise<{Entity}> {
    const response = await apiClient.put<{Entity}>(`${this.basePath}/${id}`, data)
    return response.data
  }

  async delete{Entity}(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`)
  }
}

export const {entity}Service = new {Entity}Service()
export default {entity}Service
```

#### 3. **Hooks React Query** (`hooks/`)

Implementar hooks con TanStack React Query:

```typescript
// use{Entities}.ts
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { {entity}Service } from '../services/{entity}.service'
import { {Entity} } from '../interfaces/{entity}.types'
import { STALE_TIME } from '@/shared/constants/constants'

// Hook para listar
export const use{Entities} = () => {
  const { data, isLoading, error, refetch }: UseQueryResult<{Entity}[], Error> = useQuery({
    queryKey: ['{entities}'],
    queryFn: async () => {entity}Service.get{Entities}(),
    staleTime: STALE_TIME,
    placeholderData: []
  })

  return {
    {entities}: data || [],
    isLoading,
    error,
    refetch
  }
}

// Hook para obtener uno
export const use{Entity} = (id?: number) => {
  const { data, isLoading, error, refetch }: UseQueryResult<{Entity}, Error> = useQuery({
    queryKey: ['{entity}', id],
    queryFn: async () => {entity}Service.get{Entity}(id!),
    staleTime: STALE_TIME,
    enabled: !!id && id > 0
  })

  return {
    {entity}: data,
    isLoading,
    error,
    refetch
  }
}

// Hook para crear
export const useCreate{Entity} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<{Entity}, 'id_{entity}'>) => {entity}Service.create{Entity}(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['{entities}'] })
    }
  })
}

// Hook para actualizar
export const useUpdate{Entity} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{Entity}> }) =>
      {entity}Service.update{Entity}(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['{entity}', id] })
      queryClient.invalidateQueries({ queryKey: ['{entities}'] })
    }
  })
}

// Hook para eliminar
export const useDelete{Entity} = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => {entity}Service.delete{Entity}(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['{entities}'] })
    }
  })
}
```

#### 4. **Componentes** (`components/`)

##### A. Formulario (`{Entity}Form/`)

```typescript
// {Entity}Form.tsx
import { useForm, FormProvider } from 'react-hook-form'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { Button } from '@/shared/components/molecules/Button'
import { EntitySelect } from '@/shared/components/molecules/EntitySelect'
import { FormField } from '@/shared/components/molecules/FormField'
import { {Entity} } from '../../interfaces/{entity}.types'
import { DEFAULT_{ENTITY} } from '../../interfaces/defaults'
import { useCreate{Entity}, useUpdate{Entity} } from '../../hooks/use{Entities}'

interface Props {
  initialValues?: {Entity}
  onSuccess?: () => void
  onCancel?: () => void
}

export const {Entity}Form = ({ initialValues, onSuccess, onCancel }: Props) => {
  const methods = useForm<{Entity}>({
    defaultValues: initialValues || DEFAULT_{ENTITY}
  })

  const { showNotification } = useNotification()
  const createMutation = useCreate{Entity}()
  const updateMutation = useUpdate{Entity}()

  const isEditing = !!initialValues?.id_{entity}

  const onSubmit = async (data: {Entity}) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialValues.id_{entity}, data })
        showNotification('Actualizado correctamente', 'success')
      } else {
        await createMutation.mutateAsync(data)
        showNotification('Creado correctamente', 'success')
      }
      onSuccess?.()
    } catch (error) {
      showNotification(`Error al ${isEditing ? 'actualizar' : 'crear'}`, 'error')
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campos del formulario usando FormField o EntitySelect */}

        <div className="flex gap-4">
          <Button type="submit" variant="primary">
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
```

##### B. Filtros (`{Entity}Filter.tsx`)

```typescript
import { EntitySelect } from '@/shared/components/molecules/EntitySelect'
import { Input } from '@/shared/components/molecules/Input'
import { Button } from '@/shared/components/molecules/Button'

interface FilterProps {
  filters: {
    busqueda: string
    id_campo?: number | null
    soloHoy?: boolean
  }
  onFilterChange: (key: string, value: unknown) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export const {Entity}Filter = ({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters
}: FilterProps) => {
  return (
    <div className="flex gap-4 items-end">
      <Input
        placeholder="Buscar..."
        value={filters.busqueda}
        onChange={e => onFilterChange('busqueda', e.target.value)}
      />

      {/* Otros filtros según necesidad */}

      {hasActiveFilters && (
        <Button variant="secondary" onClick={onClearFilters}>
          Limpiar
        </Button>
      )}
    </div>
  )
}
```

##### C. List Components (`{Entity}List/`)

Crear `{Entity}ListHeader.tsx` y `{Entity}ListDetail.tsx` siguiendo el patrón de grid columns.

#### 5. **Pages** (`pages/`)

##### A. Página de Listado

```typescript
// {Entities}Page.tsx
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { use{Entities} } from '../hooks/use{Entities}'
import { {Entity} } from '../interfaces/{entity}.types'
import { {Entity}Filter } from '../components/{Entity}Filter'
import { ListPage } from '@/shared/components/organisms/ListPage'
import { useListFilters } from '@/shared/hooks/useListFilters'
import {
  createMultiFieldSearchFilter,
  createNumericExactFilter
} from '@/shared/utils/filterUtils'
import { {Entity}ListHeader } from '../components/{Entity}List/{Entity}ListHeader'
import { {Entity}ListDetail } from '../components/{Entity}List/{Entity}ListDetail'

export const {Entities}Page = () => {
  const { {entities}, isLoading, error, refetch } = use{Entities}()
  const navigate = useNavigate()

  // Configuración de filtros
  const filterConfig = useMemo(
    () => ({
      busqueda: {
        type: 'search' as const,
        defaultValue: '',
        filterFn: createMultiFieldSearchFilter<{Entity}>({entity} => [
          {entity}.campo1,
          {entity}.campo2?.nombre
        ])
      },
      id_estado: {
        type: 'select' as const,
        defaultValue: null,
        filterFn: createNumericExactFilter<{Entity}>({entity} => {entity}.id_estado)
      }
    }),
    []
  )

  const {
    filters,
    filteredItems,
    hasActiveFilters,
    updateFilter,
    clearFilters
  } = useListFilters({entities} || [], filterConfig)

  const handlers = {
    onNew: () => navigate('/{entities}/nuevo'),
    onRefresh: refetch
  }

  return (
    <ListPage
      title="Gestión de {Entities}"
      data={{
        items: filteredItems,
        total: {entities}?.length,
        filtered: filteredItems.length,
        isLoading,
        error,
        refetch
      }}
      handlers={handlers}
      renderFilters={() => (
        <{Entity}Filter
          filters={filters as any}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}
    >
      <div className="space-y-2">
        <{Entity}ListHeader />
        {filteredItems.map({entity} => (
          <{Entity}ListDetail key={{entity}.id_{entity}} {entity}={{entity}} />
        ))}
      </div>
    </ListPage>
  )
}
```

##### B. Página de Creación

```typescript
// Create{Entity}Page.tsx
import { useNavigate } from 'react-router-dom'
import { {Entity}Form } from '../components/{Entity}Form/{Entity}Form'

export const Create{Entity}Page = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear {Entity}</h1>
      <{Entity}Form
        onSuccess={() => navigate('/{entities}')}
        onCancel={() => navigate('/{entities}')}
      />
    </div>
  )
}
```

#### 6. **Rutas** (`src/shared/routes/routes.tsx`)

Agregar las rutas en el router:

```typescript
import { {Entities}Page } from '@/features/{entities}/pages/{Entities}Page'
import { Create{Entity}Page } from '@/features/{entities}/pages/Create{Entity}Page'
import { Edit{Entity}Page } from '@/features/{entities}/pages/Edit{Entity}Page'

// Dentro del DashboardLayout:
{
  path: '/{entities}',
  element: <{Entities}Page />
},
{
  path: '/{entities}/nuevo',
  element: <Create{Entity}Page />
},
{
  path: '/{entities}/:id/editar',
  element: <Edit{Entity}Page />
}
```

#### 7. **Menú** (`src/shared/config/menuConfig.ts`)

Agregar entrada en el menú:

```typescript
import { {Icon} } from 'lucide-react'

// En mainMenuItems o en submódulos según corresponda:
{
  path: '/{entities}',
  label: '{Entities}',
  icon: {Icon},
  description: 'Descripción breve'
}
```

#### 8. **Exports** (`index.ts`)

Exportar componentes públicos:

```typescript
export { {Entity}Form } from './components/{Entity}Form/{Entity}Form'
export { {Entities}Page } from './pages/{Entities}Page'
export { Create{Entity}Page } from './pages/Create{Entity}Page'
export { Edit{Entity}Page } from './pages/Edit{Entity}Page'
```

---

## 🧩 Componentes Compartidos (shared/)

### Componentes Reutilizables por Categoría

#### **Atoms** (`shared/components/atoms/`)

Componentes básicos sin lógica de negocio:

- **`Label.tsx`** - Etiquetas de formulario
- **`EstadoBadge.tsx`** - Badge para mostrar estados
- **`IndicadorEstado.tsx`** - Indicador visual de estado

#### **Molecules** (`shared/components/molecules/`)

Componentes compuestos con funcionalidad específica:

- **`Button.tsx`** - Botones con variantes (primary, secondary, danger, success, warning, info)

  ```typescript
  <Button variant="primary" onClick={handler}>Texto</Button>
  ```

- **`Input.tsx`** - Campo de entrada

  ```typescript
  <Input placeholder="..." value={value} onChange={handler} />
  ```

- **`Select.tsx`** - Selector básico

  ```typescript
  <Select value={value} onChange={handler}>
    <option value="">Seleccionar</option>
  </Select>
  ```

- **`EntitySelect.tsx`** - Selector para entidades con React Hook Form

  ```typescript
  <EntitySelect
    name="id_entidad"
    label="Entidad"
    control={control}
    options={entidades}
    getValue={item => item.id}
    getLabel={item => item.nombre}
    required
  />
  ```

- **`FormField.tsx`** - Campo de formulario completo (label + input + error)

  ```typescript
  <FormField
    id="campo"
    label="Etiqueta"
    type="input"
    error={errors.campo?.message}
    inputProps={{ ...register('campo') }}
    required
  />
  ```

- **`Modal.tsx`** - Modal reutilizable
- **`Card.tsx`** - Tarjeta de contenido
- **`StatCard.tsx`** - Tarjeta de estadísticas
- **`Badge.tsx`** - Badge genérico
- **`Tabs.tsx`** - Pestañas
- **`DateTimePicker.tsx`** - Selector de fecha/hora
- **`FileUploader.tsx`** - Subidor de archivos
- **`IconButton.tsx`** - Botón con icono

#### **Organisms** (`shared/components/organisms/`)

Componentes complejos que componen layouts:

- **`ListPage.tsx`** - Template para páginas de listado

  ```typescript
  <ListPage
    title="Título"
    data={{ items, total, filtered, isLoading, error, refetch }}
    handlers={{ onNew, onRefresh }}
    renderFilters={() => <Filtros />}
    renderStats={() => <Stats />}
  >
    {contenido}
  </ListPage>
  ```

- **`ListHeader.tsx`** - Encabezado de lista con columnas
- **`ListDetail.tsx`** - Detalle de item en lista
- **`Filters/`** - Componentes de filtrado
- **`Sidebar.tsx`** - Barra lateral
- **`Timeline.tsx`** - Línea de tiempo
- **`CambiarEstado.tsx`** - Componente para cambiar estados
- **`EditableList.tsx`** - Lista editable

#### **Contextos** (`shared/contexts/`)

- **`UserContext.tsx`** - Contexto de usuario autenticado

  ```typescript
  const { user, login, logout, loading } = useUser()
  ```

- **`NotificationContext.tsx`** - Sistema de notificaciones

  ```typescript
  const { showNotification } = useNotification()
  showNotification('Mensaje', 'success' | 'error' | 'warning' | 'info')
  ```

- **`ConfirmationContext.tsx`** - Diálogos de confirmación
  ```typescript
  const { showConfirmation } = useConfirmation()
  const confirmed = await showConfirmation('¿Eliminar?', 'Esta acción no se puede deshacer')
  ```

### Hooks Compartidos (`shared/hooks/`)

- **`useDim_tables.ts`** - Hooks para tablas dimensionales (centros, clientes, pruebas, etc.)

  ```typescript
  // Ejemplos de uso:
  const { data: centros } = useCentros()
  const { data: centro } = useCentro(id)
  const createMutation = useCreateCentro()
  const updateMutation = useUpdateCentro()
  const deleteMutation = useDeleteCentro()

  // Disponible para: Centros, Clientes, CriteriosValidacion, Pacientes,
  // Pruebas, TiposMuestra, Ubicaciones, TecnicosLaboratorio, Maquinas,
  // Pipetas, Reactivos, PlantillasPasos
  ```

- **`useEstados.ts`** - Hook para gestión de estados

  ```typescript
  const { data: estados } = useEstados('muestras')
  const { data: estadosDisponibles } = useEstadosDisponibles('muestras', estadoActual)
  const cambiarEstadoMutation = useCambiarEstado()
  ```

- **`useListFilters.ts`** - Hook para filtros de listas
  ```typescript
  const { filters, filteredItems, hasActiveFilters, updateFilter, clearFilters } = useListFilters(
    items,
    filterConfig
  )
  ```

### Servicios (`shared/services/`)

- **`apiClient.ts`** - Cliente Axios configurado con interceptor JWT

  ```typescript
  import { apiClient } from '@/shared/services/apiClient'
  const response = await apiClient.get('/endpoint')
  ```

- **`authService.ts`** - Servicio de autenticación
- **`dim_tables.services.ts`** - Servicios CRUD para tablas dimensionales
- **`estadosService.ts`** - Servicio de gestión de estados

### Utilidades (`shared/utils/`)

- **`filterUtils.ts`** - Funciones para filtrado
  ```typescript
  import {
    normalizeText,
    createMultiFieldSearchFilter,
    createNumericExactFilter,
    createTodayFilter
  } from '@/shared/utils/filterUtils'
  ```

### Constantes (`shared/constants/`)

```typescript
import { BASE_URL, TOKEN_KEY, STALE_TIME, GC_TIME } from '@/shared/constants/constants'
```

---

## 🎨 Estilos y UI Guidelines

### **REGLA FUNDAMENTAL: Usar clases de Tailwind del config**

**❌ NUNCA usar colores hardcodeados:**

```tsx
// ❌ INCORRECTO
<div className="bg-blue-600">
<Button className="bg-red-500">
```

**✅ SIEMPRE usar clases del sistema:**

```tsx
// ✅ CORRECTO
<div className="bg-primary-600">
<Button variant="danger">
```

### **Paleta de Colores del Sistema**

```tsx
// Colores principales
bg-primary-{50-950}     // Azul corporativo
bg-accent-{50-950}      // Naranja de acento

// Estados y acciones
bg-success-{50-950}     // Verde (éxito)
bg-danger-{50-950}      // Rojo (error/eliminar)
bg-warning-{50-950}     // Amarillo (advertencia)
bg-info-{50-950}        // Azul claro (información)

// Superficies y neutros
bg-surface-{50-950}     // Grises para fondos/textos
text-surface-{600-700}  // Textos principales
```

### **Variantes de Botones**

```tsx
<Button variant="primary">   // Acción principal
<Button variant="secondary"> // Acción secundaria
<Button variant="success">   // Confirmar/Guardar
<Button variant="danger">    // Eliminar/Cancelar
<Button variant="warning">   // Advertencia
<Button variant="info">      // Información
```

### **Espaciado y Layout**

```tsx
// Espaciados personalizados disponibles
space - y - 18 // 4.5rem
w - 88 // 22rem
max - w - 128 // 32rem

// Sombras del sistema
shadow - soft // Sombra sutil
shadow - medium // Sombra media
shadow - strong // Sombra fuerte
```

---

## 📝 Convenciones de Código

### Nomenclatura

- **Variables/funciones:** camelCase en inglés técnico, español para dominio

  ```typescript
  const isLoading = true
  const nombrePaciente = 'Juan'
  ```

- **Tipos/Interfaces:** PascalCase

  ```typescript
  type Muestra = { ... }
  interface UserContextType = { ... }
  ```

- **Archivos de componentes:** PascalCase

  ```
  MuestraForm.tsx
  ListPage.tsx
  ```

- **Archivos de servicios/hooks:** camelCase
  ```
  muestra.service.ts
  useMuestras.ts
  ```

### Imports

Usar path alias `@` para imports:

```typescript
import { apiClient } from '@/shared/services/apiClient'
import { useMuestras } from '@/features/muestras/hooks/useMuestras'
```

### TypeScript

- Tipar explícitamente props de componentes
- Usar tipos del dominio, no primitivos cuando sea posible
- Preferir `type` sobre `interface` para definiciones de datos

---

## ⚠️ Consideraciones Importantes

### Estados y Workflows

Si la entidad maneja estados, integrar con el sistema de estados:

```typescript
import { useEstados, useCambiarEstado } from '@/shared/hooks/useEstados'

const { data: estados } = useEstados('nombre_entidad')
const cambiarEstado = useCambiarEstado()

// Cambiar estado
await cambiarEstado.mutateAsync({
  entidad: 'nombre_entidad',
  idEntidad: id,
  idEstadoNuevo: nuevoEstadoId,
  observaciones: 'Motivo del cambio'
})
```

### Validaciones con React Hook Form + Zod

Para formularios complejos, usar Zod para validaciones:

```typescript
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  nombre: z.string().min(1, 'Campo requerido'),
  email: z.string().email('Email inválido')
})

const methods = useForm({
  resolver: zodResolver(schema),
  defaultValues: {}
})
```

### Tablas Dimensionales

Si se crea una tabla dimensional nueva (maestro):

1. Agregar tipos en `shared/interfaces/dim_tables.types.ts`
2. Agregar servicios en `shared/services/dim_tables.services.ts`
3. Agregar hooks en `shared/hooks/useDim_tables.ts`
4. Crear módulo en `features/dim_tables/{nombre}/`

### React Query

- `staleTime`: 5 minutos para datos que cambian poco
- `gcTime` (garbage collection): 30 minutos
- Siempre invalidar queries relacionadas después de mutations

---

## 🚀 Proceso de Desarrollo

1. **Analizar requisitos** - Entender la entidad y sus relaciones
2. **Definir tipos** - Crear interfaces TypeScript
3. **Implementar servicios** - API calls
4. **Crear hooks** - React Query hooks
5. **Desarrollar componentes** - Formularios, filtros, listas
6. **Crear páginas** - Integrar componentes
7. **Configurar rutas** - Agregar en router
8. **Actualizar menú** - Agregar entrada de navegación
9. **Probar funcionalidad** - Verificar CRUD completo

---

## 📚 Referencias Rápidas

- Documentación del sistema de estados: `src/_md/SISTEMA_ESTADOS_GUIA.md`
- Guía de UI: `src/_md/UI-DEVELOPMENT-GUIDELINES.md`
- Referencia de módulos CRUD: `src/_md/CRUD_MODULES_REFERENCE.md`
- Colores Tailwind: `src/_md/tailwind.colors.md`
- Sistema de workflow: `WORKFLOW_SYSTEM_DOCUMENTATION.md`
