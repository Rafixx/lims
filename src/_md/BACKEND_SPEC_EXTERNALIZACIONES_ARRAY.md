# Especificación Backend: Soporte para Muestras Tipo Array en Externalizaciones

## Endpoint Afectado

```
GET /api/externalizaciones
```

## Problema Actual

El frontend necesita agrupar y mostrar de forma colapsada las externalizaciones que pertenecen a muestras tipo array. Para esto, necesita información adicional que actualmente no está siendo incluida en la respuesta.

## Campos Requeridos Adicionales

### 1. En `tecnica.muestra`

Agregar el campo `tipo_array`:

```typescript
{
  "tecnica": {
    "muestra": {
      "id_muestra": number,
      "codigo_epi": string,
      "codigo_externo": string,
      "estudio": string,
      "tipo_array": boolean  // ⬅️ NUEVO CAMPO REQUERIDO
    }
  }
}
```

**Origen del dato**: Tabla `muestras`, campo `tipo_array`

### 2. En `tecnica.muestraArray` (solo si tipo_array = true)

Agregar objeto con información del array:

```typescript
{
  "tecnica": {
    "muestraArray": {  // ⬅️ NUEVO OBJETO (solo si tipo_array = true)
      "id_array": number,
      "codigo_placa": string,
      "posicion_placa": string
    }
  }
}
```

**Origen del dato**: Tabla `muestras_array`

**Join requerido**:
```sql
LEFT JOIN muestras_array ON tecnicas.id_muestra = muestras_array.id_muestra
  AND tecnicas.id_array = muestras_array.id_array
```

## Ejemplo de Respuesta Actualizada

### Caso 1: Externalización de Muestra Normal (No Array)

```json
{
  "success": true,
  "data": [
    {
      "id_externalizacion": 101,
      "id_tecnica": 1523,
      "agencia": "Laboratorio Externo A",
      "f_envio": "2026-01-25T10:00:00Z",
      "tecnica": {
        "id_tecnica": 1523,
        "id_muestra": 789,
        "tecnica_proc": {
          "id": 5,
          "tecnica_proc": "PCR Tiempo Real"
        },
        "muestra": {
          "id_muestra": 789,
          "codigo_epi": "2026-001234",
          "codigo_externo": "EXT-5678",
          "estudio": "COVID-19",
          "tipo_array": false  // ⬅️ FALSE para muestras normales
        }
        // muestraArray no se incluye cuando tipo_array = false
      }
    }
  ]
}
```

### Caso 2: Externalización de Muestra Tipo Array

```json
{
  "success": true,
  "data": [
    {
      "id_externalizacion": 201,
      "id_tecnica": 2001,
      "agencia": "Laboratorio Externo B",
      "f_envio": "2026-01-25T11:00:00Z",
      "volumen": "50μL",
      "concentracion": "2.5 ng/μL",
      "tecnica": {
        "id_tecnica": 2001,
        "id_muestra": 890,
        "tecnica_proc": {
          "id": 8,
          "tecnica_proc": "Secuenciación NGS"
        },
        "muestra": {
          "id_muestra": 890,
          "codigo_epi": "2026-001235",
          "codigo_externo": null,
          "estudio": "Genómica",
          "tipo_array": true  // ⬅️ TRUE para muestras array
        },
        "muestraArray": {  // ⬅️ INCLUIR cuando tipo_array = true
          "id_array": 1501,
          "codigo_placa": "PLACA-001",
          "posicion_placa": "A1"  // ⬅️ CRÍTICO para identificar posición
        }
      }
    },
    {
      "id_externalizacion": 202,
      "id_tecnica": 2002,
      "agencia": "Laboratorio Externo B",
      "f_envio": "2026-01-25T11:00:00Z",
      "tecnica": {
        "id_tecnica": 2002,
        "id_muestra": 890,
        "tecnica_proc": {
          "id": 8,
          "tecnica_proc": "Secuenciación NGS"
        },
        "muestra": {
          "id_muestra": 890,
          "codigo_epi": "2026-001235",
          "codigo_externo": null,
          "estudio": "Genómica",
          "tipo_array": true
        },
        "muestraArray": {
          "id_array": 1502,
          "codigo_placa": "PLACA-001",
          "posicion_placa": "A2"  // Posición diferente
        }
      }
    }
    // ... más posiciones del mismo array
  ]
}
```

