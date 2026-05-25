import { useEffect, useState } from 'react'
import { Modal } from '@/shared/components/molecules/Modal'
import { Button } from '@/shared/components/molecules/Button'
import { useNotification } from '@/shared/components/Notification/NotificationContext'
import { useUpdateMuestra } from '../../hooks/useMuestras'
import { getErrorMessage } from '@/shared/utils/errorUtils'
import type { Muestra } from '../../interfaces/muestras.types'

interface Props {
  isOpen: boolean
  onClose: () => void
  muestra: Muestra
}

export const EditPlacaCodigosModal = ({ isOpen, onClose, muestra }: Props) => {
  const [codigoExterno, setCodigoExterno] = useState(muestra.codigo_externo ?? '')
  const [codigoEpi, setCodigoEpi] = useState(muestra.codigo_epi ?? '')
  const { notify } = useNotification()
  const updateMutation = useUpdateMuestra()

  // Sincroniza los valores cuando se abre el modal o cambia la muestra
  useEffect(() => {
    if (isOpen) {
      setCodigoExterno(muestra.codigo_externo ?? '')
      setCodigoEpi(muestra.codigo_epi ?? '')
      updateMutation.reset()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMutation.mutateAsync({
        id: muestra.id_muestra,
        data: { ...muestra, codigo_externo: codigoExterno, codigo_epi: codigoEpi }
      })
      notify('Códigos actualizados correctamente', 'success')
      onClose()
    } catch (error) {
      notify(getErrorMessage(error, 'Error al actualizar los códigos'), 'error')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-surface-300 px-3 py-2 text-sm font-mono ' +
    'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400'

  const plataLabel =
    muestra.array_config?.code || muestra.codigo_epi || `#${muestra.id_muestra}`

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar códigos — ${plataLabel}`}
      widthClass="w-full max-w-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-surface-500 mb-1">
            Código Externo
          </label>
          <input
            type="text"
            value={codigoExterno}
            onChange={e => setCodigoExterno(e.target.value)}
            placeholder="—"
            className={inputClass}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-surface-500 mb-1">
            Código Epidisease
          </label>
          <input
            type="text"
            value={codigoEpi}
            onChange={e => setCodigoEpi(e.target.value)}
            placeholder="—"
            className={inputClass}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-surface-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
