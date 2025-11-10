# 🎲 Generador de Códigos Aleatorios para Muestras

## 📋 Descripción

Sistema de generación automática de códigos únicos para muestras (EPI y externos) con soporte para patrones personalizables basados en placeholders.

---

## 🚀 Uso Básico

### Generar códigos por defecto

```typescript
import { generateMuestraCodigos } from '@/features/muestras/utils/codigoGenerator'

// Genera ambos códigos con patrones por defecto
const codigos = generateMuestraCodigos()
console.log(codigos)
// {
//   codigo_epi: "2025/11100014",
//   codigo_externo: "EXT_1125_7432"
// }
```

### Generar código EPI individual

```typescript
import { generateCodigoEpi } from '@/features/muestras/utils/codigoGenerator'

const codigoEpi = generateCodigoEpi()
// Resultado: "2025/11100014"
```

### Generar código externo individual

```typescript
import { generateCodigoExterno } from '@/features/muestras/utils/codigoGenerator'

const codigoExt = generateCodigoExterno()
// Resultado: "EXT_1125_7432"
```

---

## 🎨 Patrones Personalizados

### Placeholders Soportados

| Placeholder          | Descripción                      | Ejemplo             |
| -------------------- | -------------------------------- | ------------------- |
| `[AÑO]` o `[YYYY]`   | Año completo (4 dígitos)         | `2025`              |
| `[YY]`               | Año corto (2 dígitos)            | `25`                |
| `[MES]` o `[MM]`     | Mes con cero (01-12)             | `11`                |
| `[DIA]` o `[DD]`     | Día con cero (01-31)             | `10`                |
| `[HORA]` o `[HH]`    | Hora con cero (00-23)            | `14`                |
| `[MINUTO]` o `[mm]`  | Minuto con cero (00-59)          | `35`                |
| `[SEGUNDO]` o `[ss]` | Segundo con cero (00-59)         | `42`                |
| `[RND:N]`            | Número aleatorio de N dígitos    | `[RND:4]` → `7432`  |
| `[RAND:N]`           | Alias de `[RND:N]`               | `[RAND:3]` → `829`  |
| `[SEQ:N]`            | Contador secuencial de N dígitos | `[SEQ:5]` → `00123` |

### Ejemplos de Patrones

```typescript
import { generateCodigoFromPattern } from '@/features/muestras/utils/codigoGenerator'

// Patrón 1: Fecha + Hora + Random
const codigo1 = generateCodigoFromPattern('[AÑO]/[MES][DIA]00[HORA]')
// Resultado: "2025/11100014"

// Patrón 2: Prefijo + Año/Mes + Random
const codigo2 = generateCodigoFromPattern('EXT_[MES][YY]_[RND:4]')
// Resultado: "EXT_1125_7432"

// Patrón 3: Timestamp completo
const codigo3 = generateCodigoFromPattern('[YYYY][MM][DD][HH][mm][ss]')
// Resultado: "20251110143542"

// Patrón 4: Formato estándar con guiones
const codigo4 = generateCodigoFromPattern('MUE-[YYYY]-[MM]-[RND:5]')
// Resultado: "MUE-2025-11-08247"

// Patrón 5: Secuencial personalizado
const codigo5 = generateCodigoFromPattern('LAB-[YY][MM]-[SEQ:6]')
// Resultado: "LAB-2511-000123"
```

---

## 📦 Patrones Predefinidos

```typescript
import { CODIGO_PATTERNS } from '@/features/muestras/utils/codigoGenerator'

// Patrones para código EPI
CODIGO_PATTERNS.EPI_DEFAULT // "[AÑO]/[MES][DIA]00[HORA]"
CODIGO_PATTERNS.EPI_SIMPLE // "[YYYY]-[MM]-[RND:4]"
CODIGO_PATTERNS.EPI_TIMESTAMP // "[YYYY][MM][DD][HH][mm][ss]"
CODIGO_PATTERNS.EPI_SEQUENTIAL // "EPI-[YYYY]-[SEQ:5]"

// Patrones para código externo
CODIGO_PATTERNS.EXT_DEFAULT // "EXT_[MES][YY]_[RND:4]"
CODIGO_PATTERNS.EXT_SIMPLE // "EXT-[RND:6]"
CODIGO_PATTERNS.EXT_DATE // "EXT-[YYYY][MM][DD]-[RND:3]"
CODIGO_PATTERNS.EXT_SEQUENTIAL // "EXT-[SEQ:8]"

// Uso con patrones predefinidos
const codigo = generateCodigoFromPattern(CODIGO_PATTERNS.EPI_TIMESTAMP)
// Resultado: "20251110143542"
```

---

## 🔧 Funciones Personalizadas

### Generar con patrón personalizado

