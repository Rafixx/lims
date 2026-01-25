# Requisitos del Backend para Externalizaciones

## Problema Identificado

El endpoint `GET /externalizaciones` **NO está devolviendo** los datos necesarios para mostrar correctamente las muestras tipo array agrupadas.

### Datos Actuales (INCOMPLETOS)

```json
{
  "id_externalizacion": 237,
  "id_tecnica": 2253,
  "tecnica": {
    "id_tecnica": 2253,
    "id_muestra": 146,
    "id_estado": 16,
    "estadoInfo": { ... },
    "tecnica_proc": {
      "id": 13,
      "tecnica_proc": "Conversión Bisulfito"
    },
    "muestra": {
      "id_muestra": 146,
      "codigo_epi": "26.00066",
      "codigo_externo": "GR-MUE-2026-Test066",
      "estudio": "EST_2026066"
      // ❌ FALTA: tipo_array
    }
    // ❌ FALTA: muestraArray
  }
}
```

### Datos Requeridos (COMPLETOS)

```json
{
  "id_externalizacion": 237,
  "id_tecnica": 2253,
  "tecnica": {
    "id_tecnica": 2253,
    "id_muestra": 146,
    "id_estado": 16,
    "estadoInfo": { ... },
    "tecnica_proc": {
      "id": 13,
      "tecnica_proc": "Conversión Bisulfito"
    },
    "muestra": {
      "id_muestra": 146,
      "codigo_epi": "26.00066",
      "codigo_externo": "GR-MUE-2026-Test066",
      "estudio": "EST_2026066",
      "tipo_array": true                    // ✅ REQUERIDO
    },
    "muestraArray": {                       // ✅ REQUERIDO (si es tipo array)
      "id_array": 123,
      "codigo_placa": "PLACA_001",
      "posicion_placa": "A01"
    }
  }
}
```

## Campos Faltantes

### 1. `muestra.tipo_array` (boolean)

**Ubicación:** `externalizaciones[].tecnica.muestra.tipo_array`

**Descripción:** Indica si la muestra es de tipo array (placa) o individual.

**Valores:**
- `true`: Muestra de tipo placa/array (96 posiciones, etc.)
- `false` o `null`: Muestra individual

**Query SQL (ejemplo):**
```sql
SELECT
  m.id_muestra,
  m.codigo_epi,
  m.codigo_externo,
  m.estudio,
  m.tipo_array        -- ← AGREGAR ESTE CAMPO
FROM muestras m
```

---

### 2. `muestraArray` (objeto)

**Ubicación:** `externalizaciones[].tecnica.muestraArray`

**Descripción:** Información de la posición específica en la placa (solo si `tipo_array = true`).

**Campos requeridos:**
- `id_array` (number): ID único de la posición en el array
- `codigo_placa` (string): Código de la placa
- `posicion_placa` (string): Posición en la placa (ej: "A01", "H12")

**Query SQL (ejemplo):**
```sql
SELECT
  ma.id_array,
  ma.codigo_placa,
  ma.posicion_placa
FROM muestra_array ma
WHERE ma.id_tecnica = ?
```

---

## Modificación Requerida en el Backend

### Endpoint: `GET /externalizaciones`

**Archivo:** `externalizaciones.controller.ts` o similar

**Cambio necesario:**

```typescript
// ANTES (solo incluye datos básicos de muestra)
const externalizaciones = await db.externalizaciones.findAll({
  include: [
    {
      model: db.tecnicas,
      include: [
        {
          model: db.muestras,
          attributes: ['id_muestra', 'codigo_epi', 'codigo_externo', 'estudio']
        },
        { model: db.tecnica_proc }
      ]
    }
  ]
})

// DESPUÉS (incluye tipo_array y muestraArray)
const externalizaciones = await db.externalizaciones.findAll({
  include: [
    {
      model: db.tecnicas,
      include: [
        {
          model: db.muestras,
          attributes: [
            'id_muestra',
            'codigo_epi',
            'codigo_externo',
            'estudio',
            'tipo_array'          // ← AGREGAR
          ]
        },
        { model: db.tecnica_proc },
        {
          model: db.muestra_array,  // ← AGREGAR
          as: 'muestraArray',
          attributes: ['id_array', 'codigo_placa', 'posicion_placa']
        }
      ]
    }
  ]
})
```

