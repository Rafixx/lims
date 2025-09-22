# Sistema de Botones - Variants y Ejemplos de Uso

## 🎨 Theme Consistente

Este sistema de botones está diseñado para mantener consistencia visual en todo el proyecto LIMS con variants que cubren todos los casos de uso comunes.

## 📦 Variants Disponibles

### 🔵 **VARIANTS PRINCIPALES**

```tsx
// Acción primaria principal del sistema
<Button variant="primary">Crear Nueva Muestra</Button>

// Acciones secundarias o neutras
<Button variant="secondary">Cancelar</Button>

// Acciones importantes pero no críticas
<Button variant="accent">Generar Reporte</Button>

// Acciones destructivas o de eliminación
<Button variant="danger">Eliminar Muestra</Button>
```

### 👻 **VARIANTS SUTILES**

```tsx
// Botones discretos sin fondo
<Button variant="ghost">Ver Detalles</Button>

// Botones con borde, elegantes
<Button variant="outline">Editar</Button>

// Botones suaves con fondo ligero
<Button variant="soft">Filtrar</Button>
```

### 🎯 **VARIANTS DE ESTADO**

```tsx
// Confirmaciones y éxitos
<Button variant="success">Aprobar Resultado</Button>

// Advertencias o precaución
<Button variant="warning">Revisar Muestra</Button>

// Información o notificaciones
<Button variant="info">Ver Información</Button>
```

### ✨ **VARIANTS ESPECIALES**

```tsx
// Enlaces sin estilo de botón
<Button variant="link">Más información</Button>

// Botones circulares para iconos
<Button variant="icon">
  <Settings className="w-4 h-4" />
</Button>
```

## 📏 Tamaños Disponibles

```tsx
<Button size="xs">Extra Pequeño</Button>
<Button size="sm">Pequeño</Button>
<Button size="md">Mediano (por defecto)</Button>
<Button size="lg">Grande</Button>
<Button size="xl">Extra Grande</Button>
```

## 🔧 Características Especiales

### Loading State

```tsx
<Button loading={true}>Procesando...</Button>
```

### Full Width

```tsx
<Button fullWidth>Botón de Ancho Completo</Button>
```

### Disabled

```tsx
<Button disabled>Botón Deshabilitado</Button>
```

## 🎨 Ejemplos de Uso en el Contexto LIMS

### Página de Muestras

```tsx
// Botón principal para nueva muestra
<Button variant="primary" size="lg">
  <Plus className="w-4 h-4" />
  Nueva Muestra
</Button>

// Acciones secundarias
<Button variant="outline" size="sm">Exportar</Button>
<Button variant="ghost" size="sm">Filtros</Button>
```

### Cards de Muestra

```tsx
// Botón de edición sutil
<Button variant="soft" size="xs">
  <Edit className="w-3 h-3" />
  Editar
</Button>

// Botón de eliminación
<Button variant="danger" size="xs">
  <Trash className="w-3 h-3" />
  Eliminar
</Button>
```

### Modals y Formularios

```tsx
// Botones de confirmación
<Button variant="success" fullWidth>
  Guardar Cambios
</Button>

<Button variant="secondary" fullWidth>
  Cancelar
</Button>
```

### Estados de Carga

```tsx
<Button variant="primary" loading={isSubmitting}>
  {isSubmitting ? 'Guardando...' : 'Guardar'}
</Button>
```

## 🎨 Paleta de Colores del Theme

- **Primary**: Azul (`blue-600`) - Acciones principales
- **Secondary**: Gris (`gray-100`) - Acciones neutras
- **Accent**: Índigo (`indigo-600`) - Acciones especiales
- **Danger**: Rojo (`red-600`) - Acciones destructivas
- **Success**: Verde (`green-600`) - Confirmaciones
- **Warning**: Ámbar (`amber-600`) - Advertencias
- **Info**: Cian (`cyan-600`) - Información

## ♿ Accesibilidad

- ✅ Focus ring visible en todos los variants
- ✅ Estados disabled claros
- ✅ Contraste adecuado en todos los colores
- ✅ Transiciones suaves para mejor UX
- ✅ Tamaños de botón accesibles (mínimo 44px)

## 🔄 Migración desde el Sistema Anterior

```tsx
// Antes
<Button variant="primary">Texto</Button>
<Button variant="accent">Texto</Button>
<Button variant="danger">Texto</Button>
<Button variant="ghost">Texto</Button>

// Ahora (mantiene compatibilidad + nuevas opciones)
<Button variant="primary">Texto</Button>
<Button variant="accent">Texto</Button>
<Button variant="danger">Texto</Button>
<Button variant="ghost">Texto</Button>
<Button variant="secondary">Texto</Button> // ¡NUEVO!
<Button variant="success">Texto</Button>   // ¡NUEVO!
// ... y muchos más
```

¡El sistema es **completamente retrocompatible** y agrega muchas opciones nuevas! 🚀
