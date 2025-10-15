// src/features/muestras/components/MuestraForm/DatosGroupSection.tsx
import { useFormContext } from 'react-hook-form'
import { useState, useMemo, useEffect } from 'react'
import type { Muestra } from '../../interfaces/muestras.types'
import { AlertCircle, CheckCircle2, Grid3x3 } from 'lucide-react'

// Definición de presets comunes para placas de laboratorio
const PLATE_PRESETS = [
  { label: '12×12 (144 posiciones)', width: 12, heightLetter: 'L' },
  { label: '10×5 (50 posiciones)', width: 10, heightLetter: 'E' },
  { label: '7×9 (63 posiciones)', width: 7, heightLetter: 'I' },
  { label: '8×12 (96 posiciones)', width: 8, heightLetter: 'L' },
  { label: '16×24 (384 posiciones)', width: 16, heightLetter: 'X' }
] as const

// Utilidades para conversión letra ↔ número
const letterToNumber = (letter: string): number => {
  const upper = letter.toUpperCase()
  if (upper.length !== 1 || upper < 'A' || upper > 'Z') return 0
  return upper.charCodeAt(0) - 64 // A=1, B=2, ..., Z=26
}

const isValidHeightLetter = (letter: string): boolean => {
  return /^[A-Z]$/i.test(letter)
}

