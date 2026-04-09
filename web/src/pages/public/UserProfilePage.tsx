import { Alert, Avatar, Badge, Container, Loader, Stack, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile } from '../../api/client'
import type { UserProfile } from '../../api/types'
import { EventCard } from '../../components/public/EventCard'

export function UserProfilePage() {
  const { userSlug } = useParams<{ userSlug: string }>()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userSlug) return
    let cancelled = false

    setLoading(true)
    setError(null)

    getProfile(userSlug)
      .then((data) => {
        if (!cancelled) setProfile(data)
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Не удалось загрузить профиль.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userSlug])

  if (loading) {
    return (
      <Container size="sm" py={64} ta="center">
        <Loader color="teal" />
      </Container>
    )
  }

  if (error || !profile) {
    return (
      <Container size="sm" py={48}>
        <Alert color="red" title="Ошибка">
          {error ?? 'Пользователь не найден.'}
        </Alert>
      </Container>
    )
  }

  const { user, events } = profile

  return (
    <Container size="sm" py={48}>
      <Stack gap="xl">
        <Stack gap="xs" align="flex-start">
          <Avatar size="lg" color="teal" radius="xl">
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Title order={2}>{user.name}</Title>
          <Badge variant="light" color="gray" size="sm">
            {user.timeZone}
          </Badge>
        </Stack>

        <div>
          <Text fw={600} mb="md">
            Доступные события
          </Text>
          {events.length === 0 ? (
            <Text c="dimmed">Нет доступных событий.</Text>
          ) : (
            <Stack gap="sm">
              {events.map((event) => (
                <EventCard key={event.id} event={event} userSlug={user.slug} />
              ))}
            </Stack>
          )}
        </div>
      </Stack>
    </Container>
  )
}
