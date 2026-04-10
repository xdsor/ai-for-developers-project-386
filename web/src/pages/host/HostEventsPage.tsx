import { Alert, Button, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { hostDeleteEvent } from '../../api/client'
import type { Event } from '../../api/types'
import { EventFormModal } from '../../components/host/EventFormModal'
import { appConfig } from '../../config/app'
import { useHostEvents } from '../../hooks/host/useHostEvents'
import { copyEventLink } from '../../lib/shareUtils'
import {
  showErrorNotification,
  showSuccessNotification,
  useErrorNotification,
} from '../../lib/notifications'
import { EventsTable } from '../../widgets/host/EventsTable'

export function HostEventsPage() {
  const [modalOpened, setModalOpened] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined)
  const { events, setEvents, loading, error, reload } = useHostEvents(appConfig.demoHostId)

  useErrorNotification(error, {
    id: 'host-events-load-error',
    title: 'Не удалось загрузить события',
  })

  const handleDelete = async (eventId: string) => {
    if (!confirm('Удалить событие?')) return
    try {
      await hostDeleteEvent(appConfig.demoHostId, eventId)
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

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={3}>События</Title>
        <Button color="brand" onClick={openCreate}>
          + Создать событие
        </Button>
      </Group>

      {loading && <Loader color="brand" />}

      {error && (
        <Alert color="danger" title="Ошибка">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        events.length === 0 ? (
          <Text c="dimmed">Событий пока нет. Создайте первое!</Text>
        ) : (
          <EventsTable
            events={events}
            onEdit={(event) => { setEditingEvent(event); setModalOpened(true) }}
            onDelete={(id) => { void handleDelete(id) }}
            onShare={(event) => copyEventLink(appConfig.demoHostSlug, event.slug)}
          />
        )
      )}

      <EventFormModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSaved={reload}
        hostId={appConfig.demoHostId}
        event={editingEvent}
      />
    </Stack>
  )
}
