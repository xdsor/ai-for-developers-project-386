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
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicEvent, listSlots } from '../../api/client'
import type { Booking, Event, TimeSlot } from '../../api/types'
import { BookingForm } from '../../components/public/BookingForm'
import { BookingSuccess } from '../../components/public/BookingSuccess'
import { SlotPicker } from '../../components/public/SlotPicker'

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EventSlotsPage() {
  const { userSlug, eventSlug } = useParams<{ userSlug: string; eventSlug: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    if (!userSlug || !eventSlug) return
    let cancelled = false

    setLoading(true)
    setError(null)
    setSelectedSlot(null)
    setBooking(null)

    Promise.all([getPublicEvent(userSlug, eventSlug), listSlots(userSlug, eventSlug)])
      .then(([eventData, slotsData]) => {
        if (!cancelled) {
          setEvent(eventData)
          setSlots(slotsData.items)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Не удалось загрузить данные.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userSlug, eventSlug])

  if (loading) {
    return (
      <Container size="sm" py={64} ta="center">
        <Loader color="teal" />
      </Container>
    )
  }

  if (error || !event) {
    return (
      <Container size="sm" py={48}>
        <Alert color="red" title="Ошибка">
          {error ?? 'Событие не найдено.'}
        </Alert>
      </Container>
    )
  }

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
                    userSlug={userSlug!}
                    eventSlug={eventSlug!}
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
