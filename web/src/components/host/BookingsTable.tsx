import { Badge, Table, Text } from '@mantine/core'
import type { Booking } from '../../api/types'

interface BookingsTableProps {
  bookings: Booking[]
  events: Record<string, string>
}

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function BookingsTable({ bookings, events }: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        Бронирований пока нет.
      </Text>
    )
  }

  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Событие</Table.Th>
          <Table.Th>Гость</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Начало</Table.Th>
          <Table.Th>Конец</Table.Th>
          <Table.Th>Создано</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {bookings.map((booking) => (
          <Table.Tr key={booking.id}>
            <Table.Td>
              <Badge variant="light" color="teal">
                {events[booking.eventId] ?? booking.eventId}
              </Badge>
            </Table.Td>
            <Table.Td>{booking.guest.name}</Table.Td>
            <Table.Td>{booking.guest.email}</Table.Td>
            <Table.Td>{formatDateTime(booking.startAt)}</Table.Td>
            <Table.Td>{formatDateTime(booking.endAt)}</Table.Td>
            <Table.Td>{formatDateTime(booking.createdAt)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
