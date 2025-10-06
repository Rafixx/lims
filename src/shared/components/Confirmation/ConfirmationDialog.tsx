import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react'
import clsx from 'clsx'
import { ConfirmationType } from './ConfirmationContext'

interface ConfirmationDialogProps {
  title: string
  message: string
  confirmText: string
  cancelText: string
  type: ConfirmationType
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmationDialog = ({
  title,
  message,
  confirmText,
  cancelText,
  type,
  onConfirm,
  onCancel
}: ConfirmationDialogProps) => {
  const iconConfig = {
    danger: { Icon: XCircle, color: 'text-danger-500' },
    warning: { Icon: AlertTriangle, color: 'text-warning-500' },
    info: { Icon: Info, color: 'text-info-500' },
    success: { Icon: CheckCircle, color: 'text-success-500' }
  }

  const buttonConfig = {
    danger: 'bg-danger-500 hover:bg-danger-600',
    warning: 'bg-warning-500 hover:bg-warning-600',
    info: 'bg-info-500 hover:bg-info-600',
    success: 'bg-success-500 hover:bg-success-600'
  }

  const { Icon, color } = iconConfig[type]
  const buttonColor = buttonConfig[type]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[100] animate-fade-in"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="bg-surface-100 rounded-lg shadow-2xl max-w-md w-full animate-scale-in"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-start gap-4 flex-1">
              <Icon className={clsx('w-6 h-6 flex-shrink-0 mt-0.5', color)} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground-primary">{title}</h3>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-foreground-secondary hover:text-foreground-primary transition-colors p-1 -mt-1 -mr-1"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-foreground-secondary leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 pt-4 border-t border-border">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-border rounded-md text-foreground-secondary hover:bg-background-hover transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={clsx('px-4 py-2 text-white rounded-md transition-colors', buttonColor)}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
