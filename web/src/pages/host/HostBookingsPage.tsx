import { Alert, Loader, Stack, Title } from '@mantine/core'
import { BookingsTable } from '../../components/host/BookingsTable'
import { appConfig } from '../../config/app'
import { useHostBookings } from '../../hooks/host/useHostBookings'
import { useErrorNotification } from '../../lib/notifications'

export function HostBookingsPage() {
  const { data, loading, error } = useHostBookings(appConfig.demoHostId)

  useErrorNotification(error, {
    id: 'host-bookings-load-error',
    title: 'Не удалось загрузить бронирования',
  })

  return (
    <Stack gap="lg">
      <Title order={3}>Бронирования</Title>

      {loading && <Loader color="brand" />}

      {error && (
        <Alert color="danger" title="Ошибка">
          {error}
        </Alert>
      )}

      {!loading && !error && data && (
        <BookingsTable bookings={data.bookings} events={data.eventsById} />
      )}
    </Stack>
  )
}
