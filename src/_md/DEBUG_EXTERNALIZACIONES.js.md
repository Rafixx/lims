// ============================================
// SCRIPT DE DIAGNÓSTICO - EXTERNALIZACIONES
// ============================================
// Ejecutar en la consola del navegador desde la página "Gestión de Externalizaciones"

console.log('🔍 Iniciando diagnóstico de externalizaciones...\n')

// 1. Verificar si hay datos en el estado de React Query
const checkReactQueryCache = () => {
  console.log('📦 Verificando React Query Cache...')

  // Intentar acceder al cache de React Query desde el window
  const queryClient = window.__REACT_QUERY_CLIENT__

  if (!queryClient) {
    console.warn('⚠️ No se pudo acceder a React Query Client')
    return null
  }

  const cache = queryClient.getQueryData(['externalizaciones'])

  if (!cache || cache.length === 0) {
    console.warn('⚠️ No hay datos de externalizaciones en cache')
    return null
  }

  console.log(`✅ Encontradas ${cache.length} externalizaciones en cache`)
  return cache
}

// 2. Analizar estructura de datos
const analyzeData = (externalizaciones) => {
  if (!externalizaciones) return

  console.log('\n📊 Análisis de estructura de datos:\n')

  const sample = externalizaciones[0]

  console.log('Estructura de una externalización:')
  console.log({
    id_externalizacion: sample.id_externalizacion,
    id_tecnica: sample.id_tecnica,
    tiene_tecnica: !!sample.tecnica,
    tiene_muestra: !!sample.tecnica?.muestra,
    tiene_tecnica_proc: !!sample.tecnica?.tecnica_proc,
    tiene_muestraArray: !!sample.tecnica?.muestraArray,
    tipo_array_presente: 'tipo_array' in (sample.tecnica?.muestra || {}),
    tipo_array_valor: sample.tecnica?.muestra?.tipo_array
  })

  // Verificar campos específicos
  const conTipoArray = externalizaciones.filter(
    ext => ext.tecnica?.muestra?.tipo_array === true
  )

  const conMuestraArray = externalizaciones.filter(
    ext => ext.tecnica?.muestraArray
  )

  console.log('\n📈 Estadísticas:')
  console.log({
    total: externalizaciones.length,
    con_tipo_array: conTipoArray.length,
    con_muestraArray: conMuestraArray.length,
    sin_datos_array: externalizaciones.length - conMuestraArray.length
  })

  // Mostrar ejemplos
  if (conTipoArray.length > 0) {
    console.log('\n✅ Ejemplo con tipo_array = true:')
    console.log(conTipoArray[0])
  } else {
    console.warn('\n❌ NO hay externalizaciones con tipo_array = true')
  }

  if (conMuestraArray.length > 0) {
    console.log('\n✅ Ejemplo con muestraArray:')
    console.log(conMuestraArray[0].tecnica.muestraArray)
  } else {
    console.warn('\n❌ NO hay externalizaciones con muestraArray')
  }
}

// 3. Verificar agrupación
const checkGrouping = (externalizaciones) => {
  if (!externalizaciones) return

  console.log('\n🔗 Verificando agrupación potencial:\n')

  const grupos = {}

  externalizaciones.forEach(ext => {
    if (
      ext.tecnica?.muestra?.tipo_array &&
      ext.tecnica?.muestra?.id_muestra &&
      ext.tecnica?.tecnica_proc?.id
    ) {
      const key = `${ext.tecnica.muestra.id_muestra}-${ext.tecnica.tecnica_proc.id}`

      if (!grupos[key]) {
        grupos[key] = {
          muestra: ext.tecnica.muestra.codigo_epi,
          tecnica: ext.tecnica.tecnica_proc.tecnica_proc,
          placa: ext.tecnica.muestraArray?.codigo_placa,
          count: 0,
          posiciones: []
        }
      }

      grupos[key].count++
      grupos[key].posiciones.push(
        ext.tecnica.muestraArray?.posicion_placa || 'SIN POSICIÓN'
      )
    }
  })

  const numGrupos = Object.keys(grupos).length

  if (numGrupos === 0) {
    console.error('❌ NO se encontraron grupos (faltan datos de tipo_array)')
    console.log('\n💡 El backend debe devolver:')
    console.log('   1. muestra.tipo_array = true')
    console.log('   2. tecnica.muestraArray con posicion_placa y codigo_placa')
    return
  }

  console.log(`✅ Se encontraron ${numGrupos} grupo(s) potencial(es):\n`)
  console.table(grupos)
}

