import { AppShell, Button, Group, Title } from '@mantine/core'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { appConfig } from '../../config/app'

export function HostLayout() {
  const navigate = useNavigate()

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={4} style={{ cursor: 'pointer' }} onClick={() => navigate('/host')}>
            Meeting Booking — Host
          </Title>
          <Group gap="xs">
            <Button
              component={NavLink}
              to="/host"
              end
              variant="subtle"
              color="gray"
              size="sm"
            >
              События
            </Button>
            <Button
              component={NavLink}
              to="/host/bookings"
              variant="subtle"
              color="gray"
              size="sm"
            >
              Бронирования
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
