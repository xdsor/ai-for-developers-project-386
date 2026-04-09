import { Alert, Button, Group, Modal, NumberInput, Stack, TextInput, Textarea } from '@mantine/core'
import { useEffect, useState } from 'react'
import { adminCreateEvent, adminUpdateEvent } from '../../api/client'
import type { CreateEventRequest, Event } from '../../api/types'
import { showSuccessNotification } from '../../lib/notifications'

interface EventFormModalProps {
  opened: boolean
  onClose: () => void
  onSaved: () => void
  userId: string
  event?: Event
}

function getInitialValues(event?: Event) {
  return {
    title: event?.title ?? '',
    description: event?.description ?? '',
    durationMinutes: event?.durationMinutes ?? 30,
    slug: event?.slug ?? '',
  }
}

export function EventFormModal({ opened, onClose, onSaved, userId, event }: EventFormModalProps) {
  const isEdit = !!event
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationMinutes, setDurationMinutes] = useState<number>(30)
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!opened) {
      return
    }

    const initialValues = getInitialValues(event)
    setTitle(initialValues.title)
    setDescription(initialValues.description)
    setDurationMinutes(initialValues.durationMinutes)
    setSlug(initialValues.slug)
    setLoading(false)
    setError(null)
  }, [event, opened])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const data: CreateEventRequest = { title, description, durationMinutes, slug }

    try {
      if (isEdit) {
        await adminUpdateEvent(userId, event.id, data)
      } else {
        await adminCreateEvent(userId, data)
      }
      showSuccessNotification({
        title: isEdit ? 'Событие обновлено' : 'Событие создано',
        message: isEdit
          ? 'Изменения сохранены.'
          : 'Новое событие доступно в списке.',
      })
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? 'Редактировать событие' : 'Создать событие'}
    >
      <form onSubmit={(e) => { void handleSubmit(e) }}>
        <Stack gap="sm">
          {error && (
            <Alert color="red" title="Ошибка">
              {error}
            </Alert>
          )}
          <TextInput
            label="Название"
            required
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <Textarea
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            autosize
            minRows={2}
          />
          <NumberInput
            label="Длительность (минут)"
            required
            min={1}
            max={1440}
            value={durationMinutes}
            onChange={(val) => setDurationMinutes(typeof val === 'number' ? val : 30)}
          />
          <TextInput
            label="Slug (публичный идентификатор)"
            required
            value={slug}
            onChange={(e) => setSlug(e.currentTarget.value)}
            placeholder="my-event"
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" color="gray" onClick={onClose} disabled={loading}>
              Отмена
            </Button>
            <Button type="submit" color="teal" loading={loading}>
              {isEdit ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
