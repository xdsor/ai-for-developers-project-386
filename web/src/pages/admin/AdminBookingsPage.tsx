import { Alert, Loader, Stack, Title } from '@mantine/core'
import { BookingsTable } from '../../components/admin/BookingsTable'
import { appConfig } from '../../config/app'
import { useAdminBookings } from '../../hooks/admin/useAdminBookings'

export function AdminBookingsPage() {
  const { data, loading, error } = useAdminBookings(appConfig.demoUserId)

  return (
    <Stack gap="lg">
      <Title order={3}>Бронирования</Title>

      {loading && <Loader color="teal" />}

      {error && (
        <Alert color="red" title="Ошибка">
          {error}
        </Alert>
      )}

      {!loading && !error && data && (
        <BookingsTable bookings={data.bookings} events={data.eventsById} />
      )}
    </Stack>
  )
}
