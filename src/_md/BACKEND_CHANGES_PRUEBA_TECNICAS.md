# Cambios requeridos en Backend: Técnicas de Procesamiento por Prueba

## Contexto

El frontend ha implementado la gestión de `dim_tecnicas_proc` desde el formulario de Prueba
(crear y editar). Para que funcione correctamente se necesitan los siguientes cambios en backend.

---

## 1. `GET /pruebas/:id/tecnicas` — Filtrado por `activa`

### Estado actual

El endpoint devuelve todas las técnicas de una prueba sin filtrar por el campo `activa`.
Tampoco incluye `activa` en la respuesta.

### Cambio requerido

Añadir soporte para query param `activa` (boolean, default `true`).

**Archivo:** `src/services/dimPrueba.service.ts` → método `getTecnicasByPrueba`

```ts
// ANTES
async getTecnicasByPrueba(id: number) {
  const prueba = await DimPrueba.findByPk(id, {
    include: [{
      model: DimTecnicaProc.scope('withPlantilla'),
      as: 'tecnicas',
      attributes: ['id', 'tecnica_proc', 'orden'],
      order: [['orden', 'ASC']],
    }],
  })
  // ...
  return prueba.tecnicas
}

// DESPUÉS
async getTecnicasByPrueba(id: number, activa = true) {
  const prueba = await DimPrueba.findByPk(id, {
    include: [{
      model: DimTecnicaProc,
      as: 'tecnicas',
      attributes: ['id', 'tecnica_proc', 'orden', 'activa'],
      where: { activa },
      order: [['orden', 'ASC']],
    }],
  })
  if (!prueba) throw new Error('Prueba no encontrada')
  return prueba.tecnicas ?? []
}
```

**Archivo:** `src/controllers/dimPrueba.controller.ts` → handler `getTecnicasByPrueba`

```ts
export const getTecnicasByPrueba = async (req, res, next) => {
  const id = Number(req.params.id)
  // Parsear query param 'activa', default true
  const activa = req.query.activa === 'false' ? false : true
  try {
    const tecnicas = await dimPruebaService.getTecnicasByPrueba(id, activa)
    res.status(200).json(tecnicas)
  } catch (error) {
    next(error)
  }
}
```

**Ruta:** ya existe en `dimPrueba.routes.ts`, no requiere cambio.

---

## 2. `PATCH /tecnicasProc/orden` — Batch update de orden

### Estado actual

No existe este endpoint.

### Cambio requerido

Nuevo endpoint para actualizar el orden de múltiples técnicas en una sola llamada.

**Archivo:** `src/routes/dimTecnicaProc.routes.ts`

```ts
import { batchUpdateOrden } from '../controllers/dimTecnicaProc.controller'

router.patch('/orden', batchUpdateOrden)
```

**Archivo:** `src/controllers/dimTecnicaProc.controller.ts`

```ts
export const batchUpdateOrden = async (req, res, next) => {
  try {
    const items: { id: number; orden: number }[] = req.body
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Se espera un array de { id, orden }' })
    }
    const result = await dimTecnicaProcService.batchUpdateOrden(items)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
```

**Archivo:** `src/services/dimTecnicaProc.service.ts`

```ts
async batchUpdateOrden(items: { id: number; orden: number }[]) {
  await Promise.all(
    items.map(({ id, orden }) =>
      DimTecnicaProc.update({ orden }, { where: { id } })
    )
  )
  return { updated: items.length }
}
```

> **Alternativa transaccional** (recomendada si hay muchos items):
> ```ts
> const t = await sequelize.transaction()
> try {
>   await Promise.all(items.map(({ id, orden }) =>
>     DimTecnicaProc.update({ orden }, { where: { id }, transaction: t })
>   ))
>   await t.commit()
> } catch (err) {
>   await t.rollback()
>   throw err
> }
> ```

---

## 3. `PUT /tecnicasProc/:id` — Soporte ya existente para `activa`

No requiere cambio. El DTO ya acepta `activa?: boolean` y el modelo lo soporta.

Se usará con:
- `{ activa: false }` → eliminación lógica (soft delete)
- `{ activa: true }` → reactivación

---

## 4. `POST /tecnicasProc` — Incluir `created_by` en el DTO

### Estado actual

El DTO `CreateDimTecnicaProcDTO` ya tiene `created_by?: number` pero el frontend no lo enviaba.

### Cambio requerido

Ninguno en backend: el campo ya existe en el modelo y en el DTO.

El frontend ahora envía `created_by` con el `id` del usuario autenticado extraído del JWT.

**Payload ejemplo:**
```json
POST /tecnicasProc
{
  "tecnica_proc": "PCR",
  "orden": 1,
  "id_prueba": 5,
  "activa": true,
  "created_by": 12
}
```

---

## Resumen de endpoints afectados

| Método | Ruta | Estado | Cambio |
|--------|------|--------|--------|
| `GET` | `/pruebas/:id/tecnicas` | Existe | Añadir query param `activa`, incluir campo `activa` en respuesta |
| `PATCH` | `/tecnicasProc/orden` | **No existe** | Crear (batch update orden) |
| `PUT` | `/tecnicasProc/:id` | Existe | Sin cambio |
| `POST` | `/tecnicasProc` | Existe | Sin cambio (BE ya tiene `created_by` en DTO) |

---

## Payload de ejemplo (frontend → backend)

### GET técnicas activas
```
GET /pruebas/5/tecnicas?activa=true
```

### GET técnicas inactivas (para reactivar)
```
GET /pruebas/5/tecnicas?activa=false
```

### PATCH orden batch
```
PATCH /tecnicasProc/orden
Body: [{ "id": 10, "orden": 1 }, { "id": 7, "orden": 2 }, { "id": 12, "orden": 3 }]
```

### Respuesta esperada GET técnicas
```json
[
  { "id": 10, "tecnica_proc": "PCR", "orden": 1, "activa": true },
  { "id": 7, "tecnica_proc": "ELISA", "orden": 2, "activa": true }
]
```
