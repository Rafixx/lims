# 🎯 CRUD Modules - Quick Reference

## ✅ Módulos Implementados

### 1. **Centros** ✅

- **Campos:** codigo (requerido), descripcion (opcional)
- **Rutas:** `/centros`, `/centros/nuevo`, `/centros/:id/editar`
- **Estado:** Completo

### 2. **Clientes** ✅

- **Campos:** nombre (requerido), razon_social, nif, direccion (opcionales)
- **Rutas:** `/clientes`, `/clientes/nuevo`, `/clientes/:id/editar`
- **Estado:** Completo

### 3. **Criterios de Validación** ✅

- **Campos:** codigo (requerido), descripcion (requerida)
- **Rutas:** `/criterios-validacion`, `/criterios-validacion/nuevo`, `/criterios-validacion/:id/editar`
- **Estado:** Completo

---

## 📦 Estructura de Archivos (Patrón)

```
src/features/dim_tables/[entidad]/
├── components/
│   ├── [Entidad]Card.tsx          (ya existe)
│   └── [Entidad]Form.tsx          ✅ NUEVO
├── pages/
│   ├── [Entidades]Page.tsx        🔄 Actualizado (confirmación)
│   ├── Create[Entidad]Page.tsx    ✅ NUEVO
│   └── Edit[Entidad]Page.tsx      ✅ NUEVO
└── index.ts                       🔄 Actualizado (exports)
```

---

## 🔧 Servicios y Hooks (Patrón)

### `dim_tables.services.ts`

```typescript
async get[Entidades]()
async get[Entidad](id: number)
async create[Entidad](data: Omit<[Entidad], 'id'>)         ✅
async update[Entidad](id: number, data: Partial<...>)      ✅
async delete[Entidad](id: number)                          ✅
```

### `useDim_tables.ts`

```typescript
use[Entidades]()
use[Entidad](id: number)
useCreate[Entidad]()                                       ✅
useUpdate[Entidad]()                                       ✅
useDelete[Entidad]()                                       ✅
```

---

## 🛣️ Rutas (Patrón)

```typescript
{ path: '[entidades]', element: <[Entidades]Page /> }
{ path: '[entidades]/nuevo', element: <Create[Entidad]Page /> }         ✅
{ path: '[entidades]/:id/editar', element: <Edit[Entidad]Page /> }      ✅
```

---

## 🎨 Componentes Requeridos

### 1. **[Entidad]Form.tsx**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreate[Entidad], useUpdate[Entidad] } from '@/shared/hooks/useDim_tables'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

const [entidad]Schema = z.object({ /* campos */ })

export const [Entidad]Form = ({ initialData }) => {
  // Lógica del formulario
}
```

### 2. **Create[Entidad]Page.tsx**

```typescript
import { [Entidad]Form } from '../components/[Entidad]Form'
import { ArrowLeft } from 'lucide-react'

export const Create[Entidad]Page = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <button onClick={() => navigate('/[entidades]')}>
          <ArrowLeft size={20} />
          Volver
        </button>
        <h1>Nuevo [Entidad]</h1>
      </div>
      <div className="bg-background rounded-lg shadow-soft border border-border p-6">
        <[Entidad]Form />
      </div>
    </div>
  )
}
```

### 3. **Edit[Entidad]Page.tsx**

```typescript
import { use[Entidad] } from '@/shared/hooks/useDim_tables'
import { Loader2 } from 'lucide-react'

export const Edit[Entidad]Page = () => {
  const { id } = useParams()
  const { data, isLoading, error } = use[Entidad](parseInt(id))

  if (isLoading) return <Loader />
  if (error) return <Error />

  return <[Entidad]Form initialData={data} />
}
```

### 4. **[Entidades]Page.tsx** (Actualizar)

```typescript
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useDelete[Entidad] } from '@/shared/hooks/useDim_tables'

const deleteMutation = useDelete[Entidad]()
const { confirm } = useConfirmation()
const { notify } = useNotification()

