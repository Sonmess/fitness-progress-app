export type NotificationType = 'success' | 'error' | 'info'

export interface AppNotification {
  id: number
  message: string
  type: NotificationType
}

let counter = 0

export const useNotification = () => {
  const notifications = useState<AppNotification[]>('notifications', () => [])

  /**
   * Shows a toast notification that auto-dismisses after the given duration.
   * @param message The text to display.
   * @param type Visual style — 'error' (red), 'success' (green), 'info' (gray).
   * @param duration Milliseconds before auto-dismiss. Defaults to 4000.
   */
  const notify = (message: string, type: NotificationType = 'info', duration = 4000) => {
    const id = ++counter
    notifications.value = [...notifications.value, { id, message, type }]

    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id)
    }, duration)
  }

  /**
   * Manually dismisses a notification by its ID.
   */
  const dismiss = (id: number) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return { notifications, notify, dismiss }
}
