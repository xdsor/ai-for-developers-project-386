import { Alert, Button, Stack, TextInput } from '@mantine/core'
import { useState } from 'react'
import { createBooking } from '../../api/client'
import type { Booking, TimeSlot } from '../../api/types'

interface BookingFormProps {
  userSlug: string
  eventSlug: string
  slot: TimeSlot
  onSuccess: (booking: Booking) => void
}

export function BookingForm({ userSlug, eventSlug, slot, onSuccess }: BookingFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const booking = await createBooking(userSlug, eventSlug, {
        guest: { name, email },
        startAt: slot.startAt,
        endAt: slot.endAt,
      })
      onSuccess(booking)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать бронирование.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(e) }}>
      <Stack gap="sm">
        {error && (
          <Alert color="red" title="Ошибка">
            {error}
          </Alert>
        )}
        <TextInput
          label="Ваше имя"
          placeholder="Иван Иванов"
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <TextInput
          label="Email"
          placeholder="ivan@example.com"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <Button type="submit" color="teal" loading={loading}>
          Забронировать
        </Button>
      </Stack>
    </form>
  )
}