```typescript
import {
  generateCustomCodigoEpi,
  generateCustomCodigoExterno
} from '@/features/muestras/utils/codigoGenerator'

// Código EPI personalizado
const epiCustom = generateCustomCodigoEpi('EPI-[YY][MM]-[RND:6]')
// Resultado: "EPI-2511-742839"

// Código externo personalizado
const extCustom = generateCustomCodigoExterno('EXTLAB_[YYYY]_[SEQ:8]')
// Resultado: "EXTLAB_2025_00000123"
```

### Validar código contra patrón

```typescript
import { validateCodigoPattern } from '@/features/muestras/utils/codigoGenerator'

const codigo = '2025/11100014'
const pattern = '[AÑO]/[MES][DIA]00[HORA]'

const isValid = validateCodigoPattern(codigo, pattern)
// Resultado: true
```

---

## 🎯 Integración en Formularios

### En CreateMuestraPage (Ya implementado)

```typescript
import { generateMuestraCodigos } from '../utils/codigoGenerator'

export const CreateMuestraPage = () => {
  // Genera códigos solo para nuevas muestras
  const defaultCodigos = useMemo(() => {
    if (isEditing) return undefined
    return generateMuestraCodigos()
  }, [isEditing])

  return (
    <MuestraForm
      initialValues={muestra}
      generatedCodigos={defaultCodigos}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
```

### En MuestraForm (Ya implementado)

```typescript
export const MuestraForm = ({ initialValues, generatedCodigos, ...props }: Props) => {
  const defaultValues = useMemo(() => {
    const base = initialValues || DEFAULT_MUESTRA
    if (generatedCodigos && !initialValues) {
      return {
        ...base,
        codigo_epi: generatedCodigos.codigo_epi || base.codigo_epi,
        codigo_externo: generatedCodigos.codigo_externo || base.codigo_externo
      }
    }
    return base
  }, [initialValues, generatedCodigos])

  const methods = useForm<Muestra>({ defaultValues })
  // ...
}
```

---

## 🌟 Casos de Uso Comunes

### 1. Código con fecha actual

```typescript
const codigo = generateCodigoFromPattern('[YYYY]-[MM]-[DD]')
// Resultado: "2025-11-10"
```

### 2. Código con timestamp

```typescript
const codigo = generateCodigoFromPattern('[YY][MM][DD]-[HH][mm]')
// Resultado: "251110-1435"
```

### 3. Código con prefijo y aleatorio

```typescript
const codigo = generateCodigoFromPattern('MUESTRA-[RND:8]')
// Resultado: "MUESTRA-74283947"
```

### 4. Código secuencial por año

```typescript
const codigo = generateCodigoFromPattern('[YYYY]-[SEQ:6]')
// Resultado: "2025-000123"
```

### 5. Código mixto (fecha + random)

```typescript
const codigo = generateCodigoFromPattern('LAB[YY][MM][DD][RND:4]')
// Resultado: "LAB2511107432"
```

---

## ⚙️ Configuración Personalizada

Para cambiar los patrones por defecto, modifica las funciones en `codigoGenerator.ts`:

```typescript
// Cambiar patrón EPI por defecto
export function generateCodigoEpi(): string {
  return generateCodigoFromPattern('EPI-[YYYY]-[MM]-[RND:5]')
}

// Cambiar patrón externo por defecto
export function generateCodigoExterno(): string {
  return generateCodigoFromPattern('LAB-[YY][MM]-[RND:6]')
}
```

---

## 🧪 Testing

### Ejemplo de prueba

```typescript
describe('codigoGenerator', () => {
  it('debe generar código EPI con formato correcto', () => {
    const codigo = generateCodigoEpi()
    expect(codigo).toMatch(/^\d{4}\/\d{6}\d{2}$/)
  })

  it('debe generar código externo con formato correcto', () => {
    const codigo = generateCodigoExterno()
    expect(codigo).toMatch(/^EXT_\d{4}_\d{4}$/)
  })

  it('debe validar código contra patrón', () => {
    const codigo = '2025/11100014'
    const isValid = validateCodigoPattern(codigo, '[AÑO]/[MES][DIA]00[HORA]')
    expect(isValid).toBe(true)
  })
})
```

---

## 📝 Notas

- Los códigos generados son **únicos por timestamp** pero no garantizan unicidad absoluta en múltiples requests simultáneos
- Para unicidad garantizada, considera añadir verificación en backend
- Los placeholders `[SEQ:N]` actualmente generan números aleatorios; para secuencias reales, implementar contador en backend
- Los códigos se generan automáticamente al crear una nueva muestra
- Los códigos NO se regeneran al editar una muestra existente

---

## 🔄 Roadmap

- [ ] Añadir soporte para prefijos/sufijos configurables por entorno
- [ ] Implementar contador secuencial real (requiere backend)
- [ ] Añadir validación de unicidad antes de guardar
- [ ] Soporte para QR code embebido en el código
- [ ] Checksums para validación de integridad
