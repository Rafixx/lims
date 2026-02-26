import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/shared/components/molecules/Card'
import { ToggleButton } from '@/shared/components/molecules/ToggleButton'
import { QuantityInput } from '@/shared/components/molecules/QuantityInput'
import { MuestraForm } from '../components/MuestraForm/MuestraForm'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useMuestra, useNextCodigoEpi } from '../hooks/useMuestras'
import type { Muestra } from '../interfaces/muestras.types'

export const CreateMuestraPage = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // ✅ Estado del tipo de muestra — inicializado desde query params, controlable con el toggle
  // rerender-derived-state-no-effect: inicializar directamente en useState, sin useEffect
  const [isMuestraGroup, setIsMuestraGroup] = useState(searchParams.get('tipo') === 'grupo')

  // Cantidad de tubos a crear (solo aplica cuando !isMuestraGroup)
  const [cantidad, setCantidad] = useState(1)

  // ✅ Leer si se está duplicando desde query params
  const duplicarId = searchParams.get('duplicar')
  const isDuplicating = Boolean(duplicarId)
  const duplicarMuestraId = duplicarId ? parseInt(duplicarId) : undefined

  const muestraId = id ? parseInt(id) : undefined
  const isEditing = Boolean(muestraId && muestraId > 0)

  const [generatedCodigos, setGeneratedCodigos] = useState<{
    codigo_epi?: string
  }>()

  const shouldFetchCodigoEpi = !isEditing
  const {
    codigoEpi,
    isLoading: isLoadingCodigoEpi,
    error: codigoEpiError,
    fetchCodigo: refetchCodigoEpi
  } = useNextCodigoEpi(shouldFetchCodigoEpi)

  const { notify } = useNotification()
  const { muestra, isLoading, error } = useMuestra(muestraId)

  // ✅ Cargar muestra original si estamos duplicando
  const {
    muestra: muestraOriginal,
    isLoading: isLoadingOriginal,
    error: errorOriginal
  } = useMuestra(duplicarMuestraId)

  useEffect(() => {
    if (isEditing) {
      setGeneratedCodigos(undefined)
      return
    }

    if (codigoEpi?.codigo_epi) {
      setGeneratedCodigos({
        codigo_epi: codigoEpi.codigo_epi
      })
    }
  }, [codigoEpi, isEditing])

  // 🎯 Valores iniciales del formulario
  // - Modo edición: usa datos existentes
  // - Modo duplicación: usa datos de la muestra original pero sin id_muestra y sin prueba
  // - Modo creación: genera códigos aleatorios automáticamente
  const initialFormValues = useMemo(() => {
    if (isEditing && muestra) {
      return muestra
    }

    // Modo duplicación: cargar datos de la muestra original
    if (isDuplicating && muestraOriginal) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id_muestra, prueba, ...restMuestra } = muestraOriginal
      return {
        ...restMuestra,
        // No incluir prueba para que el usuario la seleccione
        f_recepcion: new Date().toISOString() // Nueva fecha de recepción
      } as Partial<Muestra> as Muestra
    }

    // Modo creación: retornar undefined para que use DEFAULT_MUESTRA
    // pero los códigos se inyectarán después
    return undefined
  }, [isEditing, muestra, isDuplicating, muestraOriginal])

  const handleSuccess = () => {
    notify(isEditing ? 'Muestra actualizada con éxito' : 'Muestra creada con éxito', 'success')
    navigate('/muestras')
  }

  const handleCancel = () => {
    navigate('/muestras')
  }

  // Mostrar loading mientras se cargan los datos en modo edición o duplicación
  if ((isEditing && isLoading) || (isDuplicating && isLoadingOriginal)) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-surface-600">Cargando datos de la muestra...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si falla la carga en edición o duplicación
  if ((isEditing && error) || (isDuplicating && errorOriginal)) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger-600 mb-4">Error al cargar la muestra</p>
          <button
            onClick={() => navigate('/muestras')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Volver al listado
          </button>
        </div>
      </div>
    )
  }

  if (!isEditing && codigoEpiError) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger-600 mb-4">
            No se pudo generar el código Epidisease para la nueva muestra.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => refetchCodigoEpi()}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Reintentar
            </button>
            <button
              onClick={() => navigate('/muestras')}
              className="px-4 py-2 border border-surface-300 rounded hover:bg-surface-100"
            >
              Volver al listado
            </button>
          </div>
          <p className="text-sm text-surface-500 mt-4">{codigoEpiError.message}</p>
        </div>
      </div>
    )
  }

  if (!isEditing && (isLoadingCodigoEpi || !generatedCodigos)) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-surface-600">Generando código Epidisease...</p>
        </div>
      </div>
    )
  }

  const formGeneratedCodigos = isEditing ? undefined : generatedCodigos

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
                {isEditing
                  ? 'Editar Muestra'
                  : isDuplicating
                    ? 'Nueva Prueba para Muestra Existente'
                    : 'Nueva Muestra'}
              </h1>
              <p className="text-surface-600 mt-1 text-sm">
                {isEditing
                  ? 'Modificar los datos de la muestra existente'
                  : isDuplicating
                    ? 'Crear una nueva prueba utilizando los datos de la muestra seleccionada'
                    : 'Crear una nueva muestra en el sistema'}
              </p>
            </div>

            {/* Controles de tipo y cantidad — solo en modo creación */}
            {!isEditing && !isDuplicating ? (
              <div className="flex items-center gap-3">
                <ToggleButton<boolean>
                  label=""
                  options={[
                    { value: true, label: 'Placa' },
                    { value: false, label: 'Tubo' }
                  ]}
                  value={isMuestraGroup}
                  onChange={setIsMuestraGroup}
                />
                {!isMuestraGroup ? (
                  <QuantityInput
                    label="Cantidad"
                    value={cantidad}
                    onChange={setCantidad}
                    min={1}
                    max={9999}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* Form Container */}
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <MuestraForm
              key={`${muestraId || 'new'}-${isEditing && muestra ? Boolean(muestra.tipo_array) : isMuestraGroup}-${isDuplicating}`}
              initialValues={initialFormValues}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              isMuestraGroup={isEditing && muestra ? Boolean(muestra.tipo_array) : isMuestraGroup}
              generatedCodigos={formGeneratedCodigos}
              isDuplicating={isDuplicating}
              cantidad={!isEditing && !isDuplicating && !isMuestraGroup ? cantidad : undefined}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
