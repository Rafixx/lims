# 🎲 Generador de Códigos para Worklists

## 📋 Descripción

Sistema de generación automática de códigos únicos para listas de trabajo (worklists) basados en el patrón: **`LT/[AÑO][MES]-[TECNICA_PROC]`**

---

## 🚀 Uso en la Aplicación

### Generación Automática

Cuando creas un nuevo worklist:

1. **Selecciona el tipo de proceso técnico** del dropdown
2. **El código se genera automáticamente** usando el patrón por defecto
3. **Puedes editarlo manualmente** si lo necesitas
4. **Regenera el código** haciendo clic en el botón de refresh

### Patrón Por Defecto

```
LT/[AÑO][MES]-[TECNICA]
```

**Ejemplo:**

- Proceso: `PCR`
- Fecha: Noviembre 2025
- **Resultado:** `LT/202511-PCR`

---

## 📦 API del Generador

### Función Principal

```typescript
import { generateWorklistCodigo } from '@/features/workList/utils/worklistCodigoGenerator'

// Con proceso técnico
const codigo = generateWorklistCodigo('PCR')
// Resultado: "LT/202511-PCR"

// Sin proceso (temporal)
const codigo = generateWorklistCodigo()
// Resultado: "LT/202511-TEMP"

// Con proceso largo (se trunca automáticamente)
const codigo = generateWorklistCodigo('Microbiología Avanzada')
// Resultado: "LT/202511-MICROBIO"
```

### Características del Procesamiento

El nombre de la técnica se procesa automáticamente:

1. **Normalización a mayúsculas**: `PCR` → `PCR`
2. **Eliminación de espacios y caracteres especiales**: `PCR-RT` → `PCRRT`
3. **Truncado a 8 caracteres**: `Microbiología` → `MICROBIO`
4. **Valor temporal si está vacío**: `""` → `TEMP`

---

## 🎨 Patrones Personalizados

### Usar un Patrón Diferente

```typescript
import {
  generateWorklistCodigoFromPattern,
  WORKLIST_CODIGO_PATTERNS
} from '@/features/workList/utils/worklistCodigoGenerator'

// Patrón simple
const codigo1 = generateWorklistCodigoFromPattern('WL-[YYYY]-[MM]-[TECNICA]', 'PCR')
// Resultado: "WL-2025-11-PCR"

// Con día incluido
const codigo2 = generateWorklistCodigoFromPattern('LT/[YYYY][MM][DD]-[TECNICA]', 'Microbiología')
// Resultado: "LT/20251110-MICROBIO"

// Con número aleatorio
const codigo3 = generateWorklistCodigoFromPattern('LT-[YY][MM]-[TECNICA]-[RND:3]', 'PCR')
// Resultado: "LT-2511-PCR-742"
```

### Placeholders Disponibles

| Placeholder        | Descripción                    | Ejemplo            |
| ------------------ | ------------------------------ | ------------------ |
| `[AÑO]` o `[YYYY]` | Año completo                   | `2025`             |
| `[YY]`             | Año corto                      | `25`               |
| `[MES]` o `[MM]`   | Mes (01-12)                    | `11`               |
| `[DIA]` o `[DD]`   | Día (01-31)                    | `10`               |
| `[HORA]` o `[HH]`  | Hora (00-23)                   | `14`               |
| `[TECNICA]`        | Nombre procesado de la técnica | `PCR`              |
| `[RND:N]`          | Número aleatorio de N dígitos  | `[RND:4]` → `7432` |

---

## 📚 Patrones Predefinidos

```typescript
import { WORKLIST_CODIGO_PATTERNS } from '@/features/workList/utils/worklistCodigoGenerator'

// Patrón por defecto
WORKLIST_CODIGO_PATTERNS.DEFAULT
// "LT/[AÑO][MES]-[TECNICA]"
// Resultado: "LT/202511-PCR"

// Patrón simple
WORKLIST_CODIGO_PATTERNS.SIMPLE
// "WL-[YYYY]-[MM]-[TECNICA]"
// Resultado: "WL-2025-11-PCR"

// Con día
WORKLIST_CODIGO_PATTERNS.WITH_DAY
// "LT/[YYYY][MM][DD]-[TECNICA]"
// Resultado: "LT/20251110-PCR"

// Con número aleatorio
WORKLIST_CODIGO_PATTERNS.WITH_RANDOM
// "LT-[YY][MM]-[TECNICA]-[RND:3]"
// Resultado: "LT-2511-PCR-742"

// Timestamp completo
WORKLIST_CODIGO_PATTERNS.TIMESTAMP
// "[YYYY][MM][DD][HH]-[TECNICA]"
// Resultado: "2025111014-PCR"
```

---

## 🔧 Integración en Componentes

### En CreateWorklistPage (Ya implementado)

