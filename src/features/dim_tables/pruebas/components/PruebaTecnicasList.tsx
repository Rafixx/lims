import { useState } from 'react'
import { Plus } from 'lucide-react'
import { EditableList } from '@/shared/components/organisms/EditableList'
import { Modal } from '@/shared/components/molecules/Modal'
import { Button } from '@/shared/components/molecules/Button'
import { Input } from '@/shared/components/molecules/Input'
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
  const [inputNombre, setInputNombre] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    const nombre = inputNombre.trim()
    if (!nombre) {
      setError('El nombre es obligatorio')
      return
    }
    const isDuplicate = tecnicas.some(
      t => t.tecnica_proc.toLowerCase() === nombre.toLowerCase()
    )
    if (isDuplicate) {
      setError('Ya existe una técnica con ese nombre')
      return
    }
    onAdd(nombre)
    setInputNombre('')
    setError('')
    setModalOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
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
            setInputNombre('')
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
        title="Nueva técnica"
        onClose={() => setModalOpen(false)}
        widthClass="w-full max-w-sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Nombre de la técnica
            </label>
            <Input
              autoFocus
              value={inputNombre}
              onChange={e => {
                setInputNombre(e.target.value)
                setError('')
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ej: PCR, ELISA..."
            />
            {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleAdd}>
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
  const [inputNombre, setInputNombre] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    const nombre = inputNombre.trim()
    if (!nombre) {
      setError('El nombre es obligatorio')
      return
    }
    setSaving(true)
    try {
      await onAdd(nombre)
      setInputNombre('')
      setError('')
      setModalOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al añadir')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  // Sugiere reactivar si el nombre coincide con alguna inactiva
  const sugerida = inactivas.find(
    t => t.tecnica_proc.toLowerCase() === inputNombre.trim().toLowerCase()
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-surface-700">Técnicas de procesamiento</h3>
        <button
          type="button"
          title="Añadir técnica de procesamiento"
          onClick={() => {
            setInputNombre('')
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
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Nombre de la técnica
            </label>
            <Input
              autoFocus
              value={inputNombre}
              onChange={e => {
                setInputNombre(e.target.value)
                setError('')
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ej: PCR, ELISA..."
            />
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
            <Button variant="primary" size="sm" loading={saving} onClick={handleAdd}>
              {sugerida ? 'Reactivar' : 'Añadir'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
