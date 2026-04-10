import { useEffect, useReducer, useState } from 'react'
import { hostListEvents } from '../../api/client'
import type { Event } from '../../api/types'
import { asyncStateReducer, createAsyncState, getErrorMessage } from '../shared'

export function useHostEvents(hostId: string) {
  const [state, dispatch] = useReducer(asyncStateReducer<Event[]>, undefined, () =>
    createAsyncState<Event[]>(),
  )
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    dispatch({ type: 'start' })

    hostListEvents(hostId)
      .then((response) => {
        if (!cancelled) {
          dispatch({ type: 'success', data: response.items })
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          dispatch({
            type: 'failure',
            error: getErrorMessage(loadError, 'Не удалось загрузить события.'),
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey, hostId])

  return {
    events: state.data ?? [],
    setEvents: (updater: Event[] | ((current: Event[]) => Event[])) => {
      const nextEvents =
        typeof updater === 'function' ? updater(state.data ?? []) : updater
      dispatch({ type: 'success', data: nextEvents })
    },
    loading: state.loading,
    error: state.error,
    reload: () => setReloadKey((current) => current + 1),
  }
}
