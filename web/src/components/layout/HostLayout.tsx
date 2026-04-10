import { AppShell, Button, Container, Group, Title } from '@mantine/core'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

export function HostLayout() {
  const navigate = useNavigate()

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Container size="xl" h="100%" px="md">
          <Group h="100%" justify="space-between">
            <Title order={4} style={{ cursor: 'pointer' }} onClick={() => navigate('/host')}>
              Meeting Booking — Host
            </Title>
            <Group gap="xs">
              <Button
                component={NavLink}
                to="/host"
                end
                variant="subtle"
                color="neutral"
                size="sm"
              >
                События
              </Button>
              <Button
                component={NavLink}
                to="/host/bookings"
                variant="subtle"
                color="neutral"
                size="sm"
              >
                Бронирования
              </Button>
              <ThemeToggle />
            </Group>
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
