# Backend: Campos Requeridos para muestra_array

## 🔴 PROBLEMA IDENTIFICADO

Los campos `codigo_epi` y `codigo_externo` de la tabla `muestra_array` **NO están siendo incluidos** en las respuestas del backend cuando se consultan externalizaciones.

## 📊 Contexto

La tabla `muestra_array` ahora incluye estos campos:

```sql
ALTER TABLE lims_pre.muestra_array ADD codigo_epi varchar(50) DEFAULT NULL::character varying NULL;
ALTER TABLE lims_pre.muestra_array ADD codigo_externo varchar(50) DEFAULT NULL::character varying NULL;
```

Estos campos se auto-generan al crear una nueva muestra array, del mismo modo que `codigo_epi` se genera para muestras normales.

## 🎯 Endpoints que Deben Actualizar sus Respuestas

### 1. **GET /api/externalizaciones**
### 2. **GET /api/externalizaciones/pendientes**
### 3. **GET /api/externalizaciones/tecnica/:idTecnica**
### 4. **GET /api/externalizaciones/centro/:idCentro**
### 5. **GET /api/externalizaciones/:id**
### 6. **PATCH /api/externalizaciones/:id/marcar-recibida**

Todos estos endpoints deben incluir los nuevos campos en el objeto `muestraArray`.

## ✅ Estructura de Respuesta Requerida

### Respuesta Actual (INCOMPLETA ❌)

```json
{
  "success": true,
  "data": [
    {
      "id_externalizacion": 226,
      "id_tecnica": 2149,
      "tecnica": {
        "id_tecnica": 2149,
        "id_muestra": 146,
        "muestraArray": {
          "id_array": 515,
          "codigo_placa": "PLACA6X2",
          "posicion_placa": "1A"
          // ❌ FALTAN codigo_epi y codigo_externo
        }
      }
    }
  ]
}
```

### Respuesta Esperada (COMPLETA ✅)

```json
{
  "success": true,
  "data": [
    {
      "id_externalizacion": 226,
      "id_tecnica": 2149,
      "volumen": null,
      "concentracion": null,
      "servicio": "Secuenciación",
      "f_envio": "2026-01-25T18:33:00.000Z",
      "f_recepcion": null,
      "f_recepcion_datos": null,
      "agencia": "Laboratorio Externo",
      "observaciones": "",
      "tecnica": {
        "id_tecnica": 2149,
        "id_muestra": 146,
        "id_array": 515,
        "fecha_inicio_tec": null,
        "id_estado": 17,
        "fecha_estado": "2026-01-25T19:33:55.554Z",
        "comentarios": null,
        "estadoInfo": {
          "id": 17,
          "estado": "ENVIADA_EXT",
          "color": "#fff3e0",
          "descripcion": "Enviada a laboratorio externo"
        },
        "tecnica_proc": {
          "id": 13,
          "tecnica_proc": "Conversión Bisulfito"
        },
        "muestra": {
          "id_muestra": 146,
          "codigo_epi": "26.00066",
          "codigo_externo": "GR-MUE-2026-Test066",
          "estudio": "EST_2026066",
          "tipo_array": true
        },
        "muestraArray": {
          "id_array": 515,
          "id_muestra": 146,
          "codigo_placa": "PLACA6X2",
          "posicion_placa": "1A",
          "codigo_epi": "26.00066",      // ✅ NUEVO - Auto-generado
          "codigo_externo": "GR-MUE-2026-Test066"  // ✅ NUEVO - Auto-generado
        }
      },
      "centro": {
        "id": 1,
        "codigo": "001",
        "descripcion": "HOSPITAL LA FE"
      },
      "tecnico_resp": {
        "id_usuario": 4,
        "nombre": "Tecnico"
      }
    }
  ]
}
```

## 📝 SQL Queries que Deben Actualizarse

### Ejemplo de SELECT correcto

