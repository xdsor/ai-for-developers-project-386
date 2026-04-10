import { useEffect, useReducer } from 'react'
import { hostListBookings, hostListEvents } from '../../api/client'
import type { Booking } from '../../api/types'
import { asyncStateReducer, createAsyncState, getErrorMessage } from '../shared'

interface HostBookingsData {
  bookings: Booking[]
  eventsById: Record<string, string>
}

export function useHostBookings(hostId: string) {
  const [state, dispatch] = useReducer(asyncStateReducer<HostBookingsData>, undefined, () =>
    createAsyncState<HostBookingsData>(),
  )

  useEffect(() => {
    let cancelled = false

    dispatch({ type: 'start' })

    Promise.all([hostListBookings(hostId), hostListEvents(hostId)])
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
  }, [hostId])

  return state
}