const handlers = {
  onNew: () => navigate('/[entidades]/nuevo'),
  onEdit: (item) => navigate(`/[entidades]/${item.id}/editar`),
  onDelete: async (item) => {
    const isConfirmed = await confirm({
      title: 'Eliminar [Entidad]',
      message: `¿Está seguro de eliminar...?`,
      type: 'danger'
    })

    if (!isConfirmed) return

    try {
      await deleteMutation.mutateAsync(item.id)
      notify('Eliminado correctamente', 'success')
      refetch()
    } catch (error) {
      notify('Error al eliminar', 'error')
    }
  }
}
```

---

## 📋 Checklist de Implementación

Para cada nuevo módulo CRUD:

### Backend/Servicios

- [ ] `create[Entidad]()` en `dim_tables.services.ts`
- [ ] `update[Entidad]()` en `dim_tables.services.ts`
- [ ] `delete[Entidad]()` en `dim_tables.services.ts`
- [ ] `useCreate[Entidad]()` en `useDim_tables.ts`
- [ ] `useUpdate[Entidad]()` en `useDim_tables.ts`
- [ ] `useDelete[Entidad]()` en `useDim_tables.ts`

### Frontend/Componentes

- [ ] `[Entidad]Form.tsx` component
- [ ] `Create[Entidad]Page.tsx` page
- [ ] `Edit[Entidad]Page.tsx` page
- [ ] Actualizar `[Entidades]Page.tsx` con confirmación

### Configuración

- [ ] Actualizar `index.ts` con exports
- [ ] Agregar rutas en `routes.tsx`
- [ ] Crear documentación en `src/_md`

### Testing Manual

- [ ] Crear funciona correctamente
- [ ] Editar carga y guarda datos
- [ ] Eliminar muestra confirmación
- [ ] Notificaciones funcionan
- [ ] Navegación correcta

---

## 🎯 Módulos Pendientes

| Módulo            | Prioridad | Campos Principales              |
| ----------------- | --------- | ------------------------------- |
| **Pacientes**     | 🔴 Alta   | nombre, sip, direccion          |
| **Ubicaciones**   | 🟡 Media  | codigo, ubicacion               |
| **Maquinas**      | 🟡 Media  | codigo, maquina, perfil_termico |
| **Pipetas**       | 🟢 Baja   | codigo, modelo, zona            |
| **Reactivos**     | 🟢 Baja   | num_referencia, reactivo, lote  |
| **Tipos Muestra** | 🟡 Media  | cod_tipo_muestra, tipo_muestra  |

---

## 💡 Tips Importantes

### 1. Validación con Zod

```typescript
const schema = z.object({
  campo_requerido: z.string().min(1, 'Es obligatorio'),
  campo_opcional: z.string().optional()
})
```

### 2. Importación de useConfirmation

```typescript
// ✅ Correcto
import { useConfirmation } from '@/shared/components/Confirmation/ConfirmationContext'

// ❌ Incorrecto
import { useConfirmation } from '@/shared/components/Confirmation'
```

### 3. Manejo de Errores

```typescript
try {
  await mutation.mutateAsync(data)
  notify('Éxito', 'success')
} catch (error) {
  notify(error instanceof Error ? error.message : 'Error', 'error')
}
```

### 4. Navegación después de Guardar

```typescript
navigate('/[entidades]') // Siempre volver a la lista
```

---

## 🚀 Tiempo Estimado por Módulo

- **Servicios y Hooks:** ~10 min
- **Form Component:** ~15 min
- **Pages (Create + Edit):** ~10 min
- **Actualizar Page Lista:** ~10 min
- **Rutas y Exports:** ~5 min
- **Documentación:** ~10 min

**Total por módulo:** ~60 minutos

---

## 📊 Progreso General

```
✅ Centros               [████████████████████] 100%
✅ Clientes              [████████████████████] 100%
✅ Criterios Validación  [████████████████████] 100%
⬜ Pacientes             [░░░░░░░░░░░░░░░░░░░░]   0%
⬜ Ubicaciones           [░░░░░░░░░░░░░░░░░░░░]   0%
⬜ Maquinas              [░░░░░░░░░░░░░░░░░░░░]   0%
⬜ Pipetas               [░░░░░░░░░░░░░░░░░░░░]   0%
⬜ Reactivos             [░░░░░░░░░░░░░░░░░░░░]   0%
⬜ Tipos Muestra         [░░░░░░░░░░░░░░░░░░░░]   0%

Completados: 3/9 (33%)
```

---

## 🎉 Sistema de Confirmación

Todos los módulos usan el mismo sistema de confirmación:

```typescript
const isConfirmed = await confirm({
  title: 'Título',
  message: 'Mensaje detallado',
  confirmText: 'Sí, eliminar',
  cancelText: 'Cancelar',
  type: 'danger' // 'danger' | 'warning' | 'info' | 'success'
})
```

**Ubicación:** `@/shared/components/Confirmation/ConfirmationContext`

---

**✨ Patrón establecido y funcionando para todos los módulos**
