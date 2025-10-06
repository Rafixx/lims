# Sistema de Confirmación de Usuario

Sistema de diálogos de confirmación para mantener coherencia visual con las notificaciones existentes.

## 📦 Instalación

El sistema ya está creado en `src/shared/components/Confirmation/`

## 🚀 Configuración

### 1. Agregar el Provider en tu aplicación

Envuelve tu aplicación con `ConfirmationProvider` junto con `NotificationProvider`:

```tsx
import { NotificationProvider } from '@/shared/components/Notification/NotificationContext'
import { ConfirmationProvider } from '@/shared/components/Confirmation'

function App() {
  return (
    <NotificationProvider>
      <ConfirmationProvider>{/* Tu aplicación */}</ConfirmationProvider>
    </NotificationProvider>
  )
}
```

## 💻 Uso

### Uso básico

```tsx
import { useConfirmation } from '@/shared/components/Confirmation'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

function MiComponente() {
  const { confirm } = useConfirmation()
  const { notify } = useNotification()

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      message: '¿Desea eliminar el registro?'
    })

    if (isConfirmed) {
      // Realizar la eliminación
      await deleteRecord()
      notify('Registro eliminado correctamente', 'success')
    }
  }

  return <button onClick={handleDelete}>Eliminar</button>
}
```

### Configuración personalizada

```tsx
const isConfirmed = await confirm({
  title: '¡Atención!',
  message: '¿Desea eliminar este centro? Esta acción no se puede deshacer.',
  confirmText: 'Sí, eliminar',
  cancelText: 'No, cancelar',
  type: 'danger'
})
```

## 🎨 Tipos de confirmación

El sistema soporta 4 tipos visuales:

### `danger` (predeterminado para eliminaciones)

```tsx
await confirm({
  message: '¿Eliminar este elemento?',
  type: 'danger',
  confirmText: 'Eliminar'
})
```

### `warning` (predeterminado)

```tsx
await confirm({
  message: '¿Continuar con esta acción?',
  type: 'warning'
})
```

### `info`

```tsx
await confirm({
  message: '¿Desea guardar los cambios?',
  type: 'info'
})
```

### `success`

```tsx
await confirm({
  message: '¿Confirmar la operación?',
  type: 'success'
})
```

## 📋 Opciones disponibles

| Opción        | Tipo                                           | Default            | Descripción                     |
| ------------- | ---------------------------------------------- | ------------------ | ------------------------------- |
| `message`     | `string`                                       | **requerido**      | Mensaje principal del diálogo   |
| `title`       | `string`                                       | `'¿Estás seguro?'` | Título del diálogo              |
| `confirmText` | `string`                                       | `'Confirmar'`      | Texto del botón de confirmación |
| `cancelText`  | `string`                                       | `'Cancelar'`       | Texto del botón de cancelación  |
| `type`        | `'danger' \| 'warning' \| 'info' \| 'success'` | `'warning'`        | Tipo visual del diálogo         |

## 🎯 Ejemplo completo con lista

```tsx
import { Trash2 } from 'lucide-react'
import { useConfirmation } from '@/shared/components/Confirmation'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useDeleteCentro } from '@/shared/hooks/useDim_tables'

export const CentrosList = () => {
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const deleteMutation = useDeleteCentro()

  const handleDelete = async (id: number, codigo: string) => {
    const isConfirmed = await confirm({
      title: 'Eliminar Centro',
      message: `¿Está seguro de eliminar el centro "${codigo}"? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (isConfirmed) {
      try {
        await deleteMutation.mutateAsync(id)
        notify('Centro eliminado correctamente', 'success')
      } catch (error) {
        notify('Error al eliminar el centro', 'error')
      }
    }
  }

  return (
    <div>
      {/* Lista de centros */}
      <button onClick={() => handleDelete(1, 'CENTRO-001')}>
        <Trash2 size={16} />
        Eliminar
      </button>
    </div>
  )
}
```

## ✨ Características

- ✅ **Promise-based**: Usa async/await para flujo natural
- ✅ **Coherencia visual**: Mantiene el estilo de las notificaciones
- ✅ **Accesible**: Cierre con ESC, click fuera, y botón X
- ✅ **Animaciones**: Entrada suave con fade-in y scale
- ✅ **Iconos contextuales**: Cada tipo tiene su icono apropiado
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **TypeScript**: Completamente tipado

## 🎬 Animaciones

Las animaciones se manejan con clases de Tailwind:

- `animate-fade-in`: Para el backdrop
- `animate-scale-in`: Para el diálogo

Si no están definidas, agrégalas a tu `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      }
    }
  }
}
```

## 🔧 Integración con formularios existentes

Puedes integrar fácilmente con formularios como `CentroForm.tsx`:

```tsx
// En la lista de centros
const handleEdit = async (centro: Centro) => {
  if (hasUnsavedChanges) {
    const shouldContinue = await confirm({
      message: 'Tiene cambios sin guardar. ¿Desea continuar?',
      type: 'warning'
    })

    if (!shouldContinue) return
  }

  navigate(`/centros/editar/${centro.id}`)
}
```
