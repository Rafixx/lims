# Referencia de Expresiones - Motor de Cálculo

## Funciones Soportadas

### 1. `min(a, b)` - Valor Mínimo

Retorna el menor de dos números.

**Sintaxis:**
```
min(valor1, valor2)
```

**Ejemplos:**
```javascript
min(10, 20)           // → 10
min(num_tubos, 50)    // → menor entre num_tubos y 50
min(buffer_ul, 1000)  // → menor entre buffer_ul y 1000
```

**Casos especiales:**
- Si algún argumento es `undefined` → retorna `undefined`
- Si algún argumento es `NaN` → retorna `undefined`
- Requiere exactamente 2 argumentos

### 2. `max(a, b)` - Valor Máximo

Retorna el mayor de dos números.

**Sintaxis:**
```
max(valor1, valor2)
```

**Ejemplos:**
```javascript
max(5, 10)            // → 10
max(num_tubos, 0)     // → asegura que no sea negativo
max(buffer_ul, 100)   // → mayor entre buffer_ul y 100
```

**Casos especiales:**
- Si algún argumento es `undefined` → retorna `undefined`
- Si algún argumento es `NaN` → retorna `undefined`
- Requiere exactamente 2 argumentos

### 3. `round(x, decimales)` - Redondeo

Redondea un número a N decimales.

**Sintaxis:**
```
round(valor)           // 0 decimales (entero)
round(valor, n)        // n decimales
```

**Ejemplos:**
```javascript
round(3.14159)         // → 3
round(3.14159, 2)      // → 3.14
round(buffer_ul, 1)    // → redondea buffer_ul a 1 decimal
round(2.5)             // → 3 (redondeo bancario)
```

**Casos especiales:**
- Si el valor es `undefined` → retorna `undefined`
- Si el valor es `NaN` → retorna `undefined`
- Si decimales no se especifica → usa 0
- Acepta 1 o 2 argumentos

## Operadores Soportados

### Aritméticos

| Operador | Descripción | Ejemplo | Resultado |
|----------|-------------|---------|-----------|
| `+` | Suma | `5 + 3` | `8` |
| `-` | Resta | `10 - 7` | `3` |
| `*` | Multiplicación | `4 * 5` | `20` |
| `/` | División | `20 / 4` | `5` |

### Paréntesis

Los paréntesis controlan la precedencia de evaluación:

```javascript
2 + 3 * 4       // → 14 (multiplicación primero)
(2 + 3) * 4     // → 20 (suma primero)
```

## Precedencia de Operadores

De mayor a menor precedencia:

1. **Paréntesis** `( )`
2. **Multiplicación y División** `*` `/`
3. **Suma y Resta** `+` `-`

**Ejemplos:**
```javascript
2 + 3 * 4           // → 14
(2 + 3) * 4         // → 20
10 - 2 * 3          // → 4
(10 - 2) * 3        // → 24
199 * num_tubos * error_factor  // → evalúa izquierda a derecha
```

## Variables en Expresiones

### Referencias a Inputs

Puedes referenciar cualquier input por su `key`:

```json
{
  "type": "input",
  "key": "num_tubos",
  "label": "Número de tubos",
  "valueType": "number"
}
```

**En expresión:**
```javascript
num_tubos * 2
199 * num_tubos
```

### Referencias a Calcs

También puedes referenciar otros calcs:

```json
{
  "type": "calc",
  "key": "buffer_ul",
  "expr": { "lang": "expr", "value": "199 * num_tubos" }
},
{
  "type": "calc",
  "key": "total_ul",
  "expr": { "lang": "expr", "value": "buffer_ul + reagent_ul" }
}
```

**Resolución de dependencias:**
- El motor hace hasta **3 pasadas** para resolver dependencias
- Calcs que dependen de otros calcs se calculan en orden automáticamente
- Si después de 3 pasadas no se puede resolver → retorna `undefined`

## Manejo de Casos Especiales

### 1. Variables Faltantes

Si una variable no existe o está vacía:

```javascript
// Si num_tubos está vacío:
199 * num_tubos  // → undefined (no NaN)
```

**Comportamiento:**
- Expresión retorna `undefined`
- UI muestra "—"
- Botón guardar se deshabilita si el input es requerido

### 2. División por Cero

```javascript
10 / 0           // → undefined (no Infinity)
buffer_ul / 0    // → undefined
```

**Comportamiento:**
- No genera error
- Retorna `undefined`
- UI muestra "—"

### 3. NaN (Not a Number)

```javascript
0 / 0            // → undefined (no NaN)
sqrt(-1)         // → undefined
```

**Comportamiento:**
- Cualquier resultado `NaN` se convierte a `undefined`
- UI muestra "—"

### 4. Infinity

```javascript
1e308 * 2        // → undefined (no Infinity)
max(1e308, 2)    // → undefined
```

**Comportamiento:**
- Cualquier resultado `Infinity` o `-Infinity` se convierte a `undefined`
- UI muestra "—"

## Ejemplos Completos

### Ejemplo 1: Cálculo Simple con Validación

```json
{
  "type": "calc",
  "key": "total_volume",
  "label": "Volumen total",
  "valueType": "number",
  "unit": "µL",
  "expr": {
    "lang": "expr",
    "value": "max(0, num_samples * 200)"
  }
}
```

**Garantiza:** El resultado nunca será negativo.

### Ejemplo 2: Cálculo con Redondeo

```json
{
  "type": "calc",
  "key": "concentration",
  "label": "Concentración final",
  "valueType": "number",
  "unit": "ng/µL",
  "expr": {
    "lang": "expr",
    "value": "round(total_dna / total_volume, 2)"
  }
}
```

