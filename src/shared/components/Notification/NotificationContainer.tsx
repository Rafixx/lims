import { Notification } from './NotificationContext'
import { NotificationItem } from './NotificationItem'

export const NotificationContainer = ({ notifications }: { notifications: Notification[] }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      {notifications.map(n => (
        <NotificationItem key={n.id} {...n} />
      ))}
    </div>
  )
}
