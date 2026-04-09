import { AppShell, Button, Group, Title } from '@mantine/core'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { appConfig } from '../../config/app'

export function AdminLayout() {
  const navigate = useNavigate()

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={4} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin')}>
            Meeting Booking — Admin
          </Title>
          <Group gap="xs">
            <Button
              component={NavLink}
              to="/admin"
              end
              variant="subtle"
              color="gray"
              size="sm"
            >
              События
            </Button>
            <Button
              component={NavLink}
              to="/admin/bookings"
              variant="subtle"
              color="gray"
              size="sm"
            >
              Бронирования
            </Button>
            <Button
              variant="subtle"
              color="teal"
              size="sm"
              onClick={() => navigate(`/users/${appConfig.demoUserSlug}`)}
            >
              Публичный сайт
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
