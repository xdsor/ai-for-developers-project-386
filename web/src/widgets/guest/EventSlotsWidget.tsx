import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useMemo, useState } from 'react'
import type { Booking, Host, TimeSlot } from '../../api/types'
import { BookingForm } from '../../components/guest/BookingForm'
import { BookingSuccess } from '../../components/guest/BookingSuccess'
import { formatDayHeader, formatModalDate, formatTime, toDateKey } from '../../lib/dateUtils'
import { IconClock, IconGlobe } from '../../ui/icons'
import { BookingCalendar } from './BookingCalendar'

export interface EventSlotsWidgetProps {
  hostSlug: string
  eventSlug: string
  event: {
    title: string
    description?: string | null
    durationMinutes: number
  }
  host: Host
  slots: TimeSlot[]
}

export function EventSlotsWidget({ hostSlug, eventSlug, event, host, slots }: EventSlotsWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(() =>
    slots.length > 0 ? toDateKey(slots[0].startAt) : null,
  )
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  const availableDates = useMemo(() => {
    const s = new Set<string>()
    for (const slot of slots) s.add(toDateKey(slot.startAt))
    return s
  }, [slots])

  const daySlots = useMemo(
    () => (selectedDate ? slots.filter(s => toDateKey(s.startAt) === selectedDate) : []),
    [slots, selectedDate],
  )

  if (booking) {
    return (
      <Container size="sm" py={48}>
        <BookingSuccess booking={booking} hostName={host.name} />
      </Container>
    )
  }

  return (
    <Container size="lg" py={48}>
      <Box
        style={{
          display: 'flex',
          border: '1px solid var(--mantine-color-default-border)',
          borderRadius: 12,
          overflow: 'hidden',
          background: 'white',
          height: 520,
        }}
      >
        {/* ── Left: host / event info ── */}
        <Box
          p="xl"
          style={{
            width: 240,
            flexShrink: 0,
            borderRight: '1px solid var(--mantine-color-default-border)',
          }}
        >
          <Stack gap="md">
            <Avatar color="teal" radius="xl" size="md">
              {host.name[0]?.toUpperCase()}
            </Avatar>
            <div>
              <Text size="sm" c="dimmed">{host.name}</Text>
              <Title order={3} mt={2} lh={1.3}>{event.title}</Title>
            </div>
            {event.description && (
              <Text size="sm" c="dimmed">{event.description}</Text>
            )}
            <Divider />
            <Stack gap="xs">
              <Group gap={8} c="dimmed">
                <IconClock />
                <Text size="sm">{event.durationMinutes} мин</Text>
              </Group>
              <Group gap={8} c="dimmed">
                <IconGlobe />
                <Text size="sm">{host.timeZone}</Text>
              </Group>
            </Stack>
          </Stack>
        </Box>

        {/* ── Center: calendar ── */}
        <Box p="xl" style={{ flex: 1, overflow: 'auto' }}>
          <BookingCalendar
            availableDates={availableDates}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </Box>

        {/* ── Right: time slots ── */}
        <Box
          style={{
            width: 220,
            flexShrink: 0,
            borderLeft: '1px solid var(--mantine-color-default-border)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {selectedDate ? (
            <>
              <Box px="md" pt="lg" pb="sm">
                <Text fw={700} size="lg" tt="capitalize">
                  {formatDayHeader(selectedDate)}
                </Text>
              </Box>
              <Divider />
              <ScrollArea style={{ flex: 1 }}>
                <Stack gap="xs" p="sm">
                  {daySlots.length === 0 ? (
                    <Text size="sm" c="dimmed" ta="center" pt="md">
                      Нет доступных слотов
                    </Text>
                  ) : (
                    daySlots.map(slot => (
                      <Button
                        key={slot.startAt}
                        variant="outline"
                        color="teal"
                        size="sm"
                        fullWidth
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {formatTime(slot.startAt)}
                      </Button>
                    ))
                  )}
                </Stack>
              </ScrollArea>
            </>
          ) : (
            <Box
              p="md"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Text size="sm" c="dimmed" ta="center">
                Выберите дату для просмотра слотов
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Booking modal ── */}
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
                  {host.name[0]?.toUpperCase()}
                </Avatar>
                <div>
                  <Text c="dimmed" size="sm" mb={4}>{host.name}</Text>
                  <Title order={3} lh={1.3}>{event.title}</Title>
                </div>
                <Stack gap="sm">
                  <Group gap="xs" align="flex-start" wrap="nowrap">
                    <Box c="dimmed" mt={2}><IconClock /></Box>
                    <Stack gap={0}>
                      <Text size="sm" tt="capitalize">
                        {formatModalDate(selectedSlot.startAt)}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {formatTime(selectedSlot.startAt)} – {formatTime(selectedSlot.endAt)}
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
              </Stack>
            </Grid.Col>
            <Grid.Col span={7} p="xl">
              <Stack gap="md">
                <Title order={4}>Подтверждение записи</Title>
                <Divider />
                <BookingForm
                  hostSlug={hostSlug}
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
    </Container>
  )
}
