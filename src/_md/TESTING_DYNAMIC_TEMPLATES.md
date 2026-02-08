# Guía de Prueba: Sistema de Plantillas Dinámicas

## Pre-requisitos

1. ✅ Backend implementado con endpoints:
   - `PUT /api/worklists/:id/template-values`
   - `GET /api/worklists/:id` (incluye `json_data.template_values`)
   - `GET /api/tecnicasProc/:id` (incluye `json_data`)

2. ✅ Frontend implementado (sistema completo)

## Paso 1: Preparar Plantilla en Base de Datos

### Insertar plantilla CuQub en `dim_tecnicas_proc`

```sql
-- Actualizar una técnica proc existente (ej: id = 1)
UPDATE dim_tecnicas_proc
SET json_data = '{
  "schemaVersion": "1.0",
  "scope": "PLANTILLA",
  "title": "Cuantificación Qubit",
  "nodes": [
    {
      "type": "procedure",
      "key": "proc_cuqub",
      "label": "Procedimiento de Cuantificación Qubit",
      "steps": [
        {
          "label": "Preparación de reactivos",
          "text": "Preparar el buffer de trabajo mezclando el buffer con el reactivo en proporción 199:1"
        },
        {
          "label": "Carga de muestras",
          "text": "Cargar las muestras en tubos de cuantificación según el número de tubos especificado"
        },
        {
          "label": "Medición",
          "text": "Realizar la medición en el equipo Qubit siguiendo el protocolo estándar"
        }
      ]
    },
    {
      "type": "group",
      "key": "group_calculos",
      "label": "Cálculos de Volúmenes",
      "children": [
        {
          "type": "input",
          "key": "num_tubos",
          "label": "Número de tubos",
          "valueType": "number",
          "required": true,
          "default": 8
        },
        {
          "type": "input",
          "key": "error_factor",
          "label": "Factor de error",
          "valueType": "number",
          "required": true,
          "default": 1.1
        },
        {
          "type": "calc",
          "key": "buffer_ul",
          "label": "Volumen de buffer",
          "valueType": "number",
          "unit": "µL",
          "expr": {
            "lang": "expr",
            "value": "199 * num_tubos * error_factor"
          }
        },
        {
          "type": "calc",
          "key": "reagent_ul",
          "label": "Volumen de reactivo",
          "valueType": "number",
          "unit": "µL",
          "expr": {
            "lang": "expr",
            "value": "num_tubos * error_factor"
          }
        },
        {
          "type": "calc",
          "key": "total_ul",
          "label": "Volumen total",
          "valueType": "number",
          "unit": "µL",
          "expr": {
            "lang": "expr",
            "value": "buffer_ul + reagent_ul"
          }
        }
      ]
    }
  ]
}'::jsonb
WHERE id = 1; -- Reemplazar con ID real de "Cuantificación Qubit"
```

### O crear una nueva técnica proc

```sql
INSERT INTO dim_tecnicas_proc (tecnica_proc, json_data)
VALUES (
  'Cuantificación Qubit',
  '{...}'::jsonb  -- Mismo JSON de arriba
);
```

## Paso 2: Crear Worklist de Prueba

1. Crea un worklist con técnicas que usen la técnica proc "Cuantificación Qubit"
2. Anota el ID del worklist (ej: 123)

## Paso 3: Probar en Frontend

### 3.1. Navegar a Plantilla Técnica

```
http://localhost:5173/worklist/123/plantilla-tecnica
```

### 3.2. Verificar Renderizado

Deberías ver:

#### ✅ Card azul con "Procedimiento de Cuantificación Qubit"
- 3 pasos numerados

#### ✅ Card gris con "Cálculos de Volúmenes"
- **Input**: Número de tubos (con valor 8)
- **Input**: Factor de error (con valor 1.1)
- **Calc** (púrpura): Volumen de buffer = 1751.2 µL
- **Calc** (púrpura): Volumen de reactivo = 8.8 µL
- **Calc** (púrpura): Volumen total = 1760 µL

#### ✅ Botón "Guardar Plantilla"

### 3.3. Probar Cálculo en Tiempo Real

1. **Cambiar "Número de tubos" a 10**
   - Buffer debe cambiar a: `199 * 10 * 1.1 = 2189 µL`
   - Reactivo debe cambiar a: `10 * 1.1 = 11 µL`
   - Total debe cambiar a: `2189 + 11 = 2200 µL`

2. **Cambiar "Factor de error" a 1.2**
   - Buffer debe cambiar a: `199 * 10 * 1.2 = 2388 µL`
   - Reactivo debe cambiar a: `10 * 1.2 = 12 µL`
   - Total debe cambiar a: `2388 + 12 = 2400 µL`

✅ **Resultado esperado**: Los valores calculados se actualizan **inmediatamente** sin necesidad de guardar.

### 3.4. Probar Validación

1. **Borrar el valor de "Número de tubos"**
   - Debe aparecer mensaje de error: "Número de tubos es obligatorio"
   - Botón "Guardar Plantilla" debe deshabilitarse
   - Los calcs deben mostrar "—" (no valores)

2. **Escribir texto en lugar de número**
   - Debe aparecer mensaje de error: "Número de tubos debe ser un número válido"
   - Botón "Guardar Plantilla" debe deshabilitarse

