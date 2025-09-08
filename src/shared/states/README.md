# 🎯 Sistema Centralizado de Estados LIMS

## 📋 Resumen

Este sistema proporciona una gestión centralizada y consistente de todos los estados de la aplicación LIMS, incluyendo colores, transiciones válidas, y comportamientos estandarizados.

## 🏗️ Arquitectura

```
src/shared/
├── constants/
│   └── appStates.ts          # ✅ Definición central de estados
├── utils/
│   └── stateHelpers.ts       # ✅ Utilidades y validaciones
├── hooks/
│   └── useStateManager.ts    # ✅ Hook de gestión avanzada
├── components/atoms/
│   └── EstadoBadge.tsx       # ✅ Componente visual
├── states/
│   └── index.ts              # ✅ Punto de entrada único
└── examples/
    └── SolicitudCardEjemplo.tsx # ✅ Ejemplo de uso
```

## 🎨 Estados Definidos

### Solicitudes

- `PENDIENTE` - Amarillo/Amber
- `EN_PROCESO` - Azul/Blue
- `COMPLETADA` - Verde/Green
- `CANCELADA` - Gris/Gray
- `RECHAZADA` - Rojo/Red

### Técnicas

- `PENDIENTE_TECNICA` - Amarillo/Amber
- `EN_PROGRESO` - Azul/Blue
- `COMPLETADA_TECNICA` - Verde/Green
- `CANCELADA_TECNICA` - Gris/Gray
- `BLOQUEADA` - Naranja/Orange

### Muestras

- `RECIBIDA` - Verde claro
- `EN_PROCESAMIENTO` - Azul
- `PROCESADA` - Verde
- `RECHAZADA_MUESTRA` - Rojo
- `CADUCADA` - Gris oscuro

## 🚀 Uso Básico

### 1. Importar el Sistema

```typescript
// Importación completa
import { EstadoBadge, APP_STATES, getEstadoConfig, useStateManager } from '@/shared/states'

// Importación específica
import { Estados, ConfiguracionEstados } from '@/shared/states'
```

### 2. Usar el Badge de Estado

```tsx
import { EstadoBadge, APP_STATES } from '@/shared/states'

// Badge básico
<EstadoBadge
  estado={APP_STATES.SOLICITUD.PENDIENTE}
  size="md"
  showIcon={true}
  showTooltip={true}
/>

// Badge clickeable
<EstadoBadge
  estado={solicitud.estado}
  onClick={() => cambiarEstado(solicitud)}
  className="cursor-pointer hover:scale-105"
/>
```

### 3. Validar Transiciones

```typescript
import { esTransicionValida, getEstadosPermitidos } from '@/shared/states'

// Validar si un cambio es permitido
const puedeTransicionar = esTransicionValida(
  APP_STATES.SOLICITUD.PENDIENTE,
  APP_STATES.SOLICITUD.EN_PROCESO
) // ✅ true

// Obtener estados permitidos
const estadosValidos = getEstadosPermitidos(APP_STATES.SOLICITUD.PENDIENTE)
// ['EN_PROCESO', 'CANCELADA', 'RECHAZADA']
```

### 4. Hook de Gestión de Estados

```typescript
import { useStateManager, APP_STATES } from '@/shared/states'

const MiComponente = () => {
  const {
    currentState,
    config,
    setState,
    allowedStates,
    canTransitionTo,
    history,
    undo
  } = useStateManager({
    initialState: APP_STATES.SOLICITUD.PENDIENTE,
    onStateChange: (newState, oldState) => {
      console.log(`Estado cambió: ${oldState} → ${newState}`)
    }
  })

  return (
    <div>
      <EstadoBadge estado={currentState} />

      {allowedStates.map(estado => (
        <button
          key={estado}
          onClick={() => setState(estado)}
          disabled={!canTransitionTo(estado)}
        >
          Cambiar a {estado}
        </button>
      ))}

      {history.length > 1 && (
        <button onClick={undo}>Deshacer</button>
      )}
    </div>
  )
}
```

### 5. Análisis de Estados

```typescript
import { useStateAnalytics, getEstadisticasEstados } from '@/shared/states'

const MiComponenteAnalisis = ({ solicitudes }: { solicitudes: Solicitud[] }) => {
  const {
    estadisticas,
    conteos,
    estadosOrdenados,
    itemsPorPrioridad
  } = useStateAnalytics(solicitudes, (s) => s.estado)

  return (
    <div>
      <h3>Estadísticas de Estados</h3>
      {estadisticas.map(({ estado, cantidad, config, porcentaje }) => (
        <div key={estado} className="flex items-center gap-2">
          <EstadoBadge estado={estado} size="sm" />
          <span>{cantidad} ({porcentaje}%)</span>
        </div>
      ))}

      {/* Solicitudes ordenadas por prioridad */}
      <h3>Por Prioridad</h3>
      {itemsPorPrioridad.map(solicitud => (
        <SolicitudCard key={solicitud.id} solicitud={solicitud} />
      ))}
    </div>
  )
}
```

