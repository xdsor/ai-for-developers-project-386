import { showErrorNotification, showInfoNotification } from './notifications'

export function copyEventLink(hostSlug: string, eventSlug: string): void {
  const url = `${window.location.origin}/hosts/${hostSlug}/events/${eventSlug}`
  void navigator.clipboard
    .writeText(url)
    .then(() => {
      showInfoNotification({
        title: 'Ссылка скопирована',
        message: 'Публичная ссылка сохранена в буфере обмена.',
      })
    })
    .catch(() => {
      showErrorNotification({
        title: 'Не удалось скопировать ссылку',
        message: 'Попробуйте ещё раз.',
      })
    })
}