3. **Restaurar valores válidos**
   - Errores desaparecen
   - Botón se habilita
   - Calcs vuelven a mostrar valores

### 3.5. Probar Persistencia

1. **Modificar valores**:
   - Número de tubos: 12
   - Factor de error: 1.15

2. **Click en "Guardar Plantilla"**
   - Debe mostrar notificación: "Valores de plantilla guardados correctamente"

3. **Verificar en DevTools (Network tab)**:
   ```
   PUT /api/worklists/123/template-values

   Request Body:
   {
     "template_values": {
       "num_tubos": 12,
       "error_factor": 1.15
     }
   }
   ```

4. **Recargar la página** (F5)
   - Los valores deben mantenerse: 12 y 1.15
   - Los calcs deben recalcularse automáticamente:
     - Buffer: `199 * 12 * 1.15 = 2746.2 µL`
     - Reactivo: `12 * 1.15 = 13.8 µL`
     - Total: `2760 µL`

### 3.6. Verificar en Base de Datos

```sql
SELECT json_data FROM worklist WHERE id_worklist = 123;
```

**Resultado esperado**:
```json
{
  "template_values": {
    "num_tubos": 12,
    "error_factor": 1.15
  }
}
```

**Importante**: Solo deben guardarse los **inputs**, NO los calcs.

## Paso 4: Pruebas de Integración

### 4.1. Worklist sin Plantilla

1. Navegar a un worklist que use una técnica proc SIN `json_data`
2. No debe aparecer el renderizador de plantilla dinámica
3. Solo deben mostrarse las secciones normales (Técnicas, Pipetas, Reactivos, Pasos)

### 4.2. Múltiples Worklists

1. Crear varios worklists con la misma técnica proc
2. Guardar valores diferentes en cada uno
3. Verificar que cada worklist mantiene sus propios valores

### 4.3. Plantilla Inválida

1. Insertar JSON inválido en `dim_tecnicas_proc.json_data`:
   ```sql
   UPDATE dim_tecnicas_proc
   SET json_data = '{"invalid": true}'::jsonb
   WHERE id = 1;
   ```

2. El renderizador NO debe aparecer (validación falla)
3. Las secciones normales deben seguir funcionando

## Casos de Prueba Adicionales

### Test 1: Valores por Defecto

1. Crear nuevo worklist (sin valores guardados)
2. Abrir plantilla técnica
3. Verificar que aparecen los valores por defecto:
   - Número de tubos: 8
   - Factor de error: 1.1

### Test 2: Actualización Incremental

1. Guardar `json_data` con otros campos:
   ```sql
   UPDATE worklist
   SET json_data = '{"other_data": "test"}'::jsonb
   WHERE id_worklist = 123;
   ```

2. Guardar valores desde frontend
3. Verificar que `other_data` se preserva:
   ```json
   {
     "other_data": "test",
     "template_values": {
       "num_tubos": 8,
       "error_factor": 1.1
     }
   }
   ```

### Test 3: Expresiones Complejas

Crear plantilla con expresiones más complejas:

```json
{
  "type": "calc",
  "key": "test_expr",
  "label": "Prueba",
  "valueType": "number",
  "expr": {
    "lang": "expr",
    "value": "round(min(100, max(0, num_tubos * 2.5)), 2)"
  }
}
```

Verificar que:
- `min()` funciona
- `max()` funciona
- `round()` funciona
- Precedencia de operadores es correcta

## Checklist Final

- [ ] Plantilla se renderiza correctamente
- [ ] Inputs editables funcionan
- [ ] Calcs se actualizan en tiempo real
- [ ] Validación funciona (required, tipos)
- [ ] Guardar persiste solo inputs
- [ ] Recargar restaura valores
- [ ] Calcs se recalculan al recargar
- [ ] Worklists diferentes tienen valores independientes
- [ ] JSON inválido no rompe la página
- [ ] Worklists sin plantilla funcionan normal
- [ ] Actualización incremental preserva otros datos

## Troubleshooting

### Problema: No aparece el renderizador

**Causa**: Plantilla no válida o no existe

**Solución**:
1. Verificar en DevTools (Network) que `/api/tecnicasProc/:id` retorna `json_data`
2. Verificar en consola si hay errores de validación
3. Verificar estructura del JSON con `validateTemplate()`

### Problema: Calcs no se actualizan

**Causa**: Error en expresión o variable faltante

**Solución**:
1. Abrir consola del navegador
2. Buscar errores de `expressionEvaluator`
3. Verificar que las keys en `expr.value` coinciden con keys de inputs

### Problema: Valores no se guardan

**Causa**: Endpoint no disponible o error en request

**Solución**:
1. Verificar en Network tab la request PUT
2. Verificar respuesta del servidor
3. Verificar notificaciones en pantalla

### Problema: Valores no se restauran al recargar

**Causa**: GET no incluye `json_data.template_values`

**Solución**:
1. Verificar en Network tab que GET incluye `json_data`
2. Verificar en DB que los valores están guardados
3. Verificar que el servicio extrae correctamente `json_data?.template_values`

## Contacto

Para reportar bugs o solicitar ayuda, revisar:
- `DYNAMIC_TEMPLATE_SYSTEM.md` - Documentación completa
- `src/features/plantillaTecnica/examples/cuqub-template.json` - Ejemplo de referencia
