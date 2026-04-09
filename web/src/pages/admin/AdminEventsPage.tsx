import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { adminDeleteEvent, adminListEvents, getProfile } from '../../api/client'
import type { Event } from '../../api/types'
import { EventFormModal } from '../../components/admin/EventFormModal'

const DEMO_SLUG = 'demo-user'

export function AdminEventsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userSlug, setUserSlug] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined)

  const loadData = () => {
    setLoading(true)
    setError(null)

    getProfile(DEMO_SLUG)
      .then((profile) => {
        const uid = profile.user.id
        setUserId(uid)
        setUserSlug(profile.user.slug)
        return adminListEvents(uid)
      })
      .then((data) => setEvents(data.items))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить события.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (eventId: string) => {
    if (!userId) return
    if (!confirm('Удалить событие?')) return
    try {
      await adminDeleteEvent(userId, eventId)
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления.')
    }
  }

  const openCreate = () => {
    setEditingEvent(undefined)
    setModalOpened(true)
  }

  const openEdit = (event: Event) => {
    setEditingEvent(event)
    setModalOpened(true)
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={3}>События</Title>
        <Button color="teal" onClick={openCreate}>
          + Создать событие
        </Button>
      </Group>

      {loading && <Loader color="teal" />}

      {error && (
        <Alert color="red" title="Ошибка">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          {events.length === 0 ? (
            <Text c="dimmed">Событий пока нет. Создайте первое!</Text>
          ) : (
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Название</Table.Th>
                  <Table.Th>Описание</Table.Th>
                  <Table.Th>Длительность</Table.Th>
                  <Table.Th>Slug</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {events.map((event) => (
                  <Table.Tr key={event.id}>
                    <Table.Td>
                      <Text fw={500}>{event.title}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {event.description || '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="teal">
                        {event.durationMinutes} мин
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" ff="monospace">
                        {event.slug}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs" justify="flex-end">
                        <ActionIcon
                          variant="light"
                          color="teal"
                          onClick={() => {
                            const url = `${window.location.origin}/users/${userSlug}/events/${event.slug}`
                            void navigator.clipboard.writeText(url)
                          }}
                          title="Поделиться ссылкой"
                        >
                          ⎘
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => openEdit(event)}
                          title="Редактировать"
                        >
                          ✎
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => { void handleDelete(event.id) }}
                          title="Удалить"
                        >
                          ✕
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </>
      )}

      {userId && (
        <EventFormModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          onSaved={loadData}
          userId={userId}
          event={editingEvent}
        />
      )}
    </Stack>
  )
}
