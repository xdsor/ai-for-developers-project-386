import { Button, Group, Modal, NumberInput, Stack, TextInput, Textarea } from '@mantine/core'
import { useState } from 'react'
import { adminCreateEvent, adminUpdateEvent } from '../../api/client'
import type { CreateEventRequest, Event } from '../../api/types'

interface EventFormModalProps {
  opened: boolean
  onClose: () => void
  onSaved: () => void
  userId: string
  event?: Event
}

export function EventFormModal({ opened, onClose, onSaved, userId, event }: EventFormModalProps) {
  const isEdit = !!event
  const [title, setTitle] = useState(event?.title ?? '')
  const [description, setDescription] = useState(event?.description ?? '')
  const [durationMinutes, setDurationMinutes] = useState<number>(event?.durationMinutes ?? 30)
  const [slug, setSlug] = useState(event?.slug ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          {error && <p style={{ color: 'red', margin: 0, fontSize: 14 }}>{error}</p>}
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