```sql
SELECT
  e.*,
  -- Técnica con JOINs anidados
  json_build_object(
    'id_tecnica', t.id_tecnica,
    'id_muestra', t.id_muestra,
    'id_array', t.id_array,
    'fecha_inicio_tec', t.fecha_inicio_tec,
    'id_estado', t.id_estado,
    'fecha_estado', t.fecha_estado,
    'comentarios', t.comentarios,
    'estadoInfo', (
      SELECT json_build_object(
        'id', es.id_estado,
        'estado', es.estado,
        'color', es.color,
        'descripcion', es.descripcion
      )
      FROM dim_estados es
      WHERE es.id_estado = t.id_estado
    ),
    'tecnica_proc', (
      SELECT json_build_object(
        'id', tp.id,
        'tecnica_proc', tp.tecnica_proc
      )
      FROM dim_tecnicas_proc tp
      WHERE tp.id = t.id_tecnica_proc
    ),
    'muestra', (
      SELECT json_build_object(
        'id_muestra', m.id_muestra,
        'codigo_epi', m.codigo_epi,
        'codigo_externo', m.codigo_externo,
        'estudio', m.estudio,
        'tipo_array', m.tipo_array
      )
      FROM muestra m
      WHERE m.id_muestra = t.id_muestra
    ),
    'muestraArray', (
      SELECT json_build_object(
        'id_array', ma.id_array,
        'id_muestra', ma.id_muestra,
        'codigo_placa', ma.codigo_placa,
        'posicion_placa', ma.posicion_placa,
        'codigo_epi', ma.codigo_epi,              -- ✅ INCLUIR
        'codigo_externo', ma.codigo_externo       -- ✅ INCLUIR
      )
      FROM muestra_array ma
      WHERE ma.id_array = t.id_array
    )
  ) as tecnica,
  -- Centro
  json_build_object(
    'id', c.id,
    'codigo', c.codigo,
    'descripcion', c.descripcion
  ) as centro,
  -- Técnico responsable
  json_build_object(
    'id_usuario', tec.id_usuario,
    'nombre', tec.nombre
  ) as tecnico_resp
FROM externalizaciones e
LEFT JOIN tecnica t ON t.id_tecnica = e.id_tecnica
LEFT JOIN dim_centros c ON c.id = e.id_centro
LEFT JOIN dim_tecnicos_laboratorio tec ON tec.id_usuario = e.id_tecnico_resp
WHERE e.delete_dt IS NULL
ORDER BY e.id_externalizacion DESC;
```

### Puntos Clave en el SQL:

1. **Incluir campos en el SELECT de muestraArray**:
   ```sql
   'codigo_epi', ma.codigo_epi,
   'codigo_externo', ma.codigo_externo
   ```

2. **Asegurarse de que el JOIN con muestra_array esté correctamente estructurado**:
   ```sql
   WHERE ma.id_array = t.id_array
   ```

## 🔍 Verificación

Para verificar que los campos se están devolviendo correctamente:

### 1. **Consulta SQL directa**:
```sql
SELECT
  id_array,
  codigo_placa,
  posicion_placa,
  codigo_epi,
  codigo_externo
FROM muestra_array
WHERE id_array = 515;
```

**Resultado esperado**:
```
id_array | codigo_placa | posicion_placa | codigo_epi | codigo_externo
---------|--------------|----------------|------------|------------------
515      | PLACA6X2     | 1A             | 26.00066   | GR-MUE-2026-Test066
```

### 2. **Endpoint de prueba**:
```bash
curl -X GET "http://localhost:3002/api/externalizaciones/226" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq '.data.tecnica.muestraArray'
```

**Resultado esperado**:
```json
{
  "id_array": 515,
  "id_muestra": 146,
  "codigo_placa": "PLACA6X2",
  "posicion_placa": "1A",
  "codigo_epi": "26.00066",
  "codigo_externo": "GR-MUE-2026-Test066"
}
```

## 🎯 Otros Endpoints Relacionados

Los siguientes endpoints también deben incluir estos campos si devuelven información de `muestraArray`:

### Worklists
- **GET /api/worklists/:id**
- **GET /api/worklists/:id/tecnicas**

### Técnicas
- **GET /api/tecnicas/:id**
- **GET /api/muestras/:id/tecnicas**

### Estructura en estos endpoints:
```json
{
  "id_tecnica": 2149,
  "muestraArray": {
    "id_array": 515,
    "id_muestra": 146,
    "codigo_placa": "PLACA6X2",
    "posicion_placa": "1A",
    "codigo_epi": "26.00066",          // ✅ REQUERIDO
    "codigo_externo": "GR-MUE-2026-Test066"  // ✅ REQUERIDO
  }
}
```

## ⚠️ Impacto de NO Incluir estos Campos

Sin estos campos, el frontend:
- ❌ No puede mostrar los códigos individuales de cada posición del array
- ❌ El mapeo automático de resultados es menos preciso
- ❌ La identificación de muestras en los worklists es ambigua
- ❌ Los tooltips y detalles están incompletos
- ❌ La trazabilidad de cada posición individual se pierde

## ✅ Checklist de Implementación Backend

- [ ] Actualizar consultas SQL para incluir `codigo_epi` y `codigo_externo` de `muestra_array`
- [ ] Verificar que los campos se devuelven en GET /api/externalizaciones
- [ ] Verificar que los campos se devuelven en GET /api/externalizaciones/:id
- [ ] Verificar que los campos se devuelven en GET /api/worklists/:id
- [ ] Verificar que los campos se devuelven en GET /api/tecnicas/:id
- [ ] Probar con datos reales que los valores son correctos
- [ ] Documentar los cambios en la API

## 📋 Resumen

**Acción Requerida**: Actualizar todos los endpoints que devuelven información de `tecnica` con `muestraArray` para incluir los campos `codigo_epi` y `codigo_externo`.

**Campos a añadir**:
- `muestraArray.codigo_epi` (string | null)
- `muestraArray.codigo_externo` (string | null)

**Prioridad**: Alta - El frontend ya está preparado para recibir y mostrar estos datos.