## 🎛️ Personalización

### Agregar Nuevos Estados

```typescript
// En src/shared/constants/appStates.ts

export const APP_STATES = {
  // ... estados existentes

  // Nuevo módulo
  REPORTE: {
    BORRADOR: 'BORRADOR',
    REVISION: 'REVISION',
    APROBADO: 'APROBADO',
    PUBLICADO: 'PUBLICADO'
  }
} as const

// Agregar configuración visual
export const ESTADOS_CONFIG: Record<string, EstadoConfig> = {
  // ... configuraciones existentes

  [APP_STATES.REPORTE.BORRADOR]: {
    label: 'Borrador',
    description: 'Reporte en edición',
    color: 'gray',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-800',
    icon: 'FileEdit',
    priority: 3
  }
}

// Definir transiciones
export const ESTADO_TRANSICIONES: Record<string, string[]> = {
  // ... transiciones existentes

  [APP_STATES.REPORTE.BORRADOR]: [APP_STATES.REPORTE.REVISION],
  [APP_STATES.REPORTE.REVISION]: [APP_STATES.REPORTE.APROBADO, APP_STATES.REPORTE.BORRADOR]
}
```

### Personalizar Colores

```typescript
// Themes personalizados
const THEME_CONFIG = {
  dark: {
    [APP_STATES.SOLICITUD.PENDIENTE]: {
      bgColor: 'bg-amber-900',
      textColor: 'text-amber-100',
      borderColor: 'border-amber-800'
    }
  }
}
```

## 🧪 Testing

```typescript
import { esTransicionValida, getEstadoConfig } from '@/shared/states'

describe('Sistema de Estados', () => {
  test('debe validar transiciones correctamente', () => {
    expect(esTransicionValida('PENDIENTE', 'EN_PROCESO')).toBe(true)
    expect(esTransicionValida('COMPLETADA', 'PENDIENTE')).toBe(false)
  })

  test('debe obtener configuración de estado', () => {
    const config = getEstadoConfig('PENDIENTE')
    expect(config.label).toBe('Pendiente')
    expect(config.color).toBe('amber')
  })
})
```

## 📈 Beneficios

### ✅ Consistencia

- **Colores unificados** en toda la aplicación
- **Comportamientos estandarizados** entre módulos
- **Iconografía coherente** para cada estado

### ✅ Mantenibilidad

- **Cambios centralizados**: Un solo lugar para modificar estados
- **Validaciones automáticas**: Previene transiciones inválidas
- **Tipos seguros**: TypeScript garantiza uso correcto

### ✅ Escalabilidad

- **Fácil agregar estados**: Sistema extensible
- **Hooks reutilizables**: Lógica compartida
- **Performance optimizada**: Memoización automática

### ✅ Developer Experience

- **Autocompletado**: IntelliSense completo
- **Documentación integrada**: Tooltips descriptivos
- **Debugging facilitado**: Logs automáticos

## 🔧 Troubleshooting

### Problema: Estado no aparece

```typescript
// ❌ Incorrecto
<EstadoBadge estado="pendiente" />

// ✅ Correcto
<EstadoBadge estado={APP_STATES.SOLICITUD.PENDIENTE} />
```

### Problema: Transición inválida

```typescript
// Verificar transición antes de cambiar
if (esTransicionValida(estadoActual, nuevoEstado)) {
  cambiarEstado(nuevoEstado)
} else {
  console.warn('Transición no permitida')
}
```

### Problema: Colores no aparecen

```typescript
// Verificar que las clases de Tailwind estén incluidas
// tailwind.config.js - safelist necesaria
module.exports = {
  safelist: [
    'bg-amber-100',
    'text-amber-800',
    'border-amber-200',
    'bg-blue-100',
    'text-blue-800',
    'border-blue-200'
    // ... resto de clases de estados
  ]
}
```

## 🚀 Próximos Pasos

1. **Migrar componentes existentes** al nuevo sistema
2. **Implementar notificaciones** basadas en cambios de estado
3. **Crear dashboard** de métricas de estados
4. **Agregar estados de workflow** más complejos
5. **Integrar con backend** para sincronización de estados

---

> 💡 **Tip**: Usa siempre el import centralizado `@/shared/states` para acceder a todo el sistema de estados
