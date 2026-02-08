# 🔄 Sistema de Flujo de Trabajo (Workflow) - Worklist

## 🎯 Objetivo

Implementar un sistema robusto y escalable que guíe al usuario a través de un flujo de trabajo ordenado en la gestión de worklists, habilitando y deshabilitando acciones según el estado actual.

---

## 📊 Estados del Workflow

El sistema define **4 estados principales**:

### 1. **CREATED** - Worklist Recién Creado

- **Descripción:** Estado inicial cuando se crea el worklist
- **Condición:** Técnicas sin técnico asignado

### 2. **TECNICO_ASSIGNED** - Técnico Asignado

- **Descripción:** Todas las técnicas tienen técnico asignado
- **Condición:** `tecnica.tecnico_resp?.id_usuario` existe para todas

### 3. **TECNICAS_STARTED** - Técnicas Iniciadas

- **Descripción:** Usuario hizo clic en "Iniciar Técnicas"
- **Condición:** `tecnica.id_estado > 1` (no están en PENDIENTE)

### 4. **RESULTS_IMPORTED** - Resultados Importados

- **Descripción:** Se importaron resultados al worklist
- **Condición:** `tecnica.resultados` contiene datos válidos

---

## 🎮 Permisos por Estado

### Estado: CREATED

```typescript
{
  canAssignTecnico: true,          // ✅ DISPONIBLE
  canStartTecnicas: false,         // ❌ BLOQUEADO
  canImportResults: false,         // ❌ BLOQUEADO
  canManagePlantillaTecnica: false,// ❌ BLOQUEADO
  canManageLotes: false            // ❌ BLOQUEADO
}
```

**Mensaje de ayuda:** "Asigna un técnico a cada técnica para continuar"

---

### Estado: TECNICO_ASSIGNED

```typescript
{
  canAssignTecnico: true,          // ✅ DISPONIBLE (puede cambiar)
  canStartTecnicas: true,          // ✅ DISPONIBLE
  canImportResults: false,         // ❌ BLOQUEADO
  canManagePlantillaTecnica: false,// ❌ BLOQUEADO
  canManageLotes: false            // ❌ BLOQUEADO
}
```

**Mensaje de ayuda:** "Haz clic en 'Iniciar Técnicas' para comenzar el trabajo"

---

### Estado: TECNICAS_STARTED

```typescript
{
  canAssignTecnico: false,         // ❌ BLOQUEADO
  canStartTecnicas: false,         // ❌ BLOQUEADO (ya iniciadas)
  canImportResults: true,          // ✅ DISPONIBLE
  canManagePlantillaTecnica: true, // ✅ DISPONIBLE
  canManageLotes: true             // ✅ DISPONIBLE
}
```

**Mensaje de ayuda:** "Importa resultados o gestiona la plantilla técnica y lotes"

---

### Estado: RESULTS_IMPORTED

```typescript
{
  canAssignTecnico: false,         // ❌ BLOQUEADO
  canStartTecnicas: false,         // ❌ BLOQUEADO
  canImportResults: false,         // ❌ BLOQUEADO (ya importados)
  canManagePlantillaTecnica: true, // ✅ DISPONIBLE
  canManageLotes: true             // ✅ DISPONIBLE
}
```

**Mensaje de ayuda:** "Resultados importados - puedes gestionar plantilla y lotes"

---

## 🔄 Transiciones Válidas

El sistema valida que solo se puedan realizar transiciones en orden:

```
CREATED → TECNICO_ASSIGNED → TECNICAS_STARTED → RESULTS_IMPORTED
```

**No se permite retroceder** en el flujo.

---

## 📁 Archivos Creados/Modificados

### 1. **`/hooks/useWorklistWorkflow.ts`** (NUEVO)

**Responsabilidad:** Hook principal que determina el estado actual y permisos

**Exports:**

```typescript
// Enum de estados
export enum WorklistWorkflowState {
  CREATED,
  TECNICO_ASSIGNED,
  TECNICAS_STARTED,
  RESULTS_IMPORTED
}

// Hook principal
export const useWorklistWorkflow = (tecnicas: Tecnica[]): WorklistWorkflow

// Funciones auxiliares
export function getWorkflowHelpMessage(state: WorklistWorkflowState): string
export function getDisabledTooltip(action, currentState): string
```

**Lógica de detección de estado:**

```typescript
// 1. Verificar resultados importados
if (hasResults) → RESULTS_IMPORTED

// 2. Verificar técnicas iniciadas
else if (tecnicasStarted) → TECNICAS_STARTED

// 3. Verificar técnico asignado
else if (allTecnicasHaveTecnico) → TECNICO_ASSIGNED

// 4. Estado por defecto
else → CREATED
```

---

### 2. **`/components/WorkListDetail/WorklistHeader.tsx`** (MODIFICADO)

**Cambios:**

- Importa `useWorklistWorkflow` y `getDisabledTooltip`
- Recibe `tecnicas: Tecnica[]` en lugar de flags booleanos
- Usa `permissions` del workflow para habilitar/deshabilitar botones
- Tooltips dinámicos que explican por qué un botón está deshabilitado

