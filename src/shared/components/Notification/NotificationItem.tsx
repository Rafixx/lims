import { Notification } from './NotificationContext'
import clsx from 'clsx'

export const NotificationItem = ({ message, type }: Notification) => {
  const baseStyle = 'p-4 rounded-lg shadow-medium text-white animate-fade-in'
  const typeStyle = {
    success: 'bg-success-500',
    error: 'bg-danger-500',
    info: 'bg-info-500',
    warning: 'bg-warning-500 text-surface-900'
  }[type]

  return <div className={clsx(baseStyle, typeStyle)}>{message}</div>
}
