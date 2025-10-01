# Sistema de Gestión de Estados - Guía de Uso

## 📋 Descripción General

El nuevo sistema de gestión de estados proporciona una interfaz completa y reactiva para manejar los estados de entidades (Muestras y Técnicas) en el LIMS. Está basado en la API documentada en `GESTION_ESTADOS_API.md` e integra React Query para un manejo eficiente del cache y actualizaciones automáticas.

## 🏗️ Arquitectura del Sistema

### Capas Implementadas

```
┌─────────────────────────────────────────┐
│         Componentes UI (React)          │
│  IndicadorEstado, CambiarEstado, etc.   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Hooks Personalizados              │
│  useEstados, useCambiarEstado, etc.     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         React Query Layer               │
│   Caching, Invalidación, Optimización   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Servicio de API                  │
│       estadosService.ts                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Backend API                    │
│      /api/estados/...                   │
└─────────────────────────────────────────┘
```

## 🚀 Guía de Uso

### 1. Visualizar Estados

#### Indicador Individual de Estado

```tsx
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { useEstados } from '@/shared/hooks/useEstados'

function MiComponente({ estadoNombre }) {
  const { data: estadosMuestra = [] } = useEstados('MUESTRA')
  const estado = estadosMuestra.find(e => e.estado === estadoNombre)

  return (
    <div>
      <IndicadorEstado estado={estado} size="medium" showDescription />
    </div>
  )
}
```

**Props disponibles:**

- `estado`: Objeto DimEstado o null/undefined
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `showDescription`: boolean para mostrar descripción (default: false)

#### Lista de Estados

```tsx
import { ListaEstados } from '@/shared/components/atoms/IndicadorEstado'

function MiLista() {
  const { data: estados = [] } = useEstados('MUESTRA')

  return <ListaEstados estados={estados} size="small" />
}
```

### 2. Cambiar Estados

#### Formulario Completo de Cambio de Estado

```tsx
import { CambiarEstado } from '@/shared/components/organisms/CambiarEstado'

function FormularioMuestra({ muestraId, estadoActual }) {
  const handleEstadoCambiado = nuevoEstado => {
    console.log('Estado cambiado a:', nuevoEstado)
    // Actualizar tu estado local o refrescar datos
  }

  return (
    <CambiarEstado
      entidad="MUESTRA"
      itemId={muestraId}
      estadoActual={estadoActual}
      onEstadoCambiado={handleEstadoCambiado}
      onError={error => console.error(error)}
      variant="inline" // o 'modal', 'dropdown'
      size="medium"
    />
  )
}
```

**Props principales:**

- `entidad`: 'MUESTRA' | 'TECNICA'
- `itemId`: ID numérico de la entidad
- `estadoActual`: Objeto DimEstado actual (opcional)
- `onEstadoCambiado`: Callback cuando el cambio es exitoso
- `onError`: Callback cuando hay un error
- `variant`: 'inline' | 'modal' | 'dropdown'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean

#### Cambio Rápido (Dropdown)

```tsx
import { CambioRapidoEstado } from '@/shared/components/organisms/CambiarEstado'

function MiComponente({ muestraId, estadoActual }) {
  return (
    <CambioRapidoEstado
      entidad="MUESTRA"
      itemId={muestraId}
      estadoActual={estadoActual}
      onEstadoCambiado={nuevoEstado => {
        console.log('Nuevo estado:', nuevoEstado)
      }}
    />
  )
}
```

### 3. Hooks Disponibles

#### useEstados - Obtener todos los estados

```tsx
import { useEstados } from '@/shared/hooks/useEstados'

function MiComponente() {
  const { data: estados = [], isLoading, error } = useEstados('MUESTRA')

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {estados.map(estado => (
        <li key={estado.id}>{estado.estado}</li>
      ))}
    </ul>
  )
}
```

#### useEstadosDisponibles - Estados válidos para transición

```tsx
import { useEstadosDisponibles } from '@/shared/hooks/useEstados'

function MiComponente({ estadoActualId }) {
  const { data: estadosDisponibles = [], isLoading } = useEstadosDisponibles(
    'MUESTRA',
    estadoActualId
  )

  return (
    <select>
      {estadosDisponibles.map(estado => (
        <option key={estado.id} value={estado.id}>
          {estado.estado} - {estado.descripcion}
        </option>
      ))}
    </select>
  )
}
```

#### useCambiarEstado - Cambiar estado de una entidad

```tsx
import { useCambiarEstado } from '@/shared/hooks/useEstados'

function MiComponente({ muestraId }) {
  const { cambiarEstado, isLoading, error } = useCambiarEstado('MUESTRA', {
    onSuccess: resultado => {
      console.log('Estado cambiado:', resultado)
    },
    onError: error => {
      console.error('Error:', error)
    }
  })

  const handleClick = () => {
    cambiarEstado(muestraId, 5, 'Comentario opcional')
  }

  return (
    <button onClick={handleClick} disabled={isLoading}>
      Cambiar Estado
    </button>
  )
}
```

## 🎨 Estilos y Personalización

### Sistema de Colores

Los estados se visualizan con colores específicos definidos en la base de datos:

```css
/* Ejemplos de clases CSS generadas automáticamente */
.estado-indicator {
  /* Estilos base del indicador */
}

.estado-indicator.small {
  /* Tamaño pequeño */
}

.estado-indicator.medium {
  /* Tamaño mediano */
}

.estado-indicator.large {
  /* Tamaño grande */
}
```

