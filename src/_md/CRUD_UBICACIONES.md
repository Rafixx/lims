# CRUD de Ubicaciones - Sistema LIMS

## Índice

1. [Descripción General](#descripción-general)
2. [Modelo de Datos](#modelo-de-datos)
3. [Servicios (API Client)](#servicios-api-client)
4. [Hooks de React Query](#hooks-de-react-query)
5. [Componentes](#componentes)
6. [Páginas](#páginas)
7. [Rutas](#rutas)
8. [Exports del Módulo](#exports-del-módulo)
9. [Flujos de Usuario](#flujos-de-usuario)
10. [Manejo de Errores](#manejo-de-errores)
11. [Integración con el Sistema](#integración-con-el-sistema)
12. [Casos de Uso en Laboratorio](#casos-de-uso-en-laboratorio)
13. [Ubicaciones Comunes](#ubicaciones-comunes)
14. [Mejores Prácticas](#mejores-prácticas)
15. [Testing](#testing)
16. [Troubleshooting](#troubleshooting)
17. [Roadmap](#roadmap)
18. [Conclusión](#conclusión)

---

## Descripción General

El módulo de **Ubicaciones** permite la gestión completa (CRUD) de las ubicaciones físicas dentro del laboratorio donde se almacenan muestras, reactivos, equipos y otros materiales. Este módulo es fundamental para:

- **Trazabilidad**: Saber dónde está almacenado cada elemento
- **Control de inventario**: Gestionar espacios de almacenamiento
- **Organización**: Mantener el laboratorio ordenado y eficiente
- **Cumplimiento normativo**: Registrar ubicaciones según requisitos de calidad
- **Búsqueda rápida**: Localizar materiales de forma inmediata

### Características Principales

- ✅ Crear nuevas ubicaciones con código único
- ✅ Editar información de ubicaciones existentes
- ✅ Eliminar ubicaciones (con confirmación)
- ✅ Búsqueda por código o descripción
- ✅ Validación de datos con Zod
- ✅ Sistema de notificaciones
- ✅ Diálogo de confirmación para acciones destructivas

---

## Modelo de Datos

### Interface TypeScript

```typescript
export interface Ubicacion {
  id: number
  codigo: string // Código único de identificación (OBLIGATORIO)
  ubicacion?: string // Descripción detallada (OPCIONAL)
}
```

### Campos

| Campo       | Tipo     | Obligatorio | Descripción                           | Ejemplo                                    |
| ----------- | -------- | ----------- | ------------------------------------- | ------------------------------------------ |
| `id`        | `number` | Sí (auto)   | Identificador único generado por BD   | 1                                          |
| `codigo`    | `string` | Sí          | Código único de la ubicación          | "NEVERA-01"                                |
| `ubicacion` | `string` | No          | Descripción detallada de la ubicación | "Nevera principal del laboratorio central" |

### Esquema de Validación (Zod)

```typescript
const ubicacionSchema = z.object({
  codigo: z.string().min(1, 'El código de ubicación es obligatorio'),
  ubicacion: z.string().optional()
})
```

---

## Servicios (API Client)

### Ubicación: `src/shared/services/dim_tables.services.ts`

```typescript
class DimTablesService {
  // GET - Lista todas las ubicaciones
  async getUbicaciones() {
    const response = await apiClient.get('/ubicaciones')
    return response.data
  }

  // GET - Obtiene una ubicación por ID
  async getUbicacion(id: number) {
    const response = await apiClient.get(`/ubicaciones/${id}`)
    return response.data
  }

  // POST - Crea una nueva ubicación
  async createUbicacion(ubicacion: Omit<Ubicacion, 'id'>) {
    const response = await apiClient.post('/ubicaciones', ubicacion)
    return response.data
  }

  // PUT - Actualiza una ubicación existente
  async updateUbicacion(id: number, ubicacion: Partial<Omit<Ubicacion, 'id'>>) {
    const response = await apiClient.put(`/ubicaciones/${id}`, ubicacion)
    return response.data
  }

  // DELETE - Elimina una ubicación
  async deleteUbicacion(id: number) {
    const response = await apiClient.delete(`/ubicaciones/${id}`)
    return response.data
  }
}
```

### Endpoints de la API

| Método | Endpoint           | Descripción                      | Body                      |
| ------ | ------------------ | -------------------------------- | ------------------------- |
| GET    | `/ubicaciones`     | Lista todas las ubicaciones      | -                         |
| GET    | `/ubicaciones/:id` | Obtiene una ubicación específica | -                         |
| POST   | `/ubicaciones`     | Crea una nueva ubicación         | `{ codigo, ubicacion? }`  |
| PUT    | `/ubicaciones/:id` | Actualiza una ubicación          | `{ codigo?, ubicacion? }` |
| DELETE | `/ubicaciones/:id` | Elimina una ubicación            | -                         |

---

## Hooks de React Query

### Ubicación: `src/shared/hooks/useDim_tables.ts`

```typescript
// Query Keys
export const dimTablesQueryKeys = {
  ubicaciones: () => [...dimTablesQueryKeys.all, 'ubicaciones'] as const,
  ubicacion: (id: number) => [...dimTablesQueryKeys.ubicaciones(), id] as const
}

// Hook para listar ubicaciones
export const useUbicaciones = (options?: UseQueryOptions<Ubicacion[]>) => {
  return useQuery<Ubicacion[], Error>({
    queryKey: dimTablesQueryKeys.ubicaciones(),
    queryFn: () => dimTablesService.getUbicaciones(),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    ...options
  })
}

// Hook para obtener una ubicación específica
export const useUbicacion = (id: number, options?: UseQueryOptions<Ubicacion>) => {
  return useQuery<Ubicacion, Error>({
    queryKey: dimTablesQueryKeys.ubicacion(id),
    queryFn: () => dimTablesService.getUbicacion(id),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id && id > 0,
    ...options
  })
}

// Mutación para crear ubicación
export const useCreateUbicacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Ubicacion, 'id'>) => dimTablesService.createUbicacion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dimTablesQueryKeys.ubicaciones()
      })
    }
  })
}

// Mutación para actualizar ubicación
export const useUpdateUbicacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Ubicacion, 'id'>> }) =>
      dimTablesService.updateUbicacion(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: dimTablesQueryKeys.ubicacion(id)
      })
      queryClient.invalidateQueries({
        queryKey: dimTablesQueryKeys.ubicaciones()
      })
    }
  })
}

// Mutación para eliminar ubicación
export const useDeleteUbicacion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => dimTablesService.deleteUbicacion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: dimTablesQueryKeys.ubicaciones()
      })
      queryClient.invalidateQueries({
        queryKey: dimTablesQueryKeys.ubicacion(id)
      })
    }
  })
}
```

### Características de los Hooks

- **Cache automático**: Los datos se mantienen en cache según `staleTime` y `gcTime`
- **Invalidación inteligente**: Al crear/editar/eliminar se invalida el cache automáticamente
- **Estados de carga**: `isLoading`, `isError`, `isSuccess`
- **Refetch**: Posibilidad de recargar datos manualmente
- **Optimistic updates**: Soporte para actualizaciones optimistas

---

## Componentes

### UbicacionForm

**Ubicación**: `src/features/dim_tables/ubicaciones/components/UbicacionForm.tsx`

Formulario reutilizable que funciona tanto para crear como para editar ubicaciones.

#### Props

```typescript
interface UbicacionFormProps {
  initialData?: Ubicacion // Datos iniciales (para modo edición)
  isEditMode?: boolean // true = editar, false = crear
}
```

#### Características

- **Modo dual**: Crea o edita según `isEditMode`
- **Validación**: Usa Zod para validación del lado del cliente
- **React Hook Form**: Manejo eficiente del estado del formulario
- **Detección de cambios**: Desactiva el botón guardar si no hay cambios (en modo edición)
- **Estados de carga**: Muestra spinner durante el guardado
- **Navegación**: Botón de volver a la lista
- **Notificaciones**: Mensajes de éxito/error tras guardar

#### Campos del Formulario

1. **Código de Ubicación** (obligatorio)
   - Input de texto
   - Placeholder: "Ej: NEVERA-01, ARMARIO-A, SALA-PCR"
   - Validación: No puede estar vacío

2. **Descripción de la Ubicación** (opcional)
   - Textarea (3 filas)
   - Placeholder: "Descripción detallada de la ubicación..."
   - Sin validación requerida

---

## Páginas

### 1. UbicacionesPage (Lista)

**Ubicación**: `src/features/dim_tables/ubicaciones/pages/UbicacionesPage.tsx`

Página principal que muestra la lista de todas las ubicaciones.

#### Características

- **Búsqueda multi-campo**: Busca por código o descripción
- **Filtros**: Sistema de filtros con componente `FilterContainer`
- **Acciones en tarjetas**: Editar y Eliminar por cada ubicación
- **Confirmación de eliminación**: Dialog de confirmación antes de borrar
- **Botón "Nueva ubicación"**: Navega a formulario de creación
- **Estados**: Loading, error y empty state
- **Refetch manual**: Posibilidad de recargar datos

#### Handlers

```typescript
const handlers = {
  onNew: () => navigate('/ubicaciones/nueva'),
  onEdit: (ubicacion: Ubicacion) => navigate(`/ubicaciones/${ubicacion.id}/editar`),
  onDelete: async (ubicacion: Ubicacion) => {
    // Confirmación + eliminación + notificación
  }
}
```

#### Proceso de Eliminación

1. Usuario hace clic en botón "Eliminar"
2. Se muestra diálogo de confirmación con:
   - Título: "Eliminar Ubicación"
   - Mensaje: "¿Está seguro de eliminar la ubicación '{codigo}'?"
   - Botón confirmar: "Sí, eliminar" (danger)
   - Botón cancelar: "Cancelar"
3. Si confirma:
   - Se ejecuta `deleteMutation`
   - Se muestra notificación de éxito
   - Se refresca la lista
4. Si hay error:
   - Se muestra notificación de error con mensaje

### 2. CreateUbicacionPage

**Ubicación**: `src/features/dim_tables/ubicaciones/pages/CreateUbicacionPage.tsx`

Página wrapper para el formulario en modo creación.

```typescript
export const CreateUbicacionPage = () => {
  return <UbicacionForm />
}
```

- Muestra el formulario sin datos iniciales
- El título del formulario será "Nueva Ubicación"
- Al guardar, redirige a `/ubicaciones`

### 3. EditUbicacionPage

**Ubicación**: `src/features/dim_tables/ubicaciones/pages/EditUbicacionPage.tsx`

Página wrapper para el formulario en modo edición.

#### Características

- Extrae el `id` de los parámetros de la URL
- Carga los datos de la ubicación con `useUbicacion(id)`
- **Estado de carga**: Muestra spinner mientras carga
- **Manejo de errores**: Muestra mensaje si no se puede cargar
- Pasa los datos al formulario como `initialData`
- El título del formulario será "Editar Ubicación"

```typescript
export const EditUbicacionPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: ubicacion, isLoading, error } = useUbicacion(Number(id))

  if (isLoading) return <LoadingSpinner />
  if (error || !ubicacion) return <ErrorMessage />

  return <UbicacionForm initialData={ubicacion} isEditMode />
}
```

---

## Rutas

**Ubicación**: `src/shared/routes/routes.tsx`

```typescript
// Imports
import { UbicacionesPage } from '@/features/dim_tables/ubicaciones/pages/UbicacionesPage'
import { CreateUbicacionPage } from '@/features/dim_tables/ubicaciones/pages/CreateUbicacionPage'
import { EditUbicacionPage } from '@/features/dim_tables/ubicaciones/pages/EditUbicacionPage'

// Rutas dentro del DashboardLayout
{
  path: '/',
  element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
  children: [
    // ... otras rutas
    {
      path: 'ubicaciones',
      element: <UbicacionesPage />
    },
    {
      path: 'ubicaciones/nueva',
      element: <CreateUbicacionPage />
    },
    {
      path: 'ubicaciones/:id/editar',
      element: <EditUbicacionPage />
    },
  ]
}
```

### URLs Completas

| Ruta                      | Componente          | Descripción                |
| ------------------------- | ------------------- | -------------------------- |
| `/ubicaciones`            | UbicacionesPage     | Lista de ubicaciones       |
| `/ubicaciones/nueva`      | CreateUbicacionPage | Crear nueva ubicación      |
| `/ubicaciones/:id/editar` | EditUbicacionPage   | Editar ubicación existente |

---

## Exports del Módulo

**Ubicación**: `src/features/dim_tables/ubicaciones/index.ts`

```typescript
export { UbicacionCard } from './components/UbicacionCard'
export { UbicacionForm } from './components/UbicacionForm'
export { UbicacionesPage } from './pages/UbicacionesPage'
export { CreateUbicacionPage } from './pages/CreateUbicacionPage'
export { EditUbicacionPage } from './pages/EditUbicacionPage'
```

Permite importar componentes desde:

```typescript
import {
  UbicacionesPage,
  CreateUbicacionPage,
  UbicacionForm
} from '@/features/dim_tables/ubicaciones'
```

---

## Flujos de Usuario

### Flujo 1: Crear Nueva Ubicación

1. Usuario navega a `/ubicaciones`
2. Hace clic en botón "Nueva ubicación"
3. Se abre formulario en `/ubicaciones/nueva`
4. Usuario completa:
   - **Código**: (obligatorio) Ej: "NEVERA-02"
   - **Descripción**: (opcional) Ej: "Nevera auxiliar sala B"
5. Hace clic en "Crear ubicación"
6. Sistema valida datos
7. Se envía POST a `/ubicaciones`
8. Si éxito:
   - Muestra notificación: "Ubicación creada correctamente"
   - Redirige a `/ubicaciones`
   - La nueva ubicación aparece en la lista
9. Si error:
   - Muestra notificación con mensaje de error
   - Usuario puede corregir y reintentar

### Flujo 2: Editar Ubicación Existente

1. Usuario está en `/ubicaciones`
2. Hace clic en botón "Editar" de una ubicación
3. Navega a `/ubicaciones/{id}/editar`
4. Sistema carga datos de la ubicación
5. Formulario se pre-rellena con datos actuales
6. Usuario modifica campos
7. Botón "Guardar cambios" se habilita (por `isDirty`)
8. Usuario hace clic en "Guardar cambios"
9. Sistema valida cambios
10. Se envía PUT a `/ubicaciones/{id}`
11. Si éxito:
    - Notificación: "Ubicación actualizada correctamente"
    - Redirige a `/ubicaciones`
    - Lista se actualiza automáticamente
12. Si error:
    - Notificación de error
    - Usuario permanece en formulario

### Flujo 3: Eliminar Ubicación

1. Usuario está en `/ubicaciones`
2. Hace clic en botón "Eliminar" de una ubicación
3. Se abre diálogo de confirmación:
   - "¿Está seguro de eliminar la ubicación 'NEVERA-02'?"
   - "Esta acción no se puede deshacer"
4. Usuario puede:
   - **Cancelar**: Cierra el diálogo, no pasa nada
   - **Confirmar**: Procede con la eliminación
5. Si confirma:
   - Se envía DELETE a `/ubicaciones/{id}`
   - Muestra notificación: "Ubicación eliminada correctamente"
   - Lista se actualiza automáticamente (la ubicación desaparece)
6. Si error:
   - Notificación: "Error al eliminar la ubicación"
   - La ubicación permanece en la lista

### Flujo 4: Buscar Ubicación

1. Usuario está en `/ubicaciones`
2. Escribe en el campo de búsqueda
3. El filtro se aplica en tiempo real a la lista
4. Busca coincidencias en:
   - Campo `codigo`
   - Campo `ubicacion`
5. Lista se actualiza dinámicamente
6. Si no hay resultados, se muestra mensaje de lista vacía

---

## Manejo de Errores

### Errores de Validación (Cliente)

```typescript
// Error si código vacío
'El código de ubicación es obligatorio'
```

Se muestran debajo del campo correspondiente en color rojo.

### Errores de API (Servidor)

Los errores se capturan en bloques try-catch:

```typescript
try {
  await createMutation.mutateAsync(data)
  notify('Ubicación creada correctamente', 'success')
} catch (error) {
  notify(error instanceof Error ? error.message : 'Error al guardar la ubicación', 'error')
}
```

### Tipos de Errores Comunes

| Error                                   | Causa                     | Solución                          |
| --------------------------------------- | ------------------------- | --------------------------------- |
| "El código de ubicación es obligatorio" | Campo código vacío        | Completar el campo                |
| "Ubicación no encontrada"               | ID inexistente en edición | Verificar que la ubicación existe |
| Error 409 (Conflict)                    | Código duplicado          | Usar un código único              |
| Error 500 (Server)                      | Problema en servidor/BD   | Revisar logs del servidor         |
| Network Error                           | Sin conexión a API        | Verificar conexión                |

---

## Integración con el Sistema

### Relaciones con Otros Módulos

El módulo de Ubicaciones se relaciona con:

1. **Muestras**: Cada muestra puede tener una ubicación de almacenamiento
2. **Reactivos**: Los reactivos se almacenan en ubicaciones específicas
3. **Pipetas**: Las pipetas tienen ubicaciones asignadas
4. **Máquinas**: Los equipos se ubican en lugares específicos
5. **Productos**: El inventario se organiza por ubicaciones

### Ejemplo de Integración con Muestras

```typescript
interface Muestra {
  id: number
  codigo: string
  // ... otros campos
  id_ubicacion?: number  // FK a dim_ubicacion
}

// En el formulario de muestra:
const { data: ubicaciones } = useUbicaciones()

<select name="id_ubicacion">
  {ubicaciones?.map(ub => (
    <option key={ub.id} value={ub.id}>
      {ub.codigo} - {ub.ubicacion}
    </option>
  ))}
</select>
```

---

## Casos de Uso en Laboratorio

### Caso 1: Almacenamiento de Muestras

Una muestra de sangre llega al laboratorio:

- Se crea la muestra en el sistema
- Se asigna ubicación: `NEVERA-01`
- El técnico puede localizar rápidamente la muestra
- Se mantiene trazabilidad del almacenamiento

### Caso 2: Gestión de Reactivos

Un reactivo necesita refrigeración:

- Se registra el reactivo
- Se asigna ubicación: `NEVERA-REACTIVOS-A`
- El sistema alerta si se mueve de esa ubicación
- Control de inventario por ubicación

### Caso 3: Organización de Equipos

Una PCR se instala en el laboratorio:

- Se registra la máquina
- Se asigna ubicación: `SALA-PCR-EQUIPO-02`
- Los técnicos saben dónde encontrarla
- Programación de mantenimiento por ubicación

### Caso 4: Auditorías de Calidad

Durante una auditoría:

- Se requiere localizar todas las muestras de un estudio
- El sistema filtra por ubicación
- Se genera reporte de ubicaciones
- Cumplimiento normativo garantizado

---

## Ubicaciones Comunes

### Ejemplos de Códigos de Ubicaciones

#### Neveras y Congeladores

- `NEVERA-01` - Nevera principal laboratorio
- `NEVERA-02` - Nevera auxiliar sala B
- `NEVERA-REACTIVOS` - Nevera exclusiva reactivos
- `CONGELADOR-20` - Congelador -20°C
- `CONGELADOR-80` - Congelador -80°C ultrabajo
- `ULTRACONGELADOR` - Congelador -150°C criogénico

#### Armarios y Estanterías

- `ARMARIO-A` - Armario A material general
- `ARMARIO-B` - Armario B consumibles
- `ARMARIO-REACTIVOS` - Armario reactivos secos
- `ESTANTERIA-01` - Estantería sala principal
- `VITRINA-ESTERIL` - Vitrina material estéril

#### Salas y Áreas

- `SALA-PCR` - Sala PCR equipos moleculares
- `SALA-PROC` - Sala procesamiento muestras
- `AREA-RECEPCION` - Área recepción muestras
- `SALA-SEROLOGIA` - Sala serología
- `SALA-MICROBIOLOGIA` - Sala microbiología

#### Equipos Específicos

- `CENTRIFUGA-01` - Ubicación centrifuga 1
- `LECTOR-ELISA` - Ubicación lector ELISA
- `EXTRACTOR-ADN` - Ubicación extractor ADN
- `TERMOCICLADOR-A` - Termociclador A

#### Archivos y Almacenes

- `ARCHIVO-MUESTRAS` - Archivo muestras procesadas
- `ALMACEN-GENERAL` - Almacén general
- `ALMACEN-FRIO` - Cámara frigorífica
- `CONTENEDOR-01` - Contenedor nitrógeno líquido

---

## Mejores Prácticas

### Nomenclatura de Códigos

1. **Usar prefijos descriptivos**: `NEVERA-`, `SALA-`, `ARMARIO-`
2. **Numeración secuencial**: `-01`, `-02`, `-A`, `-B`
3. **Nombres cortos y claros**: Máximo 20 caracteres
4. **Evitar caracteres especiales**: Solo letras, números y guiones
5. **Mayúsculas consistentes**: Todo en mayúsculas o minúsculas

### Gestión de Ubicaciones

1. **No eliminar ubicaciones en uso**: Verificar que no haya elementos asignados
2. **Actualizar descripciones**: Mantener información actualizada
3. **Categorización lógica**: Agrupar ubicaciones por tipo/área
4. **Documentar cambios**: Registrar movimientos de ubicaciones
5. **Auditorías periódicas**: Verificar ubicaciones físicas vs sistema

### Performance

1. **Paginación**: Para laboratorios con muchas ubicaciones
2. **Cache**: Aprovechar el sistema de cache de React Query
3. **Lazy loading**: Cargar datos solo cuando sea necesario
4. **Búsqueda eficiente**: Indexar campos de búsqueda frecuente

---

## Testing

### Tests Unitarios

```typescript
describe('UbicacionForm', () => {
  it('valida que el código sea obligatorio', async () => {
    // Test validación Zod
  })

  it('envía datos correctamente al crear', async () => {
    // Test mutación createUbicacion
  })

  it('deshabilita botón guardar si no hay cambios', () => {
    // Test isDirty en modo edición
  })
})

describe('useCreateUbicacion', () => {
  it('invalida cache tras crear ubicación', async () => {
    // Test invalidación de queries
  })
})
```

### Tests de Integración

```typescript
describe('Flujo completo de Ubicaciones', () => {
  it('permite crear, editar y eliminar una ubicación', async () => {
    // 1. Crear ubicación
    // 2. Verificar en lista
    // 3. Editar ubicación
    // 4. Verificar cambios
    // 5. Eliminar ubicación
    // 6. Verificar que no existe
  })
})
```

---

## Troubleshooting

### Problema: Ubicación no se crea

**Síntomas**: Al hacer clic en "Crear ubicación", no pasa nada o hay error.

**Posibles causas**:

1. Campo código vacío → Completar campo obligatorio
2. Código duplicado → Usar código único
3. Error de red → Verificar conexión a API
4. Error de servidor → Revisar logs

**Solución**:

```typescript
// Revisar consola del navegador
// Verificar respuesta de la API
// Comprobar validación del formulario
```

### Problema: No se puede eliminar ubicación

**Síntomas**: Error al intentar eliminar una ubicación.

**Posibles causas**:

1. Ubicación en uso por otras entidades
2. Permisos insuficientes
3. Integridad referencial de BD

**Solución**:

- Verificar que no haya muestras/reactivos/equipos asignados
- Reasignar elementos a otra ubicación
- Luego eliminar la ubicación

### Problema: Búsqueda no funciona

**Síntomas**: El filtro de búsqueda no muestra resultados esperados.

**Posibles causas**:

1. Datos no cargados completamente
2. Filtro mal configurado
3. Mayúsculas/minúsculas

**Solución**:

```typescript
// Verificar que useUbicaciones() haya terminado de cargar
// El filtro es case-insensitive por defecto
// Revisar configuración de filterConfig
```

---

## Roadmap

### Próximas Funcionalidades

1. **Capacidad de almacenamiento**
   - Definir capacidad máxima por ubicación
   - Alertas cuando se alcance el límite
   - Indicador visual de ocupación

2. **Jerarquía de ubicaciones**
   - Ubicaciones padre-hijo
   - Navegación tipo árbol
   - Ejemplo: `SALA-A > NEVERA-01 > ESTANTE-1 > CAJON-A`

3. **Mapas visuales**
   - Plano del laboratorio
   - Click en ubicación para ver detalles
   - Navegación visual

4. **Historial de movimientos**
   - Registro de cambios de ubicación
   - Auditoría completa
   - Trazabilidad temporal

5. **Códigos QR**
   - Generar QR por ubicación
   - Escaneo para acceso rápido
   - Impresión de etiquetas

6. **Alertas de temperatura**
   - Integración con sensores
   - Notificaciones si temperatura fuera de rango
   - Dashboard de monitoreo

7. **Exportación de datos**
   - Excel con listado de ubicaciones
   - PDF con códigos QR
   - Informes de auditoría

8. **Reserva de ubicaciones**
   - Bloquear ubicación temporalmente
   - Asignación futura
   - Calendario de uso

---

## Conclusión

El módulo de **Ubicaciones** es esencial para la organización y trazabilidad en el sistema LIMS. Proporciona:

✅ **CRUD completo** con validaciones robustas  
✅ **Búsqueda eficiente** multi-campo  
✅ **Confirmaciones** para acciones destructivas  
✅ **Notificaciones** claras de éxito/error  
✅ **Integración** con otros módulos del sistema  
✅ **Arquitectura escalable** basada en React Query  
✅ **UX consistente** con el resto de la aplicación

### Puntos Clave

1. **Código único obligatorio**: Identifica cada ubicación de forma inequívoca
2. **Descripción opcional**: Permite añadir contexto adicional
3. **Sistema de confirmación**: Previene eliminaciones accidentales
4. **Cache inteligente**: Mantiene datos sincronizados automáticamente
5. **Validación en dos niveles**: Cliente (Zod) y servidor

### Mantenimiento

- Revisar periódicamente ubicaciones sin uso
- Actualizar descripciones cuando cambien espacios físicos
- Realizar auditorías de coherencia sistema-realidad
- Capacitar usuarios en nomenclatura estándar
- Documentar cambios importantes en ubicaciones

---

**Documentación generada para el Sistema LIMS - Módulo Ubicaciones**  
**Versión**: 1.0  
**Fecha**: Octubre 2025  
**Autor**: Sistema de Documentación Automática
