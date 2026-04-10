import { AppShell, Container, Group, Title } from '@mantine/core'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

export function GuestLayout() {
  const navigate = useNavigate()
  const { hostSlug } = useParams<{ hostSlug: string }>()

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Container size="xl" h="100%" px="md">
          <Group h="100%" justify="space-between">
            <Title
              order={4}
              style={{ cursor: hostSlug ? 'pointer' : 'default' }}
              onClick={() => {
                if (hostSlug) navigate(`/hosts/${hostSlug}`)
              }}
            >
              Meeting Booking
            </Title>
            <ThemeToggle />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" px="md">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