**Antes:**

```typescript
interface WorklistHeaderProps {
  allTecnicasHaveResults: boolean
  allTecnicasHaveTecnicoLab: boolean
  // ...
}
```

**Ahora:**

```typescript
interface WorklistHeaderProps {
  tecnicas: Tecnica[]
  // ... resto de props
}
```

**Botones con workflow:**

```tsx
<Button
  variant="soft"
  onClick={onStartTecnicas}
  disabled={!permissions.canStartTecnicas}
  title={
    !permissions.canStartTecnicas
      ? getDisabledTooltip('canStartTecnicas', currentState)
      : 'Iniciar todas las técnicas del worklist'
  }
>
  <Play size={16} />
  Iniciar Técnicas
</Button>
```

---

### 3. **`/components/WorkListDetail/WorklistTecnicasGrid.tsx`** (MODIFICADO)

**Cambios:**

- Añadido prop `canAssignTecnico: boolean`
- Select de técnico deshabilitado cuando `!canAssignTecnico`
- Tooltip explicativo cuando está deshabilitado

**Antes:**

```typescript
<Select
  disabled={isAssigningTecnico || tecnicos.length === 0}
  // ...
/>
```

**Ahora:**

```typescript
<Select
  disabled={!canAssignTecnico || isAssigningTecnico || tecnicos.length === 0}
  title={
    !canAssignTecnico
      ? 'No puedes cambiar el técnico después de iniciar las técnicas'
      : undefined
  }
  // ...
/>
```

---

### 4. **`/pages/WorklistDetailPage.tsx`** (MODIFICADO)

**Cambios:**

- Importa `useWorklistWorkflow`
- Obtiene `permissions` del workflow
- Pasa `permissions.canAssignTecnico` a `WorklistTecnicasGrid`
- Pasa `tecnicas` a `WorklistHeader` en lugar de flags

**Código:**

```typescript
// Hook de workflow
const { permissions } = useWorklistWorkflow(worklist?.tecnicas || [])

// En el componente
<WorklistHeader
  tecnicas={worklist.tecnicas}  // ← Pasa array de técnicas
  // ... resto
/>

<WorklistTecnicasGrid
  canAssignTecnico={permissions.canAssignTecnico}  // ← Pasa permiso
  // ... resto
/>
```

---

## 🎨 Experiencia de Usuario

### Flujo Completo

#### **Paso 1: Crear Worklist**

```
Usuario → CreateWorklistPage → Crea worklist
Estado: CREATED
```

**UI:**

- ✅ Desplegable "Cambiar técnico" → Habilitado
- ❌ "Iniciar Técnicas" → Deshabilitado
- ❌ "Importar resultados" → Deshabilitado
- ❌ "Plantilla técnica" → Deshabilitado
- ❌ "Lotes" → Deshabilitado

**Tooltip:** "Primero asigna un técnico a todas las técnicas"

---

#### **Paso 2: Asignar Técnico**

```
Usuario → Selecciona técnico del desplegable
Estado: TECNICO_ASSIGNED
```

**UI:**

- ✅ Desplegable "Cambiar técnico" → Habilitado (puede cambiar)
- ✅ "Iniciar Técnicas" → Habilitado
- ❌ "Importar resultados" → Deshabilitado
- ❌ "Plantilla técnica" → Deshabilitado
- ❌ "Lotes" → Deshabilitado

**Tooltip:** "Haz clic en 'Iniciar Técnicas' para comenzar el trabajo"

---

#### **Paso 3: Iniciar Técnicas**

```
Usuario → Click en "Iniciar Técnicas"
Estado: TECNICAS_STARTED
```

**UI:**

- ❌ Desplegable "Cambiar técnico" → Deshabilitado
- ❌ "Iniciar Técnicas" → Deshabilitado (ya iniciadas)
- ✅ "Importar resultados" → Habilitado
- ✅ "Plantilla técnica" → Habilitado
- ✅ "Lotes" (con Badge) → Habilitado

**Tooltip:** "No puedes cambiar técnicos después de iniciar"

---

#### **Paso 4: Importar Resultados**

```
Usuario → Click en "Importar resultados" → Importa
Estado: RESULTS_IMPORTED
```

**UI:**

- ❌ Desplegable "Cambiar técnico" → Deshabilitado
- ❌ "Iniciar Técnicas" → Deshabilitado
- ❌ "Importar resultados" → Deshabilitado (ya importados)
- ✅ "Plantilla técnica" → Habilitado
- ✅ "Lotes" (con Badge) → Habilitado

**Tooltip:** "Los resultados ya han sido importados"

---

## 🔧 Extensibilidad

### Añadir Nuevo Estado

1. **Añadir al enum:**

```typescript
export enum WorklistWorkflowState {
  // ... estados existentes
  NEW_STATE = 'NEW_STATE'
}
```

2. **Definir permisos:**

```typescript
case WorklistWorkflowState.NEW_STATE:
  return {
    canAssignTecnico: false,
    canStartTecnicas: false,
    canImportResults: false,
    canManagePlantillaTecnica: true,
    canManageLotes: true,
    canNewAction: true  // ← Nueva acción
  }
```