## Lógica de Agrupación en Frontend

El frontend agrupa las externalizaciones usando esta lógica:

```typescript
const key = `${muestra.id_muestra}-${tecnica_proc.id}`

// Todas las externalizaciones con la misma key se agrupan
// Ejemplo: muestra 890 + técnica 8 = "890-8"
// Todas las posiciones A1, A2, A3... H12 se agrupan bajo "890-8"
```

## Impacto en Rendimiento

- **Consulta adicional**: 1 LEFT JOIN a `muestras_array` (solo cuando `tipo_array = true`)
- **Campos adicionales**: 4 campos más por registro
- **Volumen de datos**: Incremento mínimo (~50-100 bytes por registro)

## Query SQL Sugerido (Ejemplo)

```sql
SELECT
  e.*,
  t.id_tecnica,
  t.id_muestra,
  -- otros campos de técnica...
  m.id_muestra,
  m.codigo_epi,
  m.codigo_externo,
  m.estudio,
  m.tipo_array,  -- ⬅️ AGREGAR
  ma.id_array,   -- ⬅️ AGREGAR
  ma.codigo_placa,  -- ⬅️ AGREGAR
  ma.posicion_placa  -- ⬅️ AGREGAR
FROM externalizaciones e
LEFT JOIN tecnicas t ON e.id_tecnica = t.id_tecnica
LEFT JOIN muestras m ON t.id_muestra = m.id_muestra
LEFT JOIN muestras_array ma ON t.id_muestra = ma.id_muestra
  AND t.id_array = ma.id_array  -- ⬅️ JOIN CONDICIONAL
-- ... resto del query
```

## Validación

Para verificar que la implementación es correcta:

1. Crear una muestra tipo array con múltiples posiciones
2. Crear técnicas para varias posiciones
3. Externalizar esas técnicas
4. Llamar al endpoint `/api/externalizaciones`
5. Verificar que:
   - `tipo_array: true` está presente
   - `muestraArray` está presente con `codigo_placa` y `posicion_placa`
   - Cada posición tiene su `posicion_placa` única (A1, A2, B1, etc.)

## Comportamiento en Frontend

Una vez implementado, el frontend:

1. **Agrupa automáticamente** todas las externalizaciones de la misma muestra + técnica
2. **Muestra colapsado** con badge "PLACA" y contador de posiciones
3. **Permite expandir** para ver posiciones individuales
4. **Permite seleccionar** todo el grupo o posiciones individuales
5. **Muestra la posición** (A1, B2, etc.) en cada fila individual

## Pantalla Visual Esperada

```
┌─────────────────────────────────────────────────────────────────┐
│ [✓] [▶] [📊] [PLACA] Genómica - Secuenciación NGS              │
│              PLACA-001 • Código: 2026-001235 • 96 posiciones   │
│              • Lab Externo B • 25/01/2026                       │
└─────────────────────────────────────────────────────────────────┘
```

Al expandir:
```
┌─────────────────────────────────────────────────────────────────┐
│ [✓] [▼] [📊] [PLACA] Genómica - Secuenciación NGS              │
│              PLACA-001 • Código: 2026-001235 • 96 posiciones   │
├─────────────────────────────────────────────────────────────────┤
│ [✓] │ A1  │ Vol: 50μL  │ Servicio │ Técnico │ [✏️][🗑️]         │
│ [✓] │ A2  │ Conc: 2.5  │          │         │ [✏️][🗑️]         │
│ [ ] │ A3  │            │          │         │ [✏️][🗑️]         │
│ ...                                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Prioridad

**ALTA** - Sin estos campos, las externalizaciones de muestras tipo array se mostrarán como items individuales en lugar de agrupadas, dificultando la gestión cuando hay muchas posiciones (96 en un array estándar).

## Contacto

Si tienen dudas sobre la implementación, pueden consultar el código frontend en:
- `src/features/externalizaciones/components/ExternalizacionList/ExternalizacionArrayGroup.tsx`
- `src/features/externalizaciones/pages/ExternalizacionesPage.tsx` (línea 173-194)
