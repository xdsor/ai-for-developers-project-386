import { useEffect, useReducer } from 'react'
import { getHostProfile } from '../../api/client'
import type { HostProfile } from '../../api/types'
import {
  asyncStateReducer,
  createAsyncState,
  getErrorMessage,
  type AsyncState,
} from '../shared'

export function useHostProfile(hostSlug?: string): AsyncState<HostProfile> {
  const [state, dispatch] = useReducer(asyncStateReducer<HostProfile>, undefined, () =>
    createAsyncState<HostProfile>(),
  )

  useEffect(() => {
    if (!hostSlug) {
      return
    }

    let cancelled = false

    dispatch({ type: 'start' })

    getHostProfile(hostSlug)
      .then((nextProfile) => {
        if (!cancelled) {
          dispatch({ type: 'success', data: nextProfile })
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          dispatch({
            type: 'failure',
            error: getErrorMessage(loadError, 'Не удалось загрузить профиль.'),
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [hostSlug])

  if (!hostSlug) {
    return {
      data: null,
      loading: false,
      error: 'Хост не найден.',
    }
  }

  return state
}
