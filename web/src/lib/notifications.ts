import { useEffect, useRef } from 'react'
import { notifications } from '@mantine/notifications'

interface NotificationOptions {
  id?: string
  title?: string
  message: string
  autoClose?: number | false
}

interface ErrorNotificationOptions {
  id: string
  title: string
}

function showNotification({
  id,
  title,
  message,
  autoClose = 4000,
  color,
}: NotificationOptions & { color: string }) {
  notifications.show({
    id,
    title,
    message,
    color,
    autoClose,
  })
}

export function showSuccessNotification(options: NotificationOptions) {
  showNotification({
    title: 'Готово',
    autoClose: 3000,
    ...options,
    color: 'teal',
  })
}

export function showErrorNotification(options: NotificationOptions) {
  showNotification({
    title: 'Ошибка',
    autoClose: 5000,
    ...options,
    color: 'red',
  })
}

export function showInfoNotification(options: NotificationOptions) {
  showNotification({
    title: 'Готово',
    autoClose: 2500,
    ...options,
    color: 'blue',
  })
}

export function useErrorNotification(error: string | null, options: ErrorNotificationOptions) {
  const lastErrorRef = useRef<string | null>(null)

  useEffect(() => {
    if (!error || error === lastErrorRef.current) {
      return
    }

    lastErrorRef.current = error

    showErrorNotification({
      id: options.id,
      title: options.title,
      message: error,
    })
  }, [error, options.id, options.title])
}