```typescript
import { generateWorklistCodigo } from '../utils/worklistCodigoGenerator'

const [codigo, setCodigo] = useState('')
const [selectedTecnicaProc, setSelectedTecnicaProc] = useState('')

// Generar código automáticamente al seleccionar proceso
const handleGenerateCodigo = (tecnicaProc?: string) => {
  const generatedCodigo = generateWorklistCodigo(tecnicaProc)
  setCodigo(generatedCodigo)
}

// Llamar al cambiar el proceso
<select onChange={(e) => {
  const proceso = e.target.value
  setSelectedTecnicaProc(proceso)
  handleGenerateCodigo(proceso) // ✅ Genera automáticamente
}}>
```

### Campo de Código en el Formulario

```typescript
<div>
  <Label>Código del Worklist *</Label>
  <div className="flex gap-2">
    <Input
      value={codigo}
      onChange={(e) => setCodigo(e.target.value)}
      placeholder="Se generará automáticamente"
      required
    />
    <Button
      type="button"
      onClick={() => handleGenerateCodigo(selectedTecnicaProc)}
      disabled={!selectedTecnicaProc}
      title="Regenerar código"
    >
      <RefreshCw size={16} />
    </Button>
  </div>
  {codigo && (
    <p className="text-xs text-gray-500 mt-1">
      Patrón: LT/[AÑO][MES]-[TECNICA]
    </p>
  )}
</div>
```

---

## 🎯 Ejemplos de Códigos Generados

### Por Tipo de Técnica

| Técnica             | Código Generado      |
| ------------------- | -------------------- |
| PCR                 | `LT/202511-PCR`      |
| ELISA               | `LT/202511-ELISA`    |
| Microbiología       | `LT/202511-MICROBIO` |
| Western Blot        | `LT/202511-WESTERNB` |
| Inmunofluorescencia | `LT/202511-INMUNOF`  |
| RT-PCR Tiempo Real  | `LT/202511-RTPCRTIE` |

### Con Diferentes Patrones

```typescript
// Mismo proceso, diferentes patrones
const tecnica = 'PCR'

generateWorklistCodigoFromPattern('LT/[AÑO][MES]-[TECNICA]', tecnica)
// → "LT/202511-PCR"

generateWorklistCodigoFromPattern('WL-[YYYY]-[MM]-[DD]-[TECNICA]', tecnica)
// → "WL-2025-11-10-PCR"

generateWorklistCodigoFromPattern('[TECNICA]-[YYYY][MM][DD]', tecnica)
// → "PCR-20251110"

generateWorklistCodigoFromPattern('LAB[YY][MM]-[TECNICA]-[RND:4]', tecnica)
// → "LAB2511-PCR-7432"
```

---

## ✅ Validaciones

### En el Formulario

```typescript
// Validar antes de enviar
if (!codigo.trim()) {
  alert('Por favor genera o ingresa un código para el worklist.')
  return
}

// Validar patrón (opcional)
const isValidFormat = /^LT\/\d{6}-[A-Z0-9]+$/.test(codigo)
if (!isValidFormat) {
  alert('El código no tiene el formato correcto')
  return
}
```

### En el Botón Submit

```typescript
<Button
  type="submit"
  disabled={
    !nombre.trim() ||
    !codigo.trim() ||          // ✅ Requiere código
    !selectedTecnicaProc ||
    selectedTecnicas.size === 0 ||
    createWorklist.isPending
  }
>
  {createWorklist.isPending ? 'Creando...' : 'Crear Worklist'}
</Button>
```

---

## 🔄 Flujo Completo

```
1. Usuario selecciona "Tipo de Proceso"
   ↓
2. Se ejecuta handleGenerateCodigo(proceso)
   ↓
3. generateWorklistCodigo(proceso) genera el código
   ↓
4. El código se muestra en el campo de input
   ↓
5. Usuario puede:
   - Aceptar el código generado
   - Editarlo manualmente
   - Regenerarlo con el botón refresh
   ↓
6. Al enviar el formulario, el código se incluye en la petición
```

---

## 📊 Comportamiento

- ✅ **Generación automática** al seleccionar proceso
- ✅ **Editable manualmente** por el usuario
- ✅ **Botón de regeneración** para crear uno nuevo
- ✅ **Validación obligatoria** antes de crear
- ✅ **Patrón visible** debajo del campo
- ✅ **Procesamiento inteligente** de nombres largos

---

## 🚀 Resultado Final

Al crear un worklist con proceso **"PCR"** en **Noviembre 2025**:

```json
{
  "nombre": "Análisis PCR - Lunes",
  "codigo": "LT/202511-PCR",
  "tecnica_proc": "PCR",
  "tecnicas": [1, 2, 3],
  "created_by": 123
}
```

¡El sistema está listo para generar códigos únicos y consistentes para tus worklists! 🎉
