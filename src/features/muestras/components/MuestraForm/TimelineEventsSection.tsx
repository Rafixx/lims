import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { DateTimePicker } from '@/shared/components/molecules/DateTimePicker'
import { EntitySelect } from '@/shared/components/molecules/EntitySelect'
import { useTecnicosLaboratorio } from '@/shared/hooks/useDim_tables'
import {
  User,
  Clock,
  Check,
  Circle,
  FlaskConical,
  CheckCircle2,
  CalendarCheck2,
  RotateCcw,
  FlaskConicalOff,
  Trash2
} from 'lucide-react'
import type { Muestra } from '../../interfaces/muestras.types'

interface TimelineEvent {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  dateField: keyof Muestra
  tecnicoField?: keyof Muestra
  verifyField?: keyof Muestra
}

export const TimelineEventsSection = () => {
  const { watch, setValue, control } = useFormContext<Muestra>()
  const [editingField, setEditingField] = useState<string | null>(null)
  const [tempDateValue, setTempDateValue] = useState<string | null>(null)
  const { data: tecnicos = [], isLoading: loadingTecnicos } = useTecnicosLaboratorio()

  // Observar valores actuales
  const watchedValues = {
    f_toma: watch('f_toma'),
    f_recepcion: watch('f_recepcion'),
    f_destruccion: watch('f_destruccion'),
    f_devolucion: watch('f_devolucion'),
    f_agotada: watch('f_agotada'),
    id_tecnico_recepcion: watch('id_tecnico_recepcion'),
    id_tecnico_verifica: watch('id_tecnico_verifica'),
    id_tecnico_destruccion: watch('id_tecnico_destruccion'),
    id_tecnico_devolucion: watch('id_tecnico_devolucion'),
    id_tecnico_agotada: watch('id_tecnico_agotada'),
    'solicitud.f_compromiso': watch('solicitud.f_compromiso'),
    'solicitud.f_resultado': watch('solicitud.f_resultado'),
    'solicitud.f_entrega': watch('solicitud.f_entrega')
  }

  // Función helper para validar si una fecha debe mostrarse
  const isValidDate = (dateString: string | null | undefined): boolean => {
    if (!dateString || dateString === '') return false

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return false

      const year = date.getFullYear()
      if (year < 2000 || year > 2100) return false

      return true
    } catch {
      return false
    }
  }

  // Configuración de eventos
  const events: TimelineEvent[] = [
    {
      id: 'f_toma',
      title: 'Toma de Muestra',
      description: 'Fecha y hora de toma',
      icon: FlaskConical,
      dateField: 'f_toma' as keyof Muestra
    },
    {
      id: 'f_recepcion',
      title: 'Entrada Laboratorio',
      description: 'Recepción en laboratorio',
      icon: CheckCircle2,
      dateField: 'f_recepcion' as keyof Muestra,
      tecnicoField: 'id_tecnico_recepcion' as keyof Muestra,
      verifyField: 'id_tecnico_verifica' as keyof Muestra
    },
    {
      id: 'solicitud.f_compromiso',
      title: 'Fecha Compromiso',
      description: 'Entrega comprometida',
      icon: CalendarCheck2,
      dateField: 'solicitud.f_compromiso' as keyof Muestra
    },
    {
      id: 'solicitud.f_resultado',
      title: 'Resultados Listos',
      description: 'Resultados disponibles',
      icon: CheckCircle2,
      dateField: 'solicitud.f_resultado' as keyof Muestra
    },
    {
      id: 'f_agotada',
      title: 'Muestra Agotada',
      description: 'Muestra agotada',
      icon: FlaskConicalOff,
      dateField: 'f_agotada' as keyof Muestra,
      tecnicoField: 'id_tecnico_agotada' as keyof Muestra
    },
    {
      id: 'solicitud.f_entrega',
      title: 'Entrega Resultados',
      description: 'Entrega al cliente',
      icon: RotateCcw,
      dateField: 'solicitud.f_entrega' as keyof Muestra
    },
    {
      id: 'f_destruccion',
      title: 'Destrucción',
      description: 'Muestra destruida',
      icon: Trash2,
      dateField: 'f_destruccion' as keyof Muestra,
      tecnicoField: 'id_tecnico_destruccion' as keyof Muestra
    },
    {
      id: 'f_devolucion',
      title: 'Devolución',
      description: 'Devuelta al cliente',
      icon: RotateCcw,
      dateField: 'f_devolucion' as keyof Muestra,
      tecnicoField: 'id_tecnico_devolucion' as keyof Muestra
    }
  ]

  const handleSave = () => {
    if (editingField && tempDateValue) {
      setValue(editingField as keyof Muestra, tempDateValue)
    }
    setEditingField(null)
    setTempDateValue(null)
  }

  const handleCancel = () => {
    setEditingField(null)
    setTempDateValue(null)
  }

  const getInitialDateValue = () => {
    if (!editingField) return undefined
    const currentValue = watchedValues[editingField as keyof typeof watchedValues] as string

    if (isValidDate(currentValue)) {
      return currentValue
    }

    return new Date().toISOString()
  }

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!isValidDate(dateString)) return '-'

    const date = new Date(dateString!)
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getTecnicoNombre = (
    tecnicoValue: string | number | { id_usuario: number } | null | undefined
  ): string => {
    if (!tecnicoValue) return ''

    const tecnicoId =
      typeof tecnicoValue === 'object' && tecnicoValue !== null
        ? tecnicoValue.id_usuario
        : Number(tecnicoValue)

    return tecnicos.find(t => t.id_usuario === tecnicoId)?.nombre || ''
  }

  React.useEffect(() => {
    if (editingField) {
      setTempDateValue(getInitialDateValue() || null)
    }
  }, [editingField])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {events.map(event => {
          const Icon = event.icon
          const dateValue = watchedValues[event.dateField as keyof typeof watchedValues] as string
          const isCompleted = isValidDate(dateValue)
          const tecnicoValue = event.tecnicoField
            ? watchedValues[event.tecnicoField as keyof typeof watchedValues]
            : null
          const verifyValue = event.verifyField
            ? watchedValues[event.verifyField as keyof typeof watchedValues]
            : null

          return (
            <button
              key={event.id}
              type="button"
              onClick={() => setEditingField(event.id)}
              className={`
                relative p-3 rounded-lg border-2 transition-all text-left
                hover:shadow-md hover:-translate-y-0.5
                ${
                  isCompleted
                    ? 'border-success-200 bg-success-50 hover:border-success-300'
                    : 'border-surface-200 bg-white hover:border-primary-300'
                }
              `}
            >
              {/* Indicador de estado */}
              <div className="absolute top-2 right-2">
                {isCompleted ? (
                  <Check className="w-4 h-4 text-success-600" />
                ) : (
                  <Circle className="w-4 h-4 text-surface-300" />
                )}
              </div>

              {/* Contenido */}
              <div className="flex items-start gap-2 pr-6">
                <div
                  className={`
                  mt-0.5 p-1.5 rounded
                  ${isCompleted ? 'bg-success-100 text-success-700' : 'bg-surface-100 text-surface-400'}
                `}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-surface-900 mb-0.5">{event.title}</h5>
                  <p className="text-xs text-surface-500 mb-1.5">{event.description}</p>

                  {/* Fecha/Hora */}
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="w-3 h-3 text-surface-400" />
                    <span
                      className={isCompleted ? 'text-surface-700 font-medium' : 'text-surface-400'}
                    >
                      {formatDateTime(dateValue)}
                    </span>
                  </div>

                  {/* Técnico(s) */}
                  {(tecnicoValue || verifyValue) && (
                    <div className="mt-1.5 space-y-0.5">
                      {tecnicoValue && (
                        <div className="flex items-center gap-1 text-xs text-surface-600">
                          <User className="w-3 h-3" />
                          <span className="truncate">{getTecnicoNombre(tecnicoValue)}</span>
                        </div>
                      )}
                      {verifyValue && (
                        <div className="flex items-center gap-1 text-xs text-surface-600">
                          <User className="w-3 h-3" />
                          <span className="truncate">V: {getTecnicoNombre(verifyValue)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Modal de edición */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">
              Editar: {events.find(e => e.id === editingField)?.title}
            </h3>

            <div className="space-y-4">
              <DateTimePicker
                value={getInitialDateValue()}
                onChange={value => setTempDateValue(value)}
                label="Fecha y Hora"
                placeholder="Seleccionar fecha y hora"
              />

              {/* Campos de técnico según el evento */}
              {editingField === 'f_recepcion' && (
                <>
                  <EntitySelect
                    name="id_tecnico_recepcion"
                    control={control}
                    label="Técnico de Recepción"
                    options={tecnicos}
                    isLoading={loadingTecnicos}
                    getValue={tec => tec.id_usuario}
                    getLabel={tec => tec.nombre || ''}
                  />
                  <EntitySelect
                    name="id_tecnico_verifica"
                    control={control}
                    label="Técnico de Verificación"
                    options={tecnicos}
                    isLoading={loadingTecnicos}
                    getValue={tec => tec.id_usuario}
                    getLabel={tec => tec.nombre || ''}
                  />
                </>
              )}

              {editingField === 'f_destruccion' && (
                <EntitySelect
                  name="id_tecnico_destruccion"
                  control={control}
                  label="Técnico Responsable"
                  options={tecnicos}
                  isLoading={loadingTecnicos}
                  getValue={tec => tec.id_usuario}
                  getLabel={tec => tec.nombre || ''}
                />
              )}

              {editingField === 'f_devolucion' && (
                <EntitySelect
                  name="id_tecnico_devolucion"
                  control={control}
                  label="Técnico Responsable"
                  options={tecnicos}
                  isLoading={loadingTecnicos}
                  getValue={tec => tec.id_usuario}
                  getLabel={tec => tec.nombre || ''}
                />
              )}

              {editingField === 'f_agotada' && (
                <EntitySelect
                  name="id_tecnico_agotada"
                  control={control}
                  label="Técnico Responsable"
                  options={tecnicos}
                  isLoading={loadingTecnicos}
                  getValue={tec => tec.id_usuario}
                  getLabel={tec => tec.nombre || ''}
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-surface-700 bg-surface-100 hover:bg-surface-200 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
