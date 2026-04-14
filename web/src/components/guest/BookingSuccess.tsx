import { Alert, Stack, Text } from '@mantine/core'
import type { Booking } from '../../api/types'

interface BookingSuccessProps {
  booking: Booking
  hostName: string
}

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function BookingSuccess({ booking, hostName }: BookingSuccessProps) {
  return (
    <Alert color="brand" title="Встреча забронирована!" data-testid="booking-success">
      <Stack gap="xs">
        <Text size="sm">
          <strong>Начало:</strong> {formatDateTime(booking.startAt)}
        </Text>
        <Text size="sm">
          <strong>Конец:</strong> {formatDateTime(booking.endAt)}
        </Text>
        <Text size="sm">
          <strong>Хост:</strong> {hostName}
        </Text>
        <Text size="sm">
          <strong>Гость:</strong> {booking.guest.name} ({booking.guest.email})
        </Text>
      </Stack>
    </Alert>
  )
}
