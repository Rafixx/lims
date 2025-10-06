# Sistema de Colores LIMS - Tailwind Config

## 🎨 **Sistema de Colores Coherente**

Hemos actualizado la configuración de Tailwind CSS para alinearlo completamente con el sistema de botones y crear un **design system coherente** en toda la aplicación.

## 🎯 **Nuevos Colores del Sistema**

### **🔵 COLORES PRINCIPALES**

```css
/* Primary - Azul (Acciones principales) */
bg-primary-600     /* #2563eb - Botones primarios */
text-primary-700   /* #1d4ed8 - Textos destacados */
bg-primary-50      /* #eff6ff - Fondos suaves */

/* Accent - Índigo (Acciones especiales) */
bg-accent-600      /* #4f46e5 - Botones accent */
text-accent-700    /* #4338ca - Enlaces especiales */
```

### **🎨 COLORES DE ESTADO**

```css
/* Success - Verde */
bg-success-600     /* #16a34a - Confirmaciones */
text-success-700   /* #15803d - Textos de éxito */
bg-success-50      /* #f0fdf4 - Fondos de éxito */

/* Danger - Rojo */
bg-danger-600      /* #dc2626 - Botones de eliminación */
text-danger-700    /* #b91c1c - Textos de error */
bg-danger-50       /* #fef2f2 - Fondos de error */

/* Warning - Ámbar */
bg-warning-600     /* #d97706 - Advertencias */
text-warning-700   /* #b45309 - Textos de alerta */

/* Info - Cian */
bg-info-600        /* #0891b2 - Información */
text-info-700      /* #0e7490 - Textos informativos */
```

### **🎨 COLORES DE SUPERFICIE**

```css
/* Surface - Grises neutros */
bg-surface-50      /* #f9fafb - Fondos principales */
bg-surface-100     /* #f3f4f6 - Cards y contenedores */
text-surface-600   /* #4b5563 - Textos principales */
text-surface-500   /* #6b7280 - Textos secundarios */
border-surface-200 /* #e5e7eb - Bordes sutiles */
```

## 🔄 **Migración desde Sistema Anterior**

### **✅ Compatibilidad Mantenida**

Los colores legacy siguen funcionando:

```css
/* Colores legacy que seguirán funcionando */
bg-primary         /* #0F4953 -> Ahora bg-surface-700 */
bg-accent          /* #F98E6E -> Ahora bg-accent-400 */
bg-info            /* #67BDC3 -> Ahora bg-info-400 */
bg-danger          /* #CC533D -> Ahora bg-danger-600 */
bg-warning         /* #F2AD4A -> Ahora bg-warning-400 */
bg-muted           /* #CBF5EF - Mantenido */
bg-base            /* #F9FCFB - Mantenido */
```

### **🎯 Migración Recomendada**

```css
/* ANTES */
bg-primary text-white
bg-accent text-white
bg-danger text-white

/* AHORA (más coherente) */
bg-primary-600 text-white
bg-accent-600 text-white
bg-danger-600 text-white

/* O usar las escalas de colores */
bg-primary-100 text-primary-800  /* Versión suave */
bg-primary-50 text-primary-700   /* Versión muy suave */
```

## 🎨 **Ejemplos de Uso por Componente**

### **Cards y Contenedores**

```jsx
// Card principal
<div className="bg-white border border-surface-200 rounded-lg shadow-soft">

// Card con fondo suave
<div className="bg-surface-50 border border-surface-200">

// Card de estado
<div className="bg-success-50 border border-success-200 text-success-800">
```

### **Estados y Badges**

```jsx
// Badge de éxito
<span className="bg-success-100 text-success-800 px-2 py-1 rounded-md">

// Badge de advertencia
<span className="bg-warning-100 text-warning-800 px-2 py-1 rounded-md">

// Badge de información
<span className="bg-info-100 text-info-800 px-2 py-1 rounded-md">
```

### **Filtros y Inputs**

```jsx
// Input con focus state
<input className="border-surface-300 focus:border-primary-500 focus:ring-primary-500" />

// Select con estados
<select className="border-surface-300 focus:border-primary-500 bg-white">
```

## ✨ **Nuevas Características Añadidas**

### **📏 Espaciado Extendido**

```css
space-18    /* 4.5rem - Entre secciones */
space-88    /* 22rem - Layouts grandes */
space-128   /* 32rem - Containers anchos */
```

### **🎭 Sombras Semánticas**

```css
shadow-soft     /* Sombra sutil para cards */
shadow-medium   /* Sombra media para modals */
shadow-strong   /* Sombra fuerte para dropdowns */
```

### **🔄 Transiciones Optimizadas**

```css
duration-250    /* Para micro-interacciones */
duration-300    /* Para transiciones suaves */
```

### **📐 Bordes Modernos**

```css
rounded-xl      /* 0.75rem - Cards modernos */
rounded-2xl     /* 1rem - Contenedores grandes */
rounded-3xl     /* 1.5rem - Elementos destacados */
```

### **🔤 Tipografía Mejorada**

```css
font-sans       /* Inter + fallbacks del sistema */
```

## 🎯 **Casos de Uso Específicos LIMS**

### **Estados de Muestra**

```jsx
// Muestra pendiente
<div className="bg-warning-50 border-l-4 border-warning-400 text-warning-800">

// Muestra completada
<div className="bg-success-50 border-l-4 border-success-400 text-success-800">

// Muestra con error
<div className="bg-danger-50 border-l-4 border-danger-400 text-danger-800">
```

### **Filtros de Estado**

```jsx
// Filtro activo
<button className="bg-primary-600 text-white border-primary-600">

// Filtro inactivo
<button className="bg-surface-100 text-surface-700 border-surface-300">
```

### **Cards de Técnica**

```jsx
// Card con estado
<div className="bg-white border border-surface-200 hover:border-primary-300 transition-colors">
  <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs">Estado</div>
</div>
```

## 📊 **Compatibilidad y Migración**

- ✅ **100% compatible** con código existente
- ✅ Colores legacy mantenidos
- ✅ Nuevas escalas de colores disponibles
- ✅ Sistema coherente con botones
- ✅ Design tokens consistentes
- ✅ Accesibilidad mejorada con contraste adecuado

¡Ahora tienes un **sistema de colores completamente coherente** que funciona perfectamente con el sistema de botones modernizado! 🚀
