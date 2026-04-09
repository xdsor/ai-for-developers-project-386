import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  List,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import './App.css'

type EventItem = {
  id: string
  ownerId: string
  title: string
  description: string
  durationMinutes: number
  slug: string
}

type UserProfile = {
  user: {
    id: string
    name: string
    slug: string
    timeZone: string
  }
  events: EventItem[]
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
const demoUserSlug = 'demo-user'

async function fetchPublicProfile() {
  const response = await fetch(`${apiBaseUrl}/users/${demoUserSlug}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  const payload = (await response.json()) as UserProfile | { message?: string }

  if (!response.ok) {
    const message =
      'message' in payload && payload.message
        ? payload.message
        : 'Mock API request failed.'

    throw new Error(message)
  }

  return payload as UserProfile
}

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      setLoading(true)
      setError(null)

      try {
        const nextProfile = await fetchPublicProfile()

        if (!cancelled) {
          setProfile(nextProfile)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unexpected error while loading mock data.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Container size="md" py={48}>
      <Card shadow="sm" padding="xl" radius="lg" withBorder className="app-shell">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Badge color="teal" variant="light" size="lg">
              Prism Mock API
            </Badge>
            <Button component="a" href={`${apiBaseUrl}/users/${demoUserSlug}`} variant="light">
              Открыть endpoint
            </Button>
          </Group>

          <div>
            <Title order={1} mb="xs">
              Frontend подключен к контракту из TypeSpec
            </Title>
            <Text c="dimmed">
              Экран делает реальный HTTP-запрос в локальный Prism mock server,
              который читает OpenAPI, сгенерированный из `typespec/`.
            </Text>
          </div>

          <List spacing="sm">
            <List.Item>Источник контракта: `typespec/main.tsp`</List.Item>
            <List.Item>Mock server: `Prism` на базе `openapi.yaml`</List.Item>
            <List.Item>Frontend ходит в API через `VITE_API_BASE_URL`</List.Item>
          </List>

          <Divider />

          <Paper withBorder radius="md" p="lg" className="api-panel">
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text fw={600}>Запрос</Text>
                  <Text size="sm" c="dimmed">
                    GET {apiBaseUrl}/users/{demoUserSlug}
                  </Text>
                </div>
                {loading ? <Loader size="sm" color="teal" /> : null}
              </Group>

              {error ? (
                <Alert color="red" title="Mock API недоступен">
                  {error}
                </Alert>
              ) : null}

              {profile ? (
                <Stack gap="sm">
                  <Group gap="xs">
                    <Badge variant="dot" color="teal">
                      {profile.user.slug}
                    </Badge>
                    <Badge variant="light" color="gray">
                      {profile.user.timeZone}
                    </Badge>
                  </Group>

                  <div>
                    <Text fw={600}>{profile.user.name}</Text>
                    <Text size="sm" c="dimmed">
                      User id: {profile.user.id}
                    </Text>
                  </div>

                  <Divider />

                  <div>
                    <Text fw={600} mb="xs">
                      Events from mock response
                    </Text>
                    <Stack gap="xs">
                      {profile.events.map((event) => (
                        <Paper key={event.id} withBorder radius="md" p="sm">
                          <Group justify="space-between" align="flex-start">
                            <div>
                              <Text fw={600}>{event.title}</Text>
                              <Text size="sm" c="dimmed">
                                {event.description || 'No description in mock payload'}
                              </Text>
                            </div>
                            <Badge color="teal" variant="light">
                              {event.durationMinutes} min
                            </Badge>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  </div>
                </Stack>
              ) : null}
            </Stack>
          </Paper>
        </Stack>
      </Card>
    </Container>
  )
}

export default App