// 4. Verificar respuesta del API directamente
const checkAPIResponse = async () => {
  console.log('\n🌐 Verificando respuesta del API...\n')

  try {
    const token = localStorage.getItem('lims_token')

    if (!token) {
      console.error('❌ No hay token de autenticación')
      return
    }

    const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3002/api'

    const response = await fetch(`${baseURL}/externalizaciones`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`❌ Error del API: ${response.status} ${response.statusText}`)
      return
    }

    const data = await response.json()

    if (!data.success || !data.data) {
      console.error('❌ Respuesta del API inválida:', data)
      return
    }

    console.log(`✅ API respondió correctamente con ${data.data.length} externalizaciones`)

    // Verificar primera externalización
    const first = data.data[0]

    console.log('\n📄 Primera externalización del API:')
    console.log(JSON.stringify(first, null, 2))

    // Verificar campos críticos
    console.log('\n🔍 Campos críticos:')
    console.log({
      tiene_muestra: !!first.tecnica?.muestra,
      tiene_tipo_array: 'tipo_array' in (first.tecnica?.muestra || {}),
      valor_tipo_array: first.tecnica?.muestra?.tipo_array,
      tiene_muestraArray: !!first.tecnica?.muestraArray,
      posicion_placa: first.tecnica?.muestraArray?.posicion_placa,
      codigo_placa: first.tecnica?.muestraArray?.codigo_placa
    })

    return data.data

  } catch (error) {
    console.error('❌ Error al consultar API:', error)
  }
}

// Ejecutar diagnóstico
const runDiagnostic = async () => {
  console.clear()
  console.log('=' .repeat(60))
  console.log('🔍 DIAGNÓSTICO DE EXTERNALIZACIONES')
  console.log('=' .repeat(60))

  // Paso 1: Verificar cache
  const cachedData = checkReactQueryCache()

  if (cachedData) {
    analyzeData(cachedData)
    checkGrouping(cachedData)
  }

  // Paso 2: Verificar API directamente
  console.log('\n' + '='.repeat(60))
  const apiData = await checkAPIResponse()

  if (apiData && !cachedData) {
    analyzeData(apiData)
    checkGrouping(apiData)
  }

  // Resumen final
  console.log('\n' + '='.repeat(60))
  console.log('📋 RESUMEN DEL DIAGNÓSTICO')
  console.log('='.repeat(60))

  if (!cachedData && !apiData) {
    console.error('\n❌ NO se encontraron datos de externalizaciones')
    console.log('\n💡 Acciones sugeridas:')
    console.log('   1. Verificar que el backend esté corriendo')
    console.log('   2. Verificar que tengas externalizaciones creadas')
    console.log('   3. Refrescar la página')
    return
  }

  const data = cachedData || apiData

  const tienenTipoArray = data.filter(ext => ext.tecnica?.muestra?.tipo_array === true).length
  const tienenMuestraArray = data.filter(ext => ext.tecnica?.muestraArray).length

  if (tienenTipoArray === 0 && tienenMuestraArray === 0) {
    console.error('\n❌ PROBLEMA IDENTIFICADO: El backend NO está devolviendo los datos necesarios')
    console.log('\n📖 Ver documento: BACKEND_EXTERNALIZACIONES_REQUIRED.md')
    console.log('\n🛠️ El backend debe incluir en la respuesta:')
    console.log('   1. muestra.tipo_array (boolean)')
    console.log('   2. tecnica.muestraArray { id_array, codigo_placa, posicion_placa }')
  } else if (tienenTipoArray > 0 && tienenMuestraArray === 0) {
    console.warn('\n⚠️ PARCIALMENTE CORRECTO: tipo_array presente pero falta muestraArray')
    console.log('\n🛠️ El backend debe incluir: tecnica.muestraArray')
  } else if (tienenTipoArray === 0 && tienenMuestraArray > 0) {
    console.warn('\n⚠️ PARCIALMENTE CORRECTO: muestraArray presente pero falta tipo_array')
    console.log('\n🛠️ El backend debe incluir: muestra.tipo_array = true')
  } else {
    console.log('\n✅ ÉXITO: Los datos están correctos')
    console.log(`   - ${tienenTipoArray} externalizaciones con tipo_array = true`)
    console.log(`   - ${tienenMuestraArray} externalizaciones con muestraArray`)
    console.log('\n💡 Si no ves la agrupación, revisa la consola del navegador')
    console.log('   Busca el log: "✅ Externalizaciones agrupadas por muestra+técnica"')
  }

  console.log('\n' + '='.repeat(60))
}

// Ejecutar automáticamente
runDiagnostic()

// Exportar función para ejecutar manualmente
window.diagnosticarExternalizaciones = runDiagnostic
console.log('\n💡 Para ejecutar nuevamente: diagnosticarExternalizaciones()')
