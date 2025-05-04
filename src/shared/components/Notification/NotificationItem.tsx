import { Notification } from './NotificationContext'
import clsx from 'clsx'

export const NotificationItem = ({ message, type }: Notification) => {
  const baseStyle = 'p-4 rounded shadow text-white animate-fade-in'
  const typeStyle = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500 text-black'
  }[type]

  return <div className={clsx(baseStyle, typeStyle)}>{message}</div>
}
