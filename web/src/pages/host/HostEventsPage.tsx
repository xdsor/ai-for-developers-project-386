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
import { useState } from 'react'
import { hostDeleteEvent } from '../../api/client'
import type { Event } from '../../api/types'
import { EventFormModal } from '../../components/host/EventFormModal'
import { appConfig } from '../../config/app'
import { useHostEvents } from '../../hooks/host/useHostEvents'
import {
  showErrorNotification,
  showInfoNotification,
  showSuccessNotification,
  useErrorNotification,
} from '../../lib/notifications'

export function HostEventsPage() {
  const [modalOpened, setModalOpened] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined)
  const { events, setEvents, loading, error, reload } = useHostEvents(appConfig.demoUserId)

  useErrorNotification(error, {
    id: 'host-events-load-error',
    title: 'Не удалось загрузить события',
  })

  const handleDelete = async (eventId: string) => {
    if (!confirm('Удалить событие?')) return
    try {
      await hostDeleteEvent(appConfig.demoUserId, eventId)
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
      showSuccessNotification({
        title: 'Событие удалено',
        message: 'Список событий обновлён.',
      })
    } catch (err) {
      showErrorNotification({
        title: 'Не удалось удалить событие',
        message: err instanceof Error ? err.message : 'Ошибка удаления.',
      })
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
                            const url = `${window.location.origin}/users/${appConfig.demoUserSlug}/events/${event.slug}`
                            void navigator.clipboard
                              .writeText(url)
                              .then(() => {
                                showInfoNotification({
                                  title: 'Ссылка скопирована',
                                  message: 'Публичная ссылка сохранена в буфере обмена.',
                                })
                              })
                              .catch(() => {
                                showErrorNotification({
                                  title: 'Не удалось скопировать ссылку',
                                  message: 'Попробуйте ещё раз.',
                                })
                              })
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

      <EventFormModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSaved={reload}
        userId={appConfig.demoUserId}
        event={editingEvent}
      />
    </Stack>
  )
}
