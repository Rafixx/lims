#!/usr/bin/env node

/**
 * Script de prueba para verificar si el backend devuelve los campos codigo_epi y codigo_externo
 * en muestra_array
 *
 * Uso:
 * 1. Asegúrate de estar logueado y tener un token válido
 * 2. Ejecuta: node test-backend-array-data.js
 */

const BASE_URL = process.env.VITE_BASE_URL || 'http://localhost:3002/api';
const TOKEN = process.argv[2]; // Pasar token como argumento

if (!TOKEN) {
  console.error('❌ ERROR: Debes proporcionar un token de autenticación');
  console.log('Uso: node test-backend-array-data.js YOUR_TOKEN');
  process.exit(1);
}

async function testExternalizaciones() {
  console.log('🔍 Probando endpoint: GET /api/externalizaciones\n');

  try {
    const response = await fetch(`${BASE_URL}/externalizaciones`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success || !data.data || data.data.length === 0) {
      console.log('⚠️  No hay externalizaciones disponibles para probar');
      return;
    }

    // Buscar la primera externalización con array
    const extConArray = data.data.find(ext =>
      ext.tecnica?.muestraArray?.id_array
    );

    if (!extConArray) {
      console.log('⚠️  No se encontraron externalizaciones con arrays');
      return;
    }

    console.log('✅ Externalización con array encontrada:');
    console.log(`   ID Externalización: ${extConArray.id_externalizacion}`);
    console.log(`   ID Técnica: ${extConArray.tecnica.id_tecnica}`);
    console.log(`   ID Array: ${extConArray.tecnica.muestraArray.id_array}`);
    console.log(`   Código Placa: ${extConArray.tecnica.muestraArray.codigo_placa}`);
    console.log(`   Posición Placa: ${extConArray.tecnica.muestraArray.posicion_placa}`);
    console.log('');

    // Verificar campos críticos
    const muestraArray = extConArray.tecnica.muestraArray;

    console.log('📊 Campos de muestraArray recibidos:');
    console.log(JSON.stringify(muestraArray, null, 2));
    console.log('');

    // Verificación de campos requeridos
    console.log('🔍 Verificación de campos:');

    const checks = [
      { name: 'id_array', value: muestraArray.id_array, required: true },
      { name: 'codigo_placa', value: muestraArray.codigo_placa, required: true },
      { name: 'posicion_placa', value: muestraArray.posicion_placa, required: true },
      { name: 'codigo_epi', value: muestraArray.codigo_epi, required: false },
      { name: 'codigo_externo', value: muestraArray.codigo_externo, required: false }
    ];

    let allOk = true;
    checks.forEach(check => {
      const exists = check.value !== undefined && check.value !== null;
      const status = exists ? '✅' : (check.required ? '❌' : '⚠️ ');
      console.log(`   ${status} ${check.name}: ${exists ? check.value : 'NO PRESENTE'}`);

      if (!exists && !check.required) {
        allOk = false;
      }
    });

    console.log('');

    if (muestraArray.codigo_epi && muestraArray.codigo_externo) {
      console.log('✅ ¡PERFECTO! Los campos codigo_epi y codigo_externo están presentes.');
    } else {
      console.log('❌ PROBLEMA IDENTIFICADO:');
      console.log('   Los campos codigo_epi y/o codigo_externo NO están siendo devueltos por el backend.');
      console.log('');
      console.log('📝 Acción requerida:');
      console.log('   1. Revisa el archivo BACKEND_MUESTRA_ARRAY_CAMPOS.md');
      console.log('   2. Actualiza las consultas SQL del backend para incluir estos campos');
      console.log('   3. Verifica que la tabla muestra_array tenga los campos:');
      console.log('      - codigo_epi VARCHAR(50)');
      console.log('      - codigo_externo VARCHAR(50)');
    }

    // Comparación con datos de muestra
    if (extConArray.tecnica.muestra) {
      console.log('');
      console.log('📌 Comparación con datos de la muestra padre:');
      console.log(`   Muestra.codigo_epi: ${extConArray.tecnica.muestra.codigo_epi || 'N/A'}`);
      console.log(`   Muestra.codigo_externo: ${extConArray.tecnica.muestra.codigo_externo || 'N/A'}`);
      console.log(`   MuestraArray.codigo_epi: ${muestraArray.codigo_epi || 'NO PRESENTE'}`);
      console.log(`   MuestraArray.codigo_externo: ${muestraArray.codigo_externo || 'NO PRESENTE'}`);

      if (!muestraArray.codigo_epi && extConArray.tecnica.muestra.codigo_epi) {
        console.log('');
        console.log('💡 NOTA: La muestra padre tiene codigo_epi pero el array no.');
        console.log('   Esto confirma que el backend necesita incluir estos campos en muestraArray.');
      }
    }

  } catch (error) {
    console.error('❌ Error al hacer la petición:', error.message);
    process.exit(1);
  }
}

// Ejecutar test
testExternalizaciones();
