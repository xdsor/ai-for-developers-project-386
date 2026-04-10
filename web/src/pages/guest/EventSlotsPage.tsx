import {
  Alert,
  Avatar,
  Badge,
  Box,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
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

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

interface EventSlotsContentProps {
  userSlug: string
  eventSlug: string
  event: NonNullable<ReturnType<typeof useEventSlots>['data']>['event']
  slots: NonNullable<ReturnType<typeof useEventSlots>['data']>['slots']
  hostName: string
}

function EventSlotsContent({ userSlug, eventSlug, event, slots, hostName }: EventSlotsContentProps) {
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
          <Text c="dimmed" size="sm">Хост: {hostName}</Text>
          {event.description && <Text c="dimmed">{event.description}</Text>}
        </Stack>

        <Divider />

        {booking ? (
          <BookingSuccess booking={booking} hostName={hostName} />
        ) : (
          <>
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
            </Stack>

            <Modal
              opened={selectedSlot !== null}
              onClose={() => setSelectedSlot(null)}
              size="lg"
              padding={0}
              centered
              styles={{
                header: {
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  padding: 0,
                  minHeight: 0,
                  background: 'transparent',
                },
              }}
            >
              {selectedSlot && (
                <Grid gap={0} style={{ minHeight: 320 }}>
                  <Grid.Col
                    span={5}
                    p="xl"
                    style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}
                  >
                    <Stack gap="lg" h="100%">
                      <Avatar color="teal" radius="xl" size="md">
                        {hostName[0]?.toUpperCase()}
                      </Avatar>
                      <div>
                        <Text c="dimmed" size="sm" mb={4}>{hostName}</Text>
                        <Title order={3} lh={1.3}>{event.title}</Title>
                      </div>
                      <Stack gap="sm">
                        <Group gap="xs" align="flex-start" wrap="nowrap">
                          <Box c="dimmed" mt={2}><IconCalendar /></Box>
                          <Stack gap={0}>
                            <Text size="sm" tt="capitalize">{formatDate(selectedSlot.startAt)}</Text>
                            <Text size="sm" c="dimmed">
                              {formatTime(selectedSlot.startAt)} – {formatTime(selectedSlot.endAt)}
                            </Text>
                          </Stack>
                        </Group>
                        <Group gap="xs" wrap="nowrap">
                          <Box c="dimmed"><IconClock /></Box>
                          <Text size="sm">{event.durationMinutes} мин</Text>
                        </Group>
                      </Stack>
                    </Stack>
                  </Grid.Col>

                  <Grid.Col span={7} p="xl">
                    <Stack gap="md">
                      <Title order={4}>Подтверждение записи</Title>
                      <Divider />
                      <BookingForm
                        userSlug={userSlug}
                        eventSlug={eventSlug}
                        slot={selectedSlot}
                        onSuccess={(b) => {
                          setSelectedSlot(null)
                          setBooking(b)
                        }}
                      />
                    </Stack>
                  </Grid.Col>
                </Grid>
              )}
            </Modal>
          </>
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
      hostName={data.hostName}
    />
  )
}
