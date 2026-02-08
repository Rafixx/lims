# Debug - Verificar datos de técnicas disponibles

## Pasos para verificar que los datos llegan correctamente desde el backend:

### 1. Agregar console.log temporal en TecnicasTable

En el archivo `src/features/workList/components/WorkListCreate/TecnicasTable.tsx`, agrega este código justo después de la línea 28:

```typescript
// DEBUG: Ver qué datos estamos recibiendo
console.log('🔍 DEBUG Técnicas recibidas:', tecnicas.length)
if (tecnicas.length > 0) {
  console.log('🔍 DEBUG Primera técnica:', JSON.stringify(tecnicas[0], null, 2))
  console.log('🔍 DEBUG muestraArray:', tecnicas[0].muestraArray)
}
```

### 2. Forzar invalidación del cache de React Query

En la página `CreateWorklistPage.tsx`, después de seleccionar un proceso, agrega:

```typescript
// En el hook usePosiblesTecnicas
const {
  posiblesTecnicas,
  isLoading: loadingTecnicas,
  error: errorTecnicas,
  refetch  // ← Asegúrate de tener esto
} = usePosiblesTecnicas(selectedTecnicaProc)

// Y luego usa un botón o efecto para forzar refetch:
useEffect(() => {
  if (selectedTecnicaProc) {
    refetch()  // Forzar refetch cuando cambie el proceso
  }
}, [selectedTecnicaProc, refetch])
```

### 3. Verificar en Network tab del browser

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Filtra por "posiblesTecnicas"
4. Selecciona un proceso en el dropdown
5. Busca la petición GET a `/api/worklists/posiblesTecnicas/[proceso]`
6. Revisa la respuesta JSON

**Busca específicamente:**
- ¿Las técnicas tienen el campo `muestraArray`?
- ¿El campo `muestraArray` tiene `codigo_epi` y `codigo_externo`?

### 4. Hard refresh del navegador

Después de reiniciar el backend:
- **Chrome/Edge**: Ctrl + Shift + R (Windows) o Cmd + Shift + R (Mac)
- **Firefox**: Ctrl + F5 (Windows) o Cmd + Shift + R (Mac)

Esto limpia completamente el cache del navegador.

### 5. Limpiar cache de React Query manualmente

En las DevTools del navegador, ejecuta en la consola:

```javascript
// Limpiar todo el cache de React Query
queryClient.clear()
```

O en el código, importa el queryClient y ejecuta:

```typescript
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()
queryClient.invalidateQueries({ queryKey: ['posiblesTecnicas'] })
```

---

## Estructura esperada en la respuesta del backend

Cada técnica debe tener esta estructura:

```json
{
  "id_tecnica": 123,
  "id_estado": 8,
  "id_array": 45,
  "estadoInfo": {
    "id": 8,
    "estado": "CREADA",
    "color": "#3B82F6"
  },
  "muestra": {
    "codigo_epi": "26.00066",
    "codigo_externo": "GR-MUE-2026-Test066",
    "estudio": "EST_2026066"
  },
  "muestraArray": {
    "id_array": 45,
    "id_muestra": 100,
    "codigo_placa": "PL001",
    "posicion_placa": "A01",
    "codigo_epi": "26.00066.A01",
    "codigo_externo": "GR-MUE-2026-Test066-A01"
  }
}
```

Si `muestraArray` es `null`, entonces es una técnica normal (no de array).

---

## Si sigue sin funcionar

Verifica estos puntos:

1. ✅ **Backend reiniciado** después de los cambios
2. ✅ **Cambios aplicados** en `worklist.repository.ts`
3. ⏳ **Cache limpiado** en el navegador
4. ⏳ **React Query cache invalidado**
5. ⏳ **Datos verificados** en Network tab

Si después de todo esto sigues viendo los mismos códigos, puede que:
- El backend esté usando una versión cacheada del código
- Haya un error en el modelo de Sequelize que impida el join con MuestraArray
- Los datos en la base de datos no tengan códigos específicos en `muestra_array`
