// src/shared/components/molecules/Modal.tsx
import { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/shared/components/molecules/Button'

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
  widthClass?: string // Ej: 'w-[600px]' o 'w-full max-w-lg'
  heightClass?: string // Ej: 'h-auto', 'h-[400px]', 'max-h-[90vh]'...
}

export const Modal = ({
  isOpen,
  title,
  onClose,
  children,
  widthClass = 'w-full max-w-lg',
  heightClass = 'max-h-[90vh]'
}: ModalProps) => {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white p-6 rounded shadow-lg relative overflow-y-auto ${widthClass} ${heightClass}`}
      >
        <Button
          onClick={onClose}
          variant="dark_ghost"
          aria-label="Cerrar modal"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </Button>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
      </div>
    </div>,
    document.body
  )
}
