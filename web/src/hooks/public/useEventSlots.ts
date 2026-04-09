import { useEffect, useReducer } from 'react'
import { getPublicEvent, listSlots } from '../../api/client'
import type { Event, TimeSlot } from '../../api/types'
import { asyncStateReducer, createAsyncState, getErrorMessage } from '../shared'

interface EventSlotsData {
  event: Event
  slots: TimeSlot[]
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

    Promise.all([getPublicEvent(userSlug, eventSlug), listSlots(userSlug, eventSlug)])
      .then(([event, slotsResponse]) => {
        if (!cancelled) {
          dispatch({
            type: 'success',
            data: { event, slots: slotsResponse.items },
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
