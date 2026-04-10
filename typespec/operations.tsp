using Http;

namespace MeetingBooking;

@route("/users")
@tag("Guest Users")
interface GuestUsers {
  /** Get a public user profile and all events created by that user. */
  @get
  @route("{userSlug}")
  readProfile(@path userSlug: Slug): UserProfile | Error;

  /** List public events created by a user. */
  @get
  @route("{userSlug}/events")
  listEvents(@path userSlug: Slug): EventList | Error;

  /** Get a public event by user slug and event slug. */
  @get
  @route("{userSlug}/events/{eventSlug}")
  readEvent(@path userSlug: Slug, @path eventSlug: Slug): Event | Error;
}

@route("/users/{userSlug}/events/{eventSlug}")
@tag("Guest Bookings")
interface GuestBookings {
  /** Get all data needed to render the public booking page for an event. */
  @get
  @route("booking-page")
  readBookingPage(@path userSlug: Slug, @path eventSlug: Slug): EventBookingPage | Error;

  /** List free slots for the next 14 days from the host's current date. */
  @get
  @route("slots")
  listSlots(@path userSlug: Slug, @path eventSlug: Slug): TimeSlotList | Error;

  /** Create a booking for a free slot in the event host's 14-day booking window. */
  @post
  @route("bookings")
  createBooking(
    @path userSlug: Slug,
    @path eventSlug: Slug,
    @body body: CreateBookingRequest,
  ): Booking | Error;
}

@route("/host/users")
@tag("Host Users")
interface HostUsers {
  /** Read a user by id. */
  @get
  @route("{userId}")
  read(@path userId: ResourceId): User | Error;
}

@route("/host/users/{userId}/events")
@tag("Host Events")
interface HostEvents {
  /** List events owned by a user. */
  @get
  list(@path userId: ResourceId): EventList | Error;

  /** Create an event owned by a user. */
  @post
  create(@path userId: ResourceId, @body body: CreateEventRequest): Event | Error;

  /** Read an event owned by a user. */
  @get
  @route("{eventId}")
  read(@path userId: ResourceId, @path eventId: ResourceId): Event | Error;

  /** Update an event owned by a user. */
  @patch
  @route("{eventId}")
  update(
    @path userId: ResourceId,
    @path eventId: ResourceId,
    @body body: UpdateEventRequest,
  ): Event | Error;

  /** Delete an event owned by a user. */
  @delete
  @route("{eventId}")
  delete(@path userId: ResourceId, @path eventId: ResourceId): void | Error;
}

@route("/host/users/{userId}/bookings")
@tag("Host Bookings")
interface HostBookings {
  /** List bookings for a user across all owned events. */
  @get
  list(@path userId: ResourceId): BookingList | Error;
}
