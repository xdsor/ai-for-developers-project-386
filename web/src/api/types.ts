export type ResourceId = string
export type Slug = string
export type Email = string
export type IanaTimeZone = string

export interface Host {
  id: ResourceId
  name: string
  slug: Slug
  timeZone: IanaTimeZone
}

export interface Event {
  id: ResourceId
  ownerId: ResourceId
  title: string
  description: string
  durationMinutes: number
  slug: Slug
}

export interface GuestContact {
  name: string
  email: Email
}

export interface TimeSlot {
  startAt: string
  endAt: string
}

export interface Booking {
  id: ResourceId
  eventId: ResourceId
  ownerId: ResourceId
  guest: GuestContact
  startAt: string
  endAt: string
  createdAt: string
}

export interface HostProfile {
  host: Host
  events: Event[]
}

export interface EventBookingPage {
  host: Host
  event: Event
  slots: TimeSlot[]
}

export interface EventList {
  items: Event[]
}

export interface TimeSlotList {
  items: TimeSlot[]
}

export interface BookingList {
  items: Booking[]
}

export interface CreateEventRequest {
  title: string
  description: string
  durationMinutes: number
  slug: Slug
}

export interface UpdateEventRequest {
  title?: string
  description?: string
  durationMinutes?: number
  slug?: Slug
}

export interface CreateBookingRequest {
  guest: GuestContact
  startAt: string
}

export type ErrorCode =
  | 'NotFound'
  | 'ValidationFailed'
  | 'SlotUnavailable'
  | 'SlotOutsideBookingWindow'
  | 'SlotDurationMismatch'
  | 'SlugAlreadyExists'

export interface ApiError {
  message: string
  code?: ErrorCode
}