3. **Añadir transición:**

```typescript
const validTransitions: Record<WorklistWorkflowState, WorklistWorkflowState[]> = {
  // ...
  [WorklistWorkflowState.RESULTS_IMPORTED]: [WorklistWorkflowState.NEW_STATE]
}
```

4. **Añadir tooltip:**

```typescript
case WorklistWorkflowState.NEW_STATE:
  return 'Mensaje de ayuda para nuevo estado'
```

---

### Añadir Nueva Acción

1. **Añadir al interface de permisos:**

```typescript
interface WorkflowPermissions {
  // ... permisos existentes
  canNewAction: boolean
}
```

2. **Definir permisos por estado:**

```typescript
case WorklistWorkflowState.SOME_STATE:
  return {
    // ... otros permisos
    canNewAction: true
  }
```

3. **Usar en componente:**

```tsx
<Button
  disabled={!permissions.canNewAction}
  title={!permissions.canNewAction ? getDisabledTooltip('canNewAction', currentState) : ''}
>
  Nueva Acción
</Button>
```

4. **Añadir tooltips:**

```typescript
const messages: Record<
  WorklistWorkflowState,
  Partial<Record<keyof WorkflowPermissions, string>>
> = {
  [WorklistWorkflowState.SOME_STATE]: {
    canNewAction: 'Explicación de por qué está deshabilitado'
  }
}
```

---

## ✅ Ventajas del Sistema

### 1. **Centralizado**

- Toda la lógica de workflow en un solo lugar
- Fácil de mantener y debuggear

### 2. **Escalable**

- Añadir nuevos estados: ~10 líneas de código
- Añadir nuevas acciones: ~5 líneas de código

### 3. **Type-Safe**

- TypeScript garantiza que todos los estados tienen permisos
- Imposible olvidar definir un permiso

### 4. **Testable**

- Lógica pura separada de la UI
- Fácil de hacer unit tests

### 5. **UX Mejorada**

- Tooltips explicativos
- Feedback claro de por qué algo está deshabilitado
- Guía al usuario paso a paso

---

## 🧪 Testing

### Test 1: Estado CREATED

1. Crear nuevo worklist
2. **Verificar:** Solo "Asignar técnico" disponible
3. **Verificar:** Tooltip en "Iniciar Técnicas": "Primero asigna un técnico..."

### Test 2: Estado TECNICO_ASSIGNED

1. Asignar técnico a todas las técnicas
2. **Verificar:** "Iniciar Técnicas" habilitado
3. **Verificar:** Puede cambiar técnico
4. **Verificar:** Otros botones deshabilitados

### Test 3: Estado TECNICAS_STARTED

1. Click en "Iniciar Técnicas"
2. **Verificar:** Desplegable técnico deshabilitado
3. **Verificar:** "Importar", "Plantilla", "Lotes" habilitados
4. **Verificar:** Badge de lotes visible

### Test 4: Estado RESULTS_IMPORTED

1. Importar resultados
2. **Verificar:** Solo "Plantilla" y "Lotes" habilitados
3. **Verificar:** "Importar" deshabilitado con tooltip

### Test 5: Transiciones Inválidas

1. Verificar que no se puede retroceder
2. `canTransitionTo(previousState)` → `false`

---

## 📊 Diagrama de Flujo

```
┌─────────────────┐
│    CREATED      │  Worklist creado
│                 │
│ ✅ Asignar téc  │
│ ❌ Iniciar      │
│ ❌ Importar     │
│ ❌ Plantilla    │
│ ❌ Lotes        │
└────────┬────────┘
         │ Asigna técnico
         ▼
┌─────────────────┐
│ TECNICO_ASSIGNED│  Técnico asignado
│                 │
│ ✅ Asignar téc  │
│ ✅ Iniciar      │
│ ❌ Importar     │
│ ❌ Plantilla    │
│ ❌ Lotes        │
└────────┬────────┘
         │ Click "Iniciar"
         ▼
┌─────────────────┐
│TECNICAS_STARTED │  Técnicas iniciadas
│                 │
│ ❌ Asignar téc  │
│ ❌ Iniciar      │
│ ✅ Importar     │
│ ✅ Plantilla    │
│ ✅ Lotes 🎯     │
└────────┬────────┘
         │ Importa resultados
         ▼
┌─────────────────┐
│RESULTS_IMPORTED │  Resultados importados
│                 │
│ ❌ Asignar téc  │
│ ❌ Iniciar      │
│ ❌ Importar     │
│ ✅ Plantilla    │
│ ✅ Lotes 🎯     │
└─────────────────┘
```

---

## 🎉 Resultado Final

El sistema ahora:

- ✅ Guía al usuario paso a paso
- ✅ Previene errores (no puede importar sin iniciar)
- ✅ Da feedback claro (tooltips explicativos)
- ✅ Es fácil de extender (añadir estados/acciones)
- ✅ Es mantenible (lógica centralizada)
- ✅ Es type-safe (TypeScript completo)

**El flujo de trabajo está completamente implementado y funcional.** 🚀
