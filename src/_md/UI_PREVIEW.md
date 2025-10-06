# 🎨 Vista Previa del Sistema de Confirmación

## Flujo Visual del Usuario

```
┌──────────────────────────────────────────────────────────────┐
│                     Tu Aplicación                            │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  Lista de Centros                              │         │
│  │  ┌──────────────────────────────────────┐     │         │
│  │  │ CENTRO-001 │ Centro Principal  │ ✏️ 🗑️ │     │         │
│  │  └──────────────────────────────────────┘     │         │
│  │  ┌──────────────────────────────────────┐     │         │
│  │  │ CENTRO-002 │ Centro Secundario │ ✏️ 🗑️ │     │         │
│  │  └──────────────────────────────────────┘     │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ Usuario hace click en 🗑️
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ████████████████████████████████████████████████████████  │
│   ███                                                    ███  │
│   ███  ┌─────────────────────────────────────────┐     ███  │
│   ███  │  ⚠️  Eliminar Centro              ✖️    │     ███  │
│   ███  │                                         │     ███  │
│   ███  │  ¿Está seguro de eliminar el centro    │     ███  │
│   ███  │  "CENTRO-001"? Esta acción no se       │     ███  │
│   ███  │  puede deshacer.                        │     ███  │
│   ███  │                                         │     ███  │
│   ███  │                    ┌──────────┐  ┌─────┴──┐  │  ███  │
│   ███  │                    │ Cancelar │  │ Eliminar│  │  ███  │
│   ███  │                    └──────────┘  └─────────┘  │  ███  │
│   ███  └─────────────────────────────────────────┘     ███  │
│   ███         ▲ Animación fade-in + scale-in           ███  │
│   ████████████████████████████████████████████████████████  │
│         ▲ Backdrop semi-transparente (click para cerrar)    │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ Usuario confirma
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     Tu Aplicación                            │
│  ┌────────────────────────────────────────────┐             │
│  │  ✅ Centro eliminado correctamente         │ ← Notificación
│  └────────────────────────────────────────────┘             │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  Lista de Centros (actualizada)               │         │
│  │  ┌──────────────────────────────────────┐     │         │
│  │  │ CENTRO-002 │ Centro Secundario │ ✏️ 🗑️ │     │         │
│  │  └──────────────────────────────────────┘     │         │
│  └────────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────┘
```

## Variantes Visuales

### 🔴 Danger (Eliminaciones)

```
┌─────────────────────────────────────────┐
│  ⛔  Eliminar Centro              ✖️    │
│  ────────────────────────────────────   │
│  ¿Está seguro de eliminar...?          │
│                                         │
│              Cancelar   [ Eliminar ]    │
│                         └─ Rojo ──┘    │
└─────────────────────────────────────────┘
```

### 🟡 Warning (Advertencias)

```
┌─────────────────────────────────────────┐
│  ⚠️  ¿Estás seguro?               ✖️    │
│  ────────────────────────────────────   │
│  Esta acción tiene consecuencias...    │
│                                         │
│              Cancelar   [ Confirmar ]   │
│                         └─ Amarillo ─┘  │
└─────────────────────────────────────────┘
```

### 🔵 Info (Información)

```
┌─────────────────────────────────────────┐
│  ℹ️  Confirmar acción             ✖️    │
│  ────────────────────────────────────   │
│  ¿Desea continuar con...?              │
│                                         │
│              Cancelar   [ Confirmar ]   │
│                         └─ Azul ────┘   │
└─────────────────────────────────────────┘
```

### 🟢 Success (Confirmación positiva)

```
┌─────────────────────────────────────────┐
│  ✅  Operación exitosa            ✖️    │
│  ────────────────────────────────────   │
│  ¿Confirmar la finalización?           │
│                                         │
│              Cancelar   [ Confirmar ]   │
│                         └─ Verde ───┘   │
└─────────────────────────────────────────┘
```

## Interacciones del Usuario

### 1. Apertura del diálogo

```
[Animación: 200ms]
Backdrop: opacity 0 → 1
Dialog:   scale 0.95 → 1, opacity 0 → 1
```

### 2. Opciones de cierre

- ✖️ Botón X en la esquina superior derecha
- 🖱️ Click en el backdrop (área gris)
- ⌨️ ESC (si se implementa)
- 🔘 Botón "Cancelar"

### 3. Confirmación

- 🔘 Botón principal (color según tipo)
- ✅ Promise se resuelve con `true`
- 📢 Notificación de éxito/error

## Comparación: Antes vs Después

### ❌ Antes (window.confirm)

```
┌────────────────────────────────┐
│ localhost:3000 dice:           │ ← Browser nativo
│                                │
│ ¿Estás seguro de eliminar?     │ ← Texto plano
│                                │
│     [Cancelar]  [Aceptar]      │ ← Estilo del navegador
└────────────────────────────────┘
```

- ❌ Estilo inconsistente con la app
- ❌ No personalizable
- ❌ Sin iconos ni colores
- ❌ UX pobre

### ✅ Después (Sistema de Confirmación)

```
┌──────────────────────────────────────────┐
│  ⛔  Eliminar Centro              ✖️     │ ← Tu diseño
│  ─────────────────────────────────────   │
│  ¿Está seguro de eliminar el centro     │ ← Mensaje detallado
│  "CENTRO-001"? Esta acción no se puede  │
│  deshacer.                               │
│                                          │
│              Cancelar   [ Sí, eliminar ] │ ← Personalizado
└──────────────────────────────────────────┘
```

- ✅ Coherente con el diseño de la app
- ✅ Completamente personalizable
- ✅ Iconos y colores contextuales
- ✅ Excelente UX

## Stack de Diálogos (si se abren múltiples)

```
z-index: 100 (Backdrop)
z-index: 101 (Dialog)

Si se abre otro diálogo:
z-index: 102 (Backdrop 2)
z-index: 103 (Dialog 2)
```

## Responsive Design

### Desktop (> 768px)

```
┌────────────────────────────────────────────────┐
│                                                │
│     ┌──────────────────────────────┐          │
│     │  Dialog (max-width: 28rem)   │          │
│     └──────────────────────────────┘          │
│                                                │
└────────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────────────┐
│                          │
│  ┌────────────────────┐  │
│  │  Dialog (full-w)   │  │
│  │  con padding       │  │
│  └────────────────────┘  │
│                          │
└──────────────────────────┘
```

## Accesibilidad

- 🎯 Focus trap dentro del diálogo
- ⌨️ Navegación por teclado (Tab, Enter, ESC)
- 📢 ARIA labels para lectores de pantalla
- 🎨 Contraste de colores adecuado (WCAG AA)
- 👆 Área de click suficiente (botones > 44x44px)
