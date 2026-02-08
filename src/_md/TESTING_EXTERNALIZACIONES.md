# Guía de Pruebas - Sistema de Externalizaciones

## Escenarios de Prueba Implementados

### 1. ✅ Externalización Exitosa

**Pasos:**
1. Ir a "Gestión de Externalizaciones"
2. Hacer clic en el botón "+" (Añadir técnicas)
3. Seleccionar técnicas que NO estén externalizadas
4. Hacer clic en "Externalizar"

**Resultado Esperado:**
```
✓ Notificación verde: "X técnica(s) externalizada(s) correctamente"
✓ Modal se cierra
✓ Listado se actualiza automáticamente
✓ Las técnicas ahora aparecen en el listado con estado EXTERNALIZADA
```

---

### 2. ❌ Error: Técnica Ya Externalizada (409 Conflict)

**Pasos:**
1. Intentar externalizar UNA técnica que ya tiene una externalización activa
2. El backend debe devolver:
   ```json
   {
     "success": false,
     "message": "Ya existe una externalización activa para la técnica 1611 (ID: 12)"
   }
   ```

**Resultado Esperado:**
```
✗ Notificación roja con el mensaje EXACTO del backend:
  "Ya existe una externalización activa para la técnica 1611 (ID: 12)"

✓ El modal NO se cierra (para que el usuario pueda corregir la selección)
✓ Console.debug muestra detalles del error
```

---

### 3. ⚠️ Error Múltiple: Varias Técnicas Ya Externalizadas

**Pasos:**
1. Intentar externalizar MÚLTIPLES técnicas (ej: 5 técnicas)
2. Todas ya tienen externalización activa
3. El backend devuelve error 409 para cada una

**Resultado Esperado:**

**Si todas tienen el MISMO error:**
```
⚠ Notificación roja:
  "Ya existe una externalización activa para la técnica... (5 técnicas)"

✓ Console.error muestra lista detallada de errores
✓ Console.table muestra tabla con ID Técnica y Error
```

**Si tienen DIFERENTES errores:**
```
⚠ Notificación roja:
  "No se pudo externalizar ninguna técnica. 5 error(es) encontrado(s).
   Revisa la consola para detalles."

✓ Console.error muestra lista de errores
✓ Console.table muestra tabla detallada
```

---

### 4. ⚠️ Éxito Parcial: Algunas Exitosas, Algunas Fallaron

**Pasos:**
1. Seleccionar 10 técnicas
2. 7 son válidas (sin externalización previa)
3. 3 ya tienen externalización activa

**Resultado Esperado:**
```
⚠ Notificación amarilla/warning:
  "7 técnica(s) externalizada(s), 3 fallaron.
   Revisa la consola para detalles."

✓ Las 7 exitosas se procesaron correctamente
✓ Modal se cierra
✓ Listado se actualiza con las 7 nuevas externalizaciones
✓ Console.warn muestra las 3 que fallaron con sus errores
✓ Console.table muestra tabla detallada de fallos
```

---

## Verificación del Backend

### Endpoint: `POST /externalizaciones`

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id_externalizacion": 12,
    "id_tecnica": 1611,
    ...
  }
}
```

**Respuesta Error 409 (Conflict):**
```json
{
  "success": false,
  "message": "Ya existe una externalización activa para la técnica 1611 (ID: 12)"
}
```

---

## Logs en Consola del Navegador

### Para Debugging Individual (Console.debug)
```javascript
Error externalizando técnica 1611: {
  status: 409,
  message: "Ya existe una externalización activa para la técnica 1611 (ID: 12)",
  fullError: {...}
}
```

### Para Errores Múltiples (Console.error + Console.table)
```javascript
// Array de errores
[
  { id_tecnica: 1611, error: "Ya existe una externalización activa..." },
  { id_tecnica: 1612, error: "Ya existe una externalización activa..." },
  { id_tecnica: 1613, error: "Ya existe una externalización activa..." }
]

// Tabla formateada
┌─────────┬────────────┬──────────────────────────────────────────┐
│ (index) │ ID Técnica │ Error                                    │
├─────────┼────────────┼──────────────────────────────────────────┤
│    0    │    1611    │ "Ya existe una externalización activa..." │
│    1    │    1612    │ "Ya existe una externalización activa..." │
│    2    │    1613    │ "Ya existe una externalización activa..." │
└─────────┴────────────┴──────────────────────────────────────────┘
```

---

## Flujo de Datos

```
Usuario selecciona técnicas
    ↓
SeleccionarTecnicasModal
    ↓
useExternalizarTecnicas (Promise.allSettled)
    ↓
externalizacionesService.createExternalizacion (para cada técnica)
    ↓
Backend POST /externalizaciones
    ↓
┌─────────────────┬─────────────────┐
│   Éxito (201)   │  Error (409)    │
├─────────────────┼─────────────────┤
│ success: true   │ success: false  │
│ data: {...}     │ message: "..."  │
└─────────────────┴─────────────────┘
    ↓                    ↓
{ success: true }  { success: false, error: "mensaje del backend" }
    ↓
Agrupar resultados: { successful: [...], failed: [...] }
    ↓
Mostrar notificación según caso:
- Todas exitosas → Success
- Todas fallaron → Error (con mensaje del backend)
- Parcial → Warning
```

---

## Notas Importantes

1. **El mensaje del backend siempre se muestra al usuario** en caso de error
2. **No se pierde información**: Si 1 de 10 falla, las otras 9 se procesan
3. **Logs detallados**: Siempre disponibles en consola para diagnóstico
4. **UX clara**: El usuario sabe exactamente qué pasó y por qué

---

## Comandos de Verificación

```bash
# Compilar TypeScript
npm run build

# Ejecutar en desarrollo
npm run dev

# Ver logs del backend
# (verificar que devuelve los mensajes esperados)
```
