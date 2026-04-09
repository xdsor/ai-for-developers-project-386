import {
  Alert,
  Badge,
  Card,
  Container,
  Divider,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Booking, TimeSlot } from '../../api/types'
import { BookingForm } from '../../components/guest/BookingForm'
import { BookingSuccess } from '../../components/guest/BookingSuccess'
import { SlotPicker } from '../../components/guest/SlotPicker'
import { useEventSlots } from '../../hooks/guest/useEventSlots'
import { useErrorNotification } from '../../lib/notifications'

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface EventSlotsContentProps {
  userSlug: string
  eventSlug: string
  event: NonNullable<ReturnType<typeof useEventSlots>['data']>['event']
  slots: NonNullable<ReturnType<typeof useEventSlots>['data']>['slots']
}

function EventSlotsContent({ userSlug, eventSlug, event, slots }: EventSlotsContentProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  return (
    <Container size="sm" py={48}>
      <Stack gap="xl">
        <Stack gap="xs">
          <Badge color="teal" variant="light">
            {event.durationMinutes} мин
          </Badge>
          <Title order={2}>{event.title}</Title>
          {event.description && <Text c="dimmed">{event.description}</Text>}
        </Stack>

        <Divider />

        {booking ? (
          <BookingSuccess booking={booking} />
        ) : (
          <Stack gap="lg">
            <div>
              <Text fw={600} mb="md">
                Выберите удобное время
              </Text>
              <SlotPicker
                slots={slots}
                onSelect={(slot) => {
                  setSelectedSlot(slot)
                }}
                selectedSlot={selectedSlot}
              />
            </div>

            {selectedSlot && (
              <Card withBorder radius="md" padding="lg">
                <Stack gap="sm">
                  <Text fw={600}>
                    Выбрано: {formatDateTime(selectedSlot.startAt)} —{' '}
                    {new Date(selectedSlot.endAt).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  <Divider />
                  <BookingForm
                    userSlug={userSlug}
                    eventSlug={eventSlug}
                    slot={selectedSlot}
                    onSuccess={(b) => setBooking(b)}
                  />
                </Stack>
              </Card>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  )
}

export function EventSlotsPage() {
  const { userSlug, eventSlug } = useParams<{ userSlug: string; eventSlug: string }>()
  const { data, loading, error } = useEventSlots(userSlug, eventSlug)

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

  if (error || !data || !userSlug || !eventSlug) {
    return (
      <Container size="sm" py={48}>
        <Alert color="red" title="Ошибка">
          {error ?? 'Событие не найдено.'}
        </Alert>
      </Container>
    )
  }

  return (
    <EventSlotsContent
      key={`${userSlug}:${eventSlug}`}
      userSlug={userSlug}
      eventSlug={eventSlug}
      event={data.event}
      slots={data.slots}
    />
  )
}
