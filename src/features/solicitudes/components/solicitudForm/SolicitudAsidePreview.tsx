// src/features/solicitudes/components/solicitudForm/SolicitudAsidePreview.tsx
import { useEffect, useState } from 'react'
import { useCliente } from '../../hooks/useCliente'
import { useTecnicas } from '../../hooks/useTecnicas'
import { usePaciente } from '../../hooks/usePaciente'
import { Card } from '@/shared/components/molecules/Card'
import { IconButton } from '@/shared/components/molecules/IconButton'
import { List } from 'lucide-react'
import { Modal } from '@/shared/components/molecules/Modal'
import { EditableList } from '@/shared/components/organisms/EditableList'

interface Props {
  id_cliente?: number
  id_prueba?: number
  id_paciente?: number
  id_muestra?: number
  onTecnicasChange?: (tecnicas: { id_tecnica_proc: number }[]) => void
}

export const SolicitudAsidePreview = ({
  id_cliente,
  id_prueba,
  id_paciente,
  id_muestra,
  onTecnicasChange
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false)

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
        {showTecnicas && (
          <Card variant="ghost">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-gray-500">Técnicas asociadas</h4>
              <IconButton
                title="Editar técnicas"
                icon={<List size={16} />}
                className="text-actions"
                aria-label="Editar técnicas"
                onClick={() => setModalOpen(true)}
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
