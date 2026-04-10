import type {
  ApiError,
  Booking,
  BookingList,
  CreateBookingRequest,
  CreateEventRequest,
  EventBookingPage,
  Event,
  EventList,
  TimeSlotList,
  UpdateEventRequest,
  User,
  UserProfile,
} from './types'
import { appConfig } from '../config/app'

async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...init,
  })

  const payload = (await parseResponse(response)) as T | ApiError | string | null

  if (!response.ok) {
    const err = typeof payload === 'object' && payload ? (payload as ApiError) : null
    const error = new Error(
      typeof payload === 'string' ? payload : err?.message ?? 'Request failed',
    )
    ;(error as Error & { code?: string }).code = err?.code
    throw error
  }

  return payload as T
}

// Guest

export function getProfile(userSlug: string): Promise<UserProfile> {
  return request<UserProfile>(`/users/${userSlug}`)
}

export function listGuestEvents(userSlug: string): Promise<EventList> {
  return request<EventList>(`/users/${userSlug}/events`)
}

export function getGuestEvent(userSlug: string, eventSlug: string): Promise<Event> {
  return request<Event>(`/users/${userSlug}/events/${eventSlug}`)
}

export function getEventBookingPage(userSlug: string, eventSlug: string): Promise<EventBookingPage> {
  return request<EventBookingPage>(`/users/${userSlug}/events/${eventSlug}/booking-page`)
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

// Host

export function hostGetUser(userId: string): Promise<User> {
  return request<User>(`/host/users/${userId}`)
}

export function hostListEvents(userId: string): Promise<EventList> {
  return request<EventList>(`/host/users/${userId}/events`)
}

export function hostCreateEvent(userId: string, data: CreateEventRequest): Promise<Event> {
  return request<Event>(`/host/users/${userId}/events`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function hostGetEvent(userId: string, eventId: string): Promise<Event> {
  return request<Event>(`/host/users/${userId}/events/${eventId}`)
}

export function hostUpdateEvent(
  userId: string,
  eventId: string,
  data: UpdateEventRequest,
): Promise<Event> {
  return request<Event>(`/host/users/${userId}/events/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function hostDeleteEvent(userId: string, eventId: string): Promise<void> {
  return request<void>(`/host/users/${userId}/events/${eventId}`, { method: 'DELETE' })
}

export function hostListBookings(userId: string): Promise<BookingList> {
  return request<BookingList>(`/host/users/${userId}/bookings`)
}
