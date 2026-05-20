import { useState } from 'react'
import { Plus } from 'lucide-react'
import { EditableList } from '@/shared/components/organisms/EditableList'
import { Modal } from '@/shared/components/molecules/Modal'
import { Button } from '@/shared/components/molecules/Button'
import { useTecnicasProc } from '@/shared/hooks/useDim_tables'
import type { TecnicaProc } from '@/shared/interfaces/dim_tables.types'
import type { TecnicaLocal } from '../hooks/usePruebaTecnicas'

// ============================================================
// Modo CREATE
// ============================================================

interface PruebaTecnicasCreateProps {
  tecnicas: TecnicaLocal[]
  onAdd: (nombre: string) => void
  onRemove: (id: number) => void
  onReorder: (newList: TecnicaLocal[]) => void
}

export const PruebaTecnicasCreate = ({
  tecnicas,
  onAdd,
  onRemove,
  onReorder
}: PruebaTecnicasCreateProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedNombre, setSelectedNombre] = useState('')
  const [error, setError] = useState('')

  const { data: tecnicasSistema = [], isLoading: loadingTecnicas } = useTecnicasProc()

  // Filtrar las que ya están en la lista actual, ordenadas alfanuméricamente
  const disponibles = tecnicasSistema
    .filter(ts => !tecnicas.some(t => t.tecnica_proc.toLowerCase() === ts.tecnica_proc.toLowerCase()))
    .sort((a, b) => a.tecnica_proc.localeCompare(b.tecnica_proc, 'es', { sensitivity: 'base' }))

  const handleAdd = () => {
    const nombre = selectedNombre.trim()
    if (!nombre) {
      setError('Selecciona una técnica')
      return
    }
    onAdd(nombre)
    setSelectedNombre('')
    setError('')
    setModalOpen(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-surface-700">Técnicas de procesamiento</h3>
        <button
          type="button"
          title="Añadir técnica de procesamiento"
          onClick={() => {
            setSelectedNombre('')
            setError('')
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md
            text-primary-700 bg-primary-50 border border-primary-200
            hover:bg-primary-100 transition-colors"
        >
          <Plus size={14} />
          Añadir técnica
        </button>
      </div>

      {tecnicas.length > 0 ? (
        <EditableList
          items={tecnicas}
          deletedItems={[]}
          getItemId={t => t.id}
          getItemLabel={t => t.tecnica_proc}
          onOrderChange={onReorder}
          onDelete={onRemove}
          onReinsert={() => {}}
        />
      ) : (
        <p className="text-xs text-surface-400 italic">Sin técnicas asociadas</p>
      )}

      <Modal
        isOpen={modalOpen}
        title="Añadir técnica"
        onClose={() => setModalOpen(false)}
        widthClass="w-full max-w-sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="tecnica-select-create" className="block text-sm font-medium text-surface-700 mb-1">
              Técnica
            </label>
            {loadingTecnicas ? (
              <p className="text-xs text-surface-400">Cargando técnicas...</p>
            ) : disponibles.length === 0 ? (
              <p className="text-xs text-surface-400 italic">
                No hay técnicas disponibles en el sistema.
              </p>
            ) : (
              <select
                id="tecnica-select-create"
                autoFocus
                value={selectedNombre}
                onChange={e => {
                  setSelectedNombre(e.target.value)
                  setError('')
                }}
                className="w-full px-3 py-2 border border-surface-300 rounded-md bg-white
                  text-surface-700 text-sm focus:outline-none focus:ring-2
                  focus:ring-primary-400 focus:border-primary-400"
              >
                <option value="">Selecciona una técnica...</option>
                {disponibles.map(t => (
                  <option key={t.id} value={t.tecnica_proc}>
                    {t.tecnica_proc}
                  </option>
                ))}
              </select>
            )}
            {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={!selectedNombre || loadingTecnicas}
            >
              Añadir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ============================================================
// Modo EDIT
// ============================================================

interface PruebaTecnicasEditProps {
  activas: TecnicaProc[]
  inactivas: TecnicaProc[]
  isLoading: boolean
  onAdd: (nombre: string) => Promise<void>
  onRemove: (id: number) => Promise<void>
  onReactivate: (id: number) => Promise<void>
  onReorder: (newList: TecnicaProc[]) => Promise<void>
}

export const PruebaTecnicasEdit = ({
  activas,
  inactivas,
  isLoading,
  onAdd,
  onRemove,
  onReactivate,
  onReorder
}: PruebaTecnicasEditProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedNombre, setSelectedNombre] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const { data: tecnicasSistema = [], isLoading: loadingTecnicas } = useTecnicasProc()

  // Técnicas del sistema que no están ya activas en esta prueba, ordenadas alfanuméricamente
  const disponibles = tecnicasSistema
    .filter(ts => !activas.some(a => a.tecnica_proc.toLowerCase() === ts.tecnica_proc.toLowerCase()))
    .sort((a, b) => a.tecnica_proc.localeCompare(b.tecnica_proc, 'es', { sensitivity: 'base' }))

  // Detecta si la técnica seleccionada coincide con una inactiva (para reactivar en lugar de crear)
  const sugerida = inactivas.find(
    t => t.tecnica_proc.toLowerCase() === selectedNombre.trim().toLowerCase()
  )

  const handleAdd = async () => {
    const nombre = selectedNombre.trim()
    if (!nombre) {
      setError('Selecciona una técnica')
      return
    }
    setSaving(true)
    try {
      await onAdd(nombre)
      setSelectedNombre('')
      setError('')
      setModalOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al añadir')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-surface-700">Técnicas de procesamiento</h3>
        <button
          type="button"
          title="Añadir técnica de procesamiento"
          onClick={() => {
            setSelectedNombre('')
            setError('')
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md
            text-primary-700 bg-primary-50 border border-primary-200
            hover:bg-primary-100 transition-colors"
        >
          <Plus size={14} />
          Añadir técnica
        </button>
      </div>

      {isLoading ? (
        <p className="text-xs text-surface-400">Cargando técnicas...</p>
      ) : (
        <EditableList
          items={activas}
          deletedItems={inactivas}
          getItemId={t => t.id}
          getItemLabel={t => t.tecnica_proc}
          onOrderChange={onReorder}
          onDelete={onRemove}
          onReinsert={onReactivate}
        />
      )}

      <Modal
        isOpen={modalOpen}
        title="Añadir técnica"
        onClose={() => setModalOpen(false)}
        widthClass="w-full max-w-sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="tecnica-select-edit" className="block text-sm font-medium text-surface-700 mb-1">
              Técnica
            </label>
            {loadingTecnicas ? (
              <p className="text-xs text-surface-400">Cargando técnicas...</p>
            ) : disponibles.length === 0 && inactivas.length === 0 ? (
              <p className="text-xs text-surface-400 italic">
                No hay técnicas disponibles en el sistema.
              </p>
            ) : (
              <select
                id="tecnica-select-edit"
                autoFocus
                value={selectedNombre}
                onChange={e => {
                  setSelectedNombre(e.target.value)
                  setError('')
                }}
                className="w-full px-3 py-2 border border-surface-300 rounded-md bg-white
                  text-surface-700 text-sm focus:outline-none focus:ring-2
                  focus:ring-primary-400 focus:border-primary-400"
              >
                <option value="">Selecciona una técnica...</option>
                {disponibles.map(t => (
                  <option key={t.id} value={t.tecnica_proc}>
                    {t.tecnica_proc}
                  </option>
                ))}
                {inactivas.length > 0 && (
                  <optgroup label="Desactivadas (se reactivarán)">
                    {inactivas.map(t => (
                      <option key={t.id} value={t.tecnica_proc}>
                        {t.tecnica_proc}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            )}
            {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
            {sugerida && (
              <p className="mt-1.5 text-xs text-info-600">
                Esta técnica existe desactivada. Se reactivará en lugar de crear una nueva.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              onClick={handleAdd}
              disabled={!selectedNombre || loadingTecnicas}
            >
              {sugerida ? 'Reactivar' : 'Añadir'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
