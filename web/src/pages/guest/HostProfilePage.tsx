import { Alert, Avatar, Badge, Container, Loader, Stack, Text, Title } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { EventCard } from '../../components/guest/EventCard'
import { useHostProfile } from '../../hooks/guest/useHostProfile'
import { useErrorNotification } from '../../lib/notifications'

export function HostProfilePage() {
  const { hostSlug } = useParams<{ hostSlug: string }>()
  const { data: profile, loading, error } = useHostProfile(hostSlug)

  useErrorNotification(error, {
    id: 'guest-host-profile-load-error',
    title: 'Не удалось загрузить профиль',
  })

  if (loading) {
    return (
      <Container size="sm" py={64} ta="center">
        <Loader color="brand" />
      </Container>
    )
  }

  if (error || !profile) {
    return (
      <Container size="sm" py={48}>
        <Alert color="danger" title="Ошибка">
          {error ?? 'Хост не найден.'}
        </Alert>
      </Container>
    )
  }

  const { host, events } = profile

  return (
    <Container size="sm" py={48}>
      <Stack gap="xl">
        <Stack gap="xs" align="flex-start">
          <Avatar size="lg" color="brand" radius="xl">
            {host.name.charAt(0).toUpperCase()}
          </Avatar>
          <Title order={2}>{host.name}</Title>
          <Badge variant="light" color="neutral" size="sm">
            {host.timeZone}
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
                <EventCard key={event.id} event={event} hostSlug={host.slug} />
              ))}
            </Stack>
          )}
        </div>
      </Stack>
    </Container>
  )
}
