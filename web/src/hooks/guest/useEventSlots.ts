import { useEffect, useReducer } from 'react'
import { getEventBookingPage } from '../../api/client'
import type { Event, Host, TimeSlot } from '../../api/types'
import { asyncStateReducer, createAsyncState, getErrorMessage } from '../shared'

interface EventSlotsData {
  event: Event
  slots: TimeSlot[]
  hostName: string
  host: Host
}

export function useEventSlots(hostSlug?: string, eventSlug?: string) {
  const [state, dispatch] = useReducer(asyncStateReducer<EventSlotsData>, undefined, () =>
    createAsyncState<EventSlotsData>(),
  )

  useEffect(() => {
    if (!hostSlug || !eventSlug) {
      return
    }

    let cancelled = false

    dispatch({ type: 'start' })

    getEventBookingPage(hostSlug, eventSlug)
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
  }, [eventSlug, hostSlug])

  if (!hostSlug || !eventSlug) {
    return {
      data: null,
      loading: false,
      error: 'Событие не найдено.',
    }
  }

  return state
}
