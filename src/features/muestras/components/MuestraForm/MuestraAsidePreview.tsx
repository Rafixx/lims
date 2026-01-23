// src/features/solicitudes/components/solicitudForm/SolicitudAsidePreview.tsx
import { useEffect, useState, useMemo } from 'react'
import { useCliente } from '@/shared/hooks/useDim_tables'
import { useTecnicas } from '../../hooks/useTecnicas'
import { usePaciente } from '@/shared/hooks/useDim_tables'
import { Card } from '@/shared/components/molecules/Card'
import { IconButton } from '@/shared/components/molecules/IconButton'
import { List } from 'lucide-react'
import { Modal } from '@/shared/components/molecules/Modal'
import { EditableList } from '@/shared/components/organisms/EditableList'
// import { CambioRapidoEstado } from '@/shared/components/organisms/CambiarEstado'
// import { IndicadorEstado } from '@/shared/components/atoms/IndicadorEstado'
// import { useEstados } from '@/shared/hooks/useEstados'
// import { useNotification } from '@/shared/components/Notification/NotificationContext'
// import type { DimEstado } from '@/shared/interfaces/estados.types'

interface Props {
  id_cliente?: number
  id_prueba?: number
  id_paciente?: number
  id_muestra?: number
  // estado_muestra?: string
  onTecnicasChange?: (tecnicas: { id_tecnica_proc: number }[]) => void
}

export const MuestraAsidePreview = ({
  id_cliente,
  id_prueba,
  id_paciente,
  id_muestra,
  // estado_muestra,
  onTecnicasChange
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false)
  // const { notify } = useNotification()

  // Obtener estados para la muestra
  // const { data: estadosMuestra = [] } = useEstados('MUESTRA')
  // const estadoActual = estadosMuestra.find(e => e.estado === estado_muestra)

  const {
    tecnicas,
    tecnicasDeleted,
    isLoading: loadingTecnicas,
    setOrder: onOrderChange,
    deleteOne: onDelete,
    reinsertOne: onReinsert
  } = useTecnicas(id_prueba, id_muestra)

  const { data: clienteData, isLoading: loadingCliente } = useCliente(id_cliente)
  const { data: pacienteData, isLoading: loadingPaciente } = usePaciente(id_paciente)

  // Mostrar cada sección si hay un ID válido seleccionado
  const showTecnicas = !!id_prueba && id_prueba > 0
  const showCliente = !!id_cliente && id_cliente > 0
  const showPaciente = !!id_paciente && id_paciente > 0

  // 🔧 Memoizar el payload para evitar loop infinito
  // Solo se recalcula cuando cambian los IDs de las técnicas, no en cada render
  const tecnicasPayload = useMemo(() => {
    return tecnicas.map(t => ({ id_tecnica_proc: t.id }))
  }, [tecnicas])

  useEffect(() => {
    if (!onTecnicasChange) return
    onTecnicasChange(tecnicasPayload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tecnicasPayload])

  // Renderizar el aside si al menos una sección debe mostrarse
  if (!showTecnicas && !showCliente && !showPaciente) return null

  return (
    <>
      <aside className="pl-4 w-72 space-y-4 text-sm text-gray-700">
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
                  <li key={tecnica.id}>{tecnica.nombre}</li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {showCliente && (
          <Card variant="ghost">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">Datos del cliente</h4>
            {loadingCliente ? (
              <p className="text-xs text-gray-400">Cargando cliente...</p>
            ) : clienteData ? (
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
            ) : (
              <p className="text-xs text-gray-400">No hay datos del cliente</p>
            )}
          </Card>
        )}

        {showPaciente && (
          <Card variant="ghost">
            <h4 className="text-xs font-semibold text-gray-500 mb-2">Datos del paciente</h4>
            {loadingPaciente ? (
              <p className="text-xs text-gray-400">Cargando paciente...</p>
            ) : pacienteData ? (
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
            ) : (
              <p className="text-xs text-gray-400">No hay datos del paciente</p>
            )}
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
            getItemLabel={t => t.nombre}
            onOrderChange={onOrderChange}
            onDelete={onDelete}
            onReinsert={onReinsert}
          />
        )}
      </Modal>
    </>
  )
}