export const MuestraGroupSection = () => {
  const { setValue, watch } = useFormContext<Muestra>()

  // Observar los valores actuales del formulario
  const currentArrayConfig = watch('array_config')

  // Estados locales para el formulario del array
  const [arrayCode, setArrayCode] = useState<string>('')
  const [width, setWidth] = useState<string>('')
  const [heightLetter, setHeightLetter] = useState<string>('')
  const [selectedPreset, setSelectedPreset] = useState<string>('')

  // ✅ Sincronizar estado local con datos del formulario al montar
  useEffect(() => {
    if (currentArrayConfig) {
      setArrayCode(currentArrayConfig.code || '')
      setWidth(currentArrayConfig.width?.toString() || '')
      setHeightLetter(currentArrayConfig.heightLetter || '')
    }
  }, [currentArrayConfig])

  // Validaciones
  const widthError = useMemo(() => {
    if (!width) return null
    const num = parseInt(width, 10)
    if (isNaN(num) || num < 1 || num > 200) {
      return 'Introduce un entero positivo entre 1 y 200.'
    }
    return null
  }, [width])

  const heightError = useMemo(() => {
    if (!heightLetter) return null
    if (!isValidHeightLetter(heightLetter)) {
      return 'Introduce una letra mayúscula entre A y Z.'
    }
    return null
  }, [heightLetter])

  const arrayCodeError = useMemo(() => {
    if (!arrayCode) return null
    if (arrayCode.length > 25) {
      return 'El código no puede exceder 25 caracteres.'
    }
    if (!/^[A-Za-z0-9]+$/.test(arrayCode)) {
      return 'Solo se permiten caracteres alfanuméricos.'
    }
    return null
  }, [arrayCode])

  // Cálculos derivados
  const heightNumber = useMemo(() => {
    if (!heightLetter || !isValidHeightLetter(heightLetter)) return 0
    return letterToNumber(heightLetter)
  }, [heightLetter])

  const totalPositions = useMemo(() => {
    const w = parseInt(width, 10)
    if (isNaN(w) || widthError || heightError) return 0
    return w * heightNumber
  }, [width, heightNumber, widthError, heightError])

  const isFormValid = useMemo(() => {
    return (
      arrayCode.length > 0 &&
      !arrayCodeError &&
      width.length > 0 &&
      !widthError &&
      heightLetter.length > 0 &&
      !heightError
    )
  }, [arrayCode, arrayCodeError, width, widthError, heightLetter, heightError])

  useEffect(() => {
    if (isFormValid) {
      const arrayData = {
        code: arrayCode,
        width: parseInt(width, 10),
        heightLetter: heightLetter.toUpperCase(),
        height: heightNumber,
        totalPositions
      }

      // console.log('✅ [DatosGroupSection] Guardando configuración automáticamente:', arrayData)
      setValue('array_config', arrayData, { shouldValidate: true, shouldDirty: true })
    } else {
      // Si los datos no son válidos, limpiar array_config
      setValue('array_config', null, { shouldValidate: true, shouldDirty: true })
    }
  }, [isFormValid, arrayCode, width, heightLetter, heightNumber, totalPositions, setValue])

  // Handler para selección de preset
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetLabel = e.target.value
    setSelectedPreset(presetLabel)

    if (!presetLabel) return

    const preset = PLATE_PRESETS.find(p => p.label === presetLabel)
    if (preset) {
      setWidth(preset.width.toString())
      setHeightLetter(preset.heightLetter)
    }
  }

  // Handler para el campo de altura (auto-mayúscula)
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (value.length <= 1) {
      setHeightLetter(value)
      setSelectedPreset('') // Limpiar preset si el usuario modifica manualmente
    }
  }

  // Handler para el campo de ancho
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Permitir solo números
    if (value === '' || /^\d+$/.test(value)) {
      setWidth(value)
      setSelectedPreset('') // Limpiar preset si el usuario modifica manualmente
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuración de la Placa */}
      <div className="bg-white border-2 border-blue-100 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 mb-2 sm:mb-4">
          <Grid3x3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Configuración de la Placa
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              Define el código y las dimensiones de la placa de muestras
            </p>
          </div>
          {isFormValid && (
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guardado</span>
            </div>
          )}
        </div>

        {/* Layout Responsivo: 2 columnas en lg+, 1 columna en xs/md */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* COLUMNA IZQUIERDA: Formulario de configuración */}
          <div className="space-y-4">
            {/* Código de la Placa */}
            <div>
              <label htmlFor="plateCode" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Placa <span className="text-red-500">*</span>
              </label>
              <input
                id="plateCode"
                type="text"
                value={arrayCode}
                onChange={e => setArrayCode(e.target.value.toUpperCase())}
                placeholder="p. ej., PLACA001ABC"
                maxLength={25}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  arrayCodeError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                aria-invalid={!!arrayCodeError}
                aria-describedby={arrayCodeError ? 'arrayCode-error' : 'arrayCode-help'}
              />
              <div className="mt-1 text-xs text-gray-500" id="arrayCode-help">
                Código alfanumérico (max 25)
              </div>
              {arrayCodeError && (
                <div
                  className="mt-1 flex items-center gap-1 text-red-600 text-sm"
                  id="arrayCode-error"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{arrayCodeError}</span>
                </div>
              )}
            </div>

            {/* Preset */}
            <div>
              <label htmlFor="preset" className="block text-sm font-medium text-gray-700 mb-2">
                Presets
              </label>
              <select
                id="preset"
                value={selectedPreset}
                onChange={handlePresetChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Manual</option>
                {PLATE_PRESETS.map(preset => (
                  <option key={preset.label} value={preset.label}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-500">Plantillas predefinidas</div>
            </div>

            {/* Ancho */}
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                Ancho <span className="text-red-500">*</span>
              </label>
              <input
                id="width"
                type="text"
                inputMode="numeric"
                value={width}
                onChange={handleWidthChange}
                placeholder="10"
                maxLength={2}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  widthError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                aria-invalid={!!widthError}
                aria-describedby={widthError ? 'width-error' : 'width-help'}
              />
              <div className="mt-1 text-xs text-gray-500" id="width-help">
                Columnas (1-50)
              </div>
              {widthError && (
                <div
                  className="mt-1 flex items-center gap-1 text-red-600 text-sm"
                  id="width-error"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">{widthError}</span>
                </div>
              )}
            </div>

            {/* Alto */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Alto <span className="text-red-500">*</span>
              </label>
              <input
                id="height"
                type="text"
                value={heightLetter}
                onChange={handleHeightChange}
                placeholder="D"
                maxLength={1}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors uppercase ${
                  heightError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                aria-invalid={!!heightError}
                aria-describedby={heightError ? 'height-error' : 'height-help'}
              />
              <div className="mt-1 text-xs text-gray-500" id="height-help">
                Letra A-Z
              </div>
              {heightError && (
                <div
                  className="mt-1 flex items-center gap-1 text-red-600 text-sm"
                  id="height-error"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">{heightError}</span>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Información Calculada en Tiempo Real */}
          {heightLetter && !heightError && width && !widthError && (
            <div className="space-y-3">
              {/* Información Numérica */}
              <div
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4"
                role="status"
                aria-live="polite"
              >
                <div className="flex-col justify-between mb-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <p className="text-xs sm:text-sm font-medium text-blue-900">
                          Alto numérico: <span className="font-bold">{heightNumber}</span>
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-blue-900">
                          Total: <span className="font-bold">{totalPositions}</span> posiciones
                        </p>
                        <p className="text-xs text-blue-700">
                          {width}×{heightLetter} ({width}×{heightNumber})
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Grid3x3 className="w-4 h-4" />
                        Vista previa de la placa
                      </h4>
                      <span className="text-xs text-gray-500 font-mono">
                        {arrayCode || 'Sin código'}
                      </span>
                    </div>
                    {/* Grid de la Placa */}
                    <div className="bg-white p-3 rounded-lg shadow-inner overflow-auto">
                      <div
                        className="inline-grid gap-0.5 mx-auto"
                        style={{
                          gridTemplateColumns: `repeat(${parseInt(width, 10)}, minmax(0, 1fr))`,
                          maxWidth: parseInt(width, 10) > 12 ? '100%' : 'fit-content'
                        }}
                      >
                        {Array.from({ length: totalPositions }, (_, index) => {
                          const row = Math.floor(index / parseInt(width, 10))
                          const col = index % parseInt(width, 10)
                          const rowLetter = String.fromCharCode(65 + row) // A, B, C...
                          const colNumber = col + 1

                          return (
                            <div
                              key={index}
                              className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-sm hover:from-blue-100 hover:to-blue-200 transition-colors flex items-center justify-center group relative"
                              style={{
                                minWidth: parseInt(width, 10) > 20 ? '16px' : '20px',
                                maxWidth: '32px'
                              }}
                              title={`Posición ${rowLetter}${colNumber}`}
                            >
                              <span
                                className={`text-blue-400 font-mono font-semibold select-none ${
                                  parseInt(width, 10) > 12 ? 'text-[6px]' : 'text-[8px]'
                                } group-hover:text-blue-600 transition-colors`}
                              >
                                {parseInt(width, 10) > 16 ? '·' : `${rowLetter}${colNumber}`}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Leyenda de coordenadas */}
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-sm" />
                          <span>
                            Filas: A-{heightLetter} | Columnas: 1-{width}
                          </span>
                        </div>
                        {parseInt(width, 10) > 16 && (
                          <span className="text-xs text-amber-600">⚠ Vista simplificada</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
