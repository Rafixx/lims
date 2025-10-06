# 🚀 Guía de Integración del Sistema de Confirmación

## Paso 1: Agregar el Provider en main.tsx

Actualiza `/src/main.tsx` para incluir el `ConfirmationProvider`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './shared/routes/routes'
import { UserProvider } from './shared/contexts/UserContext'
import { NotificationProvider } from './shared/components/Notification/NotificationContext'
// ✨ AGREGAR ESTA LÍNEA
import { ConfirmationProvider } from './shared/components/Confirmation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './index.css'
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationProvider>
      {/* ✨ ENVOLVER CON ConfirmationProvider */}
      <ConfirmationProvider>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </UserProvider>
      </ConfirmationProvider>
    </NotificationProvider>
  </React.StrictMode>
)
```

## Paso 2: Verificar las animaciones en tailwind.config.js

Asegúrate de que existen las animaciones necesarias en tu `tailwind.config.js`:

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

## Paso 3: Usar en tus componentes

### Ejemplo básico en CentrosPage.tsx

Reemplaza el `window.confirm` existente con el nuevo sistema:

```tsx
import { useConfirmation } from '@/shared/components/Confirmation'
import { useNotification } from '@/shared/components/Notification/NotificationContext'

export const CentrosPage = () => {
  const { confirm } = useConfirmation()
  const { notify } = useNotification()
  const deleteMutation = useDeleteCentro()

  const onDelete = async (centro: Centro) => {
    const isConfirmed = await confirm({
      title: 'Eliminar Centro',
      message: `¿Está seguro de eliminar el centro "${centro.codigo}"?`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (!isConfirmed) return

    try {
      await deleteMutation.mutateAsync(centro.id)
      notify('Centro eliminado correctamente', 'success')
    } catch (error) {
      notify('Error al eliminar el centro', 'error')
    }
  }
}
```

## 🎨 Tipos de confirmación disponibles

### Danger (Eliminaciones)

```tsx
await confirm({
  message: '¿Eliminar este registro?',
  type: 'danger'
})
```

### Warning (Acciones con consecuencias)

```tsx
await confirm({
  message: '¿Continuar con esta acción?',
  type: 'warning'
})
```

### Info (Confirmaciones informativas)

```tsx
await confirm({
  message: '¿Guardar los cambios?',
  type: 'info'
})
```

### Success (Confirmaciones positivas)

```tsx
await confirm({
  message: '¿Confirmar la operación?',
  type: 'success'
})
```

## ✅ Checklist de integración

- [ ] Agregar `ConfirmationProvider` en `main.tsx`
- [ ] Verificar animaciones en `tailwind.config.js`
- [ ] Importar `useConfirmation` en componentes que lo necesiten
- [ ] Reemplazar `window.confirm` por `confirm()`
- [ ] Agregar notificaciones de éxito/error después de las acciones
- [ ] Probar en navegador

## 🔧 Solución de problemas

### El diálogo no aparece

- Verifica que el `ConfirmationProvider` esté correctamente agregado
- Asegúrate de estar usando `await` con `confirm()`

### Las animaciones no funcionan

- Verifica que las animaciones estén en `tailwind.config.js`
- Reinicia el servidor de desarrollo después de modificar Tailwind

### Error "useConfirmation must be used within..."

- El componente debe estar dentro del árbol de `ConfirmationProvider`
- Verifica la estructura de providers en `main.tsx`
