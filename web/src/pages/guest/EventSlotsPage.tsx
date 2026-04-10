import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Booking, Host, TimeSlot } from '../../api/types'
import { BookingForm } from '../../components/guest/BookingForm'
import { BookingSuccess } from '../../components/guest/BookingSuccess'
import { useEventSlots } from '../../hooks/guest/useEventSlots'
import { useErrorNotification } from '../../lib/notifications'

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconClock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function IconChevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {direction === 'left'
        ? <polyline points="15 18 9 12 15 6" />
        : <polyline points="9 18 15 12 9 6" />}
    </svg>
  )
}

// ── Date utilities ────────────────────────────────────────────────────────────

function toDateKey(iso: string): string {
  return iso.slice(0, 10)
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function formatDayHeader(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function formatModalDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

// Mon-first: Пн Вт Ср Чт Пт Сб Вс
const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function buildMonthGrid(year: number, month: number): (number | null)[][] {
  const firstDow = new Date(year, month, 1).getDay() // 0=Sun
  const padding = (firstDow + 6) % 7                // convert to Mon-first
  const days = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array<null>(padding).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  const grid: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) grid.push(cells.slice(i, i + 7))
  return grid
}

// ── Calendar ──────────────────────────────────────────────────────────────────

interface CalendarProps {
  availableDates: Set<string>
  selectedDate: string | null
  onSelect: (key: string) => void
}

function BookingCalendar({ availableDates, selectedDate, onSelect }: CalendarProps) {
  const today = todayKey()
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth())

  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text fw={600} size="md">
          {MONTHS_RU[viewMonth]}{' '}
          <Text span c="dimmed" fw={400}>{viewYear}</Text>
        </Text>
        <Group gap={4}>
          <UnstyledButton
            onClick={prevMonth}
            style={{ display: 'flex', alignItems: 'center', padding: '4px 6px', borderRadius: 6 }}
          >
            <IconChevron direction="left" />
          </UnstyledButton>
          <UnstyledButton
            onClick={nextMonth}
            style={{ display: 'flex', alignItems: 'center', padding: '4px 6px', borderRadius: 6 }}
          >
            <IconChevron direction="right" />
          </UnstyledButton>
        </Group>
      </Group>

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
          textAlign: 'center',
        }}
      >
        {WEEK_DAYS.map(d => (
          <Text key={d} size="xs" c="dimmed" fw={500}>{d}</Text>
        ))}
      </Box>

      <Stack gap={4}>
        {grid.map((week, wi) => (
          <Box
            key={wi}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}
          >
            {week.map((day, di) => {
              if (!day) return <div key={di} />
              const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isAvailable = availableDates.has(key)
              const isSelected = selectedDate === key
              const isToday = today === key

              let bg = 'transparent'
              let color = 'var(--mantine-color-dimmed)'
              let border = 'none'
              let fw: number | undefined = undefined
              const cursor = isAvailable ? 'pointer' : 'default'

              if (isSelected) {
                bg = 'var(--mantine-color-teal-6)'
                color = 'white'
                fw = 600
              } else if (isAvailable && isToday) {
                bg = 'var(--mantine-color-dark-7)'
                color = 'white'
                border = '2px solid var(--mantine-color-teal-5)'
              } else if (isAvailable) {
                bg = 'var(--mantine-color-dark-7)'
                color = 'white'
              } else if (isToday) {
                border = '2px solid var(--mantine-color-teal-5)'
                color = 'var(--mantine-color-teal-6)'
              }

              return (
                <UnstyledButton
                  key={di}
                  onClick={() => { if (isAvailable) onSelect(key) }}
                  style={{
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bg,
                    color,
                    border,
                    borderRadius: 8,
                    cursor,
                    fontWeight: fw,
                    fontSize: 14,
                    opacity: !isAvailable && !isToday ? 0.35 : 1,
                  }}
                >
                  {day}
                </UnstyledButton>
              )
            })}
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}

// ── Main content ──────────────────────────────────────────────────────────────

interface ContentProps {
  hostSlug: string
  eventSlug: string
  event: NonNullable<ReturnType<typeof useEventSlots>['data']>['event']
  host: Host
  slots: TimeSlot[]
}

function EventSlotsContent({ hostSlug, eventSlug, event, host, slots }: ContentProps) {
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

// ── Page ──────────────────────────────────────────────────────────────────────

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
    <EventSlotsContent
      key={`${hostSlug}:${eventSlug}`}
      hostSlug={hostSlug}
      eventSlug={eventSlug}
      event={data.event}
      host={data.host}
      slots={data.slots}
    />
  )
}
