//src/shared/components/atoms/Modal.tsx
import React, { useEffect, useRef } from 'react'
import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen])

  // Permite cerrar el modal al pulsar fuera del contenido
  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={`p-6 rounded-md shadow-lg ${className}`}
      onCancel={handleCancel}
    >
      {children}
      <div className="mt-4 text-right">
        <Button onClick={onClose} variant="secondary">
          Cerrar
        </Button>
      </div>
    </dialog>
  )
}