---

## Verificación

### Paso 1: Ejecutar el endpoint

```bash
GET http://localhost:3002/api/externalizaciones
Authorization: Bearer <token>
```

### Paso 2: Verificar respuesta

La respuesta debe incluir:

```json
{
  "success": true,
  "data": [
    {
      "id_externalizacion": 237,
      "tecnica": {
        "muestra": {
          "tipo_array": true  // ✅ Debe estar presente
        },
        "muestraArray": {     // ✅ Debe estar presente si tipo_array = true
          "id_array": 123,
          "codigo_placa": "PLACA_001",
          "posicion_placa": "A01"
        }
      }
    }
  ]
}
```

### Paso 3: Verificar agrupación en frontend

Una vez que el backend devuelva los datos correctos:

1. Abrir la consola del navegador
2. Navegar a "Gestión de Externalizaciones"
3. Buscar el log: `✅ Externalizaciones agrupadas por muestra+técnica:`
4. Verificar que muestra los grupos correctamente

**Log esperado:**
```javascript
✅ Externalizaciones agrupadas por muestra+técnica: {
  grupos: 2,                    // Número de grupos (placas)
  totalEnGrupos: 96,           // Total de posiciones
  individuales: 5,             // Muestras individuales (no array)
  detalleGrupos: [
    {
      key: "146-13",           // id_muestra-id_tecnica_proc
      muestra: "26.00066",     // codigo_epi
      tecnica: "Conversión Bisulfito",
      posiciones: 96,          // Número de posiciones en la placa
      placa: "PLACA_001"       // codigo_placa
    }
  ]
}
```

---

## Impacto sin estos Datos

Si el backend NO incluye `tipo_array` y `muestraArray`:

❌ **No se agruparán las externalizaciones** → Todas se mostrarán como individuales
❌ **No se mostrará el código de placa** → Falta información
❌ **No se mostrará la posición** → No se puede identificar A01, A02, etc.
❌ **Experiencia de usuario pobre** → Usuario tiene que buscar manualmente

Con estos datos:

✅ **Agrupación automática** → Todas las posiciones de una placa juntas
✅ **Vista colapsada** → Menos scroll, más organizado
✅ **Código de placa visible** → Fácil identificación
✅ **Posiciones ordenadas** → A01, A02, ..., H12
✅ **Experiencia de usuario excelente** → Información clara y organizada

---

## Próximos Pasos

1. **Backend:** Modificar `GET /externalizaciones` para incluir:
   - `muestra.tipo_array`
   - `tecnica.muestraArray` (con `id_array`, `codigo_placa`, `posicion_placa`)

2. **Verificar:** Ejecutar el endpoint y verificar que devuelva los datos

3. **Frontend:** Una vez que el backend esté corregido, el frontend ya está preparado para:
   - Agrupar automáticamente por `id_muestra + tecnica_proc`
   - Mostrar vista colapsada/expandida
   - Ordenar posiciones alfabéticamente
   - Permitir selección grupal

---

## Ejemplo Real Esperado

Para la muestra `26.00066` con técnica "Conversión Bisulfito" y 96 posiciones:

```json
[
  {
    "id_externalizacion": 235,
    "tecnica": {
      "id_tecnica": 2240,
      "muestra": {
        "id_muestra": 146,
        "codigo_epi": "26.00066",
        "tipo_array": true
      },
      "tecnica_proc": { "id": 13, "tecnica_proc": "Conversión Bisulfito" },
      "muestraArray": { "codigo_placa": "PLACA_001", "posicion_placa": "A01" }
    }
  },
  {
    "id_externalizacion": 236,
    "tecnica": {
      "id_tecnica": 2175,
      "muestra": {
        "id_muestra": 146,
        "codigo_epi": "26.00066",
        "tipo_array": true
      },
      "tecnica_proc": { "id": 13, "tecnica_proc": "Conversión Bisulfito" },
      "muestraArray": { "codigo_placa": "PLACA_001", "posicion_placa": "A02" }
    }
  },
  // ... 94 posiciones más
]
```

Esto se agrupará en **1 grupo** con **96 posiciones**.
