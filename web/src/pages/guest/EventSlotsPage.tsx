import { Alert, Container, Loader } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { useEventSlots } from '../../hooks/guest/useEventSlots'
import { useErrorNotification } from '../../lib/notifications'
import { EventSlotsWidget } from '../../widgets/guest/EventSlotsWidget'

export function EventSlotsPage() {
  const { hostSlug, eventSlug } = useParams<{ hostSlug: string; eventSlug: string }>()
  const { data, loading, error } = useEventSlots(hostSlug, eventSlug)

  useErrorNotification(error, {
    id: 'guest-event-slots-load-error',
    title: 'Не удалось загрузить событие',
  })

  if (loading) {
    return (
      <Container size="sm" py={64} ta="center">
        <Loader color="teal" />
      </Container>
    )
  }

  if (error || !data || !hostSlug || !eventSlug) {
    return (
      <Container size="sm" py={48}>
        <Alert color="red" title="Ошибка">
          {error ?? 'Событие не найдено.'}
        </Alert>
      </Container>
    )
  }

  return (
    <EventSlotsWidget
      key={`${hostSlug}:${eventSlug}`}
      hostSlug={hostSlug}
      eventSlug={eventSlug}
      event={data.event}
      host={data.host}
      slots={data.slots}
    />
  )
}