**Muestra:** Resultado con 2 decimales.

### Ejemplo 3: Dependencias entre Calcs

```json
{
  "type": "calc",
  "key": "buffer_ul",
  "expr": { "lang": "expr", "value": "199 * num_tubos" }
},
{
  "type": "calc",
  "key": "reagent_ul",
  "expr": { "lang": "expr", "value": "num_tubos * error_factor" }
},
{
  "type": "calc",
  "key": "total_ul",
  "expr": { "lang": "expr", "value": "buffer_ul + reagent_ul" }
}
```

**Orden de cálculo:**
1. Pasada 1: Calcula `buffer_ul` y `reagent_ul` (dependen solo de inputs)
2. Pasada 2: Calcula `total_ul` (depende de otros calcs)

### Ejemplo 4: Límites con min/max

```json
{
  "type": "calc",
  "key": "safe_volume",
  "label": "Volumen seguro",
  "valueType": "number",
  "unit": "µL",
  "expr": {
    "lang": "expr",
    "value": "min(max(requested_volume, 50), 1000)"
  }
}
```

**Comportamiento:**
- Si `requested_volume < 50` → retorna 50
- Si `requested_volume > 1000` → retorna 1000
- Si `50 ≤ requested_volume ≤ 1000` → retorna el valor tal cual

## Limitaciones Conocidas

### ❌ No Soportado

1. **Funciones no implementadas:**
   - `sqrt()`, `pow()`, `abs()` → agregar si es necesario
   - Funciones trigonométricas
   - Funciones estadísticas complejas

2. **Operadores no soportados:**
   - Módulo `%`
   - Potencia `**`
   - Comparación `<`, `>`, `==`
   - Lógicos `&&`, `||`, `!`

3. **Strings:**
   - No hay concatenación de strings
   - No hay interpolación
   - Solo operaciones numéricas

4. **Arrays:**
   - No hay soporte para arrays
   - No hay funciones como `sum()`, `avg()`

### ✅ Extensible

Para agregar nuevas funciones, editar:
```typescript
// src/features/plantillaTecnica/utils/expressionEvaluator.ts

function evaluateFunction(name: string, args: (number | undefined)[]): number | undefined {
  // ...
  case 'sqrt':
    if (numArgs.length !== 1) throw new Error('sqrt() requiere 1 argumento')
    if (numArgs[0] < 0) return undefined // raíz de negativo = undefined
    return Math.sqrt(numArgs[0])
  // ...
}
```

## Testing de Expresiones

### Probar en Consola del Navegador

```javascript
import { evaluateExpression } from '@/features/plantillaTecnica/utils/expressionEvaluator'

// Caso básico
evaluateExpression('2 + 3', {})  // → 5

// Con variables
evaluateExpression('num_tubos * 2', { num_tubos: 8 })  // → 16

// Con funciones
evaluateExpression('min(10, num_tubos)', { num_tubos: 5 })  // → 5

// Variable faltante
evaluateExpression('num_tubos * 2', {})  // → undefined

// División por cero
evaluateExpression('10 / 0', {})  // → undefined
```

## Mejores Prácticas

### ✅ DO

1. **Usar nombres descriptivos para variables:**
   ```javascript
   buffer_volume_ul  // ✅ Claro
   bv                // ❌ Confuso
   ```

2. **Documentar unidades en labels:**
   ```json
   {
     "key": "volume_ul",
     "label": "Volumen",
     "unit": "µL"  // ← Importante
   }
   ```

3. **Validar rangos con min/max:**
   ```javascript
   max(0, calculated_value)  // Nunca negativo
   min(calculated_value, 1000)  // Máximo 1000
   ```

4. **Usar round para presentación:**
   ```javascript
   round(calculated_value, 2)  // 2 decimales
   ```

### ❌ DON'T

1. **No asumir que las variables existen:**
   ```javascript
   optional_var * 2  // Puede ser undefined
   ```

2. **No ignorar división por cero:**
   ```javascript
   total / count  // Si count = 0 → undefined
   ```

3. **No usar nombres con espacios:**
   ```javascript
   "num tubos"  // ❌ Error de sintaxis
   "num_tubos"  // ✅ Correcto
   ```

## Soporte y Debugging

### Logs de Error

El motor registra errores en consola:

```
Error evaluando expresión: num_tubos * 2
Error: Variable 'num_tubos' not found
```

### Verificar Expresión

En DevTools → Components → DynamicTemplateRenderer → calculatedValues:

```javascript
{
  buffer_ul: 1751.2,     // ✅ Calculado
  reagent_ul: undefined, // ⚠️ Falta variable o error
  total_ul: undefined    // ⚠️ Depende de reagent_ul
}
```

### Mensajes de Error Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Variable 'x' not found` | Input vacío o no existe | Llenar el input |
| `Division by zero` | Dividiendo por 0 | Validar denominador |
| `Function 'xyz' unknown` | Función no implementada | Usar solo min/max/round |
| `Expected ')'` | Paréntesis desbalanceados | Revisar expresión |

## Changelog

### v1.0 (Actual)
- ✅ Operadores: `+`, `-`, `*`, `/`, `()`
- ✅ Funciones: `min()`, `max()`, `round()`
- ✅ Manejo de `undefined`, `NaN`, `Infinity`
- ✅ Resolución de dependencias (3 pasadas)
- ✅ Validación estricta de tipos

### Futuro (Opcional)
- ⏳ `sqrt()`, `abs()`, `pow()`
- ⏳ Funciones agregadas: `sum()`, `avg()` para arrays
- ⏳ Operadores de comparación: `<`, `>`, `==`
- ⏳ Condicionales: `if(condition, then, else)`
