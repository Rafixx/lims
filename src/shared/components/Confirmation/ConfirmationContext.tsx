import { createContext, useContext, useState, ReactNode } from 'react'
import { ConfirmationDialog } from './ConfirmationDialog'

export type ConfirmationType = 'danger' | 'warning' | 'info' | 'success'

export interface ConfirmationOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmationType
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

interface ConfirmationContextValue {
  confirm: (options: ConfirmationOptions) => Promise<boolean>
}

const ConfirmationContext = createContext<ConfirmationContextValue | undefined>(undefined)

export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    message: '',
    type: 'warning',
    onConfirm: () => {},
    onCancel: () => {}
  })

  const confirm = (options: ConfirmationOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setState({
        isOpen: true,
        title: options.title || '¿Estás seguro?',
        message: options.message,
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        type: options.type || 'warning',
        onConfirm: () => {
          setState(prev => ({ ...prev, isOpen: false }))
          resolve(true)
        },
        onCancel: () => {
          setState(prev => ({ ...prev, isOpen: false }))
          resolve(false)
        }
      })
    })
  }

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      {state.isOpen && (
        <ConfirmationDialog
          title={state.title || '¿Estás seguro?'}
          message={state.message}
          confirmText={state.confirmText || 'Confirmar'}
          cancelText={state.cancelText || 'Cancelar'}
          type={state.type || 'warning'}
          onConfirm={state.onConfirm}
          onCancel={state.onCancel}
        />
      )}
    </ConfirmationContext.Provider>
  )
}

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider')
  }
  return context
}
