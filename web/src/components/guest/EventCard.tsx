import { Badge, Card, Group, Text } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import type { Event } from '../../api/types'

interface EventCardProps {
  event: Event
  hostSlug: string
}

export function EventCard({ event, hostSlug }: EventCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      shadow="xs"
      padding="md"
      radius="md"
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/hosts/${hostSlug}/events/${event.slug}`)}
    >
      <Group justify="space-between" align="flex-start">
        <div style={{ flex: 1 }}>
          <Text fw={600}>{event.title}</Text>
          {event.description && (
            <Text size="sm" c="dimmed" mt={4}>
              {event.description}
            </Text>
          )}
        </div>
        <Badge color="brand" variant="light" style={{ flexShrink: 0 }}>
          {event.durationMinutes} мин
        </Badge>
      </Group>
    </Card>
  )
}
