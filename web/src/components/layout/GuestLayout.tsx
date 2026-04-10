import { AppShell, Group, Title } from '@mantine/core'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

export function GuestLayout() {
  const navigate = useNavigate()
  const { hostSlug } = useParams<{ hostSlug: string }>()

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
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
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
