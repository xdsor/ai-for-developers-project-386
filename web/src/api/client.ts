import type {
  ApiError,
  Booking,
  BookingList,
  CreateBookingRequest,
  CreateEventRequest,
  EventBookingPage,
  Event,
  EventList,
  Host,
  HostProfile,
  TimeSlotList,
  UpdateEventRequest,
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

export function getHostProfile(hostSlug: string): Promise<HostProfile> {
  return request<HostProfile>(`/hosts/${hostSlug}`)
}

export function listGuestEvents(hostSlug: string): Promise<EventList> {
  return request<EventList>(`/hosts/${hostSlug}/events`)
}

export function getGuestEvent(hostSlug: string, eventSlug: string): Promise<Event> {
  return request<Event>(`/hosts/${hostSlug}/events/${eventSlug}`)
}

export function getEventBookingPage(hostSlug: string, eventSlug: string): Promise<EventBookingPage> {
  return request<EventBookingPage>(`/hosts/${hostSlug}/events/${eventSlug}/booking-page`)
}

export function listSlots(hostSlug: string, eventSlug: string): Promise<TimeSlotList> {
  return request<TimeSlotList>(`/hosts/${hostSlug}/events/${eventSlug}/slots`)
}

export function createBooking(
  hostSlug: string,
  eventSlug: string,
  data: CreateBookingRequest,
): Promise<Booking> {
  return request<Booking>(`/hosts/${hostSlug}/events/${eventSlug}/bookings`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Host

export function hostGetHost(hostId: string): Promise<Host> {
  return request<Host>(`/host/${hostId}`)
}

export function hostListEvents(hostId: string): Promise<EventList> {
  return request<EventList>(`/host/${hostId}/events`)
}

export function hostCreateEvent(hostId: string, data: CreateEventRequest): Promise<Event> {
  return request<Event>(`/host/${hostId}/events`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function hostGetEvent(hostId: string, eventId: string): Promise<Event> {
  return request<Event>(`/host/${hostId}/events/${eventId}`)
}

export function hostUpdateEvent(
  hostId: string,
  eventId: string,
  data: UpdateEventRequest,
): Promise<Event> {
  return request<Event>(`/host/${hostId}/events/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function hostDeleteEvent(hostId: string, eventId: string): Promise<void> {
  return request<void>(`/host/${hostId}/events/${eventId}`, { method: 'DELETE' })
}

export function hostListBookings(hostId: string): Promise<BookingList> {
  return request<BookingList>(`/host/${hostId}/bookings`)
}
