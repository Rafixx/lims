// src/features/solicitudes/components/solicitudForm/SolicitudAsidePreview.tsx
import { useEffect, useState } from 'react'
import { useCliente } from '@/shared/hooks/useDim_tables'
import { useTecnicas } from '../../hooks/useTecnicas'
import { usePaciente } from '@/shared/hooks/useDim_tables'
import { Card } from '@/shared/components/molecules/Card'
import { IconButton } from '@/shared/components/molecules/IconButton'
import { List } from 'lucide-react'
import { Modal } from '@/shared/components/molecules/Modal'
import { EditableList } from '@/shared/components/organisms/EditableList'
import { CambioRapidoEstado } from '@/shared/components/organisms/CambiarEstado'
import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
import { useEstados } from '@/shared/hooks/useEstados'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import type { DimEstado } from '@/shared/interfaces/estados.types'

interface Props {
  id_cliente?: number
  id_prueba?: number
  id_paciente?: number
  id_muestra?: number
  estado_muestra?: string
  onTecnicasChange?: (tecnicas: { id_tecnica_proc: number }[]) => void
}

export const MuestraAsidePreview = ({
  id_cliente,
  id_prueba,
  id_paciente,
  id_muestra,
  estado_muestra,
  onTecnicasChange
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { notify } = useNotification()

  // Obtener estados para la muestra
  const { data: estadosMuestra = [] } = useEstados('MUESTRA')
  const estadoActual = estadosMuestra.find(e => e.estado === estado_muestra)

  const {
    tecnicas,
    tecnicasDeleted,
    isLoading: loadingTecnicas,
    setOrder: onOrderChange,
    deleteOne: onDelete,
    reinsertOne: onReinsert
  } = useTecnicas(id_prueba, id_muestra)

  const { data: clienteData } = useCliente(id_cliente)
  const { data: pacienteData } = usePaciente(id_paciente)

  const showTecnicas = tecnicas.length > 0 || loadingTecnicas
  const showCliente = !!clienteData
  const showPaciente = !!pacienteData

  useEffect(() => {
    if (!onTecnicasChange) return
    const payload = tecnicas.map(t => ({ id_tecnica_proc: t.id }))
    onTecnicasChange(payload)
  }, [tecnicas, onTecnicasChange])

  if (!showTecnicas && !showCliente && !showPaciente) return null

  return (
    <>
      <aside className="pl-4 w-72 space-y-4 text-sm text-gray-700">
        {/* Sección de estado (solo para muestras existentes) */}
        {id_muestra && id_muestra > 0 && (
          <Card variant="ghost">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">Estado de la muestra</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Estado actual:</span>
                <IndicadorEstado estado={estadoActual} size="small" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Cambiar estado:</label>
                <CambioRapidoEstado
                  entidad="MUESTRA"
                  itemId={id_muestra}
                  estadoActual={estadoActual}
                  onEstadoCambiado={(nuevoEstado: DimEstado) => {
                    notify(`Estado cambiado a: ${nuevoEstado.estado}`, 'success')
                    // Aquí podrías actualizar el estado en el formulario si es necesario
                  }}
                />
              </div>
            </div>
          </Card>
        )}

        {showTecnicas && (
          <Card variant="ghost">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-gray-500">Técnicas asociadas</h4>
              <IconButton
                title={
                  id_muestra !== undefined && id_muestra > 0
                    ? 'No se pueden editar técnicas al modificar una muestra existente'
                    : 'Editar técnicas'
                }
                icon={<List size={16} />}
                className="text-actions"
                aria-label="Editar técnicas"
                onClick={() => setModalOpen(true)}
                disabled={!!(id_muestra && id_muestra > 0)}
              />
            </div>
            {loadingTecnicas ? (
              <p className="text-xs text-gray-400">Cargando técnicas...</p>
            ) : (
              <ul className="space-y-1 text-gray-600">
                {tecnicas.map(tecnica => (
                  <li key={tecnica.id}>{tecnica.tecnica_proc}</li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {showCliente && (
          <Card variant="ghost">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">Datos del cliente</h4>
            <ul className="text-gray-600 space-y-1">
              <li>
                <strong>Nombre:</strong> {clienteData.nombre}
              </li>
              <li>
                <strong>Razón social:</strong> {clienteData.razon_social}
              </li>
              <li>
                <strong>NIF:</strong> {clienteData.nif}
              </li>
              <li>
                <strong>Dirección:</strong> {clienteData.direccion}
              </li>
            </ul>
          </Card>
        )}

        {showPaciente && (
          <Card variant="ghost">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">Datos del paciente</h4>
            <ul className="text-gray-600 space-y-1">
              <li>
                <strong>Nombre:</strong> {pacienteData.nombre}
              </li>
              <li>
                <strong>SIP:</strong> {pacienteData.sip}
              </li>
              <li>
                <strong>Dirección:</strong> {pacienteData.direccion}
              </li>
            </ul>
          </Card>
        )}
      </aside>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Editar Técnicas"
        widthClass="w-full max-w-sm"
        heightClass="max-h-[70vh]"
      >
        {loadingTecnicas ? (
          <p className="text-xs text-gray-400">Cargando técnicas...</p>
        ) : (
          <EditableList
            items={tecnicas}
            deletedItems={tecnicasDeleted}
            getItemId={t => t.id}
            getItemLabel={t => t.tecnica_proc}
            onOrderChange={onOrderChange}
            onDelete={onDelete}
            onReinsert={onReinsert}
          />
        )}
      </Modal>
    </>
  )
}
