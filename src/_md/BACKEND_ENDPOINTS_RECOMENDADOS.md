# Endpoints Backend Recomendados

## Análisis de la implementación actual

### ✅ Lo que funciona correctamente

Con los endpoints REST estándar actuales (`GET/POST/PUT/DELETE /api/tecnicasReactivos/:id`) podemos:

- ✅ Obtener datos de técnicas y reactivos desde worklist
- ✅ Crear nuevas relaciones técnica-reactivo
- ✅ Actualizar lotes y volúmenes de relaciones existentes

### 🔄 Endpoints que optimizarían el flujo

## 1. **Batch Update de Lotes** (ALTA PRIORIDAD)

### Problema actual

En `LotesPage.tsx`, cuando el usuario guarda múltiples lotes, hacemos N llamadas individuales (una por cada reactivo modificado):

```typescript
// Actual: Múltiples llamadas
await Promise.all(updates.map(data =>
  upsertMutation.mutateAsync({...})
))
```

### Endpoint propuesto

```http
PATCH /api/tecnicasReactivos/batch
Content-Type: application/json

{
  "updates": [
    {
      "id": 123,              // ID de tecnicas_reactivos (si existe)
      "id_tecnica": 45,       // ID de la técnica (si es creación)
      "id_reactivo": 67,      // ID del reactivo (si es creación)
      "lote": "LOTE001",
      "volumen": "500"
    },
    {
      "id": 124,
      "lote": "LOTE002",
      "volumen": "250"
    }
  ]
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "updated": 2,
  "created": 0,
  "results": [
    { "id": 123, "status": "updated" },
    { "id": 124, "status": "updated" }
  ]
}
```

### Beneficios

- ✅ Una sola transacción de base de datos
- ✅ Más eficiente (reduce latencia de red)
- ✅ Todo o nada (transaccionalidad)
- ✅ Mejor manejo de errores parciales

---

## 2. **Obtener Técnicas-Reactivos por Worklist** (PRIORIDAD MEDIA)

### Problema actual

Para obtener los reactivos de un worklist, hacemos una query compleja que devuelve toda la estructura anidada. El backend podría optimizar esto.

### Endpoint propuesto

```http
GET /api/worklists/:id/tecnicas-reactivos
```

**Respuesta optimizada:**

```json
{
  "worklistId": 42,
  "tecnicas": [
    {
      "idTecnica": 45,
      "nombreTecnica": "PCR COVID-19",
      "muestra": {
        "id": 123,
        "codigoEpi": "M-2024-001",
        "codigoExterno": "EXT-001"
      },
      "reactivos": [
        {
          "id": 67, // ID del reactivo (dim_reactivos)
          "idTecnicaReactivo": 890, // ID de la relación (tecnicas_reactivos)
          "nombre": "Buffer PCR",
          "lote": "LOTE001", // null si no tiene
          "volumen": "500", // null si no tiene
          "unidad": "μL"
        }
      ]
    }
  ],
  "estadisticas": {
    "totalReactivos": 15,
    "lotesCompletos": 10,
    "lotesPendientes": 5
  }
}
```

### Beneficios

- ✅ Estructura plana optimizada para el frontend
- ✅ Incluye estadísticas útiles (lotes pendientes)
- ✅ Reduce transformaciones en el frontend

---

## 3. **Validar Disponibilidad de Lotes** (PRIORIDAD BAJA)

### Caso de uso

Antes de asignar un lote, verificar que existe inventario suficiente.

### Endpoint propuesto

```http
POST /api/reactivos/validar-disponibilidad
Content-Type: application/json

{
  "validaciones": [
    {
      "id_reactivo": 67,
      "lote": "LOTE001",
      "volumen_requerido": "500"
    }
  ]
}
```

**Respuesta:**

```json
{
  "validaciones": [
    {
      "id_reactivo": 67,
      "lote": "LOTE001",
      "disponible": true,
      "volumen_disponible": "2000",
      "volumen_requerido": "500",
      "volumen_restante": "1500"
    }
  ],
  "todas_disponibles": true
}
```

### Beneficios

- ✅ Previene asignación de lotes sin stock
- ✅ Mejor UX (validación previa)
- ✅ Integridad de datos

---

## 4. **Historial de Cambios de Lotes** (PRIORIDAD BAJA)

### Caso de uso

Auditoría: ¿quién cambió qué lote y cuándo?

### Endpoint propuesto

```http
GET /api/tecnicasReactivos/:id/historial
```

**Respuesta:**

```json
{
  "tecnicaReactivoId": 123,
  "historial": [
    {
      "fecha": "2025-11-07T10:30:00Z",
      "usuario": "usuario@lab.com",
      "accion": "UPDATE",
      "cambios": {
        "lote": { "anterior": "LOTE001", "nuevo": "LOTE002" },
        "volumen": { "anterior": "500", "nuevo": "250" }
      }
    }
  ]
}
```

---

## Priorización recomendada

### 🔴 Implementar YA

**1. Batch Update de Lotes** → Mayor impacto en rendimiento y UX

### 🟡 Implementar pronto

**2. GET worklists/:id/tecnicas-reactivos** → Simplifica el código del frontend

### 🟢 Implementar después

**3. Validar disponibilidad** → Mejora la integridad de datos  
**4. Historial de cambios** → Auditoría y trazabilidad

---

## Cambios necesarios en el frontend si implementas estos endpoints

### Si implementas el endpoint #1 (Batch Update):

```typescript
// En tecnicaReactivoService.ts
async batchUpsertLotes(updates: BatchUpdateData[]) {
  const response = await apiClient.patch('/tecnicasReactivos/batch', { updates })
  return response.data
}

// En LotesPage.tsx
const handleSaveAll = async () => {
  try {
    setIsSaving(true)

    const updates = Object.values(formData).map(data => ({
      id: data.idTecnicaReactivo,
      id_tecnica: data.idTecnica,
      id_reactivo: data.idReactivo,
      lote: data.lote,
      volumen: data.volumen
    }))

    await batchUpsertMutation.mutateAsync(updates)
    notify(`${updates.length} lotes actualizados correctamente`, 'success')
    handleClose()
  } catch (error) {
    notify('Error al actualizar lotes', 'error')
  } finally {
    setIsSaving(false)
  }
}
```

### Si implementas el endpoint #2 (GET optimizado):

```typescript
// En tecnicaReactivoService.ts
async getWorklistTecnicasReactivos(worklistId: number) {
  const response = await apiClient.get(`/worklists/${worklistId}/tecnicas-reactivos`)
  return response.data
}

// En LotesPage.tsx - mucho más simple
const reactivos = tecnica.reactivos // Ya viene plano desde backend
```

---

## Resumen

**Endpoint más importante a implementar:** Batch Update (#1)

**Razón:** Actualmente hacemos 10-20 llamadas HTTP individuales al guardar lotes. Con batch update serían solo 1 llamada, mejorando:

- ⚡ Performance (menos latencia)
- 🔒 Transaccionalidad (todo o nada)
- 🎯 Mejor manejo de errores
- 📊 Métricas de uso más claras

**Esfuerzo estimado:** Bajo-Medio (depende de tu ORM/framework)

**Impacto:** Alto
