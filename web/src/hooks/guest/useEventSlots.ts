import { useEffect, useReducer } from 'react'
import { getGuestEvent, getProfile, listSlots } from '../../api/client'
import type { Event, TimeSlot } from '../../api/types'
import { asyncStateReducer, createAsyncState, getErrorMessage } from '../shared'

interface EventSlotsData {
  event: Event
  slots: TimeSlot[]
  hostName: string
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

    Promise.all([getGuestEvent(userSlug, eventSlug), listSlots(userSlug, eventSlug), getProfile(userSlug)])
      .then(([event, slotsResponse, profile]) => {
        if (!cancelled) {
          dispatch({
            type: 'success',
            data: { event, slots: slotsResponse.items, hostName: profile.user.name },
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
