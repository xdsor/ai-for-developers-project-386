import type {
  ApiError,
  Booking,
  BookingList,
  CreateBookingRequest,
  CreateEventRequest,
  Event,
  EventList,
  TimeSlotList,
  UpdateEventRequest,
  User,
  UserProfile,
} from './types'

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...init,
  })

  const payload = (await response.json()) as T | ApiError

  if (!response.ok) {
    const err = payload as ApiError
    const error = new Error(err.message ?? 'Request failed')
    ;(error as Error & { code?: string }).code = err.code
    throw error
  }

  return payload as T
}

// Public

export function getProfile(userSlug: string): Promise<UserProfile> {
  return request<UserProfile>(`/users/${userSlug}`)
}

export function listPublicEvents(userSlug: string): Promise<EventList> {
  return request<EventList>(`/users/${userSlug}/events`)
}

export function getPublicEvent(userSlug: string, eventSlug: string): Promise<Event> {
  return request<Event>(`/users/${userSlug}/events/${eventSlug}`)
}

export function listSlots(userSlug: string, eventSlug: string): Promise<TimeSlotList> {
  return request<TimeSlotList>(`/users/${userSlug}/events/${eventSlug}/slots`)
}

export function createBooking(
  userSlug: string,
  eventSlug: string,
  data: CreateBookingRequest,
): Promise<Booking> {
  return request<Booking>(`/users/${userSlug}/events/${eventSlug}/bookings`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Admin

export function adminGetUser(userId: string): Promise<User> {
  return request<User>(`/admin/users/${userId}`)
}

export function adminListEvents(userId: string): Promise<EventList> {
  return request<EventList>(`/admin/users/${userId}/events`)
}

export function adminCreateEvent(userId: string, data: CreateEventRequest): Promise<Event> {
  return request<Event>(`/admin/users/${userId}/events`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function adminGetEvent(userId: string, eventId: string): Promise<Event> {
  return request<Event>(`/admin/users/${userId}/events/${eventId}`)
}

export function adminUpdateEvent(
  userId: string,
  eventId: string,
  data: UpdateEventRequest,
): Promise<Event> {
  return request<Event>(`/admin/users/${userId}/events/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function adminDeleteEvent(userId: string, eventId: string): Promise<void> {
  return request<void>(`/admin/users/${userId}/events/${eventId}`, { method: 'DELETE' })
}

export function adminListBookings(userId: string): Promise<BookingList> {
  return request<BookingList>(`/admin/users/${userId}/bookings`)
}
