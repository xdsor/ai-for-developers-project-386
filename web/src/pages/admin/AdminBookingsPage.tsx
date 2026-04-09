import { Alert, Loader, Stack, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { adminListBookings, adminListEvents, getProfile } from '../../api/client'
import type { Booking, Event } from '../../api/types'
import { BookingsTable } from '../../components/admin/BookingsTable'

const DEMO_SLUG = 'demo-user'

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [eventMap, setEventMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getProfile(DEMO_SLUG)
      .then((profile) => {
        const uid = profile.user.id
        return Promise.all([adminListBookings(uid), adminListEvents(uid)])
      })
      .then(([bookingsData, eventsData]) => {
        if (!cancelled) {
          setBookings(bookingsData.items)
          const map: Record<string, string> = {}
          for (const event of eventsData.items as Event[]) {
            map[event.id] = event.title
          }
          setEventMap(map)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Не удалось загрузить бронирования.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Stack gap="lg">
      <Title order={3}>Бронирования</Title>

      {loading && <Loader color="teal" />}

      {error && (
        <Alert color="red" title="Ошибка">
          {error}
        </Alert>
      )}

      {!loading && !error && <BookingsTable bookings={bookings} events={eventMap} />}
    </Stack>
  )
}
