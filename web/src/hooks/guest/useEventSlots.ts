import { useEffect, useReducer } from 'react'
import { getEventBookingPage } from '../../api/client'
import type { Event, TimeSlot, User } from '../../api/types'
import { asyncStateReducer, createAsyncState, getErrorMessage } from '../shared'

interface EventSlotsData {
  event: Event
  slots: TimeSlot[]
  hostName: string
  host: User
}

export function useEventSlots(userSlug?: string, eventSlug?: string) {
  const [state, dispatch] = useReducer(asyncStateReducer<EventSlotsData>, undefined, () =>
    createAsyncState<EventSlotsData>(),
  )

  useEffect(() => {
    if (!userSlug || !eventSlug) {
      return
    }

    let cancelled = false

    dispatch({ type: 'start' })

    getEventBookingPage(userSlug, eventSlug)
      .then((bookingPage) => {
        if (!cancelled) {
          dispatch({
            type: 'success',
            data: {
              event: bookingPage.event,
              slots: bookingPage.slots,
              hostName: bookingPage.host.name,
              host: bookingPage.host,
            },
          })
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          dispatch({
            type: 'failure',
            error: getErrorMessage(loadError, 'Не удалось загрузить данные.'),
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [eventSlug, userSlug])

  if (!userSlug || !eventSlug) {
    return {
      data: null,
      loading: false,
      error: 'Событие не найдено.',
    }
  }

  return state
}
