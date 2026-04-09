import { useEffect, useReducer } from 'react'
import { adminListBookings, adminListEvents } from '../../api/client'
import type { Booking } from '../../api/types'
import { asyncStateReducer, createAsyncState, getErrorMessage } from '../shared'

interface AdminBookingsData {
  bookings: Booking[]
  eventsById: Record<string, string>
}

export function useAdminBookings(userId: string) {
  const [state, dispatch] = useReducer(asyncStateReducer<AdminBookingsData>, undefined, () =>
    createAsyncState<AdminBookingsData>(),
  )

  useEffect(() => {
    let cancelled = false

    dispatch({ type: 'start' })

    Promise.all([adminListBookings(userId), adminListEvents(userId)])
      .then(([bookingsResponse, eventsResponse]) => {
        if (cancelled) {
          return
        }

        const eventsById = Object.fromEntries(
          eventsResponse.items.map((event) => [event.id, event.title]),
        )

        dispatch({
          type: 'success',
          data: {
            bookings: bookingsResponse.items,
            eventsById,
          },
        })
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          dispatch({
            type: 'failure',
            error: getErrorMessage(loadError, 'Не удалось загрузить бронирования.'),
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  return state
}
