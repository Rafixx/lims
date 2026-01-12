import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Timeline, MuestraIcons, TimelineEvent } from '@/shared/components/organisms/Timeline'
import { DateTimePicker } from '@/shared/components/molecules/DateTimePicker'
import { EntitySelect } from '@/shared/components/molecules/EntitySelect'
import { useTecnicosLaboratorio } from '@/shared/hooks/useDim_tables'
import { User } from 'lucide-react'
import type { Muestra } from '../../interfaces/muestras.types'

export const DatosMuestraSection = () => {
  const { watch, setValue, control } = useFormContext<Muestra>()
  const [editingField, setEditingField] = useState<string | null>(null)
  const { data: tecnicos = [], isLoading: loadingTecnicos } = useTecnicosLaboratorio()

  // Observar valores actuales
  const watchedValues = {
    f_toma: watch('f_toma'),
    f_recepcion: watch('f_recepcion'),
    f_destruccion: watch('f_destruccion'),
    f_devolucion: watch('f_devolucion'),
    id_tecnico_recepcion: watch('id_tecnico_recepcion'),
    'solicitud.f_creacion': watch('solicitud.f_creacion'),
    'solicitud.f_entrada': watch('solicitud.f_entrada'),
    'solicitud.f_compromiso': watch('solicitud.f_compromiso'),
    'solicitud.f_entrega': watch('solicitud.f_entrega'),
    'solicitud.f_resultado': watch('solicitud.f_resultado')
  }

  // Función helper para validar si una fecha debe mostrarse
  const isValidDate = (dateString: string | null | undefined): boolean => {
    if (!dateString || dateString === '') return false

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return false

      const year = date.getFullYear()
      if (year < 2000 || year > 2100) return false

      // Excluir fecha por defecto del sistema: 26 de septiembre de 2025, 02:00
      const defaultDate = new Date('2025-09-26T02:00:00')
      if (Math.abs(date.getTime() - defaultDate.getTime()) < 60000) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  // Función para determinar el estado de cada evento
  const getEventStatus = (fieldName: string): TimelineEvent['status'] => {
    const value = watchedValues[fieldName as keyof typeof watchedValues]

    // Convertir a string si es número, o retornar pending si no es string
    const dateValue = typeof value === 'string' ? value : null

    // Usar la misma validación que isValidDate
    if (!isValidDate(dateValue)) return 'pending'

    return 'completed'
  }

  // Configuración de eventos del timeline
  const timelineEvents: TimelineEvent[] = [
    {
      id: 'solicitud.f_creacion',
      title: 'Solicitud Creada',
      description: 'Fecha en que se creó la solicitud en el sistema',
      date: isValidDate(watchedValues['solicitud.f_creacion'])
        ? (watchedValues['solicitud.f_creacion'] ?? null)
        : null,
      icon: MuestraIcons.creacion,
      status: getEventStatus('solicitud.f_creacion'),
      editable: true,
      onClick: () => setEditingField('solicitud.f_creacion')
    },
    {
      id: 'solicitud.f_entrada',
      title: 'Entrada al Sistema',
      description: 'Fecha de entrada de la solicitud al laboratorio',
      date: isValidDate(watchedValues['solicitud.f_entrada'])
        ? (watchedValues['solicitud.f_entrada'] ?? null)
        : null,
      icon: MuestraIcons.entrada,
      status: getEventStatus('solicitud.f_entrada'),
      editable: true,
      onClick: () => setEditingField('solicitud.f_entrada')
    },
    {
      id: 'f_toma',
      title: 'Toma de Muestra',
      description: 'Fecha y hora en que se tomó la muestra del paciente',
      date: isValidDate(watchedValues.f_toma) ? (watchedValues.f_toma ?? null) : null,
      icon: MuestraIcons.toma,
      status: getEventStatus('f_toma'),
      editable: true,
      onClick: () => setEditingField('f_toma')
    },
    {
      id: 'f_recepcion',
      title: 'Recepción en Laboratorio',
      description: 'Fecha y hora de recepción de la muestra en el laboratorio',
      date: isValidDate(watchedValues.f_recepcion) ? (watchedValues.f_recepcion ?? null) : null,
      icon: MuestraIcons.recepcion,
      status: getEventStatus('f_recepcion'),
      additionalInfo: watchedValues.id_tecnico_recepcion ? (
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span className="font-medium">Recepcionado por: </span>
          <span className="ml-1">
            {(() => {
              const tecnicoValue = watchedValues.id_tecnico_recepcion
              const tecnicoId =
                typeof tecnicoValue === 'object' && tecnicoValue !== null
                  ? (tecnicoValue as { id_usuario: number }).id_usuario
                  : Number(tecnicoValue)

              return (
                tecnicos.find(t => t.id_usuario === tecnicoId)?.nombre || 'Técnico no encontrado'
              )
            })()}
          </span>
        </div>
      ) : null,
      editable: true,
      onClick: () => setEditingField('f_recepcion')
    },
    {
      id: 'solicitud.f_compromiso',
      title: 'Fecha Compromiso',
      description: 'Fecha comprometida para la entrega de resultados',
      date: isValidDate(watchedValues['solicitud.f_compromiso'])
        ? (watchedValues['solicitud.f_compromiso'] ?? null)
        : null,
      icon: MuestraIcons.compromiso,
      status: getEventStatus('solicitud.f_compromiso'),
      editable: true,
      onClick: () => setEditingField('solicitud.f_compromiso')
    },
    {
      id: 'solicitud.f_resultado',
      title: 'Resultados Listos',
      description: 'Fecha en que los resultados están disponibles',
      date: isValidDate(watchedValues['solicitud.f_resultado'])
        ? (watchedValues['solicitud.f_resultado'] ?? null)
        : null,
      icon: MuestraIcons.resultado,
      status: getEventStatus('solicitud.f_resultado'),
      editable: true,
      onClick: () => setEditingField('solicitud.f_resultado')
    },
    {
      id: 'solicitud.f_entrega',
      title: 'Entrega de Resultados',
      description: 'Fecha de entrega final de los resultados al cliente',
      date: isValidDate(watchedValues['solicitud.f_entrega'])
        ? (watchedValues['solicitud.f_entrega'] ?? null)
        : null,
      icon: MuestraIcons.entrega,
      status: getEventStatus('solicitud.f_entrega'),
      editable: true,
      onClick: () => setEditingField('solicitud.f_entrega')
    },
    {
      id: 'f_destruccion',
      title: 'Destrucción de Muestra',
      description: 'Fecha programada o ejecutada de destrucción de la muestra',
      date: isValidDate(watchedValues.f_destruccion) ? (watchedValues.f_destruccion ?? null) : null,
      icon: MuestraIcons.destruccion,
      status: getEventStatus('f_destruccion'),
      editable: true,
      onClick: () => setEditingField('f_destruccion')
    },
    {
      id: 'f_devolucion',
      title: 'Devolución de Muestra',
      description: 'Fecha de devolución de la muestra al cliente (si aplica)',
      date: isValidDate(watchedValues.f_devolucion) ? (watchedValues.f_devolucion ?? null) : null,
      icon: MuestraIcons.devolucion,
      status: getEventStatus('f_devolucion'),
      editable: true,
      onClick: () => setEditingField('f_devolucion')
    }
  ]

  const handleDateChange = (fieldName: string, value: string | null) => {
    setValue(fieldName as keyof Muestra, value)
    setEditingField(null)
  }

  return (
    <div className="space-y-6">
      {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200"> */}
      <div className="bg-gray-50 p-4 rounded-lg">
        {/* <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Cronología de la Muestra</h3>
          <p className="text-gray-600 text-sm">
            Haga clic en cualquier evento para editar su fecha y hora
          </p>
        </div> */}
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cronología de la Muestra </h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm">
          <Timeline events={timelineEvents} className="max-w-4xl" />
        </div>
      </div>

      {/* Modal para editar fechas */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Editar: {timelineEvents.find(e => e.id === editingField)?.title}
            </h3>

            <div className="space-y-4">
              <DateTimePicker
                value={
                  editingField &&
                  isValidDate(watchedValues[editingField as keyof typeof watchedValues] as string)
                    ? (watchedValues[editingField as keyof typeof watchedValues] as string)
                    : undefined
                }
                onChange={value => handleDateChange(editingField, value || '')}
                label="Fecha y Hora"
                placeholder="Seleccionar fecha y hora"
              />

              {/* Campo adicional de técnico para evento de recepción */}
              {editingField === 'f_recepcion' && (
                <EntitySelect
                  name="id_tecnico_recepcion"
                  control={control}
                  label="Técnico de Recepción"
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
                onClick={() => setEditingField(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setEditingField(null)}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
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
