# WorkList Feature

Este módulo implementa la funcionalidad de lista de trabajo (worklist) para el sistema LIMS, permitiendo la gestión y seguimiento de técnicas pendientes asociadas a muestras de laboratorio.

## Estructura

```
src/features/workList/
├── components/
│   ├── TecnicaCard.tsx          # Tarjeta para mostrar técnicas agrupadas
│   ├── MuestraDetailCard.tsx    # Detalle de muestra con asignación de técnico
│   └── WorklistStats.tsx        # Estadísticas del worklist
├── hooks/
│   ├── useWorklist.ts           # Hooks para manejo de datos del worklist
│   └── useTecnicosLab.ts        # Hook para obtener técnicos de laboratorio
├── interfaces/
│   └── worklist.types.ts        # Tipos y interfaces TypeScript
├── pages/
│   └── WorkListPage.tsx         # Página principal del worklist
├── services/
│   └── worklistService.ts       # Servicios para comunicación con API
└── index.ts                     # Exportaciones del módulo
```

## Funcionalidades

### 1. Vista Principal

- **Estadísticas**: Muestra métricas clave como técnicas pendientes, en progreso, completadas y procesos activos
- **Lista de Técnicas**: Técnicas agrupadas por proceso con contadores
- **Detalle de Muestras**: Vista detallada de muestras asociadas a cada técnica

### 2. Gestión de Técnicas

- **Asignación de Técnicos**: Permite asignar técnicos responsables a cada técnica
- **Control de Estados**: Cambio de estado de técnicas (pendiente → en progreso → completada)
- **Seguimiento en Tiempo Real**: Actualización automática cada 30 segundos

### 3. Endpoints Utilizados

| Endpoint                                 | Descripción                                         |
| ---------------------------------------- | --------------------------------------------------- |
| `GET /api/worklist/tecnicas-pendientes`  | Obtiene todas las técnicas pendientes               |
| `GET /api/worklist/tecnicas-agrupadas`   | Técnicas agrupadas por proceso con conteos          |
| `GET /api/worklist/tecnicas-con-proceso` | Técnicas pendientes con información del proceso     |
| `GET /api/worklist/estadisticas`         | Estadísticas completas del worklist                 |
| `GET /api/worklist/procesos-pendientes`  | Procesos que tienen técnicas pendientes             |
| `GET /api/worklist/conteo`               | Conteo total de técnicas pendientes                 |
| `GET /api/worklist/proceso/:id/tecnicas` | Técnicas pendientes para un proceso específico      |
| `GET /api/worklist/proceso/:id/existe`   | Valida si existe un proceso con técnicas pendientes |

## Uso

### Importación

```typescript
import { WorkListPage, useWorklist, TecnicaCard } from '@/features/workList'
```

### Hooks Principales

#### useWorklist

```typescript
const {
  useTecnicasPendientes,
  useTecnicasAgrupadasPorProceso,
  useWorklistStats,
  useAsignarTecnico,
  useIniciarTecnica,
  useCompletarTecnica
} = useWorklist()
```

#### useTecnicosLab

```typescript
const { data: tecnicos, isLoading } = useTecnicosLab()
```

### Componentes

#### TecnicaCard

```typescript
<TecnicaCard
  tecnica={tecnicaAgrupada}
  onClick={handleSelectProceso}
  isSelected={selectedProcesoId === tecnica.id_tecnica_proc}
/>
```

#### MuestraDetailCard

```typescript
<MuestraDetailCard
  tecnica={tecnicaConMuestra}
  tecnicos={tecnicos}
  onAsignarTecnico={handleAsignarTecnico}
  onIniciarTecnica={handleIniciarTecnica}
  onCompletarTecnica={handleCompletarTecnica}
/>
```

## Tipos de Datos

### TecnicaPendiente

```typescript
interface TecnicaPendiente {
  id_tecnica: number
  id_muestra: number
  id_tecnica_proc: number
  id_tecnico_resp: number | null
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada'
  // ... otros campos
}
```

### WorklistStats

```typescript
interface WorklistStats {
  total_tecnicas_pendientes: number
  total_procesos: number
  total_tecnicas_en_progreso: number
  total_tecnicas_completadas_hoy: number
  promedio_tiempo_procesamiento: number | null
}
```

## Estados y Flujo de Trabajo

1. **Pendiente**: Técnica creada pero sin técnico asignado
2. **Asignada**: Técnico responsable asignado
3. **En Progreso**: Técnica iniciada por el técnico
4. **Completada**: Técnica finalizada

## Características Técnicas

- **Cache inteligente**: Datos válidos por 30 segundos para técnicas, 5 minutos para técnicos
- **Optimistic Updates**: Actualizaciones inmediatas en UI con rollback en caso de error
- **Loading States**: Estados de carga específicos para cada sección
- **Error Handling**: Manejo robusto de errores con notificaciones al usuario
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla
