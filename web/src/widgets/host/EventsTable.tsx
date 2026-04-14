import { ActionIcon, Badge, Group, Table, Text } from '@mantine/core'
import type { Event } from '../../api/types'

export interface EventsTableProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
  onShare: (event: Event) => void
}

export function EventsTable({ events, onEdit, onDelete, onShare }: EventsTableProps) {
  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Название</Table.Th>
          <Table.Th>Описание</Table.Th>
          <Table.Th>Длительность</Table.Th>
          <Table.Th>Slug</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {events.map((event) => (
          <Table.Tr key={event.id}>
            <Table.Td>
              <Text fw={500}>{event.title}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed" lineClamp={1}>
                {event.description || '—'}
              </Text>
            </Table.Td>
            <Table.Td>
              <Badge variant="light" color="brand">
                {event.durationMinutes} мин
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size="sm" ff="monospace">
                {event.slug}
              </Text>
            </Table.Td>
            <Table.Td>
              <Group gap="xs" justify="flex-end">
                <ActionIcon
                  variant="light"
                  color="brand"
                  onClick={() => onShare(event)}
                  title="Поделиться ссылкой"
                  aria-label={`Поделиться ссылкой на событие ${event.title}`}
                >
                  ⎘
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="accent"
                  onClick={() => onEdit(event)}
                  title="Редактировать"
                  aria-label={`Редактировать событие ${event.title}`}
                >
                  ✎
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="danger"
                  onClick={() => onDelete(event.id)}
                  title="Удалить"
                  aria-label={`Удалить событие ${event.title}`}
                >
                  ✕
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