Los colores se aplican dinámicamente desde el campo `color` de cada estado en la base de datos.

### Dark Mode

Los componentes incluyen soporte para modo oscuro:

```css
@media (prefers-color-scheme: dark) {
  .estado-indicator {
    /* Ajustes automáticos para modo oscuro */
  }
}
```

## 📊 Integración en Componentes Existentes

### Ejemplo 1: Reemplazar EstadoBadge en Cards

**Antes:**

```tsx
import { EstadoBadge } from '@/shared/states'

;<EstadoBadge estado={muestra.estado_muestra} size="sm" />
```

**Después:**

```tsx
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { useEstados } from '@/shared/hooks/useEstados'

function MuestraCard({ muestra }) {
  const { data: estadosMuestra = [] } = useEstados('MUESTRA')
  const estadoActual = estadosMuestra.find(e => e.estado === muestra.estado_muestra)

  return <IndicadorEstado estado={estadoActual} size="small" />
}
```

### Ejemplo 2: Agregar Cambio de Estado en Formularios

```tsx
import { CambioRapidoEstado } from '@/shared/components/organisms/CambiarEstado'

function MuestraForm({ muestraId, estadoActual }) {
  return (
    <div className="form-section">
      <label>Estado de la muestra:</label>
      <CambioRapidoEstado
        entidad="MUESTRA"
        itemId={muestraId}
        estadoActual={estadoActual}
        onEstadoCambiado={nuevoEstado => {
          // Actualizar formulario o mostrar notificación
          notify(`Estado actualizado a: ${nuevoEstado.estado}`, 'success')
        }}
      />
    </div>
  )
}
```

## 🔍 Demo Interactiva

Accede a la demo completa del sistema en:

```
http://localhost:5173/demo/estados
```

La demo incluye:

- Visualización de todos los componentes
- Ejemplos interactivos de cambio de estado
- Simulación de estados para Muestras y Técnicas
- Información completa del sistema

## ⚙️ Configuración y Setup

### React Query ya está configurado

El `QueryClient` ya está configurado en `main.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

// En el render:
<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Configuración Personalizada (Opcional)

Si necesitas personalizar el comportamiento de React Query:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 10, // 10 minutos
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
})
```

## 🔧 Troubleshooting

### Estados no se actualizan después del cambio

React Query invalida automáticamente las queries relacionadas. Si necesitas invalidación manual:

```tsx
import { useQueryClient } from '@tanstack/react-query'

function MiComponente() {
  const queryClient = useQueryClient()

  const refrescarEstados = () => {
    queryClient.invalidateQueries({ queryKey: ['estados', 'MUESTRA'] })
  }
}
```

### Error: "Estado no encontrado"

Asegúrate de que el nombre del estado en tu base de datos coincide exactamente con el valor que estás buscando:

```tsx
// Buscar estado ignorando case
const estadoActual = estadosMuestra.find(
  e => e.estado.toLowerCase() === muestra.estado_muestra?.toLowerCase()
)
```

### Colores no se muestran correctamente

Verifica que el campo `color` en la tabla `dim_estado` contenga valores CSS válidos:

- Formato hexadecimal: `#FF5733`
- Formato RGB: `rgb(255, 87, 51)`
- Nombres de color: `red`, `blue`, etc.

## 📚 Referencias

- **API Backend**: Ver `GESTION_ESTADOS_API.md`
- **Interfaces TypeScript**: `src/shared/interfaces/estados.types.ts`
- **Servicio de API**: `src/shared/services/estadosService.ts`
- **Hooks**: `src/shared/hooks/useEstados.ts`
- **Componentes**: `src/shared/components/atoms/IndicadorEstado.tsx`, `src/shared/components/organisms/CambiarEstado.tsx`

## 🎯 Mejores Prácticas

1. **Siempre usar hooks en lugar de llamadas directas al servicio**

   ```tsx
   // ✅ Correcto
   const { data: estados } = useEstados('MUESTRA')

   // ❌ Incorrecto
   const estados = await estadosService.getEstadosPorEntidad('MUESTRA')
   ```

2. **Manejar estados de carga y error**

   ```tsx
   const { data, isLoading, error } = useEstados('MUESTRA')

   if (isLoading) return <Spinner />
   if (error) return <ErrorMessage error={error} />
   ```

3. **Usar callbacks para acciones post-cambio**

   ```tsx
   <CambiarEstado
     onEstadoCambiado={nuevoEstado => {
       // Actualizar UI, mostrar notificación, etc.
     }}
     onError={error => {
       // Manejar error específico
     }}
   />
   ```

4. **Aprovechar el caching de React Query**
   - Los estados se cachean por 5 minutos por defecto
   - Las transiciones se invalidan automáticamente
   - No es necesario refrescar manualmente en la mayoría de casos

## 🆕 Actualizaciones Futuras

Funcionalidades planificadas:

- [ ] Historial de cambios de estado
- [ ] Notificaciones en tiempo real de cambios
- [ ] Filtros avanzados por estado en listados
- [ ] Exportación de reportes por estado
- [ ] Dashboard de estadísticas de estados

---

**Última actualización**: Octubre 2025
**Versión del sistema**: 2.0.0
