import { useEffect, useReducer } from 'react'
import { getProfile } from '../../api/client'
import type { UserProfile } from '../../api/types'
import {
  asyncStateReducer,
  createAsyncState,
  getErrorMessage,
  type AsyncState,
} from '../shared'

export function useUserProfile(userSlug?: string): AsyncState<UserProfile> {
  const [state, dispatch] = useReducer(asyncStateReducer<UserProfile>, undefined, () =>
    createAsyncState<UserProfile>(),
  )

  useEffect(() => {
    if (!userSlug) {
      return
    }

    let cancelled = false

    dispatch({ type: 'start' })

    getProfile(userSlug)
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
  }, [userSlug])

  if (!userSlug) {
    return {
      data: null,
      loading: false,
      error: 'Пользователь не найден.',
    }
  }

  return state
}
