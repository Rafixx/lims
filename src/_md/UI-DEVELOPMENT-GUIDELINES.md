# Guía de Desarrollo UI - Basado en Tailwind Config

## 🎯 **Principio Fundamental**

**TODAS las referencias visuales en la UI deben basarse EXCLUSIVAMENTE en `tailwind.config.js`**

No usar colores hardcodeados, usar siempre las clases de Tailwind personalizadas definidas en la configuración.

## ✅ **CORRECTO - Usar Clases de Tailwind Config**

### **🎨 Colores del Sistema**

```tsx
// ✅ CORRECTO - Usar clases definidas en tailwind.config.js
<Button variant="primary">        // bg-primary-600
<div className="bg-primary-50">   // Fondo suave primario
<span className="text-primary-700"> // Texto primario
<div className="border-primary-300"> // Borde primario

// ✅ Estados y acciones
<Button variant="success">        // bg-success-600
<Button variant="danger">         // bg-danger-600
<Button variant="warning">        // bg-warning-600
<Button variant="info">           // bg-info-600

// ✅ Superficies y neutros
<div className="bg-surface-50">   // Fondo principal
<div className="bg-surface-100">  // Cards y contenedores
<p className="text-surface-600">  // Texto principal
<p className="text-surface-500">  // Texto secundario
```

### **🔤 Tipografía del Sistema**

```tsx
// ✅ CORRECTO - Usar font family del config
<div className="font-sans">       // Inter + fallbacks

// ✅ Transiciones del sistema
<div className="duration-200">     // 200ms del config
<div className="duration-250">     // 250ms personalizado
<div className="duration-300">     // 300ms personalizado
```

### **📐 Espaciado del Sistema**

```tsx
// ✅ CORRECTO - Usar spacing personalizado
<div className="space-y-18">       // 4.5rem del config
<div className="w-88">             // 22rem del config
<div className="max-w-128">        // 32rem del config
```

### **🎭 Sombras y Bordes**

```tsx
// ✅ CORRECTO - Usar sombras del sistema
<div className="shadow-soft">      // Sombra sutil
<div className="shadow-medium">    // Sombra media
<div className="shadow-strong">    // Sombra fuerte

// ✅ Bordes del sistema
<div className="rounded-xl">       // 0.75rem
<div className="rounded-2xl">      // 1rem
<div className="rounded-3xl">      // 1.5rem
```

## ❌ **INCORRECTO - NO Hacer**

### **🚫 Colores Hardcodeados**

```tsx
// ❌ INCORRECTO - No usar colores hardcodeados
bg-blue-600        // Usar bg-primary-600
bg-red-600         // Usar bg-danger-600
bg-green-600       // Usar bg-success-600
bg-gray-100        // Usar bg-surface-100

// ❌ INCORRECTO - No usar valores CSS directos
style={{ backgroundColor: '#2563eb' }}  // Usar bg-primary-600
style={{ color: '#dc2626' }}           // Usar text-danger-600
```

### **🚫 Estilos Inline**

```tsx
// ❌ INCORRECTO - No usar estilos inline para colores del sistema
style={{
  backgroundColor: 'blue',
  borderColor: 'red',
  fontSize: '14px'
}}

// ✅ CORRECTO - Usar clases de Tailwind
className="bg-primary-600 border-danger-600 text-sm"
```

## 🎨 **Mapeo de Colores Sistema → Tailwind**

### **Componentes Principales**

```tsx
// Botones - SIEMPRE usar variants
<Button variant="primary">   // bg-primary-600
<Button variant="secondary"> // bg-surface-100
<Button variant="accent">    // bg-accent-600
<Button variant="danger">    // bg-danger-600
<Button variant="success">   // bg-success-600
<Button variant="warning">   // bg-warning-600
<Button variant="info">      // bg-info-600
<Button variant="ghost">     // bg-transparent
<Button variant="outline">   // bg-transparent border-primary-600
<Button variant="soft">      // bg-primary-50
```

### **Estados de Componentes**

```tsx
// Estados de muestra/solicitud
className = 'bg-success-50 text-success-800 border-success-200' // Completado
className = 'bg-warning-50 text-warning-800 border-warning-200' // Pendiente
className = 'bg-danger-50 text-danger-800 border-danger-200' // Error
className = 'bg-info-50 text-info-800 border-info-200' // En proceso
```

### **Cards y Contenedores**

```tsx
// Card principal
className = 'bg-white border border-surface-200 rounded-lg shadow-soft'

// Card con hover
className =
  'bg-white border border-surface-200 hover:border-primary-300 transition-colors duration-200'

// Card de estado
className = 'bg-primary-50 border border-primary-200 text-primary-800'
```

## 🔧 **Proceso de Desarrollo**

### **1. Antes de Crear/Modificar Componentes UI**

1. ✅ Revisar `tailwind.config.js`
2. ✅ Identificar colores/espaciado/tipografía disponible
3. ✅ Usar SOLO clases definidas en el config
4. ✅ NO usar colores hardcodeados

### **2. Validación de Código**

```bash
# Buscar colores hardcodeados (PROHIBIDO)
grep -r "bg-blue-" src/           # Debe usar bg-primary-
grep -r "bg-red-" src/            # Debe usar bg-danger-
grep -r "bg-green-" src/          # Debe usar bg-success-
grep -r "bg-gray-" src/           # Debe usar bg-surface-
```

### **3. Reglas de Componentes**

- **Botones**: SIEMPRE usar `variant` prop
- **Cards**: SIEMPRE usar `bg-white` + `border-surface-200`
- **Estados**: SIEMPRE usar escalas de colores (50, 100, 600, 700, etc.)
- **Textos**: SIEMPRE usar `text-surface-X` para neutros

## 🎯 **Ejemplos de Migración**

### **Antes → Después**

```tsx
// ❌ ANTES - Colores hardcodeados
<div className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700">

// ✅ DESPUÉS - Config de Tailwind
<div className="bg-primary-600 text-white border-primary-600 hover:bg-primary-700">

// ❌ ANTES - Grises genéricos
<div className="bg-gray-100 text-gray-700 border-gray-300">

// ✅ DESPUÉS - Sistema de superficie
<div className="bg-surface-100 text-surface-700 border-surface-300">
```

## ✨ **Beneficios de Este Enfoque**

- ✅ **Consistencia total** en toda la aplicación
- ✅ **Mantenimiento simplificado** - cambio en un lugar
- ✅ **Escalabilidad** - agregar nuevos colores en el config
- ✅ **Trazabilidad** - todos los colores en un archivo
- ✅ **Coherencia de marca** - design system centralizado
- ✅ **Accesibilidad** - contraste validado en el config

## 🚨 **Regla de Oro**

> **Si no está en `tailwind.config.js`, no se usa en la UI**

Esta es la única fuente de verdad para colores, espaciado, tipografía y sistema visual del proyecto LIMS.

¡Mantén esta guía como referencia obligatoria para todo desarrollo UI! 🎨
