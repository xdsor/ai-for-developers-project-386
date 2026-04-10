namespace MeetingBooking;

alias ResourceId = string;

@minLength(1)
scalar NonEmptyString extends string;

alias Slug = NonEmptyString;

@format("email")
scalar Email extends string;

alias IanaTimeZone = NonEmptyString;

@minValue(1)
@maxValue(1440)
scalar PositiveDurationMinutes extends int32;

@doc("Application user who owns events and receives bookings.")
model User {
  id: ResourceId;
  name: NonEmptyString;
  slug: Slug;
  timeZone: IanaTimeZone;
}

@doc("Meeting topic created by a user and shared through a public link.")
model Event {
  id: ResourceId;
  ownerId: ResourceId;
  title: NonEmptyString;
  description: string;
  durationMinutes: PositiveDurationMinutes;
  slug: Slug;
}

@doc("Guest contact details captured directly on the booking in the MVP.")
model GuestContact {
  name: NonEmptyString;
  email: Email;
}

@doc("Computed available slot for an event in the owner's next 14-day booking window.")
model TimeSlot {
  startAt: utcDateTime;
  endAt: utcDateTime;
}

@doc("Meeting reservation created by a guest for an event.")
model Booking {
  id: ResourceId;
  eventId: ResourceId;
  ownerId: ResourceId;
  guest: GuestContact;
  startAt: utcDateTime;
  endAt: utcDateTime;
  createdAt: utcDateTime;
}

model UserProfile {
  user: User;
  events: Event[];
}

model EventBookingPage {
  host: User;
  event: Event;
  slots: TimeSlot[];
}

model EventList {
  items: Event[];
}

model TimeSlotList {
  items: TimeSlot[];
}

model BookingList {
  items: Booking[];
}

model CreateEventRequest {
  title: NonEmptyString;
  description: string;
  durationMinutes: PositiveDurationMinutes;
  slug: Slug;
}

model UpdateEventRequest {
  title?: NonEmptyString;
  description?: string;
  durationMinutes?: PositiveDurationMinutes;
  slug?: Slug;
}

model CreateBookingRequest {
  guest: GuestContact;
  startAt: utcDateTime;
}

@error
model Error {
  code: ErrorCode;
  message: string;
}

enum ErrorCode {
  NotFound,
  ValidationFailed,
  SlotOutsideBookingWindow,
  SlotUnavailable,
  SlotDurationMismatch,
  SlugAlreadyExists,
}
