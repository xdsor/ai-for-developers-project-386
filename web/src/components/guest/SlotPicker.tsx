import { Accordion, Badge, Button, Group, SimpleGrid, Text } from '@mantine/core'
import type { TimeSlot } from '../../api/types'

interface SlotPickerProps {
  slots: TimeSlot[]
  onSelect: (slot: TimeSlot) => void
  selectedSlot: TimeSlot | null
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDay(isoString: string): string {
  return new Date(isoString).toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function groupByDay(slots: TimeSlot[]): Map<string, TimeSlot[]> {
  const map = new Map<string, TimeSlot[]>()
  for (const slot of slots) {
    const day = new Date(slot.startAt).toDateString()
    const group = map.get(day) ?? []
    group.push(slot)
    map.set(day, group)
  }
  return map
}

export function SlotPicker({ slots, onSelect, selectedSlot }: SlotPickerProps) {
  const grouped = groupByDay(slots)
  const days = Array.from(grouped.entries())

  if (days.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        Нет доступных слотов на ближайшие 14 дней.
      </Text>
    )
  }

  const defaultDay = days[0][0]

  return (
    <Accordion defaultValue={defaultDay} variant="separated">
      {days.map(([day, daySlots]) => (
        <Accordion.Item key={day} value={day}>
          <Accordion.Control>
            <Group gap="xs">
              <Text fw={500}>{formatDay(daySlots[0].startAt)}</Text>
              <Badge size="sm" variant="light" color="teal">
                {daySlots.length}
              </Badge>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <SimpleGrid cols={{ base: 3, sm: 4, md: 5 }} spacing="xs">
              {daySlots.map((slot) => {
                const isSelected = selectedSlot?.startAt === slot.startAt
                return (
                  <Button
                    key={slot.startAt}
                    variant={isSelected ? 'filled' : 'light'}
                    color="teal"
                    size="sm"
                    onClick={() => onSelect(slot)}
                  >
                    {formatTime(slot.startAt)}
                  </Button>
                )
              })}
            </SimpleGrid>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
